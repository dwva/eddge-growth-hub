// EDDGE Portal Mock Data

export const subjects = [
  { id: '1', name: 'Mathematics', icon: '📐', color: 'bg-blue-500', progress: 72, chapters: 12, completedChapters: 8 },
  { id: '2', name: 'Science', icon: '🔬', color: 'bg-purple-500', progress: 65, chapters: 10, completedChapters: 6 },
  { id: '3', name: 'English', icon: '📚', color: 'bg-pink-500', progress: 88, chapters: 8, completedChapters: 7 },
  { id: '4', name: 'History', icon: '🏛️', color: 'bg-amber-500', progress: 45, chapters: 15, completedChapters: 6 },
  { id: '5', name: 'Geography', icon: '🌍', color: 'bg-teal-500', progress: 55, chapters: 9, completedChapters: 5 },
];

export const chapters: Record<string, { id: string; name: string; completed: boolean; concepts: number }[]> = {
  '1': [ // Mathematics
    { id: 'c1', name: 'Algebra Basics', completed: true, concepts: 5 },
    { id: 'c2', name: 'Linear Equations', completed: true, concepts: 4 },
    { id: 'c3', name: 'Quadratic Equations', completed: true, concepts: 6 },
    { id: 'c4', name: 'Polynomials', completed: false, concepts: 5 },
    { id: 'c5', name: 'Geometry Fundamentals', completed: false, concepts: 8 },
  ],
  '2': [ // Science
    { id: 'c1', name: 'Matter and Energy', completed: true, concepts: 4 },
    { id: 'c2', name: 'Force and Motion', completed: true, concepts: 5 },
    { id: 'c3', name: 'Light and Sound', completed: false, concepts: 6 },
    { id: 'c4', name: 'Electricity', completed: false, concepts: 7 },
  ],
  '3': [{ id: 'c1', name: 'Grammar', completed: false, concepts: 6 }],
  '4': [{ id: 'c1', name: 'Ancient World', completed: false, concepts: 8 }],
  '5': [{ id: 'c1', name: 'Maps', completed: false, concepts: 5 }],
};

// Learning Engine: topics per chapter (subject id -> chapter id -> topics)
export type TopicDifficulty = 'easy' | 'medium' | 'hard';
export interface LearningTopic {
  id: string;
  name: string;
  chapterId: string;
  difficulty?: TopicDifficulty;
  description?: string;
}

// Key: subjectId-chapterId (e.g. '1-c1' for Mathematics Algebra Basics)
export const learningTopics: Record<string, LearningTopic[]> = {
  '1-c1': [
    { id: 't1', name: 'Linear Expressions', chapterId: 'c1', difficulty: 'easy', description: 'Introduction to algebraic expressions with one variable.' },
    { id: 't2', name: 'Factorization', chapterId: 'c1', difficulty: 'medium', description: 'Factorizing algebraic expressions using common factors and identities.' },
  ],
  '1-c2': [
    { id: 't3', name: 'One Variable Equations', chapterId: 'c2', difficulty: 'easy', description: 'Solving equations of the form ax + b = c.' },
    { id: 't4', name: 'Word Problems', chapterId: 'c2', difficulty: 'medium', description: 'Forming and solving linear equations from real-world problems.' },
  ],
  '1-c3': [
    { id: 't5', name: 'Factorization Method', chapterId: 'c3', difficulty: 'medium', description: 'Solving quadratic equations by factorization.' },
    { id: 't6', name: 'Quadratic Formula', chapterId: 'c3', difficulty: 'hard', description: 'Using the quadratic formula to find roots.' },
  ],
  '1-c4': [
    { id: 't7', name: 'Polynomial Identities', chapterId: 'c4', difficulty: 'medium' },
    { id: 't8', name: 'Remainder Theorem', chapterId: 'c4', difficulty: 'hard' },
  ],
  '2-c1': [
    { id: 't9', name: 'Matter and States', chapterId: 'c1', difficulty: 'easy' },
    { id: 't10', name: 'Energy Forms', chapterId: 'c1', difficulty: 'medium' },
  ],
  '2-c2': [
    { id: 't11', name: "Newton's Laws", chapterId: 'c2', difficulty: 'medium', description: 'Laws of motion and their applications.' },
    { id: 't12', name: 'Friction and Motion', chapterId: 'c2', difficulty: 'easy' },
  ],
};

