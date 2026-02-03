// Teacher Portal Mock Data

export const classStudents = [
  { id: 's1', name: 'John Smith', avatar: 'JS', rank: 1, overallScore: 92, trend: 'up', trendValue: 5, weakAreas: [], subjects: { Mathematics: 95, Science: 88, English: 93 }, behaviour: 'Excellent', strongAreas: ['Algebra', 'Grammar'] },
  { id: 's2', name: 'Emma Wilson', avatar: 'EW', rank: 2, overallScore: 88, trend: 'up', trendValue: 3, weakAreas: ['Geometry'], subjects: { Mathematics: 85, Science: 90, English: 89 }, behaviour: 'Good', strongAreas: ['Chemistry', 'Writing'] },
  { id: 's3', name: 'David Brown', avatar: 'DB', rank: 3, overallScore: 85, trend: 'stable', trendValue: 0, weakAreas: [], subjects: { Mathematics: 82, Science: 88, English: 85 }, behaviour: 'Good', strongAreas: ['Physics'] },
  { id: 's4', name: 'Sarah Johnson', avatar: 'SJ', rank: 4, overallScore: 82, trend: 'down', trendValue: -2, weakAreas: ['Trigonometry'], subjects: { Mathematics: 78, Science: 85, English: 83 }, behaviour: 'Needs Attention', strongAreas: ['Biology'] },
  { id: 's5', name: 'Michael Lee', avatar: 'ML', rank: 5, overallScore: 79, trend: 'up', trendValue: 4, weakAreas: ['Chemistry'], subjects: { Mathematics: 80, Science: 75, English: 82 }, behaviour: 'Good', strongAreas: ['History'] },
  { id: 's6', name: 'Lisa Chen', avatar: 'LC', rank: 6, overallScore: 76, trend: 'stable', trendValue: 0, weakAreas: [], subjects: { Mathematics: 74, Science: 78, English: 76 }, behaviour: 'Good', strongAreas: ['Literature'] },
  { id: 's7', name: 'James Anderson', avatar: 'JA', rank: 7, overallScore: 72, trend: 'down', trendValue: -3, weakAreas: ['Algebra'], subjects: { Mathematics: 68, Science: 75, English: 73 }, behaviour: 'Needs Attention', strongAreas: [] },
  { id: 's8', name: 'Emily Davis', avatar: 'ED', rank: 8, overallScore: 68, trend: 'up', trendValue: 2, weakAreas: ['Physics'], subjects: { Mathematics: 70, Science: 62, English: 72 }, behaviour: 'Good', strongAreas: ['Creative Writing'] },
  { id: 's9', name: 'Robert Taylor', avatar: 'RT', rank: 9, overallScore: 55, trend: 'down', trendValue: -5, weakAreas: ['Mathematics', 'Physics'], subjects: { Mathematics: 48, Science: 55, English: 62 }, behaviour: 'Concern', strongAreas: [] },
  { id: 's10', name: 'Jennifer White', avatar: 'JW', rank: 10, overallScore: 52, trend: 'down', trendValue: -4, weakAreas: ['All Subjects'], subjects: { Mathematics: 50, Science: 52, English: 54 }, behaviour: 'Concern', strongAreas: [] },
];

export const behaviourNotes = [
  { id: 'b1', studentId: 's1', studentName: 'John Smith', type: 'positive', description: 'Helped classmates with mathematics problems during group study', date: '2026-02-02', time: '10:30 AM' },
  { id: 'b2', studentId: 's4', studentName: 'Sarah Johnson', type: 'attention', description: 'Frequently distracted during class, needs to focus more', date: '2026-02-01', time: '2:15 PM' },
  { id: 'b3', studentId: 's9', studentName: 'Robert Taylor', type: 'concern', description: 'Missed 3 consecutive homework submissions', date: '2026-01-31', time: '9:00 AM' },
  { id: 'b4', studentId: 's2', studentName: 'Emma Wilson', type: 'positive', description: 'Outstanding presentation in science class', date: '2026-01-30', time: '11:00 AM' },
  { id: 'b5', studentId: 's7', studentName: 'James Anderson', type: 'attention', description: 'Late to class 3 times this week', date: '2026-01-29', time: '8:30 AM' },
];

