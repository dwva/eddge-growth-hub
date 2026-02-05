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

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
}

export const upcomingEvents: UpcomingEvent[] = [
  { id: 'ue1', title: 'Parent-Teacher Meeting', date: '2026-02-15', time: '10:00 AM' },
  { id: 'ue2', title: 'Science Exhibition', date: '2026-02-20', time: '2:00 PM' },
  { id: 'ue3', title: 'Mid-Term Exams Begin', date: '2026-02-25', time: '9:00 AM' },
];

export const messagesOverview = {
  ptmReminders: 5,
  unreadMessages: 3,
  studentQuestions: 2,
};

// Extended Student Profile Data
export const studentProfileData = {
  s1: {
    rollNumber: '10A-001',
    parentName: 'Mr. Robert Smith',
    parentPhone: '+1 234-567-8901',
    parentEmail: 'robert.smith@email.com',
    lastContactedDate: '2026-02-03',
    avgResponseTime: '2 hours',
    communicationFrequency: 12,
    responseRate: 95,
    engagementLevel: 'high',
    performanceHistory: [
      { month: 'Sep', score: 85 },
      { month: 'Oct', score: 87 },
      { month: 'Nov', score: 89 },
      { month: 'Dec', score: 90 },
      { month: 'Jan', score: 91 },
      { month: 'Feb', score: 92 },
    ],
    attendanceHistory: [
      { month: 'Sep', percentage: 95, present: 19, absent: 1 },
      { month: 'Oct', percentage: 100, present: 22, absent: 0 },
      { month: 'Nov', percentage: 96, present: 21, absent: 1 },
      { month: 'Dec', percentage: 100, present: 18, absent: 0 },
      { month: 'Jan', percentage: 98, present: 20, absent: 0 },
      { month: 'Feb', percentage: 100, present: 3, absent: 0 },
    ],
    aiInsights: {
      strengths: ['Exceptional in Algebra and problem-solving', 'Consistent performer with upward trend', 'Helps peers during group studies'],
      weaknesses: [],
      recommendations: ['Consider advanced mathematics challenges', 'Potential candidate for math olympiad'],
    },
  },
  s4: {
    rollNumber: '10A-004',
    parentName: 'Mrs. Linda Johnson',
    parentPhone: '+1 234-567-8904',
    parentEmail: 'linda.johnson@email.com',
    lastContactedDate: '2026-02-01',
    avgResponseTime: '6 hours',
    communicationFrequency: 8,
    responseRate: 75,
    engagementLevel: 'medium',
    performanceHistory: [
      { month: 'Sep', score: 85 },
      { month: 'Oct', score: 84 },
      { month: 'Nov', score: 83 },
      { month: 'Dec', score: 82 },
      { month: 'Jan', score: 81 },
      { month: 'Feb', score: 82 },
    ],
    attendanceHistory: [
      { month: 'Sep', percentage: 90, present: 18, absent: 2 },
      { month: 'Oct', percentage: 91, present: 20, absent: 2 },
      { month: 'Nov', percentage: 87, present: 19, absent: 3 },
      { month: 'Dec', percentage: 94, present: 17, absent: 1 },
      { month: 'Jan', percentage: 90, present: 18, absent: 2 },
      { month: 'Feb', percentage: 100, present: 3, absent: 0 },
    ],
    aiInsights: {
      strengths: ['Strong in Biology', 'Good participation in class'],
      weaknesses: ['Struggles with Trigonometry concepts', 'Occasional focus issues noted'],
      recommendations: ['Schedule remedial session for Trigonometry', 'Increase parent communication', 'Monitor classroom attention'],
    },
  },
  s9: {
    rollNumber: '10A-009',
    parentName: 'Mr. George Taylor',
    parentPhone: '+1 234-567-8909',
    parentEmail: 'george.taylor@email.com',
    lastContactedDate: '2026-01-28',
    avgResponseTime: '2 days',
    communicationFrequency: 3,
    responseRate: 40,
    engagementLevel: 'low',
    performanceHistory: [
      { month: 'Sep', score: 68 },
      { month: 'Oct', score: 65 },
      { month: 'Nov', score: 62 },
      { month: 'Dec', score: 58 },
      { month: 'Jan', score: 56 },
      { month: 'Feb', score: 55 },
    ],
    attendanceHistory: [
      { month: 'Sep', percentage: 85, present: 17, absent: 3 },
      { month: 'Oct', percentage: 82, present: 18, absent: 4 },
      { month: 'Nov', percentage: 78, present: 17, absent: 5 },
      { month: 'Dec', percentage: 72, present: 13, absent: 5 },
      { month: 'Jan', percentage: 75, present: 15, absent: 5 },
      { month: 'Feb', percentage: 67, present: 2, absent: 1 },
    ],
    aiInsights: {
      strengths: ['Shows interest in English Literature'],
      weaknesses: ['Significant decline in Mathematics and Physics', 'High absenteeism affecting performance', 'Multiple missed homework submissions'],
      recommendations: ['URGENT: Schedule parent meeting', 'Develop personalized remedial plan', 'Consider counseling support', 'Daily homework monitoring'],
    },
  },
};