// Practice: question types per topic (keyed by topicId)
export type PracticeDifficulty = 'easy' | 'medium' | 'hard';

export interface PracticeQuestionMCQ {
  id: string;
  question: string;
  options: string[];
  correct: number;
  difficulty?: PracticeDifficulty;
  hint?: string;
  explanation?: string;
}

export interface PracticeQuestionShortAnswer {
  id: string;
  question: string;
  difficulty?: PracticeDifficulty;
  hint?: string;
  modelAnswer?: string;
  rubric?: string;
}

export interface PracticeQuestionLongAnswer {
  id: string;
  question: string;
  subParts?: { label: string; question: string }[];
  difficulty?: PracticeDifficulty;
  hint?: string;
  modelAnswer?: string;
  rubric?: string;
  framework?: string;
}

export interface PracticeQuestionCaseStudy {
  id: string;
  caseText: string;
  questions: (
    | { type: 'mcq'; id: string; question: string; options: string[]; correct: number }
    | { type: 'short'; id: string; question: string }
    | { type: 'long'; id: string; question: string }
  )[];
  difficulty?: PracticeDifficulty;
}

export interface PracticeQuestionVeryShort {
  id: string;
  question: string;
  correctAnswer: string;
  difficulty?: PracticeDifficulty;
  hint: string;
}

export interface PracticeTopicSet {
  mcq: PracticeQuestionMCQ[];
  shortAnswer: PracticeQuestionShortAnswer[];
  longAnswer: PracticeQuestionLongAnswer[];
  caseStudy: PracticeQuestionCaseStudy[];
  veryShort: PracticeQuestionVeryShort[];
}

