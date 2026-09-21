export interface VoiceInfo {
  voiceURI: string;
  name: string;
  lang: string;
  isBritish: boolean;
  score: number;
}

export function isBritishVoice(v: SpeechSynthesisVoice): boolean {
  const text = `${v.lang || ""} ${v.name || ""} ${v.voiceURI || ""}`.toLowerCase();
  return (
    v.lang === "en-GB" ||
    /en-gb|united kingdom|great britain|british|google uk english|microsoft (sonia|ryan|libby|george|hazel)|\bdaniel\b|\bserena\b/.test(text)
  );
}

export function calculateVoiceScore(v: SpeechSynthesisVoice): number {
  const text = `${v.lang || ""} ${v.name || ""} ${v.voiceURI || ""}`.toLowerCase();
  let score = 0;
  if (v.lang === "en-GB") score += 140;
  else if ((v.lang || "").startsWith("en-")) score += 35;
  if (/united kingdom|great britain|british|google uk english/.test(text)) score += 80;
  if (/microsoft (sonia|ryan|libby|george|hazel)|\bdaniel\b|\bserena\b/.test(text)) score += 55;
  if (/natural|online/.test(text)) score += 12;
  if (v.localService) score += 4;
  return score;
}

export function getRankedVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  return voices.slice().sort((a, b) => calculateVoiceScore(b) - calculateVoiceScore(a) || a.name.localeCompare(b.name));
}

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakWord(word: string, voiceURI?: string, rate: number = 0.8): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }
  try {
    window.speechSynthesis.cancel();
    const cleanWord = word.trim();
    if (!cleanWord) return false;

    const utterance = new SpeechSynthesisUtterance(cleanWord);
    utterance.rate = rate;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = getRankedVoices();
    let selected: SpeechSynthesisVoice | undefined;

    if (voiceURI) {
      selected = voices.find(v => v.voiceURI === voiceURI);
    }
    if (!selected) {
      selected = voices.find(isBritishVoice) || voices[0];
    }

    if (selected) {
      utterance.voice = selected;
      utterance.lang = selected.lang || 'en-GB';
    } else {
      utterance.lang = 'en-GB';
    }

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);

    // Keep voice synthesis alive if browser goes into background
    setTimeout(() => {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }, 50);

    return true;
  } catch (err) {
    console.error('Speech error:', err);
    return false;
  }
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
