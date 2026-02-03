import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type TeacherMode = 'class_teacher' | 'subject_teacher';

const STORAGE_KEY = 'eddge_teacher_mode';

function getStoredMode(): TeacherMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'class_teacher' || stored === 'subject_teacher') return stored;
  } catch {
    // ignore
  }
  return 'class_teacher';
}

interface TeacherModeContextType {
  currentMode: TeacherMode;
  setCurrentMode: (mode: TeacherMode) => void;
}

const TeacherModeContext = createContext<TeacherModeContextType | undefined>(undefined);

export const TeacherModeProvider = ({ children }: { children: ReactNode }) => {
  const [currentMode, setCurrentMode] = useState<TeacherMode>(getStoredMode);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currentMode);
    } catch {
      // ignore
    }
  }, [currentMode]);

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