// Practice questions by topic (topicId -> set). Fallback to first topic's set when topic has no data.
export const practiceQuestionsByTopic: Record<string, PracticeTopicSet> = {
  t1: {
    mcq: [
      { id: 'mq1', question: 'Simplify: 3x + 2x', options: ['5x', '6x', '5', 'x'], correct: 0, difficulty: 'easy', hint: 'Add the coefficients of x.', explanation: '3x + 2x = (3+2)x = 5x' },
      { id: 'mq2', question: 'What is the degree of 4x² + 3x + 1?', options: ['1', '2', '3', '0'], correct: 1, difficulty: 'easy', hint: 'Degree is the highest power of the variable.' },
    ],
    shortAnswer: [
      { id: 'sq1', question: 'Explain what a linear expression in one variable is. Give one example.', difficulty: 'easy', hint: 'Think of expressions like ax + b.', modelAnswer: 'A linear expression has the form ax + b where a and b are constants and x is the variable. Example: 2x + 5.' },
    ],
    longAnswer: [
      { id: 'lq1', question: 'Describe the steps to simplify an algebraic expression with like terms. Give a worked example.', framework: 'Introduction → Identify like terms → Combine → Conclusion', rubric: '2 marks: definition; 2 marks: steps; 2 marks: example.' },
    ],
    caseStudy: [
      {
        id: 'cs1',
        caseText: 'A shop sells notebooks for ₹x each and pens for ₹y each. Riya buys 3 notebooks and 2 pens. The total cost is 3x + 2y.',
        questions: [
          { type: 'mcq', id: 'csm1', question: 'What does the term 3x represent?', options: ['Cost of 2 pens', 'Cost of 3 notebooks', 'Cost of 1 notebook', 'Total cost'], correct: 1 },
          { type: 'short', id: 'css1', question: 'Write an expression for the cost of 5 notebooks and 4 pens.' },
        ],
      },
    ],
    veryShort: [
      { id: 'vs1', question: 'What is the coefficient of x in 7x + 2?', correctAnswer: '7', difficulty: 'easy', hint: 'The number multiplied by x is the coefficient.' },
    ],
  },
  t2: {
    mcq: [
      { id: 'mq3', question: 'Factorize: 6x + 12', options: ['6(x+2)', '3(2x+4)', '2(3x+6)', 'x(6+12)'], correct: 0, difficulty: 'medium', hint: 'Take the common factor out.' },
    ],
    shortAnswer: [{ id: 'sq2', question: 'What is the HCF of 6 and 12? Use it to factorize 6x + 12.', hint: 'HCF(6,12) = 6.' }],
    longAnswer: [],
    caseStudy: [],
    veryShort: [
      { id: 'vs2', question: 'Factorize 5a + 10 in one step. (Write the expression only)', correctAnswer: '5(a+2)', hint: 'Common factor is 5.' },
    ],
  },
  t3: {
    mcq: [
      { id: 'mq4', question: 'Solve for x: 2x + 5 = 15', options: ['x = 5', 'x = 10', 'x = 7.5', 'x = 4'], correct: 0, difficulty: 'easy', hint: 'Subtract 5 from both sides first.', explanation: '2x = 10, so x = 5.' },
    ],
    shortAnswer: [],
    longAnswer: [],
    caseStudy: [],
    veryShort: [
      { id: 'vs3', question: 'If 3x = 12, what is x?', correctAnswer: '4', hint: 'Divide both sides by 3.' },
    ],
  },
  t11: {
    mcq: [
      { id: 'mq5', question: "What is the SI unit of force?", options: ['Joule', 'Newton', 'Watt', 'Pascal'], correct: 1, difficulty: 'easy', hint: 'Named after a famous physicist.', explanation: 'Force is measured in newtons (N).' },
    ],
    shortAnswer: [
      { id: 'sq3', question: "State Newton's first law of motion in one sentence.", hint: 'Think about a body at rest or in uniform motion.', modelAnswer: 'A body remains at rest or in uniform motion in a straight line unless acted upon by an external force.' },
    ],
    longAnswer: [],
    caseStudy: [
      {
        id: 'cs2',
        caseText: 'A book is lying on a table. The table exerts a normal force N on the book; the book exerts weight W downward. The book is at rest.',
        questions: [
          { type: 'mcq', id: 'csm2', question: 'For the book to be at rest, how do N and W compare?', options: ['N > W', 'N = W', 'N < W', 'N = 0'], correct: 1 },
          { type: 'short', id: 'css2', question: 'Which law of Newton best explains why the book remains at rest?' },
        ],
      },
    ],
    veryShort: [
      { id: 'vs4', question: 'What is the SI unit of force? (One word)', correctAnswer: 'Newton', hint: 'Named after Isaac Newton.' },
    ],
  },
  t12: {
    mcq: [
      { id: 'mq6', question: 'Friction opposes _____.', options: ['weight', 'motion', 'gravity', 'mass'], correct: 1, difficulty: 'easy', hint: 'It acts between surfaces.' },
    ],
    shortAnswer: [],
    longAnswer: [],
    caseStudy: [],
    veryShort: [
      { id: 'vs5', question: 'Name the force that opposes relative motion between two surfaces.', correctAnswer: 'Friction', hint: 'It acts along the surface.' },
    ],
  },
};

// Default set when a topic has no practice data (reuse t1)
const defaultPracticeSet = practiceQuestionsByTopic['t1'];

export function getPracticeSetForTopic(topicId: string): PracticeTopicSet {
  return practiceQuestionsByTopic[topicId] ?? defaultPracticeSet;
}

// Reference materials (mock) – scoped to subject/chapter/topic
export const formulaSheetByChapter: Record<string, string[]> = {
  '1-c1': ['Like terms: ax + bx = (a+b)x', 'Distributive: a(b+c) = ab + ac'],
  '1-c2': ['ax + b = c ⇒ x = (c−b)/a', 'Linear equation in one variable'],
  '2-c2': ['F = ma', 'v = u + at', 's = ut + ½at²', 'Newton\'s first law: F_net = 0 ⇒ constant velocity'],
};

export const glossaryByChapter: Record<string, { term: string; definition: string }[]> = {
  '1-c1': [
    { term: 'Coefficient', definition: 'The number multiplied by a variable in a term.' },
    { term: 'Like terms', definition: 'Terms that have the same variable(s) and power.' },
  ],
  '2-c2': [
    { term: 'Force', definition: 'A push or pull that can change the state of motion of a body.' },
    { term: 'Inertia', definition: 'Tendency of a body to resist change in its state of motion.' },
  ],
};

