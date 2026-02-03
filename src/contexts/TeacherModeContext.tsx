import React, { createContext, useContext, useState, ReactNode } from 'react';

type TeacherMode = 'class_teacher' | 'subject_teacher';

interface TeacherModeContextType {
  currentMode: TeacherMode;
  setCurrentMode: (mode: TeacherMode) => void;
}

const TeacherModeContext = createContext<TeacherModeContextType | undefined>(undefined);

export const TeacherModeProvider = ({ children }: { children: ReactNode }) => {
  const [currentMode, setCurrentMode] = useState<TeacherMode>('class_teacher');

  return (
    <TeacherModeContext.Provider value={{ currentMode, setCurrentMode }}>
      {children}
    </TeacherModeContext.Provider>
  );
};

export const useTeacherMode = () => {
  const context = useContext(TeacherModeContext);
  if (!context) {
    throw new Error('useTeacherMode must be used within a TeacherModeProvider');
  }
  return context;
};