// Tasks & Follow-ups
export const teacherTasks = [
  { id: 't1', studentId: 's9', studentName: 'Robert Taylor', type: 'Call Parent', priority: 'high', status: 'pending', dueDate: '2026-02-06', createdDate: '2026-02-04', description: 'Discuss declining performance and attendance', notes: '', autoGenerated: true },
  { id: 't2', studentId: 's9', studentName: 'Robert Taylor', type: 'Remedial Plan', priority: 'high', status: 'pending', dueDate: '2026-02-08', createdDate: '2026-02-04', description: 'Create mathematics remedial action plan', notes: '', autoGenerated: true },
  { id: 't3', studentId: 's4', studentName: 'Sarah Johnson', type: 'Monitor Progress', priority: 'medium', status: 'in-progress', dueDate: '2026-02-10', createdDate: '2026-02-01', description: 'Weekly check on attention and focus improvements', notes: 'Showed improvement this week', autoGenerated: false },
  { id: 't4', studentId: 's1', studentName: 'John Smith', type: 'Submit Report', priority: 'low', status: 'completed', dueDate: '2026-02-03', createdDate: '2026-01-30', description: 'Quarterly excellence report for advanced program', notes: 'Report submitted. Recommended for math olympiad.', autoGenerated: false, completedDate: '2026-02-03' },
  { id: 't5', studentId: 's7', studentName: 'James Anderson', type: 'Call Parent', priority: 'medium', status: 'pending', dueDate: '2026-02-05', createdDate: '2026-02-03', description: 'Discuss lateness pattern', notes: '', autoGenerated: false },
  { id: 't6', studentId: 's10', studentName: 'Jennifer White', type: 'Remedial Plan', priority: 'high', status: 'pending', dueDate: '2026-02-07', createdDate: '2026-02-04', description: 'Multi-subject intervention required', notes: '', autoGenerated: true },
];

// Remedial Interventions
export const remedialInterventions = [
  {
    id: 'r1',
    studentId: 's9',
    studentName: 'Robert Taylor',
    subject: 'Mathematics',
    topic: 'Basic Algebra',
    actionType: 'Extra Class',
    startDate: '2026-01-20',
    endDate: '2026-02-15',
    status: 'active',
    beforeScore: 45,
    currentScore: 52,
    targetScore: 65,
    outcome: 'in-progress',
    notes: 'Student attending extra sessions. Showing gradual improvement.',
    teacherNotes: 'Focus on foundational concepts. Parent engaged.',
    parentCommunication: [
      { date: '2026-01-20', type: 'Call', summary: 'Discussed intervention plan' },
      { date: '2026-01-28', type: 'Message', summary: 'Weekly progress update' },
    ],
  },
  {
    id: 'r2',
    studentId: 's7',
    studentName: 'James Anderson',
    subject: 'Mathematics',
    topic: 'Algebra',
    actionType: 'Worksheet Practice',
    startDate: '2026-01-15',
    endDate: '2026-02-01',
    status: 'completed',
    beforeScore: 65,
    currentScore: 70,
    afterScore: 70,
    targetScore: 75,
    outcome: 'improved',
    notes: 'Completed additional practice worksheets. Improved understanding of algebraic expressions.',
    teacherNotes: 'Student responded well to structured practice.',
    parentCommunication: [
      { date: '2026-01-15', type: 'Message', summary: 'Shared intervention plan' },
      { date: '2026-02-01', type: 'Call', summary: 'Discussed completion and progress' },
    ],
  },
  {
    id: 'r3',
    studentId: 's4',
    studentName: 'Sarah Johnson',
    subject: 'Mathematics',
    topic: 'Trigonometry',
    actionType: 'Peer Tutoring',
    startDate: '2026-02-01',
    endDate: '2026-02-20',
    status: 'active',
    beforeScore: 72,
    currentScore: 75,
    targetScore: 80,
    outcome: 'in-progress',
    notes: 'Paired with John Smith for peer tutoring sessions.',
    teacherNotes: 'Good response to peer learning approach.',
    parentCommunication: [
      { date: '2026-02-01', type: 'Message', summary: 'Informed about peer tutoring arrangement' },
    ],
  },
];