// O-D-P-E-T-W-X stages for Learning Pathway
export const learningStages = [
  { id: 'foundation', letter: 'O', name: 'Foundation', description: 'Overview and why this topic matters.' },
  { id: 'deep', letter: 'D', name: 'Deep Learn', description: 'Core concepts and detailed explanation.' },
  { id: 'concept', letter: 'P', name: 'Concept Anchoring', description: 'Practice and reinforce understanding.' },
  { id: 'micro', letter: 'E', name: 'Micro Check', description: 'Quick checkpoints to validate learning.' },
];

// Recently studied chapters (for Learn dashboard)
export const recentlyStudiedChapters = [
  { chapterId: 'c3', chapterName: 'Quadratic Equations', subjectName: 'Mathematics', progress: 75, topicsCompleted: 3, topicsTotal: 4, lastStudied: '2 days ago' },
  { chapterId: 'c2', chapterName: 'Linear Equations', subjectName: 'Mathematics', progress: 100, topicsCompleted: 4, topicsTotal: 4, lastStudied: '1 week ago' },
  { chapterId: 'c1', chapterName: 'Algebra Basics', subjectName: 'Mathematics', progress: 60, topicsCompleted: 2, topicsTotal: 3, lastStudied: '2 weeks ago' },
  { chapterId: 'c2', chapterName: 'Force and Motion', subjectName: 'Science', progress: 40, topicsCompleted: 1, topicsTotal: 3, lastStudied: '3 days ago' },
  { chapterId: 'c1', chapterName: 'Matter and Energy', subjectName: 'Science', progress: 100, topicsCompleted: 4, topicsTotal: 4, lastStudied: '1 month ago' },
];

// Recently revised (topic-level with practice type) – for Practice page
export type RecentRevisionPracticeType = 'MCQs' | 'Short answer' | 'Long answer' | 'Case study' | 'Very short answer' | 'Revision';
export interface RecentlyRevisedItem {
  subjectId: string;
  chapterId: string;
  topicId: string;
  chapterName: string;
  subjectName: string;
  topicName: string;
  practiceType: RecentRevisionPracticeType;
  lastRevised: string;
  progress: number;
  topicsCompleted: number;
  topicsTotal: number;
}

export const recentlyRevisedTopics: RecentlyRevisedItem[] = [
  { subjectId: '1', chapterId: 'c3', topicId: 't5', chapterName: 'Quadratic Equations', subjectName: 'Mathematics', topicName: 'Factorization Method', practiceType: 'MCQs', lastRevised: '2 days ago', progress: 75, topicsCompleted: 3, topicsTotal: 4 },
  { subjectId: '1', chapterId: 'c2', topicId: 't4', chapterName: 'Linear Equations', subjectName: 'Mathematics', topicName: 'Word Problems', practiceType: 'MCQs', lastRevised: '1 week ago', progress: 100, topicsCompleted: 4, topicsTotal: 4 },
  { subjectId: '1', chapterId: 'c1', topicId: 't1', chapterName: 'Algebra Basics', subjectName: 'Mathematics', topicName: 'Linear Expressions', practiceType: 'Revision', lastRevised: '2 weeks ago', progress: 66, topicsCompleted: 2, topicsTotal: 3 },
  { subjectId: '2', chapterId: 'c2', topicId: 't11', chapterName: 'Force and Motion', subjectName: 'Science', topicName: "Newton's Laws", practiceType: 'MCQs', lastRevised: '3 days ago', progress: 33, topicsCompleted: 1, topicsTotal: 3 },
  { subjectId: '2', chapterId: 'c1', topicId: 't9', chapterName: 'Matter and Energy', subjectName: 'Science', topicName: 'Matter and States', practiceType: 'Short answer', lastRevised: '1 month ago', progress: 100, topicsCompleted: 4, topicsTotal: 4 },
];

