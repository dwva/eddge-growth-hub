import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TeacherModeProvider, useTeacherMode } from '@/contexts/TeacherModeContext';
import TeacherSidebar from './TeacherSidebar';
import { Button } from '@/components/ui/button';
import { Users, BookOpen } from 'lucide-react';

interface TeacherDashboardLayoutProps {
  children: ReactNode;
}

const ModeToggle = () => {
  const { currentMode, setCurrentMode } = useTeacherMode();

  return (
    <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
      <Button
        variant={currentMode === 'class_teacher' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setCurrentMode('class_teacher')}
        className="gap-2"
      >
        <Users className="w-4 h-4" />
        Class Teacher
      </Button>
      <Button
        variant={currentMode === 'subject_teacher' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setCurrentMode('subject_teacher')}
        className="gap-2"
      >
        <BookOpen className="w-4 h-4" />
        Subject Teacher
      </Button>
    </div>
  );
};

const TeacherDashboardContent = ({ children }: TeacherDashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <TeacherSidebar />
      
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              <div />
              <ModeToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

const TeacherDashboardLayout = ({ children }: TeacherDashboardLayoutProps) => {
  return (
    <TeacherModeProvider>
      <TeacherDashboardContent>{children}</TeacherDashboardContent>
    </TeacherModeProvider>
  );
};

export default TeacherDashboardLayout;