// Parent Engagement Analytics
export const parentEngagementData = [
  { id: 'pe1', studentId: 's1', studentName: 'John Smith', parentName: 'Mr. Robert Smith', responseRate: 95, avgResponseTime: '2 hours', lastContacted: '2026-02-03', messageCount: 12, engagementLevel: 'high' },
  { id: 'pe2', studentId: 's2', studentName: 'Emma Wilson', parentName: 'Mrs. Alice Wilson', responseRate: 90, avgResponseTime: '4 hours', lastContacted: '2026-02-04', messageCount: 10, engagementLevel: 'high' },
  { id: 'pe3', studentId: 's3', studentName: 'David Brown', parentName: 'Mr. David Brown Sr.', responseRate: 85, avgResponseTime: '8 hours', lastContacted: '2026-02-02', messageCount: 8, engagementLevel: 'high' },
  { id: 'pe4', studentId: 's4', studentName: 'Sarah Johnson', parentName: 'Mrs. Linda Johnson', responseRate: 75, avgResponseTime: '6 hours', lastContacted: '2026-02-01', messageCount: 8, engagementLevel: 'medium' },
  { id: 'pe5', studentId: 's5', studentName: 'Michael Lee', parentName: 'Mr. James Lee', responseRate: 70, avgResponseTime: '12 hours', lastContacted: '2026-01-30', messageCount: 6, engagementLevel: 'medium' },
  { id: 'pe6', studentId: 's6', studentName: 'Lisa Chen', parentName: 'Mrs. Wei Chen', responseRate: 80, avgResponseTime: '5 hours', lastContacted: '2026-02-03', messageCount: 7, engagementLevel: 'high' },
  { id: 'pe7', studentId: 's7', studentName: 'James Anderson', parentName: 'Mrs. Mary Anderson', responseRate: 65, avgResponseTime: '1 day', lastContacted: '2026-01-29', messageCount: 5, engagementLevel: 'medium' },
  { id: 'pe8', studentId: 's8', studentName: 'Emily Davis', parentName: 'Mr. Tom Davis', responseRate: 88, avgResponseTime: '3 hours', lastContacted: '2026-02-04', messageCount: 9, engagementLevel: 'high' },
  { id: 'pe9', studentId: 's9', studentName: 'Robert Taylor', parentName: 'Mr. George Taylor', responseRate: 40, avgResponseTime: '2 days', lastContacted: '2026-01-28', messageCount: 3, engagementLevel: 'low' },
  { id: 'pe10', studentId: 's10', studentName: 'Jennifer White', parentName: 'Mrs. Karen White', responseRate: 45, avgResponseTime: '1.5 days', lastContacted: '2026-01-27', messageCount: 4, engagementLevel: 'low' },
];

// Helper function to get student profile data
export const getStudentProfile = (studentId: string) => {
  const student = classStudents.find(s => s.id === studentId);
  const profileData = studentProfileData[studentId as keyof typeof studentProfileData];
  const studentBehaviorNotes = behaviourNotes.filter(n => n.studentId === studentId);
  const studentTasks = teacherTasks.filter(t => t.studentId === studentId);
  const studentInterventions = remedialInterventions.filter(r => r.studentId === studentId);
  const parentEngagement = parentEngagementData.find(p => p.studentId === studentId);
  
  return {
    ...student,
    ...profileData,
    behaviorNotes: studentBehaviorNotes,
    tasks: studentTasks,
    interventions: studentInterventions,
    parentEngagement,
  };
};