export const practiceQuestions = [
  {
    id: 'q1',
    subject: 'Mathematics',
    question: 'Solve for x: 2x + 5 = 15',
    options: ['x = 5', 'x = 10', 'x = 7.5', 'x = 4'],
    correct: 0,
    difficulty: 'easy',
    hint: 'Subtract 5 from both sides first',
  },
  {
    id: 'q2',
    subject: 'Science',
    question: 'What is the SI unit of force?',
    options: ['Joule', 'Newton', 'Watt', 'Pascal'],
    correct: 1,
    difficulty: 'easy',
    hint: 'Named after a famous physicist',
  },
  {
    id: 'q3',
    subject: 'Mathematics',
    question: 'Find the area of a circle with radius 7 cm',
    options: ['44 cm²', '154 cm²', '22 cm²', '308 cm²'],
    correct: 1,
    difficulty: 'medium',
    hint: 'Use the formula πr², where π ≈ 22/7',
  },
];

export const upcomingTests = [
  { id: 't1', subject: 'Mathematics', name: 'Mid-Term Exam', date: '2026-02-10', duration: '2 hours' },
  { id: 't2', subject: 'Science', name: 'Chapter Test', date: '2026-02-05', duration: '1 hour' },
  { id: 't3', subject: 'English', name: 'Essay Writing', date: '2026-02-08', duration: '1.5 hours' },
];

export const studentPerformance = {
  xp: 2450,
  level: 12,
  streak: 7,
  totalStudyTime: '48h 30m',
  averageScore: 78,
  strengths: ['Algebra', 'Grammar', 'World History'],
  weakAreas: ['Geometry', 'Chemistry'],
  weeklyProgress: [
    { day: 'Mon', minutes: 45 },
    { day: 'Tue', minutes: 60 },
    { day: 'Wed', minutes: 30 },
    { day: 'Thu', minutes: 55 },
    { day: 'Fri', minutes: 40 },
    { day: 'Sat', minutes: 75 },
    { day: 'Sun', minutes: 50 },
  ],
};

// ─── New EDDGE Performance Philosophy (Readiness + Consistency + Clarity) ───
export type ReadinessLevel = 'Building' | 'Stable' | 'Strong';
export type StabilityLabel = 'Consistent' | 'Improving' | 'Needs regular revision';
export type FocusLoadLabel = 'Balanced' | 'Too many open topics' | 'Focused';
export type KnowledgeHealth = 'strong' | 'needs-refresh' | 'needs-attention';

export const performanceDashboard = {
  readiness: 'Stable' as ReadinessLevel,
  stability: 'Improving' as StabilityLabel,
  focusLoad: 'Balanced' as FocusLoadLabel,
  knowledgeHealthMap: [
    { id: 'k1', name: 'Algebra', subject: 'Mathematics', health: 'strong' as KnowledgeHealth },
    { id: 'k2', name: 'Grammar', subject: 'English', health: 'strong' as KnowledgeHealth },
    { id: 'k3', name: 'World History', subject: 'History', health: 'strong' as KnowledgeHealth },
    { id: 'k4', name: 'Geometry', subject: 'Mathematics', health: 'needs-refresh' as KnowledgeHealth },
    { id: 'k5', name: 'Chemical Reactions', subject: 'Chemistry', health: 'needs-refresh' as KnowledgeHealth },
    { id: 'k6', name: 'Trigonometry', subject: 'Mathematics', health: 'needs-attention' as KnowledgeHealth },
    { id: 'k7', name: 'Organic Chemistry', subject: 'Chemistry', health: 'needs-attention' as KnowledgeHealth },
  ],
  improvementTrajectory: [
    { id: 't1', label: 'Understanding improving', positive: true },
    { id: 't2', label: 'Fewer repeated mistakes', positive: true },
    { id: 't3', label: 'Revision effectiveness: Good', positive: true },
  ],
  strengths: [
    { id: 's1', name: 'Algebra', note: 'Reliable — use for confidence' },
    { id: 's2', name: 'Grammar', note: 'Reliable — use for confidence' },
    { id: 's3', name: 'World History', note: 'Reliable — use for confidence' },
  ],
  currentlyBuilding: [
    { id: 'c1', name: 'Geometry', note: 'Needs one more revision' },
    { id: 'c2', name: 'Chemistry', note: 'Concept clarity pending' },
  ],
  coachAction: {
    title: 'If you do ONE thing today…',
    action: 'Revise Geometry for 10 minutes — it\'s cooling down.',
    whyMatters: 'Geometry is moving from "needs refresh" to "strong" with a short revision. A little now helps more than a long session later.',
  },
};