export const classAnalyticsData = {
  classAverage: 74,
  totalStudents: 32,
  overallAccuracy: 71,
  performanceTrend: [
    { week: 'Week 1', score: 68 },
    { week: 'Week 2', score: 70 },
    { week: 'Week 3', score: 72 },
    { week: 'Week 4', score: 74 },
  ],
  distribution: {
    high: 8,
    medium: 16,
    low: 8,
  },
  subjectPerformance: [
    { subject: 'Mathematics', avgScore: 72, passRate: 85, teacher: 'Mr. Johnson' },
    { subject: 'Science', avgScore: 75, passRate: 88, teacher: 'Ms. Smith' },
    { subject: 'English', avgScore: 78, passRate: 92, teacher: 'Mrs. Davis' },
    { subject: 'History', avgScore: 70, passRate: 82, teacher: 'Mr. Brown' },
    { subject: 'Geography', avgScore: 68, passRate: 80, teacher: 'Ms. Wilson' },
  ],
};

export const atRiskStudents = [
  { id: 'ar1', name: 'Robert Taylor', avatar: 'RT', overallScore: 55, weakestSubject: 'Mathematics', trend: 'declining', attendance: 78, missedAssignments: 5 },
  { id: 'ar2', name: 'Jennifer White', avatar: 'JW', overallScore: 52, weakestSubject: 'Science', trend: 'declining', attendance: 85, missedAssignments: 3 },
  { id: 'ar3', name: 'James Anderson', avatar: 'JA', overallScore: 72, weakestSubject: 'Mathematics', trend: 'declining', attendance: 90, missedAssignments: 2 },
];

export const assessments = [
  { id: 'a1', title: 'Mid-Term Mathematics', subject: 'Mathematics', class: 'Class 10-A', type: 'Unit Test', marks: 50, scheduledDate: '2026-02-10', status: 'published' },
  { id: 'a2', title: 'Chapter 5 Quiz', subject: 'Science', class: 'Class 10-A', type: 'Quiz', marks: 20, scheduledDate: '2026-02-05', status: 'published' },
  { id: 'a3', title: 'Grammar Assessment', subject: 'English', class: 'Class 10-A', type: 'Assessment', marks: 30, scheduledDate: '2026-02-08', status: 'draft' },
  { id: 'a4', title: 'History Chapter Test', subject: 'History', class: 'Class 10-A', type: 'Unit Test', marks: 40, scheduledDate: '2026-02-15', status: 'draft' },
];

export const assessmentResults = [
  { id: 'r1', assessmentId: 'a1', title: 'Mid-Term Mathematics', subject: 'Mathematics', class: 'Class 10-A', studentsAttempted: 30, totalStudents: 32, avgScore: 72, highest: 95, lowest: 35, completed: '2026-02-10' },
  { id: 'r2', assessmentId: 'a2', title: 'Chapter 5 Quiz', subject: 'Science', class: 'Class 10-A', studentsAttempted: 32, totalStudents: 32, avgScore: 78, highest: 100, lowest: 45, completed: '2026-02-05' },
];

export const parentConversations = [
  { id: 'c1', parentName: 'Mr. Robert Smith', studentName: 'John Smith', studentClass: 'Class 10-A', avatar: 'RS', lastMessage: 'Thank you for the update on John\'s progress.', timestamp: '10:30 AM', unread: 2, online: true },
  { id: 'c2', parentName: 'Mrs. Alice Wilson', studentName: 'Emma Wilson', studentClass: 'Class 10-A', avatar: 'AW', lastMessage: 'When is the next PTM scheduled?', timestamp: 'Yesterday', unread: 0, online: false },
  { id: 'c3', parentName: 'Mr. David Brown Sr.', studentName: 'David Brown', studentClass: 'Class 10-A', avatar: 'DB', lastMessage: 'I would like to discuss David\'s performance.', timestamp: '2 days ago', unread: 1, online: false },
];

