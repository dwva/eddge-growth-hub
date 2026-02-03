/**
 * Planner stub data – isolated for easy replacement when backend is connected.
 */

import type { Task, Priority } from '@/pages/student/StudentPlanner';

export type { Priority };
export type CognitiveLoad = 'low' | 'balanced' | 'high';

export const plannerStubs = {
  cognitiveLoad: 'balanced' as CognitiveLoad,

  deadlines: [
    { date: 'Feb 15', month: 'Feb', day: '15', name: 'Math assignment', subject: 'Mathematics', priority: 'high' as Priority },
    { date: 'Feb 20', month: 'Feb', day: '20', name: 'Science project', subject: 'Science', priority: 'medium' as Priority },
  ],

  weakAreas: ['Quadratic Equations', 'Laws of Motion'],

  exam: { name: 'Annual Exam', date: 'Mar 15, 2026', daysLeft: 40 },

  suggestions: [
    { id: 's1', name: 'Algebra drill', subject: 'Mathematics', duration: '20 min', priority: 'high' as Priority, why: 'Weak area practice' },
  ],

  /** Seed tasks for initial load – replace with API when backend exists */
  initialTasks: [
    { id: '1', name: 'Quadratic Equations practice', subject: 'Mathematics', duration: '30 min', priority: 'high' as Priority, status: 'pending' as const, intent: 'practice' as const, reason: 'Weak area identified', origin: 'ai' as const, dueDate: new Date(2026, 1, 3), allocatedDate: new Date(2026, 1, 3), startTime: '09:00', endTime: '09:30', resources: [{ label: 'Calculator', status: 'required' }], aiInsight: 'Focus on quadratic formula today.', performanceScore: 85 },
    { id: '2', name: 'Laws of Motion revision', subject: 'Science', duration: '15 min', priority: 'medium' as Priority, status: 'completed' as const, intent: 'revision' as const, reason: 'Upcoming exam topic', origin: 'user' as const, dueDate: new Date(2026, 1, 3) },
    { id: '3', name: 'Algebra basics', subject: 'Mathematics', duration: '25 min', priority: 'high' as Priority, status: 'pending' as const, intent: 'learn' as const, reason: 'New topic this week', origin: 'ai' as const, dueDate: new Date(2026, 1, 3) },
    { id: '4', name: 'Mechanics – numerical', subject: 'Physics', duration: '45 min', priority: 'medium' as Priority, status: 'pending' as const, intent: 'practice' as const, reason: 'Practice set', origin: 'ai' as const, dueDate: new Date(2026, 1, 3), resources: [{ label: 'Quiet room', status: 'recommended' }] },
    { id: '5', name: 'Organic chemistry', subject: 'Chemistry', duration: '20 min', priority: 'low' as Priority, status: 'pending' as const, intent: 'revision' as const, reason: 'Revision', origin: 'user' as const, dueDate: new Date(2026, 1, 3) },
  ] as Task[],
} as const;