// ─── Graph-first Student Performance Dashboard (EPI, trajectory, heatmap, etc.) ───
export type TrajectoryPoint = {
  date: string;
  accuracy: number;
  difficultyWeightedScore: number;
  retention: number;
  practiceType?: string;
  topic?: string;
};

export type KnowledgeHealthCell = {
  topicId: string;
  topicName: string;
  subject: string;
  accuracy: number;
  retention: number;
  mistakeFrequency: number; // 0–100, higher = more mistakes
};

export type QuestionTypePerformance = {
  type: string;
  accuracy: number;
  avgTimeSec: number;
};

export type TimePerSubject = {
  subject: string;
  timePct: number;
  scoreReturnPct: number;
};

export type StrengthCard = {
  id: string;
  topic: string;
  lastAccuracy: number;
  retention14d: number;
  label: string;
};

export type BuildingCard = {
  id: string;
  topic: string;
  whatsMissing: string;
};

export type DailyActionData = {
  action: string;
  sparklineData: { day: string; retention: number }[];
  whyMatters: string;
};

export type OverallPerformancePoint = {
  month: string;
  value: number;
};

export const studentPerformanceDashboard = {
  epi: 78,
  epiInsight: 'Learning is stable and improving. Geometry and Organic Chemistry need attention.',
  overallPerformance: [
    { month: 'Jan', value: 80 },
    { month: 'Feb', value: 77 },
    { month: 'Mar', value: 73 },
    { month: 'Apr', value: 75 },
    { month: 'May', value: 77 },
    { month: 'Jun', value: 79 },
    { month: 'Jul', value: 80 },
  ] as OverallPerformancePoint[],
  learningTrajectory: {
    '30': [
      { date: '2026-01-08', accuracy: 68, difficultyWeightedScore: 62, retention: 72, practiceType: 'Practice', topic: 'Algebra' },
      { date: '2026-01-12', accuracy: 72, difficultyWeightedScore: 66, retention: 74, practiceType: 'Revision', topic: 'Geometry' },
      { date: '2026-01-16', accuracy: 71, difficultyWeightedScore: 68, retention: 70, practiceType: 'Practice', topic: 'Chemistry' },
      { date: '2026-01-20', accuracy: 75, difficultyWeightedScore: 71, retention: 76, practiceType: 'Practice', topic: 'Algebra' },
      { date: '2026-01-24', accuracy: 74, difficultyWeightedScore: 72, retention: 75, practiceType: 'Revision', topic: 'Trigonometry' },
      { date: '2026-01-28', accuracy: 76, difficultyWeightedScore: 74, retention: 77, practiceType: 'Practice', topic: 'Mixed' },
      { date: '2026-02-01', accuracy: 78, difficultyWeightedScore: 76, retention: 78, practiceType: 'Practice', topic: 'Mixed' },
    ] as TrajectoryPoint[],
    '60': [
      { date: '2025-12-10', accuracy: 62, difficultyWeightedScore: 56, retention: 65 },
      { date: '2025-12-20', accuracy: 66, difficultyWeightedScore: 60, retention: 68 },
      { date: '2025-12-30', accuracy: 68, difficultyWeightedScore: 64, retention: 70 },
      { date: '2026-01-09', accuracy: 70, difficultyWeightedScore: 66, retention: 72 },
      { date: '2026-01-19', accuracy: 74, difficultyWeightedScore: 70, retention: 75 },
      { date: '2026-01-29', accuracy: 77, difficultyWeightedScore: 74, retention: 77 },
      { date: '2026-02-04', accuracy: 78, difficultyWeightedScore: 76, retention: 78 },
    ] as TrajectoryPoint[],
    '90': [
      { date: '2025-11-08', accuracy: 58, difficultyWeightedScore: 52, retention: 62 },
      { date: '2025-11-25', accuracy: 62, difficultyWeightedScore: 56, retention: 65 },
      { date: '2025-12-12', accuracy: 65, difficultyWeightedScore: 60, retention: 68 },
      { date: '2025-12-28', accuracy: 68, difficultyWeightedScore: 63, retention: 70 },
      { date: '2026-01-14', accuracy: 72, difficultyWeightedScore: 68, retention: 74 },
      { date: '2026-01-28', accuracy: 76, difficultyWeightedScore: 73, retention: 76 },
      { date: '2026-02-05', accuracy: 78, difficultyWeightedScore: 76, retention: 78 },
    ] as TrajectoryPoint[],
  },
  knowledgeHealthHeatmap: [
    { topicId: 'k1', topicName: 'Algebra', subject: 'Mathematics', accuracy: 88, retention: 85, mistakeFrequency: 12 },
    { topicId: 'k2', topicName: 'Grammar', subject: 'English', accuracy: 90, retention: 88, mistakeFrequency: 8 },
    { topicId: 'k3', topicName: 'World History', subject: 'History', accuracy: 85, retention: 82, mistakeFrequency: 15 },
    { topicId: 'k4', topicName: 'Geometry', subject: 'Mathematics', accuracy: 62, retention: 61, mistakeFrequency: 38 },
    { topicId: 'k5', topicName: 'Chemical Reactions', subject: 'Chemistry', accuracy: 58, retention: 55, mistakeFrequency: 42 },
    { topicId: 'k6', topicName: 'Trigonometry', subject: 'Mathematics', accuracy: 48, retention: 45, mistakeFrequency: 55 },
    { topicId: 'k7', topicName: 'Organic Chemistry', subject: 'Chemistry', accuracy: 44, retention: 42, mistakeFrequency: 58 },
  ] as KnowledgeHealthCell[],
  questionPatternPerformance: [
    { type: 'MCQs', accuracy: 82, avgTimeSec: 45 },
    { type: 'Assertion & Reason', accuracy: 68, avgTimeSec: 90 },
    { type: 'Case Study', accuracy: 58, avgTimeSec: 180 },
    { type: 'Short Answer', accuracy: 72, avgTimeSec: 120 },
    { type: 'Long Answer', accuracy: 65, avgTimeSec: 300 },
  ] as QuestionTypePerformance[],
  timeRoi: {
    timePerSubject: [
      { subject: 'Physics', timePct: 20, scoreReturnPct: 22 },
      { subject: 'Maths', timePct: 28, scoreReturnPct: 30 },
      { subject: 'Chemistry', timePct: 25, scoreReturnPct: 16 },
      { subject: 'English', timePct: 15, scoreReturnPct: 20 },
      { subject: 'Biology', timePct: 12, scoreReturnPct: 12 },
    ],
    timeVsAccuracyGain: [
      { timeMin: 30, accuracyGain: 2 },
      { timeMin: 60, accuracyGain: 5 },
      { timeMin: 90, accuracyGain: 8 },
      { timeMin: 120, accuracyGain: 10 },
      { timeMin: 150, accuracyGain: 11 },
      { timeMin: 180, accuracyGain: 12 },
    ],
    roiInsight: 'Chemistry uses 25% of your study time but yields only 16% score return.',
  },
  strengths: [
    { id: 's1', topic: 'Algebra', lastAccuracy: 88, retention14d: 85, label: 'Reliable — use for confidence' },
    { id: 's2', topic: 'Grammar', lastAccuracy: 90, retention14d: 88, label: 'Reliable — use for confidence' },
    { id: 's3', topic: 'World History', lastAccuracy: 85, retention14d: 82, label: 'Reliable — use for confidence' },
  ] as StrengthCard[],
  currentlyBuilding: [
    { id: 'c1', topic: 'Geometry', whatsMissing: 'Concept clarity on similar triangles; one focused revision recommended.' },
    { id: 'c2', topic: 'Organic Chemistry', whatsMissing: 'Practice depth on reaction mechanisms; 2–3 more sets needed.' },
  ] as BuildingCard[],
  dailyAction: {
    action: 'Revise Geometry for 10 minutes',
    sparklineData: [
      { day: 'Day -7', retention: 78 },
      { day: 'Day -6', retention: 76 },
      { day: 'Day -5', retention: 74 },
      { day: 'Day -4', retention: 70 },
      { day: 'Day -3', retention: 66 },
      { day: 'Day -2', retention: 63 },
      { day: 'Day -1', retention: 61 },
    ],
    whyMatters: 'Retention dropped from 78% → 61% in the last 7 days.',
  } as DailyActionData,
};

