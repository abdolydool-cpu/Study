import React, { useState, useEffect, useRef } from 'react';
import { Topic, Question, MultiplayerRoom, MultiplayerPlayer, PublicRoomInfo } from '../types';
import { TOPICS } from '../data/topics';
import { generateQuestionPool } from '../utils/questionBuilder';
import { 
  Trophy, 
  Users, 
  Copy, 
  Check, 
  Timer, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Sparkles,
  RotateCcw,
  Flame,
  Crown,
  Wifi,
  WifiOff,
  LogOut,
  Radio,
  Swords,
  Play,
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TournamentScreenProps {
  presetTopicId?: string;
  onBackToDashboard: () => void;
}

const AVATARS = ['🎓', '⚡', '🦁', '🦉', '🚀', '👑', '🦊', '🎯', '🌟', '🐉'];

const QUICK_REACTIONS = [
  { emoji: '👏', text: 'Good luck!' },
  { emoji: '🔥', text: 'On fire!' },
  { emoji: '⚡', text: 'Catch up!' },
  { emoji: '🎯', text: 'Bullseye!' },
  { emoji: '🤯', text: 'Tough one!' },
  { emoji: '👑', text: 'GG!' }
];

export const TournamentScreen: React.FC<TournamentScreenProps> = ({
  presetTopicId,
  onBackToDashboard
}) => {
  // Player profile state
  const [playerName, setPlayerName] = useState<string>(() => {
    return localStorage.getItem('gl_player_name') || `Student ${Math.floor(100 + Math.random() * 900)}`;
  });
  const [avatar, setAvatar] = useState<string>(() => {
    return localStorage.getItem('gl_player_avatar') || '🎓';
  });

  // Lobby setup state
  const [selectedSubject, setSelectedSubject] = useState<'all' | 'english' | 'maths'>('all');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(presetTopicId || 'all');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timePerQuestion, setTimePerQuestion] = useState<number>(15);
  const [inputRoomCode, setInputRoomCode] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // WebSocket & Room State
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [myPlayerId, setMyPlayerId] = useState<string>('');
  const [currentRoom, setCurrentRoom] = useState<MultiplayerRoom | null>(null);
  const [publicRooms, setPublicRooms] = useState<PublicRoomInfo[]>([]);
  const [activeReactions, setActiveReactions] = useState<{ id: string; name: string; emoji: string; text: string }[]>([]);

  // Match round state
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [roundFeedback, setRoundFeedback] = useState<{
    isCorrect: boolean;
    earnedPoints: number;
    explanation: string;
    correctAnswer: string;
  } | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(15);

  const socketRef = useRef<WebSocket | null>(null);
  const questionStartTimeRef = useRef<number>(Date.now());
  const rivalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const rivalActiveRef = useRef<boolean>(false);

  // Save profile changes
  useEffect(() => {
    localStorage.setItem('gl_player_name', playerName);
  }, [playerName]);

  useEffect(() => {
    localStorage.setItem('gl_player_avatar', avatar);
  }, [avatar]);

  // Connect to the WebSocket server
  useEffect(() => {
    let isMounted = true;
    let reconnectTimeout: NodeJS.Timeout;

    function connect() {
      if (!isMounted) return;
      setConnectionStatus('connecting');

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      try {
        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          if (!isMounted) return;
          setConnectionStatus('connected');
          setErrorMessage('');
          // Request available public rooms
          ws.send(JSON.stringify({ type: 'get_rooms' }));
        };

        ws.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            handleIncomingMessage(data);
          } catch (err) {
            console.error('Error parsing WebSocket message', err);
          }
        };

        ws.onclose = () => {
          if (!isMounted) return;
          setConnectionStatus('disconnected');
          reconnectTimeout = setTimeout(connect, 3000);
        };

        ws.onerror = () => {
          if (!isMounted) return;
          setConnectionStatus('disconnected');
        };
      } catch (err) {
        console.error('WebSocket connection error:', err);
        setConnectionStatus('disconnected');
        reconnectTimeout = setTimeout(connect, 4000);
      }
    }

    connect();

    return () => {
      isMounted = false;
      clearTimeout(reconnectTimeout);
      if (rivalTimerRef.current) clearInterval(rivalTimerRef.current);
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  // Handle incoming server messages
  function handleIncomingMessage(msg: any) {
    switch (msg.type) {
      case 'connected':
        setMyPlayerId(msg.clientId);
        break;

      case 'public_rooms':
        setPublicRooms(msg.rooms || []);
        break;

      case 'room_created':
      case 'room_joined':
        setCurrentRoom(msg.room);
        setErrorMessage('');
        break;

      case 'room_update':
        setCurrentRoom(msg.room);
        break;

      case 'game_started':
        setCurrentRoom(msg.room);
        setCurrentQIndex(0);
        setSelectedOption(null);
        setTypedAnswer('');
        setIsAnswerSubmitted(false);
        setRoundFeedback(null);
        setSecondsRemaining(msg.room.timePerQuestion || 15);
        questionStartTimeRef.current = Date.now();
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
        break;

      case 'answer_result':
        setRoundFeedback({
          isCorrect: msg.isCorrect,
          earnedPoints: msg.earnedPoints,
          explanation: msg.explanation,
          correctAnswer: msg.correctAnswer
        });
        if (msg.isCorrect) {
          confetti({ particleCount: 20, spread: 45, origin: { y: 0.8 } });
        }
        break;

      case 'player_reaction': {
        const reactionItem = {
          id: Math.random().toString(),
          name: msg.playerName,
          emoji: msg.emoji,
          text: msg.text
        };
        setActiveReactions(prev => [...prev.slice(-3), reactionItem]);
        setTimeout(() => {
          setActiveReactions(prev => prev.filter(r => r.id !== reactionItem.id));
        }, 3500);
        break;
      }

      case 'error':
        setErrorMessage(msg.message || 'An error occurred');
        setTimeout(() => setErrorMessage(''), 5000);
        break;
    }
  }

  // Timer per question in active match
  useEffect(() => {
    if (!currentRoom || currentRoom.status !== 'in_progress' || isAnswerSubmitted) return;
    if (currentRoom.timePerQuestion <= 0) return;

    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          // Time expired, auto-submit blank
          handleAnswerSubmit(selectedOption || typedAnswer || '(timeout)');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentRoom?.status, currentQIndex, isAnswerSubmitted, selectedOption, typedAnswer]);

  // Automatically advance to the next question after feedback review
  const handleNextQuestion = () => {
    if (!currentRoom) return;
    const nextIdx = currentQIndex + 1;
    if (nextIdx < currentRoom.questions.length) {
      setCurrentQIndex(nextIdx);
      setSelectedOption(null);
      setTypedAnswer('');
      setIsAnswerSubmitted(false);
      setRoundFeedback(null);
      setSecondsRemaining(currentRoom.timePerQuestion || 15);
      questionStartTimeRef.current = Date.now();
    }
  };

  // Create a new Challenge Room
  const handleCreateRoom = () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      setErrorMessage('Connecting to live multiplayer server, please wait...');
      return;
    }

    // Filter topics according to selection
    let filteredTopics = TOPICS;
    if (selectedTopicId !== 'all') {
      filteredTopics = TOPICS.filter(t => t.id === selectedTopicId);
    } else if (selectedSubject !== 'all') {
      filteredTopics = TOPICS.filter(t => t.subject === selectedSubject);
    }

    // Generate balanced questions for all players in this challenge
    const questions = generateQuestionPool(filteredTopics, questionCount);
    const topicObj = TOPICS.find(t => t.id === selectedTopicId);

    socketRef.current.send(JSON.stringify({
      type: 'create_room',
      playerName,
      avatar,
      subject: selectedSubject,
      topicId: selectedTopicId,
      topicTitle: topicObj ? topicObj.title : selectedSubject === 'maths' ? 'Year 7 Maths' : selectedSubject === 'english' ? 'Year 7 English' : 'Curriculum Mixed Challenge',
      questionCount,
      timePerQuestion,
      questions
    }));
  };

  // Join by Room Code
  const handleJoinRoom = (targetCode?: string) => {
    const code = (targetCode || inputRoomCode).trim().toUpperCase();
    if (!code) {
      setErrorMessage('Please enter a 6-digit room code');
      return;
    }

    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      setErrorMessage('Not connected to live challenge server');
      return;
    }

    socketRef.current.send(JSON.stringify({
      type: 'join_room',
      roomId: code,
      playerName,
      avatar
    }));
  };

  // Toggle ready status
  const handleToggleReady = () => {
    if (!socketRef.current || !currentRoom) return;
    socketRef.current.send(JSON.stringify({ type: 'toggle_ready' }));
  };

  // Host starts the game
  const handleStartGame = () => {
    if (!socketRef.current || !currentRoom) return;
    socketRef.current.send(JSON.stringify({ type: 'start_game' }));
  };

  // Submit Answer for current question
  const handleAnswerSubmit = (answer: string) => {
    if (isAnswerSubmitted || !currentRoom || currentRoom.status !== 'in_progress') return;

    setIsAnswerSubmitted(true);
    const timeTaken = Math.max(500, Date.now() - questionStartTimeRef.current);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'submit_answer',
        questionIndex: currentQIndex,
        answer,
        timeMs: timeTaken
      }));
    }
  };

  // Send quick in-game reaction
  const handleSendReaction = (reaction: { emoji: string; text: string }) => {
    if (!socketRef.current || !currentRoom) return;
    socketRef.current.send(JSON.stringify({
      type: 'send_reaction',
      emoji: reaction.emoji,
      text: reaction.text
    }));
  };

  // Add Practice Rival (Simulated Sparring Competitor if no friend is online)
  const handleAddPracticeRival = () => {
    if (!currentRoom) return;
    // Notify room of a sparring rival joining the arena
    rivalActiveRef.current = true;
    const rivalPlayer: MultiplayerPlayer = {
      id: 'rival_bot_1',
      name: 'Ada - Maths Prodigy',
      avatar: '🦉',
      score: 0,
      streak: 0,
      currentQIndex: 0,
      isReady: true,
      isFinished: false
    };

    setCurrentRoom(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        players: {
          ...prev.players,
          [rivalPlayer.id]: rivalPlayer
        }
      };
    });
  };

  // Simulate rival answers during live game
  useEffect(() => {
    if (!currentRoom || currentRoom.status !== 'in_progress' || !rivalActiveRef.current) return;

    const rival = currentRoom.players['rival_bot_1'];
    if (!rival || rival.isFinished) return;

    const delay = 4000 + Math.random() * 4000;
    rivalTimerRef.current = setTimeout(() => {
      setCurrentRoom(prev => {
        if (!prev || prev.status !== 'in_progress') return prev;
        const currentRival = prev.players['rival_bot_1'];
        if (!currentRival || currentRival.isFinished) return prev;

        const isCorrect = Math.random() < 0.85;
        const nextQ = currentRival.currentQIndex + 1;
        const points = isCorrect ? Math.floor(90 + Math.random() * 40) : 0;

        return {
          ...prev,
          players: {
            ...prev.players,
            ['rival_bot_1']: {
              ...currentRival,
              currentQIndex: nextQ,
              score: currentRival.score + points,
              streak: isCorrect ? currentRival.streak + 1 : 0,
              isFinished: nextQ >= prev.questions.length,
              lastAnswerCorrect: isCorrect
            }
          }
        };
      });
    }, delay);

    return () => {
      if (rivalTimerRef.current) clearTimeout(rivalTimerRef.current);
    };
  }, [currentRoom?.status, currentRoom?.players['rival_bot_1']?.currentQIndex]);

  // Leave room and return to multiplayer lobby
  const handleLeaveRoom = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'leave_room' }));
    }
    setCurrentRoom(null);
    setSelectedOption(null);
    setTypedAnswer('');
    setIsAnswerSubmitted(false);
    setRoundFeedback(null);
  };

  // Host starts a Rematch
  const handlePlayAgain = () => {
    if (!socketRef.current || !currentRoom) return;
    const newQuestions = generateQuestionPool(
      currentRoom.topicId && currentRoom.topicId !== 'all' 
        ? TOPICS.filter(t => t.id === currentRoom.topicId)
        : TOPICS, 
      currentRoom.questionCount
    );

    socketRef.current.send(JSON.stringify({
      type: 'play_again',
      newQuestions
    }));
  };

  const copyRoomCode = () => {
    if (!currentRoom) return;
    navigator.clipboard.writeText(currentRoom.id);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Derived state
  const isHost = currentRoom && currentRoom.hostId === myPlayerId;
  const currentQ = currentRoom?.questions[currentQIndex];
  const playersList: MultiplayerPlayer[] = currentRoom ? (Object.values(currentRoom.players) as MultiplayerPlayer[]) : [];
  const sortedPlayers = [...playersList].sort((a, b) => b.score - a.score);
  const allPlayersReady = playersList.length > 0 && playersList.every(p => p.isReady);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#23444a]/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#28d4c7] via-[#20b2a6] to-[#f2b84b] flex items-center justify-center text-[#031011] shadow-lg shadow-[#28d4c7]/20">
            <Swords className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Multiplayer Arena
              </h2>
              <span className="flex items-center gap-1 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-[#28d4c7]/15 text-[#28d4c7] border border-[#28d4c7]/30">
                <Radio className="w-3 h-3 animate-pulse text-[#28d4c7]" />
                Live 1v1 &amp; Group
              </span>
            </div>
            <p className="text-xs text-[#9db4b8]">
              Real-time server-synchronized Year 7 curriculum challenge battles
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Connection Status Badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
            connectionStatus === 'connected' 
              ? 'bg-[#8bd450]/15 text-[#8bd450] border-[#8bd450]/30' 
              : connectionStatus === 'connecting'
                ? 'bg-[#f2b84b]/15 text-[#f2b84b] border-[#f2b84b]/30'
                : 'bg-[#ff6b5f]/15 text-[#ff6b5f] border-[#ff6b5f]/30'
          }`}>
            {connectionStatus === 'connected' ? (
              <Wifi className="w-3.5 h-3.5 text-[#8bd450]" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-[#ff6b5f]" />
            )}
            <span className="capitalize">{connectionStatus}</span>
          </div>

          <button
            onClick={onBackToDashboard}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#13262b] text-[#9db4b8] hover:text-white border border-[#23444a] transition-all cursor-pointer"
          >
            Exit Arena
          </button>
        </div>
      </div>

      {/* Error alert if any */}
      {errorMessage && (
        <div className="p-3 bg-[#ff6b5f]/15 border border-[#ff6b5f]/30 rounded-xl text-xs sm:text-sm text-[#ff6b5f] flex items-center justify-between animate-shake">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage('')} className="font-bold underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Floating Reaction Overlays */}
      {activeReactions.length > 0 && (
        <div className="fixed top-20 right-6 z-50 flex flex-col gap-2 pointer-events-none">
          {activeReactions.map(r => (
            <div 
              key={r.id} 
              className="bg-[#0d1b1f]/95 border border-[#28d4c7]/40 shadow-xl rounded-2xl px-4 py-2 flex items-center gap-2.5 backdrop-blur-md animate-bounce text-sm"
            >
              <span className="text-2xl">{r.emoji}</span>
              <div>
                <span className="text-xs font-bold text-[#28d4c7] block leading-none">{r.name}</span>
                <span className="text-xs text-white">{r.text}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. LOBBY VIEW (NO ACTIVE ROOM)                                            */}
      {/* ========================================================================= */}
      {!currentRoom && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Player Identity & Create Challenge */}
          <div className="lg:col-span-7 space-y-6">
            {/* Player Identity Card */}
            <div className="bg-[#0d1b1f] border border-[#23444a] rounded-2xl p-5 sm:p-6 space-y-4">
              <h3 className="text-sm uppercase font-extrabold text-[#9db4b8] tracking-wider flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#f2b84b]" />
                Your Challenger Profile
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#9db4b8] font-medium block mb-1">Challenger Name</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={e => setPlayerName(e.target.value.slice(0, 18))}
                    placeholder="Enter your name..."
                    className="w-full bg-[#071113] border border-[#23444a] rounded-xl px-3.5 py-2 text-sm text-white focus:border-[#28d4c7] focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#9db4b8] font-medium block mb-1">Select Avatar Badge</label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {AVATARS.map(av => (
                      <button
                        key={av}
                        onClick={() => setAvatar(av)}
                        className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer ${
                          avatar === av 
                            ? 'bg-[#28d4c7]/20 border-2 border-[#28d4c7] scale-110 shadow-sm shadow-[#28d4c7]/30' 
                            : 'bg-[#13262b] border border-[#23444a] hover:bg-[#1a343b]'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Create Challenge Setup */}
            <div className="bg-[#0d1b1f] border border-[#23444a] rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-[#28d4c7]" />
                  Host a New Live Challenge
                </h3>
                <span className="text-[11px] text-[#9db4b8]">You will receive a room code</span>
              </div>

              {/* Subject filter */}
              <div>
                <label className="text-xs text-[#9db4b8] font-medium block mb-1.5">Curriculum Subject</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'all', label: 'Mixed Subjects' },
                    { id: 'maths', label: 'Year 7 Maths' },
                    { id: 'english', label: 'Year 7 English' }
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedSubject(s.id as any);
                        setSelectedTopicId('all');
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedSubject === s.id
                          ? 'bg-[#28d4c7]/20 border-[#28d4c7] text-[#28d4c7]'
                          : 'bg-[#071113] border-[#23444a] text-[#9db4b8] hover:bg-[#13262b]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific topic (optional) */}
              <div>
                <label className="text-xs text-[#9db4b8] font-medium block mb-1.5">Specific Focus Topic (Optional)</label>
                <select
                  value={selectedTopicId}
                  onChange={e => setSelectedTopicId(e.target.value)}
                  className="w-full bg-[#071113] border border-[#23444a] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:border-[#28d4c7] focus:outline-none cursor-pointer"
                >
                  <option value="all">All Available Units &bull; Broad Mixed Pool</option>
                  {TOPICS.filter(t => selectedSubject === 'all' || t.subject === selectedSubject).map(t => (
                    <option key={t.id} value={t.id}>
                      [{t.subject.toUpperCase()}] {t.title} ({t.unit})
                    </option>
                  ))}
                </select>
              </div>

              {/* Rounds and Time Limit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#9db4b8] font-medium block mb-1">Number of Rounds</label>
                  <select
                    value={questionCount}
                    onChange={e => setQuestionCount(Number(e.target.value))}
                    className="w-full bg-[#071113] border border-[#23444a] rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:border-[#28d4c7] focus:outline-none"
                  >
                    <option value={5}>5 Questions (Quick)</option>
                    <option value={8}>8 Questions (Standard)</option>
                    <option value={10}>10 Questions (Tournament)</option>
                    <option value={15}>15 Questions (Championship)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#9db4b8] font-medium block mb-1">Time Per Question</label>
                  <select
                    value={timePerQuestion}
                    onChange={e => setTimePerQuestion(Number(e.target.value))}
                    className="w-full bg-[#071113] border border-[#23444a] rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:border-[#28d4c7] focus:outline-none"
                  >
                    <option value={10}>10s &bull; Rapid Speed</option>
                    <option value={15}>15s &bull; Balanced</option>
                    <option value={20}>20s &bull; Generous</option>
                    <option value={0}>Untimed (Free Pace)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleCreateRoom}
                className="w-full py-3 rounded-xl font-extrabold text-sm bg-gradient-to-r from-[#28d4c7] to-[#158d99] text-[#031011] shadow-lg shadow-[#28d4c7]/20 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Swords className="w-4 h-4" />
                <span>Create &amp; Host Challenge Room</span>
              </button>
            </div>
          </div>

          {/* Right Column: Direct Join & Public Rooms */}
          <div className="lg:col-span-5 space-y-6">
            {/* Join with Code Card */}
            <div className="bg-[#0d1b1f] border border-[#23444a] rounded-2xl p-5 sm:p-6 space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#f2b84b]" />
                Join with Room Code
              </h3>
              <p className="text-xs text-[#9db4b8]">
                Have a code from your classmate or teacher? Enter the 6-digit code below to enter the arena.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={8}
                  value={inputRoomCode}
                  onChange={e => setInputRoomCode(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleJoinRoom()}
                  placeholder="e.g. 583921"
                  className="flex-1 bg-[#071113] border border-[#23444a] rounded-xl px-4 py-2.5 font-mono text-center tracking-widest text-lg font-black text-[#28d4c7] focus:border-[#28d4c7] focus:outline-none uppercase"
                />
                <button
                  onClick={() => handleJoinRoom()}
                  className="px-5 rounded-xl font-extrabold text-xs sm:text-sm bg-[#13262b] text-[#28d4c7] hover:bg-[#28d4c7] hover:text-[#031011] border border-[#28d4c7]/40 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  Join
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Public Rooms Browser */}
            <div className="bg-[#0d1b1f] border border-[#23444a] rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm uppercase font-extrabold text-[#9db4b8] tracking-wider flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-[#28d4c7] animate-pulse" />
                  Live Open Rooms
                </h3>
                <span className="text-[11px] text-[#28d4c7] font-bold">
                  {publicRooms.length} Available
                </span>
              </div>

              {publicRooms.length === 0 ? (
                <div className="text-center py-8 px-4 rounded-xl border border-dashed border-[#23444a] bg-[#071113]/50 space-y-2">
                  <Users className="w-8 h-8 text-[#9db4b8]/40 mx-auto" />
                  <p className="text-xs text-[#9db4b8]">No public waiting rooms right now.</p>
                  <p className="text-[11px] text-[#9db4b8]/60">
                    Host a room on the left to invite a friend or classmate!
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {publicRooms.map(room => (
                    <div
                      key={room.id}
                      className="p-3 bg-[#071113] border border-[#23444a] hover:border-[#28d4c7]/50 rounded-xl flex items-center justify-between gap-3 transition-all"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-white truncate">
                            {room.name}
                          </span>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#28d4c7]/10 text-[#28d4c7]">
                            {room.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#9db4b8] flex items-center gap-2 mt-0.5">
                          <span>Host: {room.hostName}</span>
                          <span>&bull;</span>
                          <span>{room.questionCount} Qs</span>
                          <span>&bull;</span>
                          <span>{room.playerCount}/6 Players</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleJoinRoom(room.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-extrabold bg-[#28d4c7]/15 text-[#28d4c7] hover:bg-[#28d4c7] hover:text-[#031011] transition-all shrink-0 cursor-pointer"
                      >
                        Enter
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PRE-MATCH STAGING ROOM (WAITING / READY PHASE)                         */}
      {/* ========================================================================= */}
      {currentRoom && currentRoom.status === 'waiting' && (
        <div className="bg-[#0d1b1f] border border-[#23444a] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
          {/* Room Header & Code Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#23444a] pb-6">
            <div>
              <span className="text-[11px] uppercase font-black text-[#28d4c7] tracking-wider block">
                Challenge Staging Lobby
              </span>
              <h3 className="text-2xl font-black text-white">{currentRoom.name}</h3>
              <p className="text-xs text-[#9db4b8] mt-1">
                {currentRoom.topicTitle} &bull; {currentRoom.questionCount} Questions &bull;{' '}
                {currentRoom.timePerQuestion > 0 ? `${currentRoom.timePerQuestion}s per question` : 'Untimed'}
              </p>
            </div>

            {/* Room Code Badge */}
            <div className="flex items-center gap-3 bg-[#071113] border border-[#28d4c7]/40 px-4 py-2.5 rounded-xl shadow-inner">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#9db4b8] block leading-none">
                  Room Invite Code
                </span>
                <span className="text-xl font-black font-mono tracking-widest text-[#28d4c7]">
                  {currentRoom.id}
                </span>
              </div>
              <button
                onClick={copyRoomCode}
                className="p-2 rounded-lg bg-[#13262b] text-[#28d4c7] hover:bg-[#28d4c7] hover:text-[#031011] transition-all cursor-pointer"
                title="Copy Room Code"
              >
                {copiedCode ? <Check className="w-4 h-4 text-[#8bd450]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Connected Challengers Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase font-extrabold text-[#9db4b8] tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-[#28d4c7]" />
                Connected Challengers ({playersList.length}/6)
              </h4>
              <span className="text-xs text-[#9db4b8]">
                {allPlayersReady ? 'All challengers ready!' : 'Waiting for everyone to mark ready'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {playersList.map(player => (
                <div
                  key={player.id}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    player.id === myPlayerId
                      ? 'bg-[#13262b] border-[#28d4c7]/60 shadow-md shadow-[#28d4c7]/10'
                      : 'bg-[#071113] border-[#23444a]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl">{player.avatar}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-white truncate">{player.name}</span>
                        {player.id === currentRoom.hostId && (
                          <Crown className="w-3.5 h-3.5 text-[#f2b84b] shrink-0" title="Room Host" />
                        )}
                      </div>
                      <span className="text-[11px] text-[#9db4b8]">
                        {player.id === myPlayerId ? 'You' : 'Opponent'}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                      player.isReady
                        ? 'bg-[#8bd450]/15 text-[#8bd450] border-[#8bd450]/30'
                        : 'bg-[#ff6b5f]/15 text-[#ff6b5f] border-[#ff6b5f]/30'
                    }`}
                  >
                    {player.isReady ? 'Ready' : 'Not Ready'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Chat / Reactions in Lobby */}
          <div className="border-t border-[#23444a] pt-4">
            <span className="text-xs text-[#9db4b8] font-medium block mb-2">Send Pre-Match Emote:</span>
            <div className="flex items-center gap-2 flex-wrap">
              {QUICK_REACTIONS.map(r => (
                <button
                  key={r.emoji}
                  onClick={() => handleSendReaction(r)}
                  className="px-3 py-1.5 rounded-xl bg-[#071113] hover:bg-[#13262b] border border-[#23444a] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>{r.emoji}</span>
                  <span>{r.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#23444a] pt-6">
            <div className="flex items-center gap-2">
              <button
                onClick={handleLeaveRoom}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#ff6b5f] bg-[#ff6b5f]/10 hover:bg-[#ff6b5f]/20 border border-[#ff6b5f]/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Leave Room
              </button>

              {playersList.length === 1 && (
                <button
                  onClick={handleAddPracticeRival}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#f2b84b] bg-[#f2b84b]/10 hover:bg-[#f2b84b]/20 border border-[#f2b84b]/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5" />
                  Add Practice Rival (1v1 Bot)
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Ready toggle for all players */}
              <button
                onClick={handleToggleReady}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold border transition-all cursor-pointer ${
                  currentRoom.players[myPlayerId]?.isReady
                    ? 'bg-[#8bd450]/20 text-[#8bd450] border-[#8bd450]'
                    : 'bg-[#13262b] text-white border-[#23444a] hover:border-[#28d4c7]'
                }`}
              >
                {currentRoom.players[myPlayerId]?.isReady ? '✓ You Are Ready' : 'Mark as Ready'}
              </button>

              {/* Host Start button */}
              {isHost && (
                <button
                  onClick={handleStartGame}
                  disabled={!allPlayersReady}
                  className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                    allPlayersReady
                      ? 'bg-gradient-to-r from-[#28d4c7] to-[#158d99] text-[#031011] shadow-lg shadow-[#28d4c7]/20 hover:brightness-110 active:scale-95'
                      : 'bg-[#13262b] text-[#9db4b8]/50 border border-[#23444a] cursor-not-allowed'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>Start Match</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. LIVE MATCH ARENA (IN PROGRESS)                                         */}
      {/* ========================================================================= */}
      {currentRoom && currentRoom.status === 'in_progress' && currentQ && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Live Competitor Race Track */}
          <div className="bg-[#0d1b1f] border border-[#23444a] rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wider text-[#9db4b8] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#f2b84b]" />
                Live Arena Leaderboard
              </span>
              <span className="text-[#28d4c7] font-bold">
                Round {currentQIndex + 1} of {currentRoom.questions.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {sortedPlayers.map((p, idx) => {
                const progressPct = Math.min(100, Math.round((p.currentQIndex / currentRoom.questions.length) * 100));
                return (
                  <div key={p.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[#f2b84b] w-4">{idx + 1}.</span>
                        <span>{p.avatar}</span>
                        <span className={`font-bold ${p.id === myPlayerId ? 'text-[#28d4c7]' : 'text-white'}`}>
                          {p.name} {p.id === myPlayerId && '(You)'}
                        </span>
                        {p.streak >= 3 && (
                          <span className="flex items-center gap-0.5 text-[10px] font-black text-[#ff6b5f] bg-[#ff6b5f]/15 px-1.5 py-0.2 rounded">
                            <Flame className="w-3 h-3 fill-current" />
                            {p.streak}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-[#9db4b8] font-mono">
                          Q{p.currentQIndex}/{currentRoom.questions.length}
                        </span>
                        <span className="font-mono font-black text-sm text-[#28d4c7]">
                          {p.score} pts
                        </span>
                      </div>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full bg-[#071113] h-2 rounded-full overflow-hidden border border-[#23444a]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          p.id === myPlayerId
                            ? 'bg-gradient-to-r from-[#28d4c7] to-[#8bd450]'
                            : 'bg-gradient-to-r from-[#f2b84b] to-[#ff6b5f]'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Question Card */}
          <div className="bg-[#0d1b1f] border border-[#23444a] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            {/* Header: Timer and Question Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#23444a] pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded bg-[#28d4c7]/15 text-[#28d4c7] border border-[#28d4c7]/30">
                  {currentQ.unit}
                </span>
                <span className="text-xs text-[#9db4b8]">{currentQ.topic}</span>
              </div>

              {/* Per-question countdown */}
              {currentRoom.timePerQuestion > 0 && (
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border font-mono font-black text-sm ${
                  secondsRemaining <= 4 
                    ? 'bg-[#ff6b5f]/20 border-[#ff6b5f] text-[#ff6b5f] animate-pulse' 
                    : 'bg-[#13262b] border-[#23444a] text-[#f2b84b]'
                }`}>
                  <Timer className="w-4 h-4" />
                  <span>{secondsRemaining}s</span>
                </div>
              )}
            </div>

            {/* Comprehension Passage if present */}
            {currentQ.passage && (
              <div className="bg-[#071113] border border-[#23444a] rounded-xl p-4 text-xs sm:text-sm text-[#9db4b8] leading-relaxed max-h-48 overflow-y-auto italic">
                <div className="font-bold text-white mb-1.5 not-italic">
                  {currentQ.passageTitle || 'Extract Context:'}
                </div>
                {currentQ.passage}
              </div>
            )}

            {/* Prompt */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                {currentQ.prompt}
              </h3>
            </div>

            {/* Multiple Choice Options */}
            {currentQ.options && currentQ.options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map((opt, i) => {
                  let btnStyle = 'bg-[#071113] border-[#23444a] text-white hover:border-[#28d4c7] hover:bg-[#13262b]';

                  if (isAnswerSubmitted) {
                    if (roundFeedback) {
                      if (opt === roundFeedback.correctAnswer) {
                        btnStyle = 'bg-[#8bd450]/20 border-[#8bd450] text-[#8bd450] font-black';
                      } else if (selectedOption === opt && !roundFeedback.isCorrect) {
                        btnStyle = 'bg-[#ff6b5f]/20 border-[#ff6b5f] text-[#ff6b5f] line-through';
                      } else {
                        btnStyle = 'bg-[#071113]/50 border-[#23444a]/50 text-[#9db4b8]/50';
                      }
                    }
                  } else if (selectedOption === opt) {
                    btnStyle = 'bg-[#28d4c7]/20 border-[#28d4c7] text-[#28d4c7] font-bold';
                  }

                  return (
                    <button
                      key={i}
                      disabled={isAnswerSubmitted}
                      onClick={() => {
                        setSelectedOption(opt);
                        handleAnswerSubmit(opt);
                      }}
                      className={`p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswerSubmitted && roundFeedback && opt === roundFeedback.correctAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-[#8bd450] shrink-0" />
                      )}
                      {isAnswerSubmitted && roundFeedback && selectedOption === opt && !roundFeedback.isCorrect && (
                        <XCircle className="w-4 h-4 text-[#ff6b5f] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Typed Interaction Mode */}
            {(!currentQ.options || currentQ.options.length === 0) && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    disabled={isAnswerSubmitted}
                    value={typedAnswer}
                    onChange={e => setTypedAnswer(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAnswerSubmit(typedAnswer)}
                    placeholder="Type your answer here..."
                    className="flex-1 bg-[#071113] border border-[#23444a] rounded-xl px-4 py-3 text-sm text-white focus:border-[#28d4c7] focus:outline-none"
                  />
                  <button
                    disabled={isAnswerSubmitted || !typedAnswer.trim()}
                    onClick={() => handleAnswerSubmit(typedAnswer)}
                    className="px-5 rounded-xl font-bold text-xs bg-[#28d4c7] text-[#031011] disabled:opacity-40 cursor-pointer"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}

            {/* Answer Feedback Card */}
            {roundFeedback && (
              <div className={`p-4 rounded-xl border space-y-2 animate-in fade-in duration-200 ${
                roundFeedback.isCorrect 
                  ? 'bg-[#8bd450]/15 border-[#8bd450]/40 text-[#8bd450]' 
                  : 'bg-[#ff6b5f]/15 border-[#ff6b5f]/40 text-[#ff6b5f]'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-sm">
                    {roundFeedback.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Correct! +{roundFeedback.earnedPoints} Points</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5" />
                        <span>Incorrect &bull; Correct Answer: {roundFeedback.correctAnswer}</span>
                      </>
                    )}
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="px-4 py-1.5 rounded-lg text-xs font-black bg-white text-[#031011] hover:bg-[#28d4c7] transition-all flex items-center gap-1 cursor-pointer"
                  >
                    Next Round
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-white/90 leading-relaxed">
                  {roundFeedback.explanation}
                </p>
              </div>
            )}

            {/* Quick Live Reactions Toolbar */}
            <div className="flex items-center justify-between border-t border-[#23444a]/80 pt-4 text-xs">
              <span className="text-[#9db4b8]">Cheer or Taunt:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {QUICK_REACTIONS.map(r => (
                  <button
                    key={r.emoji}
                    onClick={() => handleSendReaction(r)}
                    className="w-8 h-8 rounded-lg bg-[#071113] hover:bg-[#13262b] border border-[#23444a] text-base flex items-center justify-center transition-all cursor-pointer"
                    title={r.text}
                  >
                    {r.emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. POST-MATCH PODIUM & FINISHED BREAKDOWN                                 */}
      {/* ========================================================================= */}
      {currentRoom && currentRoom.status === 'finished' && (
        <div className="bg-[#0d1b1f] border border-[#23444a] rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl animate-in zoom-in-95 duration-300 text-center">
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#f2b84b]/20 border border-[#f2b84b]/40 flex items-center justify-center text-3xl mx-auto shadow-xl">
              🏆
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Challenge Complete!
            </h3>
            <p className="text-xs text-[#9db4b8]">
              {currentRoom.name} &bull; Final Results &amp; Honors
            </p>
          </div>

          {/* Podium */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4 items-end">
            {/* 2nd Place */}
            {sortedPlayers[1] && (
              <div className="bg-[#071113] border border-[#23444a] rounded-2xl p-5 space-y-2 order-2 sm:order-1">
                <span className="text-2xl">{sortedPlayers[1].avatar}</span>
                <div className="text-xs uppercase font-extrabold text-[#9db4b8]">2nd Place</div>
                <div className="text-base font-black text-white truncate">{sortedPlayers[1].name}</div>
                <div className="text-lg font-black font-mono text-[#28d4c7]">
                  {sortedPlayers[1].score} pts
                </div>
              </div>
            )}

            {/* 1st Place Champion */}
            {sortedPlayers[0] && (
              <div className="bg-gradient-to-b from-[#242113] to-[#071113] border-2 border-[#f2b84b] rounded-2xl p-6 space-y-2 order-1 sm:order-2 shadow-2xl shadow-[#f2b84b]/20 scale-105">
                <Crown className="w-7 h-7 text-[#f2b84b] mx-auto animate-bounce" />
                <span className="text-4xl block">{sortedPlayers[0].avatar}</span>
                <div className="text-xs uppercase font-black tracking-widest text-[#f2b84b]">Champion</div>
                <div className="text-lg font-black text-white truncate">{sortedPlayers[0].name}</div>
                <div className="text-2xl font-black font-mono text-[#f2b84b]">
                  {sortedPlayers[0].score} pts
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {sortedPlayers[2] && (
              <div className="bg-[#071113] border border-[#23444a] rounded-2xl p-5 space-y-2 order-3">
                <span className="text-2xl">{sortedPlayers[2].avatar}</span>
                <div className="text-xs uppercase font-extrabold text-[#9db4b8]">3rd Place</div>
                <div className="text-base font-black text-white truncate">{sortedPlayers[2].name}</div>
                <div className="text-lg font-black font-mono text-[#28d4c7]">
                  {sortedPlayers[2].score} pts
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-[#23444a]">
            {isHost && (
              <button
                onClick={handlePlayAgain}
                className="px-6 py-3 rounded-xl font-extrabold text-sm bg-gradient-to-r from-[#28d4c7] to-[#158d99] text-[#031011] shadow-lg shadow-[#28d4c7]/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Rematch (New Questions)</span>
              </button>
            )}

            <button
              onClick={handleLeaveRoom}
              className="px-5 py-3 rounded-xl font-extrabold text-sm bg-[#13262b] text-white hover:bg-[#1a343b] border border-[#23444a] transition-all flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Return to Lobby</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
