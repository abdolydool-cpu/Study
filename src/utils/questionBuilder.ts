import { Topic, Question, FlashcardItem, MatchPair, DifficultyLevel } from '../types';
import { COMPREHENSION_BANK } from '../data/comprehensionBank';
import { MATH_GENERATORS } from './mathGenerators';
import { ENGLISH_GENERATORS } from './englishGenerators';

export function normalizeStr(str: string | null | undefined): string {
  return String(str ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function makeOptions(answer: string, distractors: string[]): string[] {
  const set = new Set<string>();
  set.add(answer);
  for (const d of distractors) {
    if (d && normalizeStr(d) !== normalizeStr(answer)) {
      set.add(d);
    }
    if (set.size >= 4) break;
  }

  // Ensure multiple choice questions always present 4 distinct options
  if (set.size < 4) {
    const rawNumber = parseFloat(answer.replace(/[^0-9.-]/g, ''));
    if (!isNaN(rawNumber)) {
      const offsets = [1, 2, -1, -2, 5, 10];
      for (const off of offsets) {
        const alt = answer.replace(rawNumber.toString(), (rawNumber + off).toString());
        if (!set.has(alt)) set.add(alt);
        if (set.size >= 4) break;
      }
    }
  }

  const result = Array.from(set);
  return shuffleArray(result);
}

const ENGLISH_QUESTION_BANK: Record<string, Array<{
  prompt: string;
  answer: string;
  distractors: string[];
  explanation: string;
  passage?: string;
  passageTitle?: string;
  interaction?: 'mc' | 'type';
  skill?: string;
  accepted?: string[];
}>> = {
  retrieval: [
    {
      prompt: "According to the extract below, where was Mara waiting?",
      answer: "Beside the locked observatory",
      distractors: ["Inside the observatory classroom", "Under a wooden bridge", "At a busy railway platform"],
      explanation: "Paragraph 1 explicitly states: 'Mara waited beside the locked observatory'.",
      passageTitle: "The Copper Dome",
      passage: "1. Mara waited beside the locked observatory, listening to rain tick against the copper dome. The key in her palm felt warmer than it should, as though it had been holding its own secret for years."
    },
    {
      prompt: "In retrieval questions, what is the absolute golden rule?",
      answer: "Locate explicit evidence directly stated in the text",
      distractors: ["Guess what might happen next", "State personal opinions about the topic", "Identify the writer's childhood history"],
      explanation: "Retrieval tests your ability to find facts directly written on the page without speculating."
    }
  ],
  inference: [
    {
      prompt: "What does the description 'The key in her palm felt warmer than it should' imply?",
      answer: "The key holds an unusual, mysterious or supernatural significance",
      distractors: ["The key was made of cheap plastic", "Mara had left the key in an oven", "The weather was extraordinarily sunny"],
      explanation: "An unnatural warmth hints that the object possesses secrets or magical power.",
      passageTitle: "The Copper Dome",
      passage: "1. Mara waited beside the locked observatory, listening to rain tick against the copper dome. The key in her palm felt warmer than it should, as though it had been holding its own secret for years."
    },
    {
      prompt: "In 'Her fingers trembled as she unsealed the letter', what can the reader infer about her emotions?",
      answer: "She is anxious and apprehensive",
      distractors: ["She is extremely bored", "She is furious with her parents", "She has forgotten how to read"],
      explanation: "Trembling hands are a physical involuntary manifestation of nervous tension."
    }
  ],
  vocabulary: [
    {
      prompt: "In the passage below, what does the word 'tick' describe?",
      answer: "Light, rhythmic tapping sounds of raindrops",
      distractors: ["A ticking mechanical wall clock", "A sudden loud thunderclap", "A poisonous insect"],
      explanation: "Rain 'ticking' against metal evokes repetitive, gentle tapping impacts.",
      passageTitle: "The Copper Dome",
      passage: "1. Mara waited beside the locked observatory, listening to rain tick against the copper dome. The key in her palm felt warmer than it should, as though it had been holding its own secret for years."
    },
    {
      prompt: "Which word is the closest synonym for 'meticulous'?",
      answer: "Careful and thorough",
      distractors: ["Hasty and hurried", "Loud and disruptive", "Ancient and brittle"],
      explanation: "Meticulous denotes showing great attention to detail with thorough precision."
    }
  ],
  "comprehension-skills": [
    {
      prompt: "What is the primary objective of a dual-evidence comprehension question in GL assessments?",
      answer: "Providing both a clear analytical point and direct textual proof",
      distractors: [
        "Retelling the entire plot from the beginning",
        "Defining every difficult word in the paragraph",
        "Stating personal opinions about the characters"
      ],
      explanation: "High-scoring comprehension responses must pair an analytical inference with direct textual quotation or paraphrase.",
      passageTitle: "The River Station",
      passage: "The old signal box stood dark against the dawn sky. Inside, the brass levers gleamed under the oil lantern, cold to the touch but ready."
    },
    {
      prompt: "Based on 'brass levers gleamed under the oil lantern, cold to the touch but ready', what impression is created?",
      answer: "The equipment is well-maintained and prepared despite the isolation",
      distractors: [
        "The signal box has been completely abandoned for decades",
        "The station is currently engulfed in an accidental fire",
        "The levers are broken beyond repair"
      ],
      explanation: "Gleaming and ready brass denotes diligent upkeep and operational readiness."
    }
  ],
  "word-choice": [
    {
      prompt: "Choose the most appropriate word: 'The archaeological team discovered an _____ collection of ancient coins.'",
      answer: "extraordinary",
      distractors: ["awkwardly", "excessive", "extreme"],
      explanation: "'Extraordinary' correctly functions as an adjective describing the remarkable nature of the collection."
    },
    {
      prompt: "Choose the word with the most formal register: 'The council decided to _____ the new library proposal.'",
      answer: "endorse",
      distractors: ["back up", "hype up", "thumb up"],
      explanation: "'Endorse' conveys authoritative, formal approval suitable for official prose."
    }
  ],
  "sentence-completion": [
    {
      prompt: "Complete the sentence logically: 'Although the wind was howling relentlessly, _____.'",
      answer: "the hikers pressed onward toward the summit",
      distractors: ["because they felt very frightened", "so the storm stopped instantly", "and the mountain path was clear"],
      explanation: "'Although' establishes a contrast; continuing despite the howl maintains cohesion."
    }
  ],
  "spelling-context": [
    {
      prompt: "Which sentence demonstrates the correct spelling of 'accommodate'?",
      answer: "The hotel was large enough to accommodate all fifty guests.",
      distractors: [
        "The hotel was large enough to acommodate all fifty guests.",
        "The hotel was large enough to accommadate all fifty guests.",
        "The hotel was large enough to acomodate all fifty guests."
      ],
      explanation: "'Accommodate' is spelled with double 'c' and double 'm'."
    },
    {
      prompt: "Which sentence correctly uses 'necessary'?",
      answer: "It is necessary to wear safety goggles during chemistry experiments.",
      distractors: [
        "It is necesary to wear safety goggles during chemistry experiments.",
        "It is neccessary to wear safety goggles during chemistry experiments.",
        "It is neccesary to wear safety goggles during chemistry experiments."
      ],
      explanation: "'Necessary' has one 'c' and double 's' (one Collar, two Socks)."
    }
  ],
  grammar: [
    {
      prompt: "Which sentence is grammatically correct?",
      answer: "Neither of the boys has submitted his assignment.",
      distractors: [
        "Neither of the boys have submitted their assignment.",
        "Neither of the boys were submitting their assignment.",
        "Neither boys has submitted his assignment."
      ],
      explanation: "'Neither' is a singular indefinite pronoun and takes the singular verb 'has'."
    }
  ],
  punctuation: [
    {
      prompt: "Which sentence uses apostrophes correctly to show possession?",
      answer: "The children's coats were hung in the teachers' staffroom.",
      distractors: [
        "The childrens' coats were hung in the teacher's staffroom.",
        "The childrens coats were hung in the teachers staffroom.",
        "The children's coats were hung in the teachers's staffroom."
      ],
      explanation: "'Children' is an irregular plural, so 'children's'. 'Teachers' is a plural ending in s, so 'teachers''."
    },
    {
      prompt: "Where should the semicolon be placed?",
      answer: "The rain poured down; nevertheless, the match continued.",
      distractors: [
        "The rain; poured down nevertheless, the match continued.",
        "The rain poured down nevertheless; the match continued.",
        "The rain poured; down nevertheless the match continued."
      ],
      explanation: "A semicolon separates independent clauses linked by a conjunctive adverb ('nevertheless')."
    }
  ],
  "parts-speech": [
    {
      prompt: "What part of speech is 'cautiously' in the sentence: 'He cautiously approached the ancient doorway'?",
      answer: "Adverb",
      distractors: ["Adjective", "Preposition", "Conjunction"],
      explanation: "'Cautiously' modifies the verb 'approached', describing how the action was performed."
    },
    {
      prompt: "What part of speech is 'beneath' in: 'The brass key lay beneath the oak roots'?",
      answer: "Preposition",
      distractors: ["Pronoun", "Adverb", "Conjunction"],
      explanation: "'Beneath' indicates spatial relationship, functioning as a preposition."
    }
  ],
  tenses: [
    {
      prompt: "Identify the sentence written in the past progressive (continuous) tense:",
      answer: "The owls were calling to one another across the forest.",
      distractors: [
        "The owls called to one another across the forest.",
        "The owls had called to one another across the forest.",
        "The owls will be calling to one another across the forest."
      ],
      explanation: "Past progressive uses 'was/were' + verb-ing (e.g. 'were calling')."
    }
  ],
  "sentence-structure": [
    {
      prompt: "What type of sentence is: 'Because the river had burst its banks, the bridge was closed to traffic.'?",
      answer: "Complex sentence",
      distractors: ["Compound sentence", "Simple sentence", "Minor sentence"],
      explanation: "It contains one subordinate clause ('Because the river...') and one main clause ('the bridge was closed...')."
    }
  ],
  "subject-verb": [
    {
      prompt: "Choose the correct verb: 'A bouquet of yellow roses _____ placed upon the table.'",
      answer: "was",
      distractors: ["were", "are", "have been"],
      explanation: "The head subject noun is 'bouquet' (singular), which takes 'was'."
    }
  ],
  conjunctions: [
    {
      prompt: "Which conjunction best expresses cause and reason: 'We took our waterproof coats _____ heavy rain was forecast.'?",
      answer: "because",
      distractors: ["although", "unless", "whereas"],
      explanation: "'Because' explains the motivating cause for taking waterproofs."
    }
  ],
  "figurative-language": [
    {
      prompt: "Which technique is used in: 'The angry sea pounded relentlessly against the helpless cliffs'?",
      answer: "Personification",
      distractors: ["Simile", "Onomatopoeia", "Oxymoron"],
      explanation: "Assigning human emotions ('angry', 'helpless') to natural elements is personification."
    },
    {
      prompt: "What literary device is present in: 'Her laughter was music to his weary ears'?",
      answer: "Metaphor",
      distractors: ["Simile", "Hyperbole", "Alliteration"],
      explanation: "It equates laughter directly to music without using 'like' or 'as'."
    }
  ],
  "fiction-questions": [
    {
      prompt: "In narrative fiction, what role does dramatic tension serve?",
      answer: "Engaging the reader through anticipation of looming conflict or revelation",
      distractors: [
        "Explaining technical non-fiction facts",
        "Ensuring every sentence rhymes",
        "Removing dialogue from characters"
      ],
      explanation: "Dramatic tension builds suspense and emotional investment in the story's outcome."
    },
    {
      prompt: "When an author shifts narrative perspective from third person to first person, what is the usual effect?",
      answer: "A heightened sense of immediacy and direct psychological intimacy",
      distractors: [
        "The story becomes strictly non-fiction",
        "The timeline immediately rewinds into the past",
        "Punctuation rules are suspended"
      ],
      explanation: "First-person narration ('I') puts the reader directly inside the character's sensory and emotional experience."
    }
  ],
  "nonfiction-questions": [
    {
      prompt: "In non-fiction texts, how can a reader best identify the author's underlying bias?",
      answer: "By analysing selective inclusion of facts and charged, emotive vocabulary",
      distractors: [
        "By checking how many paragraphs the article contains",
        "By reading only the author's biography",
        "By assuming all printed articles are perfectly neutral"
      ],
      explanation: "Tone, emotive word choice, and selective presentation of evidence reveal the writer's underlying stance."
    },
    {
      prompt: "What is the primary function of a caption beneath an infographic in non-fiction articles?",
      answer: "To clarify the statistical context and key takeaway for the reader",
      distractors: [
        "To hide inaccurate data from the audience",
        "To introduce fictional characters",
        "To provide a decorative border"
      ],
      explanation: "Captions ground visual data by explaining its significance and methodological scope."
    }
  ],
  rhetoric: [
    {
      prompt: "Identify the rhetorical device in: 'We will fight for justice, we will stand for freedom, and we will protect our future.'",
      answer: "Tricolon (rule of three)",
      distractors: ["Rhetorical question", "Understatement", "Metonymy"],
      explanation: "A tricolon presents three parallel phrases for cumulative persuasive impact."
    }
  ],
  argument: [
    {
      prompt: "What is a counterargument in persuasive writing?",
      answer: "An opposing viewpoint that the writer acknowledges and refutes",
      distractors: [
        "The introductory thesis sentence",
        "A fabricated statistic to confuse readers",
        "The concluding sentence of the essay"
      ],
      explanation: "Counterarguments address potential objections to demonstrate balanced, rigorous thinking."
    }
  ],
  summarising: [
    {
      prompt: "Which of the following represents the most effective summary strategy?",
      answer: "Condensing main arguments while discarding repetitive minor examples",
      distractors: [
        "Copying out the longest paragraph word for word",
        "Writing down only the dialogue quotations",
        "Focusing exclusively on the opening sentence"
      ],
      explanation: "Summaries must be concise, objective, and capture central thesis points."
    }
  ],
  "compare-contrast": [
    {
      prompt: "Which linking phrase explicitly indicates contrast between two viewpoints?",
      answer: "In stark contrast",
      distractors: ["Furthermore", "Similarly", "In addition"],
      explanation: "'In stark contrast' alerts the reader that an opposing difference is being introduced."
    }
  ],
  "author-study": [
    {
      prompt: "Why might an author choose a first-person narrator ('I') in an adventure novel?",
      answer: "To create an intimate, immediate emotional connection with the protagonist",
      distractors: [
        "To confuse readers about who is speaking",
        "To describe the thoughts of every character at once",
        "Because it requires less punctuation"
      ],
      explanation: "First-person perspective immerses readers directly in the character's internal sensory world."
    }
  ],
  "character-analysis": [
    {
      prompt: "Which detail provides the strongest indirect characterisation that a character is observant?",
      answer: "He immediately noticed the faint scrape marks around the lock.",
      distractors: [
        "He had dark brown hair and wore a grey coat.",
        "He stated loudly that he was a detective.",
        "He walked quickly toward the town square."
      ],
      explanation: "Noticing subtle physical clues shows high visual attentiveness through deeds rather than labels."
    }
  ],
  "plot-structure": [
    {
      prompt: "What is the function of the climax in narrative plot structure?",
      answer: "The decisive turning point of maximum tension and conflict",
      distractors: [
        "The initial introduction of setting and character",
        "The final wrapping up of loose ends",
        "The background history before the story begins"
      ],
      explanation: "The climax is the peak dramatic crisis where the main conflict must be resolved."
    }
  ],
  setting: [
    {
      prompt: "Which descriptive sentence establishes a Gothic, ominous atmosphere through setting?",
      answer: "Gargoyles grinned through the drifting fog as the iron gates groaned shut.",
      distractors: [
        "Sunlight warmed the yellow wildflowers across the open meadow.",
        "Shoppers bustled between cheerful stalls in the crowded high street.",
        "The modern office hummed with quiet computer monitors."
      ],
      explanation: "Fog, gargoyles and groaning iron gates collectively evoke Gothic menace."
    }
  ],
  theme: [
    {
      prompt: "Which statement expresses a literary theme rather than just a topic?",
      answer: "Unchecked ambition often leads to personal isolation and downfall.",
      distractors: ["Ambition", "Chapter four", "The Scottish Highlands"],
      explanation: "A theme is a complete statement or philosophical message, not just a single keyword."
    }
  ]
};

export function buildQuestionForTopic(topic: Topic, index: number, difficulty: DifficultyLevel = 'medium'): Question {
  if (topic.subject === 'maths') {
    const generator = MATH_GENERATORS[topic.id] || MATH_GENERATORS['multiples-factors'];
    const generated = generator(difficulty);
    const options = makeOptions(generated.answer, generated.distractors);
    return {
      id: `${topic.id}-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      topicId: topic.id,
      subject: 'maths',
      unit: topic.unit,
      topic: topic.title,
      prompt: generated.prompt,
      answer: generated.answer,
      accepted: generated.accepted || [generated.answer],
      options,
      explanation: generated.explanation,
      interaction: generated.interaction || 'mc',
      skill: generated.skill || topic.unit,
      marks: 1,
      difficulty
    };
  }

  // English topics
  const engGenerator = ENGLISH_GENERATORS[topic.id];
  const template = engGenerator 
    ? engGenerator(difficulty) 
    : (ENGLISH_QUESTION_BANK[topic.id] || ENGLISH_QUESTION_BANK['retrieval'])[index % (ENGLISH_QUESTION_BANK[topic.id] || ENGLISH_QUESTION_BANK['retrieval']).length];
    
  const options = makeOptions(template.answer, template.distractors);

  return {
    id: `${topic.id}-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    topicId: topic.id,
    subject: 'english',
    unit: topic.unit,
    topic: topic.title,
    prompt: template.prompt,
    answer: template.answer,
    accepted: template.accepted || [template.answer],
    options,
    explanation: template.explanation,
    passage: template.passage,
    passageTitle: template.passageTitle,
    interaction: template.interaction || 'mc',
    skill: template.skill || topic.unit,
    marks: 1,
    difficulty
  };
}

export function generateQuestionPool(topics: Topic[], count: number, difficulty: DifficultyLevel = 'medium'): Question[] {
  if (!topics.length) return [];
  const result: Question[] = [];
  let topicIdx = 0;

  while (result.length < count) {
    const t = topics[topicIdx % topics.length];
    result.push(buildQuestionForTopic(t, result.length, difficulty));
    topicIdx++;
  }

  return shuffleArray(result);
}

export function buildFlashcards(topics: Topic[]): FlashcardItem[] {
  const cards: FlashcardItem[] = [];
  topics.forEach(t => {
    cards.push({
      topicId: t.id,
      subject: t.subject,
      unit: t.unit,
      topic: t.title,
      front: t.title,
      back: t.description,
      explanation: `Unit: ${t.unit}`
    });
    t.terms.forEach(term => {
      cards.push({
        topicId: t.id,
        subject: t.subject,
        unit: t.unit,
        topic: t.title,
        front: term,
        back: `Key term in ${t.title}: relates to ${t.description}`,
        explanation: `${t.title} (${t.unit})`
      });
    });
  });
  return shuffleArray(cards);
}

export function buildMatchPairs(topics: Topic[]): MatchPair[] {
  const pairs: MatchPair[] = [];
  topics.forEach(t => {
    pairs.push({
      topicId: t.id,
      subject: t.subject,
      unit: t.unit,
      topic: t.title,
      left: t.title,
      right: t.description
    });
  });
  return shuffleArray(pairs).slice(0, 6);
}

export function getRandomComprehensionPassage(): typeof COMPREHENSION_BANK[0] {
  return COMPREHENSION_BANK[Math.floor(Math.random() * COMPREHENSION_BANK.length)];
}
