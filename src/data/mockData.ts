// EDDGE Portal Mock Data

export const subjects = [
  { id: '1', name: 'Mathematics', icon: '📐', color: 'bg-blue-500', progress: 72, chapters: 12, completedChapters: 8 },
  { id: '2', name: 'Science', icon: '🔬', color: 'bg-purple-500', progress: 65, chapters: 10, completedChapters: 6 },
  { id: '3', name: 'English', icon: '📚', color: 'bg-pink-500', progress: 88, chapters: 8, completedChapters: 7 },
  { id: '4', name: 'History', icon: '🏛️', color: 'bg-amber-500', progress: 45, chapters: 15, completedChapters: 6 },
  { id: '5', name: 'Geography', icon: '🌍', color: 'bg-teal-500', progress: 55, chapters: 9, completedChapters: 5 },
];

export const chapters = {
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
