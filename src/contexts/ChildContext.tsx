import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Child {
  id: string;
  name: string;
  class: string;
  avatar?: string;
  subjects?: SubjectProgress[];
  attendance?: number;
  progress?: number;
  streak?: number;
  achievements?: Achievement[];
}

export interface SubjectProgress {
  name: string;
  score: number;
  grade: string;
  color: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  date: string;
  type: 'milestone' | 'badge' | 'improvement';
}

interface ChildContextType {
  children: Child[];
  selectedChild: Child | null;
  setSelectedChild: (child: Child) => void;
  isLoading: boolean;
  error: string | null;
}

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export const ChildProvider = ({ children: childrenProp }: { children: ReactNode }) => {
  const [childrenData, setChildrenData] = useState<Child[]>([]);
  const [selectedChild, setSelectedChildState] = useState<Child | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching children data
    const fetchChildren = async () => {
      try {
        setIsLoading(true);
        // Mock data - in real app this would be an API call
        const mockChildren: Child[] = [
          {
            id: '1',
            name: 'Alex Johnson',
            class: 'Class 8-A',
            avatar: '👦',
            progress: 78,
            attendance: 92,
            streak: 7,
            subjects: [
              { name: 'Mathematics', score: 85, grade: 'A', color: '#3b82f6', trend: 'up', trendValue: 5 },
              { name: 'Science', score: 78, grade: 'B+', color: '#8b5cf6', trend: 'up', trendValue: 3 },
              { name: 'English', score: 92, grade: 'A+', color: '#ec4899', trend: 'stable', trendValue: 0 },
              { name: 'History', score: 71, grade: 'B', color: '#f59e0b', trend: 'up', trendValue: 8 },
              { name: 'Geography', score: 68, grade: 'B-', color: '#14b8a6', trend: 'down', trendValue: 2 },
            ],
            achievements: [
              { id: 'a1', title: 'Perfect Attendance', description: 'No absences this month', icon: 'calendar', date: '2026-01-28', type: 'milestone' },
              { id: 'a2', title: 'Math Champion', description: 'Scored highest in class test', icon: 'trophy', date: '2026-01-25', type: 'badge' },
              { id: 'a3', title: 'Consistent Learner', description: '7-day study streak', icon: 'zap', date: '2026-02-01', type: 'badge' },
            ],
          },
          {
            id: '2',
            name: 'Sam Johnson',
            class: 'Class 5-B',
            avatar: '👧',
            progress: 82,
            attendance: 95,
            streak: 12,
            subjects: [
              { name: 'Mathematics', score: 88, grade: 'A', color: '#3b82f6', trend: 'up', trendValue: 7 },
              { name: 'Science', score: 85, grade: 'A', color: '#8b5cf6', trend: 'up', trendValue: 4 },
              { name: 'English', score: 79, grade: 'B+', color: '#ec4899', trend: 'up', trendValue: 2 },
              { name: 'History', score: 82, grade: 'A-', color: '#f59e0b', trend: 'stable', trendValue: 0 },
              { name: 'Geography', score: 76, grade: 'B+', color: '#14b8a6', trend: 'up', trendValue: 5 },
            ],
            achievements: [
              { id: 'a4', title: 'Reading Star', description: 'Completed 10 books', icon: 'book', date: '2026-01-30', type: 'milestone' },
              { id: 'a5', title: 'Science Explorer', description: 'Completed all experiments', icon: 'beaker', date: '2026-01-22', type: 'badge' },
            ],
          },
        ];
        
        setChildrenData(mockChildren);
        
        // Restore selected child from localStorage or default to first
        const savedChildId = localStorage.getItem('selectedChildId');
        const savedChild = mockChildren.find(c => c.id === savedChildId);
        setSelectedChildState(savedChild || mockChildren[0] || null);
        
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load children data');
        setIsLoading(false);
      }
    };

    fetchChildren();
  }, []);

  const setSelectedChild = (child: Child) => {
    setSelectedChildState(child);
    localStorage.setItem('selectedChildId', child.id);
  };

  return (
    <ChildContext.Provider value={{ children: childrenData, selectedChild, setSelectedChild, isLoading, error }}>
      {childrenProp}
    </ChildContext.Provider>
  );
};

export const useChild = () => {
  const context = useContext(ChildContext);
  if (context === undefined) {
    throw new Error('useChild must be used within a ChildProvider');
  }
  return context;
};