export const studentConversations = [
  { id: 'sc1', studentName: 'John Smith', studentClass: 'Class 10-A', avatar: 'JS', lastMessage: 'Sir, I have a doubt in Chapter 5.', timestamp: '11:00 AM', unread: 1, online: true },
  { id: 'sc2', studentName: 'Emma Wilson', studentClass: 'Class 10-A', avatar: 'EW', lastMessage: 'Thank you for the explanation.', timestamp: 'Yesterday', unread: 0, online: true },
];

export const events = [
  { id: 'e1', title: 'Parent-Teacher Meeting', classGroup: 'Class 10-A', description: 'Monthly PTM to discuss student progress', date: '2026-02-15', time: '10:00 AM', location: 'School Auditorium', reminderSent: true },
  { id: 'e2', title: 'Science Exhibition', classGroup: 'All Classes', description: 'Annual science project exhibition', date: '2026-02-20', time: '9:00 AM', location: 'School Ground', reminderSent: false },
  { id: 'e3', title: 'Sports Day', classGroup: 'All Classes', description: 'Annual sports day celebration', date: '2026-02-25', time: '8:00 AM', location: 'Sports Complex', reminderSent: false },
];

export const meetings = [
  { id: 'm1', parentName: 'Mr. Robert Smith', studentName: 'John Smith', date: '2026-02-15', time: '10:00 AM', duration: '30 mins', type: 'Progress Review', status: 'confirmed' },
  { id: 'm2', parentName: 'Mrs. Alice Wilson', studentName: 'Emma Wilson', date: '2026-02-15', time: '10:30 AM', duration: '30 mins', type: 'Academic Discussion', status: 'pending' },
  { id: 'm3', parentName: 'Mr. David Brown Sr.', studentName: 'David Brown', date: '2026-02-15', time: '11:00 AM', duration: '30 mins', type: 'Concern Meeting', status: 'confirmed' },
];

// Subject Teacher Mode Data
export const subjectClasses = [
  { id: 'c1', name: 'Class 9-A', subject: 'Mathematics', students: 35, avgScore: 72, completion: 68, lastAssessment: '2026-02-01' },
  { id: 'c2', name: 'Class 9-B', subject: 'Mathematics', students: 32, avgScore: 75, completion: 72, lastAssessment: '2026-02-01' },
  { id: 'c3', name: 'Class 10-A', subject: 'Mathematics', students: 32, avgScore: 78, completion: 75, lastAssessment: '2026-02-03' },
  { id: 'c4', name: 'Class 10-B', subject: 'Mathematics', students: 30, avgScore: 70, completion: 65, lastAssessment: '2026-01-30' },
];

export const subjectStudents = [
  { id: 'ss1', name: 'John Smith', class: 'Class 10-A', score: 92, accuracy: 88, weakTopics: [], strongTopics: ['Algebra', 'Equations'], trend: 'up' },
  { id: 'ss2', name: 'Emma Wilson', class: 'Class 10-A', score: 85, accuracy: 82, weakTopics: ['Geometry'], strongTopics: ['Polynomials'], trend: 'up' },
  { id: 'ss3', name: 'Michael Lee', class: 'Class 9-A', score: 78, accuracy: 75, weakTopics: ['Trigonometry'], strongTopics: ['Linear Equations'], trend: 'stable' },
  { id: 'ss4', name: 'Sarah Johnson', class: 'Class 9-B', score: 72, accuracy: 68, weakTopics: ['Quadratic Equations'], strongTopics: [], trend: 'down' },
];

export const chapters = [
  { id: 'ch1', name: 'Algebra Basics', subject: 'Mathematics', attempts: 145, mastery: 'high', masteryPercent: 85, avgScore: 82, accuracy: 78, completion: 92, trend: 'up' },
  { id: 'ch2', name: 'Linear Equations', subject: 'Mathematics', attempts: 138, mastery: 'high', masteryPercent: 80, avgScore: 78, accuracy: 75, completion: 88, trend: 'stable' },
  { id: 'ch3', name: 'Quadratic Equations', subject: 'Mathematics', attempts: 120, mastery: 'medium', masteryPercent: 65, avgScore: 65, accuracy: 62, completion: 72, trend: 'up' },
  { id: 'ch4', name: 'Polynomials', subject: 'Mathematics', attempts: 115, mastery: 'medium', masteryPercent: 60, avgScore: 62, accuracy: 58, completion: 68, trend: 'down' },
  { id: 'ch5', name: 'Geometry', subject: 'Mathematics', attempts: 98, mastery: 'low', masteryPercent: 45, avgScore: 52, accuracy: 48, completion: 55, trend: 'down' },
  { id: 'ch6', name: 'Trigonometry', subject: 'Mathematics', attempts: 85, mastery: 'low', masteryPercent: 40, avgScore: 48, accuracy: 45, completion: 50, trend: 'down' },
];

