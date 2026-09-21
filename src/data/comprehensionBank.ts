import { ComprehensionPassage } from '../types';

export const COMPREHENSION_BANK: ComprehensionPassage[] = [
  {
    id: "choice-machine",
    title: "The Choice Machine",
    topicId: "nonfiction-questions",
    unit: "Reading",
    passage: `1. When the school canteen installed a new digital lunch screen, everyone expected queues to move faster. Instead, pupils stood frozen in front of it. There were six pasta sauces, four wraps, seven drinks and a button marked "surprise me". The screen was meant to help, but it made even simple choices feel strangely heavy.

2. By Friday, the head cook, Mrs Patel, noticed that the shortest queue was now the one for soup. "Soup has only two options," she said. "That might be the secret." A Year 7 pupil called Imran agreed. He liked having choice, but not when every choice seemed to hide a better one. "If I pick the mango drink," he said, "I keep wondering if the lemon one would have been nicer."

3. The school council suggested a trial: fewer choices on Monday, more on Tuesday. On Monday, the queue moved quickly and pupils had time to sit with friends. On Tuesday, the queue twisted past the library door. The experiment did not prove that choice was bad. It showed that too much choice can steal time from the thing people actually wanted: lunch.`,
    questions: [
      { prompt: "Which canteen option had only two choices?", answer: "soup", options: ["soup", "wraps", "pasta sauces", "drinks"], explanation: "Paragraph 2 states that soup had only two options.", interaction: "mc", skill: "Retrieval" },
      { prompt: "What does the phrase 'stood frozen' suggest about the pupils?", answer: "They found it difficult to decide.", options: ["They were cold.", "They found it difficult to decide.", "They were not allowed to move.", "They disliked lunch."], explanation: "The phrase indicates they stopped in hesitation because of excessive options.", interaction: "mc", skill: "Inference" },
      { prompt: "Give one word from paragraph 1 that shows the choices felt serious or difficult.", answer: "heavy", options: ["heavy", "digital", "faster", "button"], explanation: "The word 'heavy' conveys the psychological weight of too many decisions.", interaction: "mc", skill: "Vocabulary", typeAnswer: "heavy" },
      { prompt: "Why is Imran's comment included?", answer: "To show how too much choice can make people doubt their decisions.", options: ["To show that mango is unpopular.", "To show how too much choice can make people doubt their decisions.", "To explain how drinks are made.", "To prove pupils dislike the canteen."], explanation: "His personal reaction illustrates decision paralysis and subsequent regret.", interaction: "mc", skill: "Purpose" },
      { prompt: "Which statement best summarises the whole passage?", answer: "Choice can be useful, but too much choice can slow people down.", options: ["Choice is always bad.", "Soup should be served every day.", "Choice can be useful, but too much choice can slow people down.", "Digital screens never work in schools."], explanation: "Paragraph 3 concludes with this nuanced finding.", interaction: "mc", skill: "Summary" },
      { prompt: "How is paragraph 3 organised?", answer: "It compares two trial days and then gives a conclusion.", options: ["It lists every food in the canteen.", "It compares two trial days and then gives a conclusion.", "It tells the story backwards.", "It only gives Imran's opinion."], explanation: "Monday vs Tuesday comparison leads directly to the core lesson.", interaction: "mc", skill: "Structure" },
      { prompt: "Which day had fewer choices in the trial?", answer: "Monday", options: ["Monday", "Tuesday", "Friday", "The passage does not say"], explanation: "Paragraph 3 explicitly mentions 'fewer choices on Monday'.", interaction: "mc", skill: "Retrieval" },
      { prompt: "What does 'steal time' mean in the final sentence?", answer: "Too many choices waste time that pupils wanted for lunch.", options: ["The screen literally takes clocks.", "Too many choices waste time that pupils wanted for lunch.", "Pupils are stealing food.", "Lunch starts earlier than usual."], explanation: "It means time spent deliberating is deducted from relaxing and eating.", interaction: "mc", skill: "Vocabulary" }
    ]
  },
  {
    id: "bright-basket",
    title: "Bright Basket",
    topicId: "rhetoric",
    unit: "Non-Fiction",
    passage: `1. Bright Basket is a student project that helps families in the city buy fresh fruit and vegetables from nearby farms. Every Friday, volunteers pack low-cost baskets and deliver them to community centres before sunset.

2. Why does it matter? Because a healthy meal should not depend on how close someone lives to an expensive shop. Because local farms should not throw away good food just because it is slightly too small, too curved or too colourful for supermarket shelves. Because small choices can become powerful when a whole community makes them together.

3. You can help this week. Bring one clean reusable bag to reception. Ask your tutor group to sponsor a basket. Tell one neighbour about the Friday collection point. A bag, a coin, a conversation: each one can carry more than you think.`,
    questions: [
      { prompt: "When are the baskets delivered?", answer: "before sunset on Friday", options: ["before sunset on Friday", "on Monday morning", "after assembly", "during the holidays"], explanation: "Paragraph 1 specifies Friday before sunset.", interaction: "mc", skill: "Retrieval" },
      { prompt: "Which repeated word starts three sentences in paragraph 2?", answer: "Because", options: ["Because", "Bright", "Friday", "Basket"], explanation: "Paragraph 2 uses anaphora by repeating 'Because'.", interaction: "mc", skill: "Language", typeAnswer: "Because" },
      { prompt: "What is the effect of repeating 'Because' in paragraph 2?", answer: "It makes the reasons feel urgent and connected.", options: ["It makes the reasons feel urgent and connected.", "It makes the writing sound uncertain.", "It hides the main idea.", "It shows the writer has run out of ideas."], explanation: "Repetition creates a rhythmic, persuasive build-up.", interaction: "mc", skill: "Rhetoric" },
      { prompt: "Which audience is this leaflet mainly aimed at?", answer: "students and school communities", options: ["professional chefs", "students and school communities", "tourists", "farm animals"], explanation: "References to tutor groups and reception point to a school community.", interaction: "mc", skill: "Audience" },
      { prompt: "Which option explains the final sentence best?", answer: "Small actions can have a bigger helpful effect.", options: ["Reusable bags are heavy.", "Small actions can have a bigger helpful effect.", "Coins are difficult to carry.", "Conversations should be avoided."], explanation: "'Each one can carry more than you think' symbolizes amplified impact.", interaction: "mc", skill: "Inference" },
      { prompt: "What is the main purpose of the passage?", answer: "To persuade readers to support Bright Basket.", options: ["To describe a holiday.", "To persuade readers to support Bright Basket.", "To tell a mystery story.", "To explain how supermarkets are built."], explanation: "It employs persuasive techniques to recruit community action.", interaction: "mc", skill: "Purpose" },
      { prompt: "Which action is the reader directly asked to do?", answer: "Bring one clean reusable bag to reception.", options: ["Bring one clean reusable bag to reception.", "Open a new farm.", "Build a supermarket shelf.", "Stop eating fruit."], explanation: "Paragraph 3 explicitly asks for a clean reusable bag.", interaction: "mc", skill: "Retrieval" },
      { prompt: "What technique is used in 'A bag, a coin, a conversation'?", answer: "A list of three", options: ["A list of three", "Simile", "Onomatopoeia", "Direct speech"], explanation: "The rule of three (tricolon) creates a memorable punchy cadence.", interaction: "mc", skill: "Language" }
    ]
  },
  {
    id: "last-seat",
    title: "The Last Seat",
    topicId: "fiction-questions",
    unit: "Literature",
    passage: `1. Nia reached the auditorium just as the lights dipped. One seat remained in the front row, directly under the stage, where every whisper seemed loud enough to become part of the performance. She hovered beside it, clutching her programme until the paper softened in her hand.

2. Her brother waved from the back, grinning as if this was a joke they would laugh about later. Nia did not wave back. The pianist lifted his hands. The room settled. If she walked away now, she would spend the evening imagining the empty seat waiting for someone braver.

3. So she sat. At first the music rushed past her like cold water. Then a quiet pattern returned again and again, and Nia found herself breathing with it. By the final note, the front row no longer felt like a spotlight. It felt like a place she had chosen.`,
    questions: [
      { prompt: "What is Nia holding in paragraph 1?", answer: "her programme", options: ["her programme", "a ticket", "a phone", "a piano book"], explanation: "Paragraph 1 mentions her clutching her programme.", interaction: "mc", skill: "Retrieval" },
      { prompt: "What does 'the paper softened in her hand' suggest?", answer: "She is nervous and gripping it tightly.", options: ["She is bored.", "She is nervous and gripping it tightly.", "The programme is wet from rain.", "The paper is old."], explanation: "Sweaty palms and tight gripping show intense anxiety.", interaction: "mc", skill: "Inference" },
      { prompt: "Give one quotation that shows the front row feels frightening to Nia.", answer: "every whisper seemed loud enough", options: ["every whisper seemed loud enough", "Her brother waved", "The pianist lifted his hands", "the final note"], explanation: "It highlights her fear of being exposed and audible.", interaction: "mc", skill: "Evidence", typeAnswer: "every whisper seemed loud enough" },
      { prompt: "Which image is used to describe the music at first?", answer: "cold water", options: ["cold water", "a spotlight", "soft paper", "an empty seat"], explanation: "The simile says the music 'rushed past her like cold water'.", interaction: "mc", skill: "Language" },
      { prompt: "How does Nia change by the end?", answer: "She becomes calmer and more confident about her choice.", options: ["She decides to leave.", "She becomes calmer and more confident about her choice.", "She becomes angry with her brother.", "She stops listening to the music."], explanation: "She transitions from feeling scrutinized to feeling calm agency.", interaction: "mc", skill: "Character" },
      { prompt: "Which statement best explains the structure of the passage?", answer: "It moves from hesitation, to decision, to confidence.", options: ["It moves from hesitation, to decision, to confidence.", "It starts with the ending.", "It lists facts about a pianist.", "It gives only dialogue."], explanation: "The emotional arc follows Nia conquering self-doubt step by step.", interaction: "mc", skill: "Structure" },
      { prompt: "Why does Nia not wave back to her brother?", answer: "She is too tense and focused on the seat.", options: ["She cannot see him.", "She is too tense and focused on the seat.", "She is angry about the music.", "She has already left."], explanation: "Her internal tension requires all her focus.", interaction: "mc", skill: "Inference" },
      { prompt: "What does the final sentence suggest about Nia?", answer: "She feels ownership of the decision she made.", options: ["She regrets sitting down.", "She feels ownership of the decision she made.", "She wants the concert to stop.", "She has forgotten her brother."], explanation: "'A place she had chosen' conveys self-possession and bravery.", interaction: "mc", skill: "Theme" }
    ]
  },
  {
    id: "clockwork-orchard",
    title: "The Clockwork Orchard",
    topicId: "fiction-questions",
    unit: "Literature",
    passage: `1. Every autumn, the orchard behind Halim's house clicked before it ripened. The sound began softly, like someone winding a watch under the soil. Then, one by one, the metal leaves lifted themselves from the branches and turned towards the sun.

2. Halim had promised his grandfather that he would not enter before the first red apple appeared. But this year the clicking came early. It rattled through the kitchen window while Grandfather slept in his chair, and Halim saw one branch shaking as if it was trying to warn him.

3. He pushed open the gate. The grass was silver with dew. At the centre of the orchard, the oldest tree had opened a hollow in its trunk, and inside it lay a small brass key. Halim did not touch it at first. The whole orchard held its breath.`,
    questions: [
      { prompt: "What sound does the orchard make before it ripens?", answer: "clicking", options: ["clicking", "singing", "whistling", "scratching"], explanation: "Paragraph 1 says the orchard clicked before it ripened.", interaction: "mc", skill: "Retrieval" },
      { prompt: "What promise had Halim made?", answer: "not to enter before the first red apple appeared", options: ["not to enter before the first red apple appeared", "to sell the orchard", "to wake his grandfather", "to cut down the oldest tree"], explanation: "Paragraph 2 explains the promise to his grandfather.", interaction: "mc", skill: "Retrieval" },
      { prompt: "What does the phrase 'the whole orchard held its breath' suggest?", answer: "the moment feels tense and important", options: ["the moment feels tense and important", "the trees are asleep", "the weather is windy", "Halim is bored"], explanation: "The personification creates suspense and makes the key feel important.", interaction: "mc", skill: "Inference" },
      { prompt: "Which object is found inside the tree?", answer: "a small brass key", options: ["a small brass key", "a red apple", "a watch", "a silver leaf"], explanation: "The key is found in the hollow of the oldest tree.", interaction: "mc", skill: "Retrieval" },
      { prompt: "Which detail suggests the orchard is unusual or magical?", answer: "metal leaves lifted themselves from the branches", options: ["metal leaves lifted themselves from the branches", "the kitchen window was open", "Grandfather slept in a chair", "the grass was wet"], explanation: "Leaves moving by themselves and being metal creates a magical effect.", interaction: "mc", skill: "Language" },
      { prompt: "Why does Halim go into the orchard?", answer: "the early clicking and shaking branch make him think something is wrong", options: ["the early clicking and shaking branch make him think something is wrong", "he wants to pick apples for lunch", "his grandfather tells him to go", "he is chasing a cat"], explanation: "The unusual timing and shaking branch suggest a warning.", interaction: "mc", skill: "Inference" },
      { prompt: "How does the extract build mystery?", answer: "it reveals strange details gradually before ending on the key", options: ["it reveals strange details gradually before ending on the key", "it explains everything in paragraph 1", "it uses only dialogue", "it gives a list of orchard tools"], explanation: "The clicking, moving leaves, warning branch and key build mystery step by step.", interaction: "mc", skill: "Structure" },
      { prompt: "Which theme is suggested by Halim entering despite his promise?", answer: "curiosity can conflict with obedience", options: ["curiosity can conflict with obedience", "money is more important than family", "weather controls everything", "apples are always dangerous"], explanation: "Halim breaks a rule because he feels drawn to investigate.", interaction: "mc", skill: "Theme" }
    ]
  },
  {
    id: "repair-cafe",
    title: "The Repair Cafe",
    topicId: "nonfiction-questions",
    unit: "Non-Fiction",
    passage: `1. On the first Saturday of each month, the community hall becomes a repair cafe. People arrive with lamps that flicker, jackets with broken zips, radios that hum instead of sing and toys missing wheels. Nothing is guaranteed to be fixed, but almost everything is examined with patience.

2. The cafe began when a group of retired engineers noticed how quickly useful objects were being thrown away. They did not want to lecture anyone. Instead, they set out long tables, borrowed toolboxes and invited neighbours to learn how things worked.

3. The most popular table is not the one with the newest tools. It is the table where visitors sit beside volunteers and try the repair themselves. A fixed toaster is useful; a person who knows why the toaster broke is even more useful.`,
    questions: [
      { prompt: "When does the repair cafe take place?", answer: "the first Saturday of each month", options: ["the first Saturday of each month", "every Friday night", "once every year", "during school lunch"], explanation: "Paragraph 1 states it happens on the first Saturday of each month.", interaction: "mc", skill: "Retrieval" },
      { prompt: "Which item is not mentioned as being brought to the cafe?", answer: "a bicycle", options: ["a bicycle", "a lamp", "a jacket", "a radio"], explanation: "Lamps, jackets and radios are mentioned; bicycles are not.", interaction: "mc", skill: "Retrieval" },
      { prompt: "Why did the retired engineers start the cafe?", answer: "they noticed useful objects were being thrown away too quickly", options: ["they noticed useful objects were being thrown away too quickly", "they wanted to sell new tools", "they needed a place to store radios", "they wanted to close the community hall"], explanation: "Paragraph 2 explains their environmental and practical motivation.", interaction: "mc", skill: "Purpose" },
      { prompt: "What does 'radios that hum instead of sing' mean?", answer: "radios that make a faulty noise instead of playing properly", options: ["radios that make a faulty noise instead of playing properly", "radios that perform music live", "radios that are too quiet to hear", "radios that belong to singers"], explanation: "The phrase describes faulty radios that fail to broadcast clear sound.", interaction: "mc", skill: "Vocabulary" },
      { prompt: "What attitude does the writer show towards repairing things?", answer: "positive and respectful", options: ["positive and respectful", "angry and dismissive", "bored and uncertain", "fearful and suspicious"], explanation: "The tone praises community learning, patience and sustainability.", interaction: "mc", skill: "Tone" },
      { prompt: "Why is the final sentence effective?", answer: "it shows that learning the skill matters as much as fixing the object", options: ["it shows that learning the skill matters as much as fixing the object", "it proves toasters are the most important machines", "it says volunteers should work alone", "it suggests broken things should be thrown away"], explanation: "It shifts the moral from short-term fixes to long-term empowerment.", interaction: "mc", skill: "Inference" },
      { prompt: "How is paragraph 3 organised?", answer: "it contrasts tools with learning from volunteers", options: ["it contrasts tools with learning from volunteers", "it gives dates in order", "it describes only one broken toy", "it lists every volunteer"], explanation: "It contrasts the appeal of tools with human knowledge sharing.", interaction: "mc", skill: "Structure" },
      { prompt: "What is the main idea of the whole passage?", answer: "repairing objects can also teach people useful skills", options: ["repairing objects can also teach people useful skills", "old radios are better than new radios", "community halls should be closed", "only engineers can fix things"], explanation: "The heart of the text is learning practical skills through repair.", interaction: "mc", skill: "Summary" }
    ]
  },
  {
    id: "river-volunteers",
    title: "River Volunteers",
    topicId: "nonfiction-questions",
    unit: "Non-Fiction",
    passage: `1. The river looked calm from the bridge, but the volunteers knew better. Beneath the surface, plastic wrappers caught on reeds, old bottles rolled against stones and tiny scraps of foam gathered in the shallows like dirty snow.

2. Every Sunday morning, the group worked along a different stretch of bank. They recorded what they found, weighed each bag and photographed unusual objects. The data helped the council decide where new bins and signs were needed.

3. By winter, the river had not become perfect, but it had become visible. More walkers stopped to ask questions. A canoe club offered to help from the water. The volunteers learned that cleaning a river was partly about rubbish, and partly about making people notice what had been ignored.`,
    questions: [
      { prompt: "Where do plastic wrappers catch?", answer: "on reeds", options: ["on reeds", "under the bridge lights", "inside bins", "in a canoe"], explanation: "Paragraph 1 says wrappers caught on reeds.", interaction: "mc", skill: "Retrieval" },
      { prompt: "What simile is used to describe foam?", answer: "like dirty snow", options: ["like dirty snow", "like a silver ribbon", "like glass", "like a storm"], explanation: "The foam gathers in the shallows like dirty snow.", interaction: "mc", skill: "Language" },
      { prompt: "Why do volunteers record and weigh what they find?", answer: "to help the council decide where bins and signs are needed", options: ["to help the council decide where bins and signs are needed", "to win a competition", "to sell the rubbish", "to decorate the bridge"], explanation: "Paragraph 2 explains the data has a practical municipal purpose.", interaction: "mc", skill: "Purpose" },
      { prompt: "Which group offers to help from the water?", answer: "a canoe club", options: ["a canoe club", "a chess club", "a library group", "a football team"], explanation: "Paragraph 3 explicitly identifies the canoe club.", interaction: "mc", skill: "Retrieval" },
      { prompt: "What does the writer mean by 'the river had become visible'?", answer: "people had started to notice its problems", options: ["people had started to notice its problems", "the water turned transparent", "the bridge was removed", "the river became wider"], explanation: "Walkers stopped ignoring the environmental degradation.", interaction: "mc", skill: "Inference" },
      { prompt: "What contrast opens the passage?", answer: "the river looks calm but has hidden rubbish", options: ["the river looks calm but has hidden rubbish", "winter is warmer than summer", "walkers dislike volunteers", "bins are better than signs"], explanation: "Surface calm vs submerged debris is contrasted immediately.", interaction: "mc", skill: "Structure" },
      { prompt: "Which word suggests careful, organised work?", answer: "recorded", options: ["recorded", "rolled", "dirty", "ignored"], explanation: "Recording denotes systematic data collection.", interaction: "mc", skill: "Vocabulary" },
      { prompt: "What is one message of the passage?", answer: "small community action can draw attention to a bigger problem", options: ["small community action can draw attention to a bigger problem", "rivers should never be cleaned", "questions are useless", "only councils can help"], explanation: "Grassroots effort brings awareness and community collaboration.", interaction: "mc", skill: "Theme" }
    ]
  },
  {
    id: "the-map-room",
    title: "The Map Room",
    topicId: "fiction-questions",
    unit: "Literature",
    passage: `1. The map room was supposed to be locked. Priya knew this because there were three signs on the door, each one more serious than the last. Yet the brass handle turned easily in her hand, and the door opened with a sigh of dust.

2. Inside, maps covered every wall. Some showed countries, some showed oceans and one showed the school itself, but not as it was now. The canteen was labelled ballroom. The science block was marked winter garden. In the place where the playground should have been, someone had drawn a lake.

3. Priya stepped closer. A tiny paper boat moved across the drawn lake, leaving a line of blue ink behind it. Then the map gave a shiver, and from somewhere below the floor came the sound of water.`,
    questions: [
      { prompt: "How many signs are on the map room door?", answer: "three", options: ["three", "one", "two", "five"], explanation: "Paragraph 1 specifies there were three signs.", interaction: "mc", skill: "Retrieval" },
      { prompt: "What sound does the door make when it opens?", answer: "a sigh of dust", options: ["a sigh of dust", "a loud bell", "a splash", "a click of glass"], explanation: "The personification describes the opening as 'a sigh of dust'.", interaction: "mc", skill: "Language" },
      { prompt: "What is unusual about the school map?", answer: "it shows the school differently from now", options: ["it shows the school differently from now", "it is blank", "it is too small to read", "it is written in pencil only"], explanation: "It labels familiar areas as ballroom, winter garden, and lake.", interaction: "mc", skill: "Inference" },
      { prompt: "What is drawn where the playground should be?", answer: "a lake", options: ["a lake", "a tower", "a forest", "a car park"], explanation: "Paragraph 2 states a lake replaced the playground.", interaction: "mc", skill: "Retrieval" },
      { prompt: "Which detail suggests the map may be alive or magical?", answer: "a tiny paper boat moved across the drawn lake", options: ["a tiny paper boat moved across the drawn lake", "maps covered every wall", "there were signs on the door", "the room had dust"], explanation: "Autonomous movement on paper signals magic.", interaction: "mc", skill: "Inference" },
      { prompt: "Why is the final sentence suspenseful?", answer: "it suggests the drawn lake may be becoming real", options: ["it suggests the drawn lake may be becoming real", "it explains the school timetable", "it ends with a joke", "it describes a normal classroom"], explanation: "Sound of water beneath the floor links physical reality to the drawing.", interaction: "mc", skill: "Structure" },
      { prompt: "What does Priya's action show about her?", answer: "she is curious", options: ["she is curious", "she is lazy", "she is angry", "she is lost in a forest"], explanation: "She enters despite warning signs and examines the strange artifact.", interaction: "mc", skill: "Character" },
      { prompt: "What mood is created in the extract?", answer: "mysterious and tense", options: ["mysterious and tense", "cheerful and ordinary", "comic and silly", "formal and factual"], explanation: "Old rooms, secret doors and uncanny maps create mystery.", interaction: "mc", skill: "Mood" }
    ]
  },
  {
    id: "quiet-spaces",
    title: "Why Schools Need Quiet Spaces",
    topicId: "argument",
    unit: "Non-Fiction",
    passage: `1. A school is full of useful noise: questions, bells, laughter, chairs, sport, music and the sudden rush of a corridor at break. Noise can mean energy. It can mean friendship. But even energy needs somewhere to rest.

2. Every school should protect at least one quiet space at lunchtime. This is not about forcing silence on everyone. It is about giving pupils a choice. Some people recover by talking; others recover by reading, drawing or simply sitting without being asked to join another conversation.

3. Opponents may argue that space is limited. That is true, but quiet spaces do not need to be grand. A corner of the library, a supervised classroom or a sheltered bench can make a difference. If we plan football pitches and music rooms because pupils need them, we should plan calm spaces too.`,
    questions: [
      { prompt: "What does the writer call the noise of school?", answer: "useful noise", options: ["useful noise", "dangerous noise", "silent noise", "unwanted noise"], explanation: "Paragraph 1 characterizes it as 'useful noise'.", interaction: "mc", skill: "Retrieval" },
      { prompt: "What is the writer's main argument?", answer: "schools should provide quiet spaces at lunchtime", options: ["schools should provide quiet spaces at lunchtime", "schools should cancel music lessons", "pupils should never talk", "libraries should be locked"], explanation: "The central thesis is preserving a peaceful sanctuary at lunch.", interaction: "mc", skill: "Argument" },
      { prompt: "Why does the writer say quiet spaces are about choice?", answer: "different pupils recover in different ways", options: ["different pupils recover in different ways", "teachers dislike noise", "libraries are always empty", "all pupils prefer drawing"], explanation: "Some recharge via solitude and reflection, others socially.", interaction: "mc", skill: "Inference" },
      { prompt: "Which counterargument does the writer mention?", answer: "space is limited", options: ["space is limited", "pupils hate lunchtime", "quiet spaces cost millions", "music rooms are useless"], explanation: "Paragraph 3 acknowledges the objection of limited space.", interaction: "mc", skill: "Retrieval" },
      { prompt: "How does the writer respond to the counterargument?", answer: "by saying quiet spaces can be small and simple", options: ["by saying quiet spaces can be small and simple", "by ignoring it", "by saying space does not matter", "by blaming pupils"], explanation: "The writer points out a simple bench or classroom corner suffices.", interaction: "mc", skill: "Argument" },
      { prompt: "What effect does the list in paragraph 1 create?", answer: "it shows how busy and noisy school can be", options: ["it shows how busy and noisy school can be", "it proves school is always calm", "it explains a recipe", "it describes one classroom only"], explanation: "Listing chaotic stimuli demonstrates the constant sensory load.", interaction: "mc", skill: "Language" },
      { prompt: "Which phrase shows a balanced viewpoint?", answer: "That is true, but", options: ["That is true, but", "Every school", "sudden rush", "make a difference"], explanation: "It concedes an opponent's point before countering.", interaction: "mc", skill: "Vocabulary" },
      { prompt: "What is the purpose of this text?", answer: "to persuade school leaders to protect quiet spaces", options: ["to persuade school leaders to protect quiet spaces", "to entertain with a story", "to teach football rules", "to describe a holiday"], explanation: "It makes a policy argument directed at educators.", interaction: "mc", skill: "Purpose" }
    ]
  },
  {
    id: "storm-glass",
    title: "Storm Glass",
    topicId: "fiction-questions",
    unit: "Literature",
    passage: `1. Aunt Laleh kept the storm glass on the highest shelf, where nobody could knock it over by accident. It was shaped like a tear and filled with clear liquid. Most days, it looked empty. On storm days, crystals grew inside it like frost on a window.

2. Mira noticed the crystals on a cloudless morning. They crowded the glass in sharp white feathers, pressing against the sides as if trying to escape. Outside, the sky was blue enough to make the warning seem impossible.

3. By noon, birds had stopped singing. By two, the sea had pulled away from the harbour wall, leaving boats tilted in the mud. Aunt Laleh reached for the glass, but Mira was already running to warn the fishermen.`,
    questions: [
      { prompt: "Where is the storm glass kept?", answer: "on the highest shelf", options: ["on the highest shelf", "under the table", "inside a boat", "beside the harbour wall"], explanation: "Paragraph 1 places it on the highest shelf.", interaction: "mc", skill: "Retrieval" },
      { prompt: "What shape is the storm glass?", answer: "like a tear", options: ["like a tear", "like a star", "like a shell", "like a square"], explanation: "Described as 'shaped like a tear'.", interaction: "mc", skill: "Retrieval" },
      { prompt: "What is unusual about the warning?", answer: "the glass shows crystals on a cloudless morning", options: ["the glass shows crystals on a cloudless morning", "the sky is grey", "Aunt Laleh breaks the glass", "birds sing loudly"], explanation: "Crystals appeared despite a brilliant, clear blue sky.", interaction: "mc", skill: "Inference" },
      { prompt: "Which image describes the crystals?", answer: "sharp white feathers", options: ["sharp white feathers", "golden coins", "soft blue smoke", "tiny fish"], explanation: "Paragraph 2 describes them crowding in 'sharp white feathers'.", interaction: "mc", skill: "Language" },
      { prompt: "What suggests danger is approaching?", answer: "the sea pulls away from the harbour wall", options: ["the sea pulls away from the harbour wall", "the shelf is high", "the glass is clear", "the sky is blue"], explanation: "A receding sea signifies an imminent tidal surge or severe storm.", interaction: "mc", skill: "Inference" },
      { prompt: "What does Mira do at the end?", answer: "runs to warn the fishermen", options: ["runs to warn the fishermen", "hides the storm glass", "goes to sleep", "sings with the birds"], explanation: "She dashes out to protect the community.", interaction: "mc", skill: "Retrieval" },
      { prompt: "How does the structure create tension?", answer: "it moves from warning signs to urgent action", options: ["it moves from warning signs to urgent action", "it starts with the ending", "it gives only a description of a shelf", "it explains every event calmly"], explanation: "The progression accelerates from still crystals to birds fleeing and water dropping.", interaction: "mc", skill: "Structure" },
      { prompt: "What kind of character does Mira seem to be?", answer: "observant and brave", options: ["observant and brave", "careless and selfish", "bored and lazy", "angry and cruel"], explanation: "She notices early subtle cues and risks herself to warn others.", interaction: "mc", skill: "Character" }
    ]
  },
  {
    id: "screens-and-sleep",
    title: "Screens and Sleep",
    topicId: "nonfiction-questions",
    unit: "Non-Fiction",
    passage: `1. Many pupils know the feeling: one short video becomes ten, a message needs an answer and bedtime moves later without anyone quite deciding it should. Screens are not the enemy, but they are very good at asking for one more minute.

2. Sleep researchers say the problem is not only light. It is also attention. A bright game or dramatic group chat can make the brain behave as if the day is still busy. Even when the phone is put down, the mind may keep replaying the last challenge, joke or argument.

3. The best advice is boring, which is why it often works. Put the device outside reach. Choose a time to stop before you feel tired. Replace the final scroll with something repeatable: a shower, a chapter, a quiet playlist. A routine tells the brain that the day is closing.`,
    questions: [
      { prompt: "What does the writer say screens are good at asking for?", answer: "one more minute", options: ["one more minute", "homework help", "a new pillow", "loud music"], explanation: "Paragraph 1 concludes with that phrase.", interaction: "mc", skill: "Retrieval" },
      { prompt: "According to paragraph 2, what is the problem besides light?", answer: "attention", options: ["attention", "weather", "breakfast", "paper"], explanation: "Cognitive attention keeps neural circuits active.", interaction: "mc", skill: "Retrieval" },
      { prompt: "What does 'the day is still busy' suggest?", answer: "the brain stays alert instead of relaxing", options: ["the brain stays alert instead of relaxing", "the school day starts again", "the phone is broken", "the room is noisy"], explanation: "Stimulation tricks the mind into sustained alertness.", interaction: "mc", skill: "Inference" },
      { prompt: "Which option is not suggested as a replacement for scrolling?", answer: "a racing game", options: ["a racing game", "a shower", "a chapter", "a quiet playlist"], explanation: "Shower, chapter, and quiet playlist are mentioned; games are not.", interaction: "mc", skill: "Retrieval" },
      { prompt: "Why does the writer call the advice boring?", answer: "to admit it is simple but still useful", options: ["to admit it is simple but still useful", "to mock sleep researchers", "to say routines never work", "to make readers confused"], explanation: "Acknowledging simplicity disarms reader skepticism.", interaction: "mc", skill: "Tone" },
      { prompt: "What is the main purpose of the passage?", answer: "to explain why screens can affect sleep and suggest solutions", options: ["to explain why screens can affect sleep and suggest solutions", "to advertise a new phone", "to tell a ghost story", "to ban all technology"], explanation: "It balances diagnostic explanation with actionable hygiene tips.", interaction: "mc", skill: "Purpose" },
      { prompt: "Which sentence best summarises paragraph 3?", answer: "Simple routines can help the brain prepare for sleep.", options: ["Simple routines can help the brain prepare for sleep.", "All music keeps people awake.", "Devices should be repaired.", "Sleep researchers dislike showers."], explanation: "Predictable wind-down routines signal sleep readiness to the brain.", interaction: "mc", skill: "Summary" },
      { prompt: "What does 'the final scroll' mean?", answer: "the last period of using a device before stopping", options: ["the last period of using a device before stopping", "an ancient paper document", "a school certificate", "a broken screen"], explanation: "In digital context, it refers to night-time browsing.", interaction: "mc", skill: "Vocabulary" }
    ]
  },
  {
    id: "the-sound-collector",
    title: "The Sound Collector",
    topicId: "fiction-questions",
    unit: "Literature",
    passage: `1. Cass kept sounds in labelled jars. Rain on the greenhouse roof was stored in a blue jar. Her mother's laugh was kept in a small green one. The biggest jar, cloudy and sealed with wax, contained the roar of the old railway station before it closed.

2. Nobody believed Cass until the evening she dropped the jar marked thunder. It smashed on the kitchen tiles, and the whole house shook with a storm that was not outside. Plates rattled. The cat fled. Her father stood in the doorway, holding a towel and looking suddenly afraid.

3. Cass wanted to apologise, but the broken glass was humming. Among the pieces lay a sound she had never collected: a whisper saying her name.`,
    questions: [
      { prompt: "What sound is kept in the blue jar?", answer: "rain on the greenhouse roof", options: ["rain on the greenhouse roof", "her mother's laugh", "thunder", "a whisper"], explanation: "Paragraph 1 designates the blue jar for greenhouse rain.", interaction: "mc", skill: "Retrieval" },
      { prompt: "Which jar is sealed with wax?", answer: "the jar with the roar of the old railway station", options: ["the jar with the roar of the old railway station", "the blue rain jar", "the green laugh jar", "the jar marked thunder"], explanation: "The railway roar jar was the biggest, cloudy and wax-sealed.", interaction: "mc", skill: "Retrieval" },
      { prompt: "Why does the house shake?", answer: "Cass drops the jar marked thunder", options: ["Cass drops the jar marked thunder", "a real storm hits outside", "a train passes", "the cat knocks over plates"], explanation: "The trapped storm sound releases when shattered.", interaction: "mc", skill: "Cause and Effect" },
      { prompt: "What proves Cass was telling the truth?", answer: "the thunder jar releases a storm sound inside the house", options: ["the thunder jar releases a storm sound inside the house", "her father brings a towel", "the cat is asleep", "the jar labels are neat"], explanation: "The sonic supernatural eruption verifies her claim.", interaction: "mc", skill: "Inference" },
      { prompt: "What mood is created by the final sentence?", answer: "mysterious and unsettling", options: ["mysterious and unsettling", "peaceful and ordinary", "comic and relaxed", "formal and factual"], explanation: "An uncollected whisper addressing her creates spooky tension.", interaction: "mc", skill: "Mood" },
      { prompt: "Which detail shows her father is shocked?", answer: "looking suddenly afraid", options: ["looking suddenly afraid", "holding a towel", "stood in the doorway", "plates rattled"], explanation: "His fearful expression reveals complete disbelief overturned.", interaction: "mc", skill: "Character" },
      { prompt: "What is unusual about the broken glass?", answer: "it is humming", options: ["it is humming", "it disappears", "it turns blue", "it fixes itself"], explanation: "Paragraph 3 notes the shards were audibly humming.", interaction: "mc", skill: "Retrieval" },
      { prompt: "How does the structure create a twist?", answer: "it moves from explaining the jars to a new unknown sound", options: ["it moves from explaining the jars to a new unknown sound", "it tells the ending first", "it gives only dialogue", "it repeats the same event"], explanation: "The revelation of an unsolicited mysterious sound twists the premise.", interaction: "mc", skill: "Structure" }
    ]
  },
  {
    id: "save-the-old-cinema",
    title: "Save the Old Cinema",
    topicId: "rhetoric",
    unit: "Non-Fiction",
    passage: `1. The Regal Cinema has stood on King Street for ninety years. Its red seats have held grandparents, parents and children. Its faded gold ceiling has watched first dates, birthday trips and rainy afternoons when the whole town needed somewhere warm to go.

2. Now developers want to replace it with another glass office block. Another one. Do we really need more blank windows and empty foyers? Or do we need a place where stories still bring people together?

3. Sign the petition. Share a memory. Come to Saturday's meeting outside the cinema doors. If the Regal closes quietly, we will lose more than a building; we will lose one of the few places where the town still recognises itself.`,
    questions: [
      { prompt: "How long has the Regal Cinema stood on King Street?", answer: "ninety years", options: ["ninety years", "nine years", "nineteen years", "one hundred and ninety years"], explanation: "Paragraph 1 states ninety years.", interaction: "mc", skill: "Retrieval" },
      { prompt: "What do developers want to replace it with?", answer: "a glass office block", options: ["a glass office block", "a park", "a school", "a library"], explanation: "Developers plan another corporate glass tower.", interaction: "mc", skill: "Retrieval" },
      { prompt: "What technique is used in 'Another one'?", answer: "short sentence for emphasis", options: ["short sentence for emphasis", "simile", "onomatopoeia", "direct speech"], explanation: "A minor sentence expresses exasperation and emphasis.", interaction: "mc", skill: "Language" },
      { prompt: "Which rhetorical question supports the writer's argument?", answer: "Do we really need more blank windows and empty foyers?", options: ["Do we really need more blank windows and empty foyers?", "The Regal Cinema has stood on King Street.", "Sign the petition.", "Its red seats have held grandparents."], explanation: "It forces the reader to confront hollow corporate expansion.", interaction: "mc", skill: "Rhetoric" },
      { prompt: "What actions are readers asked to take?", answer: "sign the petition, share a memory and come to the meeting", options: ["sign the petition, share a memory and come to the meeting", "buy an office block", "paint the ceiling", "stay silent"], explanation: "Paragraph 3 lists petition, memory sharing and assembly.", interaction: "mc", skill: "Retrieval" },
      { prompt: "What does the writer suggest the cinema represents?", answer: "shared community memory and identity", options: ["shared community memory and identity", "a place only for developers", "a new shopping centre", "a private home"], explanation: "The final line calls it a mirror of collective community identity.", interaction: "mc", skill: "Inference" },
      { prompt: "What is the main purpose of the text?", answer: "to persuade people to help save the cinema", options: ["to persuade people to help save the cinema", "to review a film", "to explain how glass is made", "to describe office jobs"], explanation: "It rallies local citizens against commercial demolition.", interaction: "mc", skill: "Purpose" },
      { prompt: "Which phrase creates nostalgia?", answer: "birthday trips and rainy afternoons", options: ["birthday trips and rainy afternoons", "glass office block", "empty foyers", "Saturday's meeting"], explanation: "Warm personal vignettes invoke affectionate historical memories.", interaction: "mc", skill: "Vocabulary" }
    ]
  },
  {
    id: "ancient-footprints",
    title: "Ancient Footprints",
    topicId: "nonfiction-questions",
    unit: "Non-Fiction",
    passage: `1. On a windy beach, a line of footprints appeared after a storm stripped away the top layer of sand. They were not fresh. Scientists later discovered that the prints had been pressed into mud thousands of years ago and preserved beneath the shore.

2. The footprints varied in size. Some belonged to adults, others to children. A few crossed each other, suggesting that people had walked there more than once, perhaps collecting shellfish or moving between camps.

3. Finds like this are fragile. Sun, waves and curious visitors can damage them quickly. That is why researchers photograph, measure and scan the prints before the tide returns and hides the evidence again.`,
    questions: [
      { prompt: "What revealed the footprints?", answer: "a storm stripped away the top layer of sand", options: ["a storm stripped away the top layer of sand", "a machine dug them up", "children painted them", "the tide built a wall"], explanation: "A storm eroded the top sand layer to expose ancient mud.", interaction: "mc", skill: "Retrieval" },
      { prompt: "Were the footprints fresh?", answer: "no", options: ["no", "yes", "only some", "the passage does not say"], explanation: "Paragraph 1 states explicitly: 'They were not fresh.'", interaction: "mc", skill: "Retrieval" },
      { prompt: "What were the prints pressed into?", answer: "mud", options: ["mud", "concrete", "snow", "wood"], explanation: "Prehistoric mud hardened and preserved the impressions.", interaction: "mc", skill: "Retrieval" },
      { prompt: "What does the variety of sizes suggest?", answer: "adults and children were there", options: ["adults and children were there", "only birds were there", "the prints are fake", "the beach was empty"], explanation: "Varying shoe/foot prints point to family or multi-generational groups.", interaction: "mc", skill: "Inference" },
      { prompt: "Why might people have walked there?", answer: "to collect shellfish or move between camps", options: ["to collect shellfish or move between camps", "to catch buses", "to build a cinema", "to plant trees"], explanation: "Paragraph 2 hypothesizes foraging or nomadic relocation.", interaction: "mc", skill: "Retrieval" },
      { prompt: "Why do researchers scan the prints quickly?", answer: "the tide may return and hide or damage the evidence", options: ["the tide may return and hide or damage the evidence", "the prints will turn into gold", "the wind will make them bigger", "visitors need souvenirs"], explanation: "Wave action will rapidly wash away the exposed sediment.", interaction: "mc", skill: "Purpose" },
      { prompt: "What does 'fragile' mean in this context?", answer: "easily damaged", options: ["easily damaged", "very noisy", "recently made", "brightly coloured"], explanation: "Exposed to sun, waves, and foot traffic, they degrade rapidly.", interaction: "mc", skill: "Vocabulary" },
      { prompt: "What is the main idea of the passage?", answer: "ancient footprints can reveal evidence about past lives but must be recorded carefully", options: ["ancient footprints can reveal evidence about past lives but must be recorded carefully", "all beaches are dangerous", "storms always help tourists", "children invented shellfish"], explanation: "The passage pairs scientific anthropological value with urgent conservation.", interaction: "mc", skill: "Summary" }
    ]
  },
  {
    id: "starling-code",
    title: "The Starling Code",
    topicId: "fiction-questions",
    unit: "Literature",
    passage: `1. Every evening, the starlings gathered above the flats and wrote messages in the sky. Most people saw only a twisting cloud of birds. Leila saw letters.

2. Her notebook was full of translations: rain soon, fox below, window open. The messages were never wrong. So when the flock curved into three words she had never seen before, Leila's pencil froze.

3. DO NOT SLEEP, the birds wrote. Then they scattered, and every light in the flats went out at once.`,
    questions: [
      { prompt: "Where do the starlings gather?", answer: "above the flats", options: ["above the flats", "inside the library", "under the bridge", "on a train"], explanation: "Paragraph 1 sets them swarming above the apartment flats.", interaction: "mc", skill: "Retrieval" },
      { prompt: "What do most people see?", answer: "a twisting cloud of birds", options: ["a twisting cloud of birds", "clear letters", "a fox", "a notebook"], explanation: "Ordinary observers see a murmuration; Leila decodes letters.", interaction: "mc", skill: "Retrieval" },
      { prompt: "What does Leila see?", answer: "letters", options: ["letters", "numbers", "maps", "coins"], explanation: "She discerns alphabet glyphs in their flight paths.", interaction: "mc", skill: "Retrieval" },
      { prompt: "What is in Leila's notebook?", answer: "translations of the birds' messages", options: ["translations of the birds' messages", "homework answers", "bus times", "shopping lists"], explanation: "Her notebook records documented avian omens.", interaction: "mc", skill: "Retrieval" },
      { prompt: "What does 'Leila's pencil froze' suggest?", answer: "she is shocked or frightened", options: ["she is shocked or frightened", "the pencil turns to ice", "she is bored", "the notebook is full"], explanation: "Physical paralysis indicates sudden dread.", interaction: "mc", skill: "Inference" },
      { prompt: "What warning do the birds write?", answer: "DO NOT SLEEP", options: ["DO NOT SLEEP", "RAIN SOON", "FOX BELOW", "WINDOW OPEN"], explanation: "The aerial ominous warning states 'DO NOT SLEEP'.", interaction: "mc", skill: "Retrieval" },
      { prompt: "Why is the ending dramatic?", answer: "the warning is followed by every light going out", options: ["the warning is followed by every light going out", "Leila finishes her homework", "the birds sing gently", "the sun rises"], explanation: "An instantaneous total blackout reinforces the birds' urgent warning.", interaction: "mc", skill: "Structure" },
      { prompt: "What genre does the extract most suggest?", answer: "mystery or supernatural fiction", options: ["mystery or supernatural fiction", "sports report", "recipe", "formal letter"], explanation: "Cryptic bird messages and synchronised blackouts fit supernatural mystery.", interaction: "mc", skill: "Genre" }
    ]
  }
];