export const attendance = {
  totalDays: 180,
  presentDays: 165,
  absentDays: 10,
  lateDays: 5,
  percentage: 91.7,
  recentDays: [
    { date: '2026-02-01', status: 'present' },
    { date: '2026-01-31', status: 'present' },
    { date: '2026-01-30', status: 'present' },
    { date: '2026-01-29', status: 'late', arrivalTime: '09:12 AM', lateByMinutes: 12 },
    { date: '2026-01-28', status: 'present' },
    { date: '2026-01-27', status: 'absent' },
    { date: '2026-01-26', status: 'present' },
  ],
};

// Teacher Dashboard Data
export const teacherClasses = [
  { id: 'tc1', name: 'Class 10-A', subject: 'Mathematics', students: 32, schedule: 'Mon, Wed, Fri - 9:00 AM' },
  { id: 'tc2', name: 'Class 10-B', subject: 'Mathematics', students: 30, schedule: 'Tue, Thu - 10:00 AM' },
  { id: 'tc3', name: 'Class 9-A', subject: 'Mathematics', students: 35, schedule: 'Mon, Wed - 11:00 AM' },
];

export const pendingTasks = [
  { id: 'pt1', task: 'Grade Chapter 5 assignments', class: 'Class 10-A', deadline: '2026-02-03', count: 28 },
  { id: 'pt2', task: 'Review test submissions', class: 'Class 9-A', deadline: '2026-02-04', count: 35 },
  { id: 'pt3', task: 'Prepare next week lesson plan', class: 'All', deadline: '2026-02-07', count: null },
];

