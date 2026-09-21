import express from "express";
import http from "http";
import path from "path";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";

interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  currentQIndex: number;
  isReady: boolean;
  isFinished: boolean;
  answers: { qIndex: number; answer: string; isCorrect: boolean; timeMs: number }[];
  lastAnswerCorrect?: boolean;
  reaction?: { emoji: string; text: string; timestamp: number };
}

interface Room {
  id: string;
  name: string;
  hostId: string;
  status: 'waiting' | 'starting' | 'in_progress' | 'finished';
  subject: 'all' | 'english' | 'maths';
  topicId?: string;
  topicTitle?: string;
  questionCount: number;
  timePerQuestion: number;
  questions: any[];
  players: Record<string, Player>;
  createdAt: number;
  startedAt?: number;
  finishedAt?: number;
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Store active multiplayer rooms
const rooms = new Map<string, Room>();
// Map client socket to metadata
const clients = new Map<WebSocket, { id: string; roomId?: string }>();

// Helper to normalize answer strings for server validation
function normalizeStr(str: string | null | undefined): string {
  return String(str ?? '')
    .trim()
    .toLowerCase()
    .replace(/[,\s]+/g, ' ')
    .replace(/["'“”‘’]/g, '')
    .replace(/[£$%]/g, '')
    .trim();
}

function broadcastToRoom(roomId: string, message: any, excludeWs?: WebSocket) {
  const json = JSON.stringify(message);
  for (const [ws, data] of clients.entries()) {
    if (data.roomId === roomId && ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
      ws.send(json);
    }
  }
}

function broadcastPublicRooms() {
  const openRooms = Array.from(rooms.values())
    .filter(r => r.status === 'waiting' && Object.keys(r.players).length < 6)
    .map(r => ({
      id: r.id,
      name: r.name,
      hostName: r.players[r.hostId]?.name || 'Host',
      subject: r.subject,
      topicTitle: r.topicTitle || 'All Topics',
      questionCount: r.questionCount,
      timePerQuestion: r.timePerQuestion,
      playerCount: Object.keys(r.players).length,
      maxPlayers: 6
    }));

  const payload = JSON.stringify({ type: 'public_rooms', rooms: openRooms });
  for (const [ws, data] of clients.entries()) {
    if (!data.roomId && ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  }
}

// REST health check and active rooms endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", activeRooms: rooms.size, connectedClients: clients.size });
});

app.get("/api/multiplayer/rooms", (req, res) => {
  const openRooms = Array.from(rooms.values())
    .filter(r => r.status === 'waiting')
    .map(r => ({
      id: r.id,
      name: r.name,
      hostName: r.players[r.hostId]?.name || 'Host',
      subject: r.subject,
      topicTitle: r.topicTitle || 'All Topics',
      questionCount: r.questionCount,
      playerCount: Object.keys(r.players).length
    }));
  res.json({ rooms: openRooms });
});

async function startServer() {
  const server = http.createServer(app);

  // Set up WebSockets with dedicated path
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws: WebSocket) => {
    const clientId = 'pl_' + Math.random().toString(36).substring(2, 9);
    clients.set(ws, { id: clientId });

    // Send connected handshake
    ws.send(JSON.stringify({ type: 'connected', clientId }));

    // Send initial list of open rooms
    const openRooms = Array.from(rooms.values())
      .filter(r => r.status === 'waiting' && Object.keys(r.players).length < 6)
      .map(r => ({
        id: r.id,
        name: r.name,
        hostName: r.players[r.hostId]?.name || 'Host',
        subject: r.subject,
        topicTitle: r.topicTitle || 'All Topics',
        questionCount: r.questionCount,
        timePerQuestion: r.timePerQuestion,
        playerCount: Object.keys(r.players).length,
        maxPlayers: 6
      }));
    ws.send(JSON.stringify({ type: 'public_rooms', rooms: openRooms }));

    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        handleClientMessage(ws, clientId, msg);
      } catch (err) {
        console.error("Error handling WebSocket message:", err);
      }
    });

    ws.on("close", () => {
      handleClientDisconnect(ws);
    });

    ws.on("error", (err) => {
      console.warn("WebSocket client error:", err);
    });
  });

  function handleClientMessage(ws: WebSocket, clientId: string, msg: any) {
    switch (msg.type) {
      case 'get_rooms': {
        const openRooms = Array.from(rooms.values())
          .filter(r => r.status === 'waiting' && Object.keys(r.players).length < 6)
          .map(r => ({
            id: r.id,
            name: r.name,
            hostName: r.players[r.hostId]?.name || 'Host',
            subject: r.subject,
            topicTitle: r.topicTitle || 'All Topics',
            questionCount: r.questionCount,
            timePerQuestion: r.timePerQuestion,
            playerCount: Object.keys(r.players).length,
            maxPlayers: 6
          }));
        ws.send(JSON.stringify({ type: 'public_rooms', rooms: openRooms }));
        break;
      }

      case 'create_room': {
        const roomId = (msg.roomId || Math.floor(100000 + Math.random() * 900000).toString()).toUpperCase();
        const player: Player = {
          id: clientId,
          name: msg.playerName || 'Player 1',
          avatar: msg.avatar || '🎓',
          score: 0,
          streak: 0,
          currentQIndex: 0,
          isReady: true,
          isFinished: false,
          answers: []
        };

        const newRoom: Room = {
          id: roomId,
          name: msg.roomName || `${player.name}'s Arena`,
          hostId: clientId,
          status: 'waiting',
          subject: msg.subject || 'all',
          topicId: msg.topicId,
          topicTitle: msg.topicTitle || 'Curriculum Mixed Challenge',
          questionCount: msg.questionCount || 10,
          timePerQuestion: msg.timePerQuestion ?? 15,
          questions: msg.questions || [],
          players: { [clientId]: player },
          createdAt: Date.now()
        };

        rooms.set(roomId, newRoom);
        const meta = clients.get(ws);
        if (meta) meta.roomId = roomId;

        ws.send(JSON.stringify({ type: 'room_created', room: newRoom, myPlayerId: clientId }));
        broadcastPublicRooms();
        break;
      }

      case 'join_room': {
        const targetRoomId = (msg.roomId || '').trim().toUpperCase();
        const room = rooms.get(targetRoomId);

        if (!room) {
          ws.send(JSON.stringify({ type: 'error', message: `Challenge room "${targetRoomId}" was not found.` }));
          return;
        }

        if (room.status !== 'waiting') {
          ws.send(JSON.stringify({ type: 'error', message: 'This challenge has already started.' }));
          return;
        }

        if (Object.keys(room.players).length >= 6) {
          ws.send(JSON.stringify({ type: 'error', message: 'This room is full (max 6 players).' }));
          return;
        }

        const newPlayer: Player = {
          id: clientId,
          name: msg.playerName || `Challenger ${Object.keys(room.players).length + 1}`,
          avatar: msg.avatar || '⚡',
          score: 0,
          streak: 0,
          currentQIndex: 0,
          isReady: false,
          isFinished: false,
          answers: []
        };

        room.players[clientId] = newPlayer;
        const meta = clients.get(ws);
        if (meta) meta.roomId = targetRoomId;

        ws.send(JSON.stringify({ type: 'room_joined', room, myPlayerId: clientId }));
        broadcastToRoom(targetRoomId, { type: 'room_update', room });
        broadcastPublicRooms();
        break;
      }

      case 'toggle_ready': {
        const meta = clients.get(ws);
        if (!meta?.roomId) return;
        const room = rooms.get(meta.roomId);
        if (!room || !room.players[clientId]) return;

        room.players[clientId].isReady = !room.players[clientId].isReady;
        broadcastToRoom(meta.roomId, { type: 'room_update', room });
        break;
      }

      case 'start_game': {
        const meta = clients.get(ws);
        if (!meta?.roomId) return;
        const room = rooms.get(meta.roomId);
        if (!room) return;

        if (room.hostId !== clientId) {
          ws.send(JSON.stringify({ type: 'error', message: 'Only the room host can start the match.' }));
          return;
        }

        room.status = 'in_progress';
        room.startedAt = Date.now();

        // Reset all player stats for the new match
        for (const p of Object.values(room.players)) {
          p.score = 0;
          p.streak = 0;
          p.currentQIndex = 0;
          p.isFinished = false;
          p.answers = [];
          p.lastAnswerCorrect = undefined;
          p.reaction = undefined;
        }

        broadcastToRoom(meta.roomId, { type: 'game_started', room });
        broadcastPublicRooms();
        break;
      }

      case 'submit_answer': {
        const meta = clients.get(ws);
        if (!meta?.roomId) return;
        const room = rooms.get(meta.roomId);
        if (!room || room.status !== 'in_progress') return;

        const player = room.players[clientId];
        if (!player || player.isFinished) return;

        const qIndex = Number(msg.questionIndex);
        const question = room.questions[qIndex];
        if (!question) return;

        const given = String(msg.answer || '').trim();
        const normGiven = normalizeStr(given);
        const normCorrect = normalizeStr(question.answer);
        const accepted = (question.accepted || []).map(normalizeStr);

        const isCorrect = normGiven === normCorrect || accepted.includes(normGiven);
        const timeMs = Number(msg.timeMs || 5000);

        let earnedPoints = 0;
        if (isCorrect) {
          const nextStreak = player.streak + 1;
          player.streak = nextStreak;

          // Base points: 100
          // Speed bonus: up to +50 points if answered in < 5 seconds
          const speedBonus = Math.max(0, Math.floor((15000 - timeMs) / 250));
          // Streak bonus: 1.2x at 3+, 1.5x at 5+
          const multiplier = nextStreak >= 5 ? 1.5 : nextStreak >= 3 ? 1.2 : 1.0;
          earnedPoints = Math.round((100 + speedBonus) * multiplier);
          player.score += earnedPoints;
          player.lastAnswerCorrect = true;
        } else {
          player.streak = 0;
          player.lastAnswerCorrect = false;
        }

        player.answers.push({
          qIndex,
          answer: given,
          isCorrect,
          timeMs
        });

        player.currentQIndex = qIndex + 1;
        if (player.currentQIndex >= room.questions.length) {
          player.isFinished = true;
        }

        // Check if all players have finished
        const allFinished = Object.values(room.players).every(p => p.isFinished);
        if (allFinished) {
          room.status = 'finished';
          room.finishedAt = Date.now();
        }

        // Send individual validation response
        ws.send(JSON.stringify({
          type: 'answer_result',
          qIndex,
          isCorrect,
          correctAnswer: question.answer,
          explanation: question.explanation,
          earnedPoints,
          totalScore: player.score,
          streak: player.streak
        }));

        // Broadcast authoritative room state to all players
        broadcastToRoom(meta.roomId, { type: 'room_update', room });
        break;
      }

      case 'send_reaction': {
        const meta = clients.get(ws);
        if (!meta?.roomId) return;
        const room = rooms.get(meta.roomId);
        if (!room) return;

        const player = room.players[clientId];
        if (!player) return;

        player.reaction = {
          emoji: msg.emoji || '👏',
          text: msg.text || 'Good luck!',
          timestamp: Date.now()
        };

        broadcastToRoom(meta.roomId, {
          type: 'player_reaction',
          playerId: clientId,
          playerName: player.name,
          emoji: player.reaction.emoji,
          text: player.reaction.text
        });
        break;
      }

      case 'play_again': {
        const meta = clients.get(ws);
        if (!meta?.roomId) return;
        const room = rooms.get(meta.roomId);
        if (!room) return;

        if (room.hostId === clientId) {
          room.status = 'waiting';
          room.questions = msg.newQuestions || room.questions;
          for (const p of Object.values(room.players)) {
            p.isReady = p.id === room.hostId;
            p.score = 0;
            p.streak = 0;
            p.currentQIndex = 0;
            p.isFinished = false;
            p.answers = [];
            p.lastAnswerCorrect = undefined;
            p.reaction = undefined;
          }
          broadcastToRoom(meta.roomId, { type: 'room_update', room });
          broadcastPublicRooms();
        }
        break;
      }

      case 'leave_room': {
        handleClientDisconnect(ws);
        break;
      }
    }
  }

  function handleClientDisconnect(ws: WebSocket) {
    const meta = clients.get(ws);
    if (!meta) return;

    if (meta.roomId) {
      const room = rooms.get(meta.roomId);
      if (room) {
        delete room.players[meta.id];
        const remainingPlayerCount = Object.keys(room.players).length;

        if (remainingPlayerCount === 0) {
          rooms.delete(meta.roomId);
        } else {
          // If host left, elect new host
          if (room.hostId === meta.id) {
            room.hostId = Object.keys(room.players)[0];
          }
          broadcastToRoom(meta.roomId, {
            type: 'player_left',
            playerId: meta.id,
            room
          });
        }
        broadcastPublicRooms();
      }
    }

    clients.delete(ws);
  }

  // Clean up inactive rooms older than 3 hours
  setInterval(() => {
    const now = Date.now();
    for (const [id, r] of rooms.entries()) {
      if (now - r.createdAt > 3 * 60 * 60 * 1000) {
        rooms.delete(id);
      }
    }
  }, 15 * 60 * 1000);

  // Vite middleware in dev or static dist in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`GL Revision Lab server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
