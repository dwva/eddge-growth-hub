// EDDGE Parent Dashboard Mock Data

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  avatar: string;
  online: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Meeting {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  type: 'video' | 'phone' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Homework {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  status: 'completed' | 'pending';
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  type: 'meeting' | 'fee' | 'holiday' | 'event' | 'information';
  important: boolean;
  author: string;
  date: string;
}

export interface Test {
  id: string;
  name: string;
  subject: string;
  date: string;
  score: number;
  maxScore: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

// Teachers data
export const teachers: Teacher[] = [
  { id: 't1', name: 'Mrs. Priya Sharma', subject: 'Mathematics', avatar: 'PS', online: true, lastMessage: 'Alex did great in today\'s test!', lastMessageTime: '10:30 AM', unreadCount: 2 },
  { id: 't2', name: 'Mr. Rajesh Kumar', subject: 'Science', avatar: 'RK', online: false, lastMessage: 'Please sign the permission slip', lastMessageTime: 'Yesterday', unreadCount: 0 },
  { id: 't3', name: 'Mrs. Anita Patel', subject: 'English', avatar: 'AP', online: true, lastMessage: 'Essay submission reminder', lastMessageTime: '2:15 PM', unreadCount: 1 },
  { id: 't4', name: 'Mr. Suresh Nair', subject: 'History', avatar: 'SN', online: false, lastMessage: 'Project deadline extended', lastMessageTime: 'Monday', unreadCount: 0 },
  { id: 't5', name: 'Mrs. Lakshmi Iyer', subject: 'Geography', avatar: 'LI', online: true, lastMessage: 'Map work pending', lastMessageTime: '11:45 AM', unreadCount: 3 },
  { id: 't6', name: 'Mr. Arvind Menon', subject: 'Physical Education', avatar: 'AM', online: false, lastMessage: 'Sports day practice schedule', lastMessageTime: 'Last week', unreadCount: 0 },
  { id: 't7', name: 'Mrs. Kavitha Reddy', subject: 'Computer Science', avatar: 'KR', online: true, lastMessage: 'Coding assignment submitted', lastMessageTime: '3:00 PM', unreadCount: 0 },
  { id: 't8', name: 'Mr. Mohan Das', subject: 'Art', avatar: 'MD', online: false, lastMessage: 'Art exhibition next week', lastMessageTime: '2 days ago', unreadCount: 1 },
];

// Messages data
export const messages: Message[] = [
  { id: 'm1', senderId: 't1', receiverId: 'parent', content: 'Good morning! I wanted to share that Alex showed excellent improvement in the algebra test.', timestamp: '2026-02-03T10:30:00', read: false },
  { id: 'm2', senderId: 'parent', receiverId: 't1', content: 'Thank you so much! We have been practicing at home.', timestamp: '2026-02-03T10:35:00', read: true },
  { id: 'm3', senderId: 't1', receiverId: 'parent', content: 'That\'s wonderful to hear! Keep up the great work.', timestamp: '2026-02-03T10:40:00', read: false },
  { id: 'm4', senderId: 't3', receiverId: 'parent', content: 'Reminder: Essay on "My Favorite Book" is due tomorrow.', timestamp: '2026-02-03T14:15:00', read: false },
  { id: 'm5', senderId: 't5', receiverId: 'parent', content: 'Alex needs to complete the map work by Friday.', timestamp: '2026-02-03T11:45:00', read: false },
];

// Meetings data
export const meetings: Meeting[] = [
  { id: 'meet1', teacherId: 't1', teacherName: 'Mrs. Priya Sharma', subject: 'Mathematics', date: '2026-02-05', time: '10:00 AM', duration: '30 min', type: 'video', status: 'scheduled' },
  { id: 'meet2', teacherId: 't3', teacherName: 'Mrs. Anita Patel', subject: 'English', date: '2026-02-07', time: '2:00 PM', duration: '30 min', type: 'in-person', status: 'scheduled' },
  { id: 'meet3', teacherId: 't2', teacherName: 'Mr. Rajesh Kumar', subject: 'Science', date: '2026-01-28', time: '11:00 AM', duration: '45 min', type: 'video', status: 'completed', notes: 'Discussed science project progress. Alex is doing well.' },
  { id: 'meet4', teacherId: 't4', teacherName: 'Mr. Suresh Nair', subject: 'History', date: '2026-01-20', time: '3:00 PM', duration: '30 min', type: 'phone', status: 'completed', notes: 'Reviewed history assignment performance.' },
  { id: 'meet5', teacherId: 't5', teacherName: 'Mrs. Lakshmi Iyer', subject: 'Geography', date: '2026-01-15', time: '10:30 AM', duration: '30 min', type: 'video', status: 'cancelled' },
];

// Homework data
export const homeworkList: Homework[] = [
  { id: 'hw1', title: 'Quadratic Equations Practice', subject: 'Mathematics', teacher: 'Mrs. Priya Sharma', description: 'Solve exercises 5.1 to 5.3 from textbook', assignedDate: '2026-02-01', dueDate: '2026-02-05', status: 'pending' },
  { id: 'hw2', title: 'Essay: My Favorite Book', subject: 'English', teacher: 'Mrs. Anita Patel', description: 'Write a 500-word essay about your favorite book', assignedDate: '2026-02-02', dueDate: '2026-02-04', status: 'pending' },
  { id: 'hw3', title: 'Science Lab Report', subject: 'Science', teacher: 'Mr. Rajesh Kumar', description: 'Complete the lab report for the electricity experiment', assignedDate: '2026-01-30', dueDate: '2026-02-03', status: 'pending' },
  { id: 'hw4', title: 'Map Work - India Rivers', subject: 'Geography', teacher: 'Mrs. Lakshmi Iyer', description: 'Mark all major rivers of India on the outline map', assignedDate: '2026-01-28', dueDate: '2026-02-07', status: 'pending' },
  { id: 'hw5', title: 'Linear Equations Worksheet', subject: 'Mathematics', teacher: 'Mrs. Priya Sharma', description: 'Complete worksheet on linear equations', assignedDate: '2026-01-25', dueDate: '2026-01-30', status: 'completed' },
  { id: 'hw6', title: 'History Chapter Summary', subject: 'History', teacher: 'Mr. Suresh Nair', description: 'Write summary of Chapter 7 - The French Revolution', assignedDate: '2026-01-22', dueDate: '2026-01-28', status: 'completed' },
];

// Announcements data
export const announcements: Announcement[] = [
  { id: 'ann1', title: 'Parent-Teacher Meeting', description: 'PTM scheduled for all classes. Please confirm your attendance through the app.', type: 'meeting', important: true, author: 'Principal', date: '2026-02-03T09:00:00' },
  { id: 'ann2', title: 'Fee Payment Reminder', description: 'Second term fee payment due by February 15, 2026. Late payment will incur additional charges.', type: 'fee', important: true, author: 'Accounts Department', date: '2026-02-02T10:00:00' },
  { id: 'ann3', title: 'Republic Day Holiday', description: 'School will remain closed on January 26, 2026 on account of Republic Day.', type: 'holiday', important: false, author: 'Administration', date: '2026-01-24T08:00:00' },
  { id: 'ann4', title: 'Annual Day Celebration', description: 'Annual Day will be celebrated on February 20, 2026. All parents are cordially invited.', type: 'event', important: false, author: 'Cultural Committee', date: '2026-02-01T14:00:00' },
  { id: 'ann5', title: 'New Library Books', description: 'New collection of books added to the library. Students can borrow up to 3 books.', type: 'information', important: false, author: 'Library', date: '2026-01-30T11:00:00' },
  { id: 'ann6', title: 'Sports Day Registration', description: 'Registration for Sports Day events is now open. Deadline: February 10, 2026.', type: 'event', important: false, author: 'Sports Department', date: '2026-01-29T09:00:00' },
];

// Tests data
export const recentTests: Test[] = [
  { id: 'test1', name: 'Mid-Term Exam', subject: 'Mathematics', date: '2026-01-28', score: 85, maxScore: 100, trend: 'up', trendValue: 8 },
  { id: 'test2', name: 'Chapter Test', subject: 'Science', date: '2026-01-25', score: 78, maxScore: 100, trend: 'up', trendValue: 5 },
  { id: 'test3', name: 'Grammar Quiz', subject: 'English', date: '2026-01-22', score: 92, maxScore: 100, trend: 'stable', trendValue: 0 },
  { id: 'test4', name: 'Unit Test', subject: 'History', date: '2026-01-20', score: 71, maxScore: 100, trend: 'up', trendValue: 12 },
  { id: 'test5', name: 'Map Quiz', subject: 'Geography', date: '2026-01-18', score: 68, maxScore: 100, trend: 'down', trendValue: 3 },
];

// Weekly progress data for charts
export const weeklyProgressData = [
  { week: 'Week 1', progress: 72 },
  { week: 'Week 2', progress: 75 },
  { week: 'Week 3', progress: 73 },
  { week: 'Week 4', progress: 78 },
];

export const monthlyProgressData = [
  { month: 'Sep', progress: 65 },
  { month: 'Oct', progress: 70 },
  { month: 'Nov', progress: 72 },
  { month: 'Dec', progress: 75 },
  { month: 'Jan', progress: 78 },
];

// Parent Action Center Alerts
export interface ActionAlert {
  id: string;
  type: 'academic-risk' | 'attendance-concern' | 'homework-missed' | 'positive-growth';
  severity: 'info' | 'attention' | 'urgent';
  title: string;
  description: string;
  recommendedAction: string;
  dismissed?: boolean;
  snoozedUntil?: string;
}

export const actionAlerts: ActionAlert[] = [
  {
    id: 'alert1',
    type: 'academic-risk',
    severity: 'attention',
    title: 'Geography Score Drop',
    description: 'Geography scores have decreased by 5% in recent tests. This might need some attention.',
    recommendedAction: 'Talk to child about Geography concepts',
  },
  {
    id: 'alert2',
    type: 'positive-growth',
    severity: 'info',
    title: 'Mathematics Improvement',
    description: 'Great progress in Mathematics! Scores have improved by 8% this month.',
    recommendedAction: 'Encourage continued practice',
  },
  {
    id: 'alert3',
    type: 'homework-missed',
    severity: 'attention',
    title: 'Pending Homework',
    description: '2 homework assignments are due soon. Help your child stay on track.',
    recommendedAction: 'Check homework queue together',
  },
];

// Study Habits & Consistency
export interface StudyHabit {
  currentStreak: number;
  longestStreak: number;
  weeklyStudyTime: { subject: string; hours: number }[];
  submissionConsistency: number; // percentage
  studyDays: string[]; // dates
}

export const studyHabits: StudyHabit = {
  currentStreak: 7,
  longestStreak: 12,
  weeklyStudyTime: [
    { subject: 'Mathematics', hours: 5.5 },
    { subject: 'Science', hours: 4.0 },
    { subject: 'English', hours: 3.5 },
    { subject: 'History', hours: 2.5 },
  ],
  submissionConsistency: 85,
  studyDays: [
    '2026-01-28', '2026-01-29', '2026-01-30', '2026-01-31',
    '2026-02-01', '2026-02-02', '2026-02-03',
  ],
};

// Exam Readiness
export interface ExamReadiness {
  subject: string;
  readiness: 'low' | 'medium' | 'high';
  score: number; // 0-100
  explanation: string;
}

export const examReadiness: ExamReadiness[] = [
  {
    subject: 'Mathematics',
    readiness: 'high',
    score: 85,
    explanation: 'Your child is well-prepared for the upcoming Mathematics exam.',
  },
  {
    subject: 'Science',
    readiness: 'medium',
    score: 70,
    explanation: 'Good preparation, but some topics may need review.',
  },
  {
    subject: 'English',
    readiness: 'high',
    score: 90,
    explanation: 'Excellent preparation! Your child is ready.',
  },
  {
    subject: 'History',
    readiness: 'low',
    score: 55,
    explanation: 'Your child may need support in History before the next exam.',
  },
  {
    subject: 'Geography',
    readiness: 'medium',
    score: 65,
    explanation: 'Some additional practice would be helpful.',
  },
];

// Class Benchmark
export interface ClassBenchmark {
  subject: string;
  childScore: number;
  classAverage: number;
  position: 'above' | 'at' | 'below';
}

export const classBenchmark: ClassBenchmark[] = [
  { subject: 'Mathematics', childScore: 85, classAverage: 78, position: 'above' },
  { subject: 'Science', childScore: 78, classAverage: 75, position: 'above' },
  { subject: 'English', childScore: 92, classAverage: 80, position: 'above' },
  { subject: 'History', childScore: 71, classAverage: 73, position: 'below' },
  { subject: 'Geography', childScore: 68, classAverage: 70, position: 'below' },
];

// Wellbeing Signals
export interface WellbeingSignal {
  id: string;
  type: 'performance-drop' | 'attendance-change' | 'behavior-note';
  title: string;
  description: string;
  suggestion: string;
  timestamp: string;
}

export const wellbeingSignals: WellbeingSignal[] = [
  {
    id: 'wb1',
    type: 'performance-drop',
    title: 'Recent Performance Change',
    description: 'Geography scores have decreased slightly. This is normal and may indicate a need for support.',
    suggestion: 'Consider talking to your child about how they\'re feeling about Geography.',
    timestamp: '2026-02-01',
  },
  {
    id: 'wb2',
    type: 'behavior-note',
    title: 'Positive Teacher Note',
    description: 'Teacher noted increased participation in class discussions this week.',
    suggestion: 'Great to see! Continue encouraging active participation.',
    timestamp: '2026-01-30',
  },
];

// Parent Feedback & Acknowledgement
export interface FeedbackItem {
  id: string;
  type: 'announcement' | 'ptm-note' | 'teacher-remark';
  title: string;
  content: string;
  date: string;
  status: 'pending' | 'acknowledged' | 'clarification-requested' | 'follow-up-requested';
  comment?: string;
}

export const feedbackItems: FeedbackItem[] = [
  {
    id: 'fb1',
    type: 'announcement',
    title: 'Parent-Teacher Meeting',
    content: 'PTM scheduled for all classes. Please confirm your attendance.',
    date: '2026-02-03',
    status: 'pending',
  },
  {
    id: 'fb2',
    type: 'ptm-note',
    title: 'Science Project Discussion',
    content: 'Discussed science project progress. Alex is doing well.',
    date: '2026-01-28',
    status: 'acknowledged',
  },
  {
    id: 'fb3',
    type: 'teacher-remark',
    title: 'Mathematics Improvement',
    content: 'Great improvement in algebra! Keep up the good work.',
    date: '2026-02-01',
    status: 'pending',
  },
];