export const atRiskStudents = [
  { id: 'ars1', name: 'John Smith', class: 'Class 10-A', issue: 'Low test scores', score: 45 },
  { id: 'ars2', name: 'Emma Wilson', class: 'Class 10-B', issue: 'Attendance below 75%', attendance: 72 },
  { id: 'ars3', name: 'David Brown', class: 'Class 9-A', issue: 'Missing assignments', missing: 5 },
];

// Parent Dashboard Data
export const childInfo = {
  name: 'Alex Johnson',
  class: 'Class 10-A',
  rollNo: 15,
  section: 'A',
  avatar: '🎓',
};

export const childPerformance = {
  overallGrade: 'A-',
  rank: 5,
  totalStudents: 32,
  subjects: [
    { name: 'Mathematics', grade: 'A', score: 88 },
    { name: 'Science', grade: 'B+', score: 82 },
    { name: 'English', grade: 'A', score: 91 },
    { name: 'History', grade: 'B', score: 76 },
  ],
};

// Admin Dashboard Data
export const schoolStats = {
  totalStudents: 1250,
  totalTeachers: 85,
  totalClasses: 42,
  averageAttendance: 89.5,
  averagePerformance: 76.8,
};

export const recentAnnouncements = [
  { id: 'a1', title: 'Annual Day Celebration', date: '2026-02-15', type: 'event' },
  { id: 'a2', title: 'Parent-Teacher Meeting', date: '2026-02-20', type: 'meeting' },
  { id: 'a3', title: 'Holiday Notice - Republic Day', date: '2026-01-26', type: 'holiday' },
];

// Super Admin Dashboard Data
export const platformStats = {
  totalSchools: 45,
  totalUsers: 52000,
  activeUsers: 38500,
  systemHealth: 99.2,
  aiCalls: 125000,
  storageUsed: '2.4 TB',
};

export const schoolsList = [
  { id: 's1', name: 'Green Valley School', city: 'Mumbai', students: 1250, status: 'active' },
  { id: 's2', name: 'Sunrise Academy', city: 'Delhi', students: 980, status: 'active' },
  { id: 's3', name: 'St. Mary\'s School', city: 'Bangalore', students: 1500, status: 'active' },
  { id: 's4', name: 'Modern Public School', city: 'Chennai', students: 850, status: 'trial' },
];
