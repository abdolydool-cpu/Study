/**
 * Dynamic Procedural English Question Generator
 * Generates thousands of curriculum-accurate Year 7 GL Assessment questions
 * across all 26 English syllabus topics with rich vocabulary, literary extracts,
 * grammar variations, and active recall tasks.
 */

import { DifficultyLevel } from '../types';

export interface GeneratedQuestionTemplate {
  prompt: string;
  answer: string;
  distractors: string[];
  explanation: string;
  accepted?: string[];
  passage?: string;
  passageTitle?: string;
  interaction?: 'mc' | 'type';
  skill?: string;
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function choice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const c = [...arr];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

/* =========================================================================
   1. VOCABULARY BANK (100+ Authentic GL Year 7 Tier 2/3 Lexicon)
   ========================================================================= */
export interface VocabEntry {
  word: string;
  meaning: string;
  synonyms: string[];
  antonyms: string[];
  example: string;
  distractors: string[];
  tier?: 'easy' | 'medium' | 'hard';
}

export const VOCAB_BANK: VocabEntry[] = [
  {
    word: "meticulous",
    meaning: "showing great attention to detail; very careful and precise",
    synonyms: ["scrupulous", "thorough", "painstaking", "diligent"],
    antonyms: ["careless", "sloppy", "slapdash", "negligent"],
    example: "The watchmaker worked with meticulous care to assemble the microscopic gears.",
    distractors: ["clumsy and hurried", "boastful and loud", "ancient and delicate"]
  },
  {
    word: "precarious",
    meaning: "dangerously insecure, unstable, or uncertain",
    synonyms: ["hazardous", "perilous", "shaky", "unsteady"],
    antonyms: ["secure", "safe", "stable", "firm"],
    example: "The mountain climber rested on a precarious ledge overlooking the ravine.",
    distractors: ["comfortable and wide", "deliberate and slow", "wealthy and grand"]
  },
  {
    word: "benevolent",
    meaning: "well-meaning, kindly, and generous",
    synonyms: ["charitable", "compassionate", "altruistic", "kind-hearted"],
    antonyms: ["malevolent", "spiteful", "cruel", "malicious"],
    example: "The benevolent benefactor secretly paid the school fees for three impoverished pupils.",
    distractors: ["harsh and demanding", "suspicious and cautious", "wealthy but greedy"]
  },
  {
    word: "ominous",
    meaning: "giving the worrying impression that something bad or harmful is going to happen",
    synonyms: ["foreboding", "sinister", "threatening", "menacing"],
    antonyms: ["promising", "auspicious", "cheerful", "encouraging"],
    example: "Dark, bruised thunderclouds cast an ominous shadow across the valley.",
    distractors: ["bright and sunny", "humorous and playful", "peaceful and quiet"]
  },
  {
    word: "apprehensive",
    meaning: "anxious or fearful that something unpleasant or difficult will happen",
    synonyms: ["uneasy", "nervous", "hesitant", "jittery"],
    antonyms: ["confident", "serene", "bold", "composed"],
    example: "Kiran felt apprehensive as he stood outside the headmaster's oak doors.",
    distractors: ["furious and vengeful", "thrilled and overjoyed", "completely indifferent"]
  },
  {
    word: "jubilant",
    meaning: "feeling or expressing great happiness, triumph, and celebration",
    synonyms: ["ecstatic", "exultant", "triumphant", "rejoicing"],
    antonyms: ["despondent", "mournful", "glum", "crestfallen"],
    example: "The jubilant crowd cheered thunderously when the winning goal was scored in extra time.",
    distractors: ["anxious and silent", "weary and defeated", "calm and meditative"]
  },
  {
    word: "desolate",
    meaning: "bleak, dismal, and empty of people or life",
    synonyms: ["barren", "deserted", "abandoned", "forlorn"],
    antonyms: ["bustling", "fertile", "populated", "vibrant"],
    example: "Wind howled across the desolate expanse of salt flats under the grey winter sky.",
    distractors: ["colourful and crowded", "sheltered and warm", "luxurious and festive"]
  },
  {
    word: "profound",
    meaning: "having very great depth of meaning, knowledge, or emotional impact",
    synonyms: ["intense", "insightful", "deep", "weighty"],
    antonyms: ["superficial", "shallow", "trivial", "slight"],
    example: "The scientist's discovery had a profound impact on modern medicine.",
    distractors: ["shallow and silly", "brief and forgotten", "loud and disruptive"]
  },
  {
    word: "elusive",
    meaning: "difficult to find, catch, achieve, or remember",
    synonyms: ["evasive", "intangible", "fleeting", "unobtainable"],
    antonyms: ["accessible", "obvious", "tangible", "catchable"],
    example: "The snow leopard remained elusive, leaving only faint pawprints on the ridge.",
    distractors: ["common and loud", "tame and friendly", "obvious and easily seen"]
  },
  {
    word: "candid",
    meaning: "truthful and straightforward; frank and honest",
    synonyms: ["outspoken", "unreserved", "genuine", "forthright"],
    antonyms: ["deceitful", "guarded", "insincere", "evasive"],
    example: "In her candid diary entries, she admitted her fears of failing the entrance exam.",
    distractors: ["secretive and dishonest", "formal and rehearsed", "arrogant and harsh"]
  },
  {
    word: "industrious",
    meaning: "diligent, hardworking, and constantly productive",
    synonyms: ["conscientious", "persevering", "assiduous", "tireless"],
    antonyms: ["indolent", "lazy", "slothful", "idle"],
    example: "The industrious ants built a fortified mound before the autumn rains arrived.",
    distractors: ["clumsy and careless", "easily distracted", "boastful and noisy"]
  },
  {
    word: "ambiguous",
    meaning: "open to more than one interpretation; unclear or having a double meaning",
    synonyms: ["equivocal", "vague", "obscure", "indeterminate"],
    antonyms: ["explicit", "clear-cut", "unambiguous", "lucid"],
    example: "The detective scrutinized the suspect's ambiguous reply.",
    distractors: ["simple and crystal clear", "firmly settled", "spoken loudly"]
  },
  {
    word: "treacherous",
    meaning: "guilty of or involving betrayal or deception; or presenting hidden hazards",
    synonyms: ["perfidious", "deceitful", "perilous", "untrustworthy"],
    antonyms: ["faithful", "dependable", "safe", "loyal"],
    example: "The narrow path along the slippery sea cliff was treacherous in thick sea mist.",
    distractors: ["firm and paved", "warm and hospitable", "harmless and easy"]
  },
  {
    word: "luminous",
    meaning: "giving off light; bright or shining, especially in the dark",
    synonyms: ["radiant", "incandescent", "brilliant", "glowing"],
    antonyms: ["dim", "opaque", "shadowy", "murky"],
    example: "Luminous jellyfish drifted like floating lanterns through the pitch-black ocean depths.",
    distractors: ["heavy and iron", "cold and silent", "dark and muddy"]
  },
  {
    word: "hostile",
    meaning: "showing or feeling active opposition, unfriendliness, or enmity",
    synonyms: ["antagonistic", "adversarial", "belligerent", "spiteful"],
    antonyms: ["welcoming", "amicable", "cordial", "hospitable"],
    example: "The invading fleet was greeted with hostile glares from the island's defenders.",
    distractors: ["warm and welcoming", "peaceful and gentle", "bored and drowsy"]
  },
  {
    word: "resilient",
    meaning: "able to withstand or recover quickly from difficult conditions or shocks",
    synonyms: ["plucky", "tough", "buoyant", "adaptable"],
    antonyms: ["fragile", "vulnerable", "brittle", "weak"],
    example: "The young sapling was remarkably resilient, straightening up after the severe gale.",
    distractors: ["easily broken", "stubborn and unmoving", "dry and withered"]
  },
  {
    word: "solitary",
    meaning: "done or existing alone; preferring seclusion",
    synonyms: ["isolated", "lonely", "secluded", "reclusive"],
    antonyms: ["sociable", "communal", "accompanied", "crowded"],
    example: "An eagle kept a solitary vigil upon the craggy granite peak.",
    distractors: ["celebratory and noisy", "accompanied by many", "warm and friendly"]
  },
  {
    word: "perpetual",
    meaning: "never ending or changing; occurring repeatedly so as to seem endless",
    synonyms: ["incessant", "ceaseless", "everlasting", "unremitting"],
    antonyms: ["fleeting", "transient", "temporary", "intermittent"],
    example: "The waterfall filled the river canyon with a perpetual roar of thunderous foam.",
    distractors: ["brief and momentary", "silent and still", "rarely occurring"]
  },
  {
    word: "versatile",
    meaning: "able to adapt or be adapted to many different functions or activities",
    synonyms: ["adaptable", "flexible", "all-round", "resourceful"],
    antonyms: ["inflexible", "limited", "single-purpose", "rigid"],
    example: "A Swiss pocket knife is a versatile tool for wilderness hikers.",
    distractors: ["fragile and clumsy", "useless outdoors", "single-use only"]
  },
  {
    word: "subtle",
    meaning: "so delicate or precise as to be difficult to analyze or detect immediately",
    synonyms: ["understated", "nuanced", "delicate", "fine"],
    antonyms: ["blatant", "crude", "obvious", "garish"],
    example: "There was a subtle shift in his voice that revealed he was disguising the truth.",
    distractors: ["glaring and obvious", "shouted loudly", "brightly coloured"]
  },
  {
    word: "bewildered",
    meaning: "completely confused and puzzled; perplexed",
    synonyms: ["baffled", "mystified", "flummoxed", "disoriented"],
    antonyms: ["enlightened", "confident", "unfazed", "comprehending"],
    example: "The new librarian stared at the scrambled catalogue with a bewildered expression.",
    distractors: ["calm and orderly", "furious and loud", "joyful and proud"]
  },
  {
    word: "exquisite",
    meaning: "extremely beautiful and delicate; crafted with supreme skill",
    synonyms: ["magnificent", "flawless", "dazzling", "superb"],
    antonyms: ["crude", "inferior", "ugly", "rough"],
    example: "The museum displayed an exquisite stained-glass window dating from the Tudor period.",
    distractors: ["rough and broken", "plain and ordinary", "cheap and plastic"]
  },
  {
    word: "turbulent",
    meaning: "characterized by conflict, disorder, or confusion; not stable or calm",
    synonyms: ["tempestuous", "tumultuous", "unruly", "stormy"],
    antonyms: ["peaceful", "tranquil", "serene", "placid"],
    example: "The ship battled turbulent waves as the storm swept across the North Sea.",
    distractors: ["calm and flat", "sunny and breezy", "dry and frozen"]
  },
  {
    word: "melancholy",
    meaning: "a feeling of pensive sadness, typically with no obvious cause",
    synonyms: ["sorrowful", "wistful", "sombre", "lugubrious"],
    antonyms: ["cheerful", "ebullient", "radiant", "optimistic"],
    example: "The haunting cello solo cast a quiet melancholy over the darkened theatre.",
    distractors: ["riotous laughter", "furious anger", "carefree excitement"],
    tier: 'medium'
  },
  {
    word: "ephemeral",
    meaning: "lasting for only a very short time; transient and fleeting",
    synonyms: ["fleeting", "transitory", "short-lived", "momentary"],
    antonyms: ["permanent", "eternal", "enduring", "perpetual"],
    example: "Morning mist over the valley proved ephemeral, evaporating the moment sunrise broke.",
    distractors: ["rock solid and heavy", "ancient and historic", "eternal and timeless"],
    tier: 'hard'
  },
  {
    word: "magnanimous",
    meaning: "generous or forgiving, especially towards a rival or someone less powerful",
    synonyms: ["benevolent", "charitable", "noble-spirited", "altruistic"],
    antonyms: ["petty", "spiteful", "vindictive", "mean"],
    example: "In a magnanimous speech, the victor applauded his opponent's fierce determination.",
    distractors: ["boastful and greedy", "cruel and punishing", "cowardly and timid"],
    tier: 'hard'
  },
  {
    word: "clandestine",
    meaning: "kept secret or done secretly, especially because illicit or illicitly intended",
    synonyms: ["covert", "surreptitious", "stealthy", "confidential"],
    antonyms: ["overt", "public", "blatant", "transparent"],
    example: "The secret agents held a clandestine midnight meeting behind the old chapel.",
    distractors: ["widely broadcast", "loud and joyful", "simple and innocent"],
    tier: 'hard'
  },
  {
    word: "cacophony",
    meaning: "a harsh, discordant mixture of sounds and loud noise",
    synonyms: ["din", "racket", "discord", "clamour"],
    antonyms: ["harmony", "symphony", "euphony", "silence"],
    example: "Car horns, construction drills, and sirens blended into an unbearable urban cacophony.",
    distractors: ["peaceful lullaby", "gentle silence", "sweet melody"],
    tier: 'hard'
  },
  {
    word: "perspicacious",
    meaning: "having a ready insight into and clear understanding of things; shrewd",
    synonyms: ["astute", "discerning", "shrewd", "perceptive"],
    antonyms: ["ignorant", "obtuse", "foolish", "unobservant"],
    example: "The perspicacious detective noticed tiny scuff marks near the unlocked window latch.",
    distractors: ["clumsy and forgetful", "easily tricked", "careless and hasty"],
    tier: 'hard'
  },
  {
    word: "inexorable",
    meaning: "impossible to stop, prevent, or persuade otherwise; relentless",
    synonyms: ["relentless", "unstoppable", "unyielding", "implacable"],
    antonyms: ["flexible", "preventable", "yielding", "merciful"],
    example: "The inexorable march of rising sea tides eventually submerged the sandbanks.",
    distractors: ["gentle and hesitant", "easily halted", "reversible and weak"],
    tier: 'hard'
  }
];

/* =========================================================================
   2. EXTRACTS & NARRATIVE PASSAGE GENERATOR (For Comprehension, Retrieval, Inference)
   ========================================================================= */
interface NarrativeExtract {
  title: string;
  author: string;
  passage: string;
  retrievalQuestions: Array<{ prompt: string; answer: string; distractors: string[]; explanation: string }>;
  inferenceQuestions: Array<{ prompt: string; answer: string; distractors: string[]; explanation: string }>;
  craftQuestions: Array<{ prompt: string; answer: string; distractors: string[]; explanation: string }>;
}

export const LITERARY_EXTRACTS: NarrativeExtract[] = [
  {
    title: "The Clockmaker's Apprentice",
    author: "Historical Fiction Selection",
    passage: `1. Rain hammered against the diamond-paned leaded window of the workshop. Barnaby wiped bronze dust from his fingers onto his leather apron. On the cedar bench sat the Astral Chronometer: three concentric rings of pierced silver that had remained immobile for forty winters.
2. Master Cole leaned over the workbench, his breath smelling faintly of peppermint and tallow. "Patience, boy," he murmured, his spectacles glinting in the candlelight. "A clock does not yield to haste. Force an escapement, and you shatter the heartbeat of forty wheels."
3. Barnaby swallowed hard. In his palm, the tiny ruby pallet-stone felt colder than ice. The Duke's courier was due at midnight, and outside, the church bells tolled eleven ominous chimes through the swirling fog.`,
    retrievalQuestions: [
      {
        prompt: "According to paragraph 1, how long had the Astral Chronometer remained immobile?",
        answer: "Forty winters",
        distractors: ["Eleven years", "Forty days", "Three centuries"],
        explanation: "Paragraph 1 explicitly specifies: 'that had remained immobile for forty winters'."
      },
      {
        prompt: "What material was Barnaby's apron made of?",
        answer: "Leather",
        distractors: ["Wool", "Canvas", "Waxed linen"],
        explanation: "Paragraph 1 explicitly states: 'onto his leather apron'."
      },
      {
        prompt: "What hour do the church bells strike at the end of the extract?",
        answer: "Eleven",
        distractors: ["Midnight", "Ten", "Twelve"],
        explanation: "Paragraph 3 explicitly states: 'the church bells tolled eleven ominous chimes'."
      }
    ],
    inferenceQuestions: [
      {
        prompt: "What does the description 'the church bells tolled eleven ominous chimes' suggest about Barnaby's situation?",
        answer: "He is running out of time and under intense pressure before the Duke's deadline",
        distractors: [
          "He wants to attend the midnight church service",
          "The bells are broken and ringing out of tune",
          "The workshop is about to catch fire"
        ],
        explanation: "The chimes signal only one hour remains until midnight, creating intense suspense."
      },
      {
        prompt: "In paragraph 2, why does Master Cole compare clockwork wheels to a 'heartbeat'?",
        answer: "To emphasise how fragile, intricate, and lifelike the synchronized mechanism is",
        distractors: [
          "To prove that clocks are living biological creatures",
          "To suggest the clock needs to be wound up with blood",
          "To show that he dislikes the Duke"
        ],
        explanation: "The metaphor stresses that forced mechanical parts will destroy the delicate living pulse of the clock."
      }
    ],
    craftQuestions: [
      {
        prompt: "Which literary technique is used in the phrase 'shatter the heartbeat of forty wheels'?",
        answer: "Metaphor",
        distractors: ["Simile", "Onomatopoeia", "Oxymoron"],
        explanation: "Equating the mechanical rhythm to a living heartbeat without using 'like' or 'as' is a metaphor."
      }
    ]
  },
  {
    title: "The Ghost of the Salt Marshes",
    author: "Atmospheric Adventure",
    passage: `1. The salt marsh stretched into twilight like a sodden grey sponge. Between the gullies of brackish mud, tall reeds hissed as the eastern wind sliced through them. Callum pulled the collar of his oilskin jacket up to his ears, squinting towards the sandspit.
2. Somewhere out in the estuary, the bell buoy groaned with every swell of the incoming tide. Locals called it the 'Drowned Sailor's Tongue'. Even in midday sunshine, fishermen avoided the eastern bank; at dusk, when the sea mist crept ashore like cold white fingers, the silence felt watchful.
3. A splash broke the quiet—sharp and close. Callum froze. Through the drifting vapor, two pale lantern lights bobbed above the water line, moving far too quickly for any rowing boat.`,
    retrievalQuestions: [
      {
        prompt: "What do the locals call the estuary bell buoy?",
        answer: "The 'Drowned Sailor's Tongue'",
        distractors: ["The Fog Bell", "The Marsh Sentinel", "The Whispering Gull"],
        explanation: "Paragraph 2 states: 'Locals called it the Drowned Sailor's Tongue'."
      },
      {
        prompt: "What colour were the lantern lights that Callum spotted?",
        answer: "Pale",
        distractors: ["Crimson", "Amber", "Emerald green"],
        explanation: "Paragraph 3 notes: 'two pale lantern lights bobbed above the water line'."
      }
    ],
    inferenceQuestions: [
      {
        prompt: "What effect is achieved by the simile 'sea mist crept ashore like cold white fingers'?",
        answer: "It creates a sinister, predatory atmosphere that threatens Callum",
        distractors: [
          "It shows that the weather is warm and pleasant",
          "It proves that people are hiding in the fog to shake hands",
          "It indicates that Callum has forgotten his gloves"
        ],
        explanation: "The imagery personifies the mist as skeletal, grasping hands, enhancing danger and dread."
      },
      {
        prompt: "Why did fishermen avoid the eastern bank even during midday?",
        answer: "The location had a superstitious and foreboding reputation associated with tragedy",
        distractors: [
          "The fish there were completely inedible",
          "It was private royal property",
          "There was no access to the sea"
        ],
        explanation: "The local avoidance stems from chilling folklore and maritime superstition."
      }
    ],
    craftQuestions: [
      {
        prompt: "What auditory language technique is present in 'tall reeds hissed as the eastern wind sliced through them'?",
        answer: "Sibilance and onomatopoeia",
        distractors: ["Assonance only", "Hyperbole", "Parchment rhyme"],
        explanation: "The repeated soft 's' sounds ('hissed', 'sliced') mimic the whispering sound of wind in dry reeds."
      }
    ]
  },
  {
    title: "Voyage of the Coral Nautilus",
    author: "Marine Science & Exploration",
    passage: `1. Deep ocean exploration has entered a revolutionary epoch with autonomous submersibles. At six thousand metres beneath the Pacific, daylight is entirely extinguished. The water pressure exceeds six hundred atmospheres—equivalent to the weight of thirty jumbo jets stacked upon a postage stamp.
2. Yet life thrives here in defiant profusion. Around hydrothermal vents spewing mineral-rich black smoke at three hundred degrees Celsius, colonies of giant tube worms sway alongside translucent crabs. These organisms do not rely upon solar photosynthesis; instead, specialized chemosynthetic bacteria convert toxic hydrogen sulphide into vital carbohydrates.
3. The abyss is therefore not a sterile desert, but a thriving cradle of adaptation that may hold biochemical answers to novel medicines and clean energy.`,
    retrievalQuestions: [
      {
        prompt: "What temperature does the mineral-rich black smoke reach at the hydrothermal vents?",
        answer: "Three hundred degrees Celsius",
        distractors: ["One hundred degrees Celsius", "Six thousand degrees Celsius", "Six hundred degrees Celsius"],
        explanation: "Paragraph 2 explicitly states: 'three hundred degrees Celsius'."
      },
      {
        prompt: "What process do deep-sea vent bacteria use to produce food instead of photosynthesis?",
        answer: "Chemosynthesis",
        distractors: ["Electrolysis", "Evaporation", "Chlorophyll absorption"],
        explanation: "Paragraph 2 states: 'specialized chemosynthetic bacteria convert toxic hydrogen sulphide into vital carbohydrates'."
      }
    ],
    inferenceQuestions: [
      {
        prompt: "Why does the author use the comparison 'weight of thirty jumbo jets stacked upon a postage stamp'?",
        answer: "To make an unimaginably immense physical pressure comprehensible to everyday readers",
        distractors: [
          "To advertise commercial aviation travel",
          "To explain how postal letters are stamped",
          "To prove that airplanes can fly underwater"
        ],
        explanation: "The vivid analogy translates extreme barometric pressure into relatable everyday objects."
      }
    ],
    craftQuestions: [
      {
        prompt: "What is the primary purpose and tone of this non-fiction text?",
        answer: "Informative and awe-inspiring, highlighting remarkable biological discoveries",
        distractors: [
          "Humorous and satirical, mocking oceanographers",
          "Angry and persuasive, condemning marine scientists",
          "A fictional fairy tale for infants"
        ],
        explanation: "The text explains scientific marvels with objective wonder and clarity."
      }
    ]
  }
];

/* =========================================================================
   3. PROCEDURAL GENERATORS BY CURRICULUM TOPIC
   ========================================================================= */

// Retrieval Generator
export function generateRetrievalQuestion(): GeneratedQuestionTemplate {
  const extract = choice(LITERARY_EXTRACTS);
  const q = choice(extract.retrievalQuestions);
  return {
    prompt: `${q.prompt}\n\n[Extract from "${extract.title}"]\n${extract.passage}`,
    answer: q.answer,
    distractors: q.distractors,
    explanation: q.explanation,
    passage: extract.passage,
    passageTitle: extract.title,
    skill: "Retrieval",
    interaction: "mc"
  };
}

// Inference Generator
export function generateInferenceQuestion(): GeneratedQuestionTemplate {
  const extract = choice(LITERARY_EXTRACTS);
  const q = choice(extract.inferenceQuestions);
  return {
    prompt: `${q.prompt}\n\n[Extract from "${extract.title}"]\n${extract.passage}`,
    answer: q.answer,
    distractors: q.distractors,
    explanation: q.explanation,
    passage: extract.passage,
    passageTitle: extract.title,
    skill: "Inference",
    interaction: "mc"
  };
}

// Vocabulary Generator
export function generateVocabularyQuestion(diff: DifficultyLevel = 'medium'): GeneratedQuestionTemplate {
  let pool = VOCAB_BANK;
  if (diff === 'hard') {
    const hardPool = VOCAB_BANK.filter(v => v.tier === 'hard' || v.word.length >= 9);
    if (hardPool.length >= 4) pool = hardPool;
  } else if (diff === 'easy') {
    const easyPool = VOCAB_BANK.filter(v => v.tier === 'easy' || (v.tier !== 'hard' && v.word.length <= 8));
    if (easyPool.length >= 4) pool = easyPool;
  }
  const item = choice(pool);
  const mode = choice(['meaning', 'synonym', 'antonym', 'context']);

  if (mode === 'meaning') {
    const others = pool.filter(v => v.word !== item.word);
    const distPool = others.length >= 3 ? others : VOCAB_BANK.filter(v => v.word !== item.word);
    const dist = shuffle(distPool).slice(0, 3).map(o => o.meaning);
    return {
      prompt: `What is the precise definition of the word "${item.word}"?`,
      answer: item.meaning,
      distractors: dist.length === 3 ? dist : item.distractors,
      explanation: `"${item.word}" means: ${item.meaning}. Example: ${item.example}`,
      skill: "Vocabulary Meaning"
    };
  } else if (mode === 'synonym') {
    const syn = choice(item.synonyms);
    const others = pool.filter(v => v.word !== item.word);
    const distPool = others.length >= 3 ? others : VOCAB_BANK.filter(v => v.word !== item.word);
    const dist = shuffle(distPool).slice(0, 3).map(o => choice(o.synonyms));
    return {
      prompt: `Which word is the closest SYNONYM for "${item.word}"?`,
      answer: syn,
      distractors: dist,
      explanation: `"${syn}" shares the closest meaning with "${item.word}" (${item.meaning}).`,
      skill: "Synonyms"
    };
  } else if (mode === 'antonym') {
    const ant = choice(item.antonyms);
    const others = pool.filter(v => v.word !== item.word);
    const distPool = others.length >= 3 ? others : VOCAB_BANK.filter(v => v.word !== item.word);
    const dist = shuffle(distPool).slice(0, 3).map(o => choice(o.antonyms));
    return {
      prompt: `Which word is an ANTONYM (opposite in meaning) for "${item.word}"?`,
      answer: ant,
      distractors: dist,
      explanation: `"${ant}" is the opposite of "${item.word}" (${item.meaning}).`,
      skill: "Antonyms"
    };
  } else {
    // Context gap fill
    const blanked = item.example.replace(new RegExp(`\\b${item.word}\\b`, 'i'), '__________');
    const others = pool.filter(v => v.word !== item.word);
    const distPool = others.length >= 3 ? others : VOCAB_BANK.filter(v => v.word !== item.word);
    const dist = shuffle(distPool).slice(0, 3).map(o => o.word);
    return {
      prompt: `Complete the sentence with the most precise word:\n"${blanked}"`,
      answer: item.word,
      distractors: dist,
      explanation: `"${item.word}" (${item.meaning}) fits the semantic context of the sentence best.`,
      skill: "Context Vocabulary"
    };
  }
}

// Comprehension Skills
export function generateComprehensionSkillQuestion(): GeneratedQuestionTemplate {
  const extract = choice(LITERARY_EXTRACTS);
  if (extract.craftQuestions.length > 0) {
    const q = choice(extract.craftQuestions);
    return {
      prompt: `${q.prompt}\n\n[Reference Text: "${extract.title}"]\n${extract.passage}`,
      answer: q.answer,
      distractors: q.distractors,
      explanation: q.explanation,
      passage: extract.passage,
      passageTitle: extract.title,
      skill: "Craft & Structure"
    };
  }
  return generateInferenceQuestion();
}

// Word Choice
export function generateWordChoiceQuestion(diff: DifficultyLevel = 'medium'): GeneratedQuestionTemplate {
  const easyChoices = [
    {
      sentence: "The museum curator inspected the _____ manuscript with white cotton gloves.",
      answer: "fragile",
      distractors: ["clumsy", "vigorous", "boisterous"],
      reason: "'Fragile' accurately describes delicate historical paper requiring gentle handling."
    },
    {
      sentence: "The puppy let out a _____ whimper when its owner left the room.",
      answer: "faint",
      distractors: ["massive", "ancient", "towering"],
      reason: "'Faint' describes a quiet, delicate sound."
    },
    {
      sentence: "The bright lanterns provided _____ light along the garden pathway.",
      answer: "ample",
      distractors: ["clumsy", "hasty", "fragile"],
      reason: "'Ample' means plentiful and sufficient."
    }
  ];

  const hardChoices = [
    {
      sentence: "The diplomat's comments were intentionally _____, giving neither faction reason to take offense.",
      answer: "equivocal",
      distractors: ["blatant", "audacious", "boisterous"],
      reason: "'Equivocal' means open to more than one interpretation, deliberately ambiguous to avoid taking a controversial stand."
    },
    {
      sentence: "The old general gave a _____ reprimand, leaving the junior officers in stunned silence.",
      answer: "scathing",
      distractors: ["lukewarm", "tentative", "placid"],
      reason: "'Scathing' expresses severely harsh and cutting criticism."
    },
    {
      sentence: "The author's prose is remarkably _____, stripping away all redundant adjectives.",
      answer: "laconic",
      distractors: ["rambling", "verbose", "florid"],
      reason: "'Laconic' characterizes style that is concise, terse, and using very few words."
    }
  ];

  const medChoices = [
    {
      sentence: "The prime minister issued a _____ denial regarding the corruption allegations.",
      answer: "vehement",
      distractors: ["drowsy", "hasty", "stagnant"],
      reason: "'Vehement' conveys impassioned, forceful rejection suitable for a serious formal denial."
    },
    {
      sentence: "Her explanation was so _____ that even the youngest pupils understood the theorem.",
      answer: "lucid",
      distractors: ["turbid", "convoluted", "abrupt"],
      reason: "'Lucid' means clear and easily intelligible."
    },
    {
      sentence: "After years of neglected maintenance, the iron suspension bridge was in a _____ state.",
      answer: "perilous",
      distractors: ["festive", "thriving", "spacious"],
      reason: "'Perilous' means dangerously hazardous and on the verge of failure."
    },
    {
      sentence: "The novel's antagonist was an _____ mastermind who evaded every detective trap.",
      answer: "elusive",
      distractors: ["accessible", "obvious", "clueless"],
      reason: "'Elusive' depicts a criminal who is exceptionally difficult to apprehend."
    },
    {
      sentence: "The ambassador spoke with great _____, ensuring both nations felt respected.",
      answer: "diplomacy",
      distractors: ["recklessness", "treachery", "arrogance"],
      reason: "'Diplomacy' denotes tact and skill in managing international relations."
    }
  ];

  const pool = diff === 'easy' ? easyChoices : diff === 'hard' ? hardChoices : medChoices;
  const item = choice(pool);
  return {
    prompt: `Choose the most appropriate and evocative word to complete the sentence:\n"${item.sentence}"`,
    answer: item.answer,
    distractors: item.distractors,
    explanation: item.reason,
    skill: "Register & Nuance"
  };
}

// Sentence Completion
export function generateSentenceCompletionQuestion(): GeneratedQuestionTemplate {
  const sentenceList = [
    {
      sentence: "Although the storm battered the coast relentlessly, the ancient stone lighthouse _____ upright.",
      answer: "remained steadfastly",
      distractors: ["collapsed instantly", "was surrendered", "disappeared quietly"],
      reason: "'Although' signals a contrast: despite severe battering, the structure stayed firm."
    },
    {
      sentence: "The expedition team packed compact rations _____ they might need emergency calories if blizzards pinned them down.",
      answer: "in case",
      distractors: ["unless", "although", "whereas"],
      reason: "'In case' provides the precautionary contingency reason for carrying emergency food."
    },
    {
      sentence: "Not only did Maya solve the riddle ahead of schedule, _____ the hidden key inside the cipher.",
      answer: "but she also discovered",
      distractors: ["and she forgot", "despite losing", "because she avoided"],
      reason: "Correlative conjunctions require 'Not only... but also...'."
    },
    {
      sentence: "The archaeological relics were so rare that security guards watched the exhibit _____ twenty-four hours a day.",
      answer: "vigilantly",
      distractors: ["casually", "rarely", "hesitantly"],
      reason: "'Vigilantly' (watchfully and alertly) fits the protection of priceless relics."
    }
  ];
  const item = choice(sentenceList);
  return {
    prompt: `Complete the sentence with the grammatically and logically correct phrase:\n"${item.sentence}"`,
    answer: item.answer,
    distractors: item.distractors,
    explanation: item.reason,
    skill: "Sentence Completion"
  };
}

// Spelling in Context
export function generateSpellingContextQuestion(diff: DifficultyLevel = 'medium'): GeneratedQuestionTemplate {
  const easySpelling = [
    {
      word: "separate",
      sentence: "Please store the chemical reagents in __________ containers.",
      correct: "separate",
      distractors: ["seperate", "separete", "seperete"],
      tip: "There is 'a rat' in sep-a-rat-e."
    },
    {
      word: "library",
      sentence: "We went to the town __________ to research Elizabethan history.",
      correct: "library",
      distractors: ["libary", "librery", "libarry"],
      tip: "Remember the middle 'r': lib-rar-y."
    },
    {
      word: "friend",
      sentence: "A loyal __________ will always offer encouragement during challenges.",
      correct: "friend",
      distractors: ["freind", "frend", "friende"],
      tip: "'i' before 'e' in friend."
    },
    {
      word: "truly",
      sentence: "I am __________ delighted by your outstanding test results.",
      correct: "truly",
      distractors: ["truely", "trully", "trueley"],
      tip: "Drop the 'e' when turning true into truly."
    }
  ];

  const hardSpelling = [
    {
      word: "idiosyncrasy",
      sentence: "Wearing mismatched neon socks was his most endearing personal __________.",
      correct: "idiosyncrasy",
      distractors: ["idiosyncracy", "ideosyncrasy", "idiosyncresy"],
      tip: "Ends in '-asy', not '-acy'."
    },
    {
      word: "supersede",
      sentence: "The new digital satellite system will soon __________ the old analogue towers.",
      correct: "supersede",
      distractors: ["supercede", "superceed", "supersead"],
      tip: "The only English word ending in '-sede' (from Latin sedere)."
    },
    {
      word: "mischievous",
      sentence: "The puppy had a __________ glint in its eye as it grabbed the slipper.",
      correct: "mischievous",
      distractors: ["mischievious", "mischivous", "mischevous"],
      tip: "Three syllables only: mis-chie-vous (no 'i' after 'v')."
    },
    {
      word: "conscientious",
      sentence: "The __________ archivist verified every historical date before publication.",
      correct: "conscientious",
      distractors: ["consciencious", "consciencous", "consientious"],
      tip: "'Con' + 'sci' + 'en' + 'ti' + 'ous'."
    },
    {
      word: "liaison",
      sentence: "She acted as the primary diplomatic __________ between the council and the public.",
      correct: "liaison",
      distractors: ["liason", "liaision", "laison"],
      tip: "Two 'i's: l-i-a-i-s-o-n."
    }
  ];

  const medSpelling = [
    {
      word: "necessary",
      sentence: "It is __________ to show all your working in the maths exam.",
      correct: "necessary",
      distractors: ["neccessary", "necesary", "necessery"],
      tip: "One Collar, Two Sleeves: one 'c', two 's's."
    },
    {
      word: "accommodation",
      sentence: "The mountaineers secured comfortable __________ in a wooden chalet.",
      correct: "accommodation",
      distractors: ["accomodation", "acommodation", "acomodation"],
      tip: "Two c's and two m's: plenty of room for both pairs."
    },
    {
      word: "definitely",
      sentence: "We are __________ visiting the natural history museum on Thursday.",
      correct: "definitely",
      distractors: ["definately", "definitly", "definetly"],
      tip: "Notice the root 'finite': de-finite-ly."
    },
    {
      word: "embarrass",
      sentence: "He did not wish to __________ his teammates after the mistake.",
      correct: "embarrass",
      distractors: ["embarass", "emabarass", "emberrass"],
      tip: "Double 'r' and double 's'."
    },
    {
      word: "privilege",
      sentence: "It was an exceptional __________ to meet the astronaut in person.",
      correct: "privilege",
      distractors: ["privelege", "priviledge", "privelige"],
      tip: "Two 'i's and two 'e's with no 'd'."
    },
    {
      word: "conscience",
      sentence: "Her clear __________ allowed her to sleep peacefully.",
      correct: "conscience",
      distractors: ["concience", "conscence", "concsience"],
      tip: "'Con' + 'science'."
    },
    {
      word: "rhythm",
      sentence: "The marching band maintained a steady, infectious __________.",
      correct: "rhythm",
      distractors: ["rythm", "rhythym", "rhytm"],
      tip: "'Rhythm helps your two hips move' (R-H-Y-T-H-M)."
    }
  ];

  const pool = diff === 'easy' ? easySpelling : diff === 'hard' ? hardSpelling : medSpelling;
  const item = choice(pool);
  return {
    prompt: `Select the correct spelling to complete the sentence:\n"${item.sentence}"`,
    answer: item.correct,
    distractors: item.distractors,
    explanation: `The correct spelling is "${item.correct}". Memory tip: ${item.tip}`,
    skill: "Spelling in Context"
  };
}

// Grammar & Clause Analysis
export function generateGrammarQuestion(diff: DifficultyLevel = 'medium'): GeneratedQuestionTemplate {
  const easyGrammar = [
    {
      prompt: "Identify the word class of the underlined word:\n'The [gleaming] sapphire caught the light.'",
      answer: "Adjective",
      distractors: ["Verb", "Preposition", "Conjunction"],
      explanation: "'Gleaming' describes the noun 'sapphire', functioning as an adjective."
    },
    {
      prompt: "Which sentence is written in the ACTIVE voice?",
      answer: "The master conservator restored the priceless sculpture.",
      distractors: [
        "The priceless sculpture was restored by the master conservator.",
        "The sculpture was admired by tourists.",
        "A speech was delivered by the director."
      ],
      explanation: "In active voice, the subject ('conservator') directly performs the action ('restored')."
    },
    {
      prompt: "Identify the conjunction in this sentence:\n'We packed an umbrella because dark storm clouds were gathering.'",
      answer: "because",
      distractors: ["packed", "dark", "gathering"],
      explanation: "'Because' is a subordinating conjunction linking the cause to the main action."
    }
  ];

  const hardGrammar = [
    {
      prompt: "Which sentence correctly employs the SUBJUNCTIVE mood for a hypothetical condition?",
      answer: "If I were the prime minister, I would allocate greater funding to libraries.",
      distractors: [
        "If I was the prime minister, I will allocate greater funding to libraries.",
        "If I am the prime minister, I would allocate greater funding to libraries.",
        "If I would be the prime minister, I will allocate greater funding to libraries."
      ],
      explanation: "The subjunctive mood uses 'were' with singular subjects (e.g. 'If I were') to express hypothetical, contrary-to-fact statements."
    },
    {
      prompt: "Identify the sentence with correct subject-verb agreement involving correlative conjunctions:",
      answer: "Neither the captain nor the sailors were prepared for the ferocious gale.",
      distractors: [
        "Neither the captain nor the sailors was prepared for the ferocious gale.",
        "Neither the sailors nor the captain were prepared for the ferocious gale.",
        "Neither the captain or the sailors are prepared for the ferocious gale."
      ],
      explanation: "With 'neither...nor', the verb agrees in number with the closest subject ('sailors' is plural, so 'were' is correct)."
    },
    {
      prompt: "Identify the sentence that suffers from a dangling participial modifier error:",
      answer: "Having finished the grueling homework, the television was finally switched on.",
      distractors: [
        "Having finished the grueling homework, Liam finally switched on the television.",
        "After Liam finished his homework, he switched on the television.",
        "The television was switched on after Liam completed his homework."
      ],
      explanation: "The introductory participial phrase 'Having finished the grueling homework' illogically modifies 'the television' instead of the person doing the work."
    }
  ];

  const medGrammar = [
    {
      prompt: "Identify the grammatical function of the underlined clause:\n'Although the rain continued to pour, [the team refused to abandon the match].'",
      answer: "Main clause (independent clause)",
      distractors: ["Subordinate clause", "Relative clause", "Adverbial phrase"],
      explanation: "'The team refused to abandon the match' can stand alone as a complete sentence, making it the main clause."
    },
    {
      prompt: "Which sentence is written in the PASSIVE voice?",
      answer: "The priceless sculpture was restored by the master conservator.",
      distractors: [
        "The master conservator restored the priceless sculpture.",
        "The sculpture gleamed under the spotlights.",
        "Tourists admired the artwork from behind a brass rail."
      ],
      explanation: "In the passive voice, the subject ('sculpture') receives the action ('was restored') from the agent ('by the master conservator')."
    },
    {
      prompt: "Which sentence contains a dangling participle error?",
      answer: "Walking through the orchard, the ripe apples smelled sweet.",
      distractors: [
        "Walking through the orchard, Priya noticed the sweet smell of apples.",
        "As we walked through the orchard, apples fell from the boughs.",
        "The apples smelled sweet as we strolled through the orchard."
      ],
      explanation: "The opening participial phrase ('Walking through the orchard') illogically modifies 'the ripe apples' instead of the person walking."
    },
    {
      prompt: "Identify the modal auxiliary verb expressing strong obligation:\n'All laboratory visitors _____ wear safety goggles at all times.'",
      answer: "must",
      distractors: ["might", "could", "would"],
      explanation: "'Must' expresses strict mandatory obligation, unlike 'might' or 'could' which denote mere possibility."
    }
  ];

  const pool = diff === 'easy' ? easyGrammar : diff === 'hard' ? hardGrammar : medGrammar;
  const item = choice(pool);
  return {
    prompt: item.prompt,
    answer: item.answer,
    distractors: item.distractors,
    explanation: item.explanation,
    skill: "Grammar & Clauses"
  };
}

// Punctuation
export function generatePunctuationQuestion(diff: DifficultyLevel = 'medium'): GeneratedQuestionTemplate {
  const easyPunct = [
    {
      prompt: "Which sentence correctly uses an APOSTROPHE for a contraction?",
      answer: "They don't know the password for the clubhouse.",
      distractors: [
        "They do'nt know the password for the clubhouse.",
        "They dont' know the password for the clubhouse.",
        "They dont know the password for the clubhouse."
      ],
      explanation: "In 'don't', the apostrophe replaces the omitted letter 'o' in 'not'."
    },
    {
      prompt: "Which sentence has correct comma usage in a list?",
      answer: "She bought apples, bananas, pears, and oranges at the market.",
      distractors: [
        "She bought, apples bananas pears, and oranges at the market.",
        "She bought apples bananas, pears and oranges at the market.",
        "She bought apples, bananas, pears, and, oranges at the market."
      ],
      explanation: "Commas separate items in an enumeration clearly."
    }
  ];

  const hardPunct = [
    {
      prompt: "Which sentence correctly uses a HYPHEN to avoid ambiguity in a compound modifier before a noun?",
      answer: "The explorer spotted thirty-odd scientists gathered in the base camp.",
      distractors: [
        "The explorer spotted thirty odd scientists gathered in the base camp.",
        "The explorer spotted thirty odd-scientists gathered in the base camp.",
        "The explorer spotted thirty-odd-scientists gathered in the base camp."
      ],
      explanation: "'Thirty-odd' (approximately thirty) requires a hyphen; without it, 'thirty odd scientists' implies thirty peculiar scientists."
    },
    {
      prompt: "Which sentence demonstrates the precise use of PARENTHESES with surrounding sentence punctuation?",
      answer: "The archaeological expedition unearthed Roman relics (including two bronze coins), which were sent for dating.",
      distractors: [
        "The archaeological expedition unearthed Roman relics, (including two bronze coins) which were sent for dating.",
        "The archaeological expedition unearthed Roman relics (including two bronze coins,) which were sent for dating.",
        "The archaeological expedition unearthed Roman relics (including two bronze coins.) Which were sent for dating."
      ],
      explanation: "Punctuation belongs outside closing parentheses when the parenthetical element is embedded within an existing clause."
    }
  ];

  const medPunct = [
    {
      prompt: "Which sentence is correctly punctuated with a SEMICOLON linking two related independent clauses?",
      answer: "The library was silent; the only sound was the turning of pages.",
      distractors: [
        "The library was silent; because the children were reading.",
        "The library was silent, the only sound was the turning of pages.",
        "The library was silent; and nobody spoke a word."
      ],
      explanation: "A semicolon correctly connects two closely related independent clauses without coordinating conjunctions. Using a comma alone creates a comma splice."
    },
    {
      prompt: "Which option correctly uses an APOSTROPHE to show possession by MULTIPLE teachers?",
      answer: "The teachers' staffroom was newly renovated over the holidays.",
      distractors: [
        "The teacher's staffroom was newly renovated over the holidays.",
        "The teachers staffroom was newly renovated over the holidays.",
        "The teacher'es staffroom was newly renovated over the holidays."
      ],
      explanation: "For regular plural nouns ending in 's', the apostrophe goes after the 's' (teachers')."
    },
    {
      prompt: "Select the sentence with accurate speech punctuation:",
      answer: '"Halt!" shouted the castle guard. "Who approaches the gate?"',
      distractors: [
        '"Halt"! shouted the castle guard "who approaches the gate?"',
        '"Halt" shouted the castle guard, "Who approaches the gate"?',
        '"Halt!" Shouted the castle guard, "who approaches the gate"?'
      ],
      explanation: "Exclamation marks and question marks go inside speech marks; dialogue tags ('shouted') begin in lowercase unless following a full stop."
    },
    {
      prompt: "When should a COLON (:) be used in formal writing?",
      answer: "To introduce a list, an explanation, or a quotation following an independent clause",
      distractors: [
        "To separate items in every single list regardless of sentence grammar",
        "At the end of every introductory subordinate clause",
        "Instead of a question mark after rhetorical queries"
      ],
      explanation: "A colon must be preceded by a grammatically complete independent clause before introducing lists or expansions."
    }
  ];

  const pool = diff === 'easy' ? easyPunct : diff === 'hard' ? hardPunct : medPunct;
  const item = choice(pool);
  return {
    prompt: item.prompt,
    answer: item.answer,
    distractors: item.distractors,
    explanation: item.explanation,
    skill: "Punctuation"
  };
}

// Parts of Speech
export function generatePartsOfSpeechQuestion(): GeneratedQuestionTemplate {
  const parts = [
    {
      prompt: "Identify the word class of the underlined word:\n'Her [determination] inspired the entire debate society.'",
      answer: "Abstract noun",
      distractors: ["Adjective", "Adverb", "Proper noun"],
      explanation: "'Determination' is an abstract noun representing a quality, feeling, or state of mind."
    },
    {
      prompt: "What part of speech is 'reluctantly' in:\n'He [reluctantly] handed over his smartphone before the exam.'?",
      answer: "Adverb of manner",
      distractors: ["Adjective", "Preposition", "Conjunction"],
      explanation: "'Reluctantly' describes how the action was performed, functioning as an adverb of manner."
    },
    {
      prompt: "Identify the PREPOSITION in the sentence below:\n'The stray kitten darted beneath the garden shed.'",
      answer: "beneath",
      distractors: ["darted", "stray", "garden"],
      explanation: "'Beneath' specifies the spatial relationship between the kitten and the shed."
    },
    {
      prompt: "In 'Which of these three route options is the [safest]?', 'safest' is a:",
      answer: "Superlative adjective",
      distractors: ["Comparative adjective", "Abstract noun", "Relative pronoun"],
      explanation: "'Safest' compares three or more items to indicate the highest degree of safety."
    }
  ];
  const item = choice(parts);
  return {
    prompt: item.prompt,
    answer: item.answer,
    distractors: item.distractors,
    explanation: item.explanation,
    skill: "Word Classes"
  };
}

// Tenses
export function generateTensesQuestion(): GeneratedQuestionTemplate {
  const tenseItems = [
    {
      prompt: "Which sentence is written in the PAST PERFECT tense?",
      answer: "The train had already departed before we reached the platform.",
      distractors: [
        "The train was departing when we reached the platform.",
        "The train has departed from platform four.",
        "The train departed five minutes ago."
      ],
      explanation: "The past perfect ('had departed') denotes an event completed prior to another past moment ('reached')."
    },
    {
      prompt: "Choose the verb form that ensures tense consistency:\n'Yesterday she opened the locked chest and _____ an ancient manuscript inside.'",
      answer: "found",
      distractors: ["finds", "will find", "has found"],
      explanation: "Since the main clause uses simple past ('opened'), the coordinated verb must maintain simple past ('found')."
    },
    {
      prompt: "Identify the grammatical tense of:\n'By next July, Aaron will have been studying Latin for three years.'",
      answer: "Future perfect continuous",
      distractors: ["Future simple", "Present perfect", "Past continuous"],
      explanation: "'Will have been studying' describes an ongoing continuous action up to a future benchmark."
    }
  ];
  const item = choice(tenseItems);
  return {
    prompt: item.prompt,
    answer: item.answer,
    distractors: item.distractors,
    explanation: item.explanation,
    skill: "Tenses"
  };
}

// Sentence Structure
export function generateSentenceStructureQuestion(): GeneratedQuestionTemplate {
  const structureItems = [
    {
      prompt: "Classify the sentence structure:\n'The thunder cracked, and rain began to pour as the hikers sprinted towards the shelter.'",
      answer: "Compound-complex sentence",
      distractors: ["Simple sentence", "Compound sentence", "Complex sentence"],
      explanation: "It contains two independent clauses ('The thunder cracked', 'rain began to pour') joined by 'and', plus a subordinate clause ('as the hikers sprinted...')."
    },
    {
      prompt: "Which of the following is a MINOR sentence (or sentence fragment)?",
      answer: "Silence at last.",
      distractors: [
        "The bell rang loudly across the courtyard.",
        "Whenever we visit the coast, we swim.",
        "He laughed because the joke was funny."
      ],
      explanation: "'Silence at last' lacks a finite verb and subject clause, functioning as an expressive minor sentence."
    }
  ];
  const item = choice(structureItems);
  return {
    prompt: item.prompt,
    answer: item.answer,
    distractors: item.distractors,
    explanation: item.explanation,
    skill: "Sentence Types"
  };
}

// Subject-Verb Agreement
export function generateSubjectVerbQuestion(): GeneratedQuestionTemplate {
  const items = [
    {
      prompt: "Choose the verb that agrees with the subject:\n'Neither the captain nor the sailors _____ willing to venture into the reef.'",
      answer: "were",
      distractors: ["was", "is", "has been"],
      explanation: "When subjects are joined by 'neither... nor', the verb agrees with the closer subject ('sailors' -> plural 'were')."
    },
    {
      prompt: "Select the correct form:\n'A swarm of bees _____ buzzing around the lavender bushes.'",
      answer: "was",
      distractors: ["were", "are", "have been"],
      explanation: "The grammatical subject is the singular collective noun 'swarm' ('was')."
    },
    {
      prompt: "Select the correct verb:\n'The news regarding the scholarship winners _____ announced at noon.'",
      answer: "was",
      distractors: ["were", "are", "have been"],
      explanation: "'News' is an uncountable noun that takes a singular verb ('was')."
    }
  ];
  const item = choice(items);
  return {
    prompt: item.prompt,
    answer: item.answer,
    distractors: item.distractors,
    explanation: item.explanation,
    skill: "Agreement"
  };
}

// Conjunctions
export function generateConjunctionsQuestion(): GeneratedQuestionTemplate {
  const items = [
    {
      prompt: "Which conjunction is a COORDINATING conjunction (from FANBOYS)?",
      answer: "yet",
      distractors: ["although", "because", "whenever"],
      explanation: "The coordinating conjunctions are For, And, Nor, But, Or, Yet, So."
    },
    {
      prompt: "Choose the conjunction of concession:\n'We climbed to the summit _____ the icy gale chilled us to the bone.'",
      answer: "although",
      distractors: ["because", "since", "so that"],
      explanation: "'Although' introduces a concessive clause that contrasts with the main achievement."
    }
  ];
  const item = choice(items);
  return {
    prompt: item.prompt,
    answer: item.answer,
    distractors: item.distractors,
    explanation: item.explanation,
    skill: "Conjunctions"
  };
}

// Figurative Language
export function generateFigurativeLanguageQuestion(): GeneratedQuestionTemplate {
  const items = [
    {
      prompt: "Identify the figurative device in:\n'The old grandfather clock stood in the hall, clearing its throat before every chime.'",
      answer: "Personification",
      distractors: ["Simile", "Metaphor", "Alliteration"],
      explanation: "Giving a human physical act ('clearing its throat') to an inanimate clock is personification."
    },
    {
      prompt: "Which sentence features an OXYMORON?",
      answer: "There was a deafening silence when the headmistress walked onto the stage.",
      distractors: [
        "The wind howled like a wounded beast.",
        "Her eyes were sparkling diamonds.",
        "He ran faster than the speed of sound."
      ],
      explanation: "An oxymoron pairs contradictory terms together: 'deafening silence'."
    },
    {
      prompt: "What figure of speech is present in:\n'I have told you a million times not to leave your shoes in the corridor!'?",
      answer: "Hyperbole",
      distractors: ["Understatement", "Euphemism", "Metaphor"],
      explanation: "Intentional extreme exaggeration for rhetorical emphasis is hyperbole."
    },
    {
      prompt: "What device is used in 'Peter Piper picked a peck of pickled peppers'?",
      answer: "Alliteration",
      distractors: ["Assonance", "Simile", "Onomatopoeia"],
      explanation: "Repetition of the initial consonant 'p' sound across adjacent words is alliteration."
    }
  ];
  const item = choice(items);
  return {
    prompt: item.prompt,
    answer: item.answer,
    distractors: item.distractors,
    explanation: item.explanation,
    skill: "Figurative Language"
  };
}

// Fiction Questions
export function generateFictionQuestion(): GeneratedQuestionTemplate {
  const items = [
    {
      prompt: "In a mystery novel, what is a 'red herring'?",
      answer: "A misleading clue deliberately inserted to divert attention from the true culprit",
      distractors: [
        "A character who dies in the first chapter",
        "A description of the coastal fishing setting",
        "The final confession of the detective"
      ],
      explanation: "Red herrings heighten suspense by challenging the reader's deductive assumptions."
    },
    {
      prompt: "What is an OMNISCIENT third-person narrator?",
      answer: "An all-knowing voice capable of revealing the secret thoughts and emotions of every character",
      distractors: [
        "A narrator who only witnesses events through the eyes of a single protagonist",
        "A narrator who participates directly in the story using 'I'",
        "A narrator who only describes the physical weather"
      ],
      explanation: "Omniscient (Latin for 'all-knowing') narrators possess unrestricted insight into all characters."
    }
  ];
  const item = choice(items);
  return {
    prompt: item.prompt,
    answer: item.answer,
    distractors: item.distractors,
    explanation: item.explanation,
    skill: "Fiction Analysis"
  };
}

// Non-Fiction Questions
export function generateNonFictionQuestion(): GeneratedQuestionTemplate {
  const items = [
    {
      prompt: "Which of the following represents an OPINION rather than an objective FACT?",
      answer: "The new eco-friendly library is the most inspiring building in the county.",
      distractors: [
        "The building was constructed using reclaimed timber and solar panels.",
        "The facility opened to the public on 14 September 2024.",
        "The total construction expenditure was £3.4 million."
      ],
      explanation: "'Most inspiring' is a subjective value judgment (opinion) that cannot be verified scientifically."
    },
    {
      prompt: "Why do journalists frequently include direct quotes from independent experts in investigative reports?",
      answer: "To lend credibility, authority, and impartiality to their investigative findings",
      distractors: [
        "To fill space on the newspaper page when short of facts",
        "To avoid having to write their own headlines",
        "To entertain readers with humorous fictional dialogue"
      ],
      explanation: "Expert testimony corroborates assertions with specialized domain authority."
    }
  ];
  const item = choice(items);
  return {
    prompt: item.prompt,
    answer: item.answer,
    distractors: item.distractors,
    explanation: item.explanation,
    skill: "Non-Fiction Analysis"
  };
}

// Rhetoric
export function generateRhetoricQuestion(): GeneratedQuestionTemplate {
  const items = [
    {
      prompt: "What rhetorical device repeats a word or phrase at the beginning of successive sentences or clauses?",
      answer: "Anaphora",
      distractors: ["Epistrophe", "Antithesis", "Chiasmus"],
      explanation: "Anaphora (e.g. Churchill's 'We shall fight on the beaches, we shall fight on the landing grounds...') creates persuasive cumulative rhythm."
    },
    {
      prompt: "Identify the rhetorical question in the speech excerpt:\n'Can any of us truly stand by while our planet's ancient forests disappear?'",
      answer: "A question designed to prompt reflection rather than expect an answer",
      distractors: [
        "A mathematical query about timber volumes",
        "An inquiry into the speaker's personal travel history",
        "A trick question with no grammatical subject"
      ],
      explanation: "Rhetorical questions steer listeners towards a self-evident moral agreement."
    }
  ];
  const item = choice(items);
  return {
    prompt: item.prompt,
    answer: item.answer,
    distractors: item.distractors,
    explanation: item.explanation,
    skill: "Rhetoric"
  };
}

// Argument
export function generateArgumentQuestion(): GeneratedQuestionTemplate {
  const items = [
    {
      prompt: "What is an 'ad hominem' logical fallacy?",
      answer: "Attacking an opponent's personal character rather than addressing their actual argument",
      distractors: [
        "Using mathematical statistics to prove a point",
        "Providing historical counterexamples",
        "Summarising an opposing viewpoint with fairness"
      ],
      explanation: "Ad hominem deflects from genuine logical discourse by smearing the person."
    },
    {
      prompt: "In persuasive argument, what role does a 'concession' play?",
      answer: "Acknowledging a valid point made by the opposing side to demonstrate balanced integrity",
      distractors: [
        "Surrendering the entire debate to the opponent",
        "Refusing to allow the other person to speak",
        "Selling refreshments to the audience"
      ],
      explanation: "Concessions strengthen an argument by proving the author has fairly weighed counter-perspectives."
    }
  ];
  const item = choice(items);
  return {
    prompt: item.prompt,
    answer: item.answer,
    distractors: item.distractors,
    explanation: item.explanation,
    skill: "Argumentation"
  };
}

// Summarising
export function generateSummarisingQuestion(): GeneratedQuestionTemplate {
  const items = [
    {
      prompt: "Which is the most concise and accurate summary of the passage:\n'The school council raised £2,400 through a sponsored walk, cake sales, and second-hand book stalls. After extensive consultations with Year 7 pupils, the funds were allocated to install covered bicycle shelters and a water bottle refill station in the courtyard.'?",
      answer: "Pupil-led fundraising successfully financed new courtyard bike shelters and a refill station.",
      distractors: [
        "The school council held cake sales because pupils were hungry.",
        "Pupils walked ten miles in bad weather to buy second-hand books.",
        "Covered bicycle shelters cost exactly £2,400 each."
      ],
      explanation: "A faithful summary condenses the dual milestones: how funds were raised and their ultimate pupil-consulted purpose."
    }
  ];
  const item = choice(items);
  return {
    prompt: item.prompt,
    answer: item.answer,
    distractors: item.distractors,
    explanation: item.explanation,
    skill: "Summarising"
  };
}

// Compare and Contrast
export function generateCompareContrastQuestion(): GeneratedQuestionTemplate {
  const items = [
    {
      prompt: "When comparing two texts discussing space travel, Text A focuses on technological triumphs while Text B warns of exorbitant costs. What is the fundamental contrast between them?",
      answer: "Text A adopts an optimistic vision of human progress, whereas Text B evaluates fiscal responsibility.",
      distractors: [
        "Both texts agree that space travel is completely impossible.",
        "Text A was written by an astronaut, while Text B is a fictional poem.",
        "Text B wants all space exploration ceased immediately without discussion."
      ],
      explanation: "The core divergence lies in contrasting perspectives: romantic technological optimism versus practical economic prudence."
    }
  ];
  const item = choice(items);
  return {
    prompt: item.prompt,
    answer: item.answer,
    distractors: item.distractors,
    explanation: item.explanation,
    skill: "Comparative Analysis"
  };
}

// Author Study
export function generateAuthorStudyQuestion(): GeneratedQuestionTemplate {
  const items = [
    {
      prompt: "Why did Victorian writers such as Charles Dickens frequently employ serialised publication (releasing one chapter per month)?",
      answer: "To cultivate cliffhanger suspense and make literature affordable to working-class readers",
      distractors: [
        "Because printing presses could only print ten pages per year",
        "To prevent readers from finishing books too quickly",
        "Because ink was strictly rationed by parliament"
      ],
      explanation: "Monthly instalments engaged broad audiences with gripping episodic storytelling."
    }
  ];
  const item = choice(items);
  return {
    prompt: item.prompt,
    answer: item.answer,
    distractors: item.distractors,
    explanation: item.explanation,
    skill: "Author Study"
  };
}

// Character Analysis
export function generateCharacterAnalysisQuestion(): GeneratedQuestionTemplate {
  const items = [
    {
      prompt: "In literary analysis, what does the mnemonic S.T.E.A.L. stand for regarding indirect characterisation?",
      answer: "Speech, Thoughts, Effect on others, Actions, Looks",
      distractors: [
        "Setting, Theme, Exposition, Atmosphere, Language",
        "Simile, Tone, Emphasis, Alliteration, Lyric",
        "Syntax, Tension, Ending, Audience, Length"
      ],
      explanation: "STEAL outlines the five primary avenues through which authors reveal personality without blunt exposition."
    }
  ];
  const item = choice(items);
  return {
    prompt: item.prompt,
    answer: item.answer,
    distractors: item.distractors,
    explanation: item.explanation,
    skill: "Characterisation"
  };
}

// Plot Structure
export function generatePlotStructureQuestion(): GeneratedQuestionTemplate {
  const items = [
    {
      prompt: "In Freytag's classic narrative pyramid, what occurs during the 'inciting incident'?",
      answer: "An event disrupts the initial status quo and sets the main conflict into motion",
      distractors: [
        "All characters are introduced and live happily in peace",
        "The highest peak of emotional tension is resolved",
        "The final moral lesson is explained by the narrator"
      ],
      explanation: "The inciting incident triggers the protagonist's journey and breaks equilibrium."
    }
  ];
  const item = choice(items);
  return {
    prompt: item.prompt,
    answer: item.answer,
    distractors: item.distractors,
    explanation: item.explanation,
    skill: "Plot Structure"
  };
}

// Setting
export function generateSettingQuestion(): GeneratedQuestionTemplate {
  const items = [
    {
      prompt: "What literary technique is demonstrated when stormy, violent weather mirrors a character's internal turmoil?",
      answer: "Pathetic fallacy",
      distractors: ["Onomatopoeia", "Synecdoche", "Irony"],
      explanation: "Pathetic fallacy attributes human emotions and psychological moods specifically to nature and inanimate surroundings."
    }
  ];
  const item = choice(items);
  return {
    prompt: item.prompt,
    answer: item.answer,
    distractors: item.distractors,
    explanation: item.explanation,
    skill: "Setting & Atmosphere"
  };
}

// Theme
export function generateThemeQuestion(): GeneratedQuestionTemplate {
  const items = [
    {
      prompt: "Which of the following phrases expresses a THEME rather than merely a subject topic?",
      answer: "True courage involves standing up for others despite personal fear and societal isolation.",
      distractors: [
        "Bravery",
        "World War Two trenches",
        "Chapter seven of the novel"
      ],
      explanation: "A theme must express a complete philosophical belief or message about the human condition."
    }
  ];
  const item = choice(items);
  return {
    prompt: item.prompt,
    answer: item.answer,
    distractors: item.distractors,
    explanation: item.explanation,
    skill: "Themes"
  };
}

/* =========================================================================
   MASTER DISPATCH TABLE FOR ENGLISH
   ========================================================================= */
export const ENGLISH_GENERATORS: Record<string, (diff?: DifficultyLevel) => GeneratedQuestionTemplate> = {
  retrieval: () => generateRetrievalQuestion(),
  inference: () => generateInferenceQuestion(),
  vocabulary: (diff) => generateVocabularyQuestion(diff),
  "comprehension-skills": () => generateComprehensionSkillQuestion(),
  "word-choice": (diff) => generateWordChoiceQuestion(diff),
  "sentence-completion": () => generateSentenceCompletionQuestion(),
  "spelling-context": (diff) => generateSpellingContextQuestion(diff),
  grammar: (diff) => generateGrammarQuestion(diff),
  punctuation: (diff) => generatePunctuationQuestion(diff),
  "parts-speech": () => generatePartsOfSpeechQuestion(),
  tenses: () => generateTensesQuestion(),
  "sentence-structure": () => generateSentenceStructureQuestion(),
  "subject-verb": () => generateSubjectVerbQuestion(),
  conjunctions: () => generateConjunctionsQuestion(),
  "figurative-language": () => generateFigurativeLanguageQuestion(),
  "fiction-questions": () => generateFictionQuestion(),
  "nonfiction-questions": () => generateNonFictionQuestion(),
  rhetoric: () => generateRhetoricQuestion(),
  argument: () => generateArgumentQuestion(),
  summarising: () => generateSummarisingQuestion(),
  "compare-contrast": () => generateCompareContrastQuestion(),
  "author-study": () => generateAuthorStudyQuestion(),
  "character-analysis": () => generateCharacterAnalysisQuestion(),
  "plot-structure": () => generatePlotStructureQuestion(),
  setting: () => generateSettingQuestion(),
  theme: () => generateThemeQuestion()
};