export const topics = [
  { id: 't1', chapterId: 'ch5', name: 'Triangles', avgAccuracy: 52, errorRate: 48, attempts: 45, commonMistakes: ['Angle sum property', 'Congruence rules'] },
  { id: 't2', chapterId: 'ch5', name: 'Circles', avgAccuracy: 48, errorRate: 52, attempts: 38, commonMistakes: ['Chord properties', 'Arc length'] },
  { id: 't3', chapterId: 'ch5', name: 'Quadrilaterals', avgAccuracy: 45, errorRate: 55, attempts: 42, commonMistakes: ['Parallelogram properties', 'Rhombus vs Square'] },
  { id: 't4', chapterId: 'ch6', name: 'Trigonometric Ratios', avgAccuracy: 42, errorRate: 58, attempts: 50, commonMistakes: ['Sin vs Cos confusion', 'Angle calculation'] },
];

export const commonMistakes = [
  { id: 'cm1', description: 'Confusing Sin and Cos values for complementary angles', frequency: 45, topic: 'Trigonometric Ratios', chapter: 'Trigonometry', intervention: 'Use mnemonic devices and visual representations' },
  { id: 'cm2', description: 'Incorrect application of angle sum property in triangles', frequency: 38, topic: 'Triangles', chapter: 'Geometry', intervention: 'Practice with varied triangle types' },
  { id: 'cm3', description: 'Mixing up parallelogram and rhombus properties', frequency: 35, topic: 'Quadrilaterals', chapter: 'Geometry', intervention: 'Create comparison charts' },
  { id: 'cm4', description: 'Errors in factoring quadratic expressions', frequency: 42, topic: 'Quadratic Equations', chapter: 'Quadratic Equations', intervention: 'Step-by-step factoring practice' },
];

export const recentActivities = [
  { id: 'ra1', studentName: 'John Smith', activity: 'Completed Chapter 5 assessment', timestamp: '10 mins ago', type: 'assessment' },
  { id: 'ra2', studentName: 'Emma Wilson', activity: 'Submitted homework assignment', timestamp: '25 mins ago', type: 'homework' },
  { id: 'ra3', studentName: 'David Brown', activity: 'Asked a question in Mathematics', timestamp: '1 hour ago', type: 'question' },
  { id: 'ra4', studentName: 'Sarah Johnson', activity: 'Completed practice quiz', timestamp: '2 hours ago', type: 'practice' },
];

export const topPerformers = [
  { id: 'tp1', name: 'John Smith', avatar: 'JS', improvement: 12, score: 92 },
  { id: 'tp2', name: 'Emma Wilson', avatar: 'EW', improvement: 8, score: 88 },
  { id: 'tp3', name: 'David Brown', avatar: 'DB', improvement: 5, score: 85 },
  { id: 'tp4', name: 'Lisa Chen', avatar: 'LC', improvement: 4, score: 82 },
  { id: 'tp5', name: 'Michael Lee', avatar: 'ML', improvement: 3, score: 79 },
];

export const upcomingEvents = [
  { id: 'ue1', title: 'Parent-Teacher Meeting', date: '2026-02-15' },
  { id: 'ue2', title: 'Science Exhibition', date: '2026-02-20' },
  { id: 'ue3', title: 'Mid-Term Exams Begin', date: '2026-02-25' },
];

export const messagesOverview = {
  ptmReminders: 5,
  unreadMessages: 3,
  studentQuestions: 2,
};