// Question Library - Personal saved questions
export const questionLibrary = [
  {
    id: 'ql1',
    question: 'What is the value of √144?',
    type: 'mcq',
    difficulty: 'easy',
    chapter: 'Squares and Square Roots',
    topic: 'Square Roots',
    subject: 'Mathematics',
    options: ['10', '12', '14', '16'],
    correctAnswer: '12',
    marks: 1,
    bloomsLevel: 'Remember',
    cbseAligned: true,
    qualityScore: 95,
    timesUsed: 12,
    markedHighQuality: true,
    createdAt: '2026-01-15',
    tags: ['fundamental', 'frequently-used'],
  },
  {
    id: 'ql2',
    question: 'Solve for x: 2x + 5 = 15',
    type: 'short',
    difficulty: 'medium',
    chapter: 'Linear Equations',
    topic: 'Solving Equations',
    subject: 'Mathematics',
    correctAnswer: 'x = 5',
    marks: 2,
    bloomsLevel: 'Apply',
    cbseAligned: true,
    qualityScore: 92,
    timesUsed: 8,
    markedHighQuality: true,
    createdAt: '2026-01-20',
    tags: ['problem-solving'],
  },
  {
    id: 'ql3',
    question: 'Explain how the Pythagorean theorem can be used to find the distance between two points on a coordinate plane.',
    type: 'long',
    difficulty: 'hard',
    chapter: 'Coordinate Geometry',
    topic: 'Distance Formula',
    subject: 'Mathematics',
    marks: 5,
    bloomsLevel: 'Analyze',
    cbseAligned: true,
    qualityScore: 88,
    timesUsed: 5,
    markedHighQuality: false,
    createdAt: '2026-01-25',
    tags: ['conceptual'],
  },
];

// Remedial Tracker for Subject Teachers
export const subjectRemedialActions = [
  {
    id: 'sra1',
    chapter: 'Quadratic Equations',
    topic: 'Factorization',
    actionType: 'Extra Class',
    class: 'Class 10-A',
    date: '2026-02-01',
    studentsCount: 8,
    outcome: 'improved',
    beforeAverage: 52,
    afterAverage: 68,
    notes: 'Conducted 2-hour remedial session focusing on factorization methods',
    linkedResources: ['Worksheet #12', 'Practice Quiz'],
  },
  {
    id: 'sra2',
    chapter: 'Trigonometry',
    topic: 'Trigonometric Identities',
    actionType: 'Practice Assessment',
    class: 'Class 10-B',
    date: '2026-01-28',
    studentsCount: 12,
    outcome: 'no-change',
    beforeAverage: 58,
    afterAverage: 60,
    notes: 'Created targeted practice questions on identities',
    linkedResources: ['Assessment #45'],
  },
  {
    id: 'sra3',
    chapter: 'Polynomials',
    topic: 'Division Algorithm',
    actionType: 'Worksheet',
    class: 'Class 9-A',
    date: '2026-01-25',
    studentsCount: 15,
    outcome: 'needs-followup',
    beforeAverage: 45,
    afterAverage: 48,
    notes: 'Provided worksheet with progressive difficulty. Need additional practice.',
    linkedResources: ['Worksheet #8'],
  },
];

// Assessment Insights - AI analysis of completed assessments
export const assessmentInsights = {
  a1: {
    assessmentId: 'a1',
    assessmentTitle: 'Mid-term Mathematics Test',
    totalStudents: 32,
    averageScore: 68,
    difficultQuestions: [
      {
        questionNumber: 5,
        question: 'Solve the system of linear equations: 2x + 3y = 13, 3x - y = 3',
        percentCorrect: 35,
        topic: 'Linear Equations',
        chapter: 'Pair of Linear Equations',
        mistakePattern: 'Sign errors during elimination method',
        aiInsight: 'Students struggled with sign conventions when applying elimination method. Recommend additional practice on handling negative coefficients.',
        suggestedAction: 'generate-practice',
      },
      {
        questionNumber: 8,
        question: 'Find the value of tan(45°) + cos(60°)',
        percentCorrect: 42,
        topic: 'Trigonometric Ratios',
        chapter: 'Trigonometry',
        mistakePattern: 'Incorrect standard angle values',
        aiInsight: 'Common confusion between values of standard angles. Difficulty appears appropriate but foundational knowledge needs reinforcement.',
        suggestedAction: 'remedial-worksheet',
      },
    ],
    topicsNeedingAttention: [
      { topic: 'Linear Equations', chapter: 'Pair of Linear Equations', avgScore: 48 },
      { topic: 'Trigonometric Ratios', chapter: 'Trigonometry', avgScore: 52 },
    ],
    overallInsight: 'Class performed well in Algebra basics but struggled with advanced problem-solving. Recommend targeted practice on multi-step problems.',
  },
};
