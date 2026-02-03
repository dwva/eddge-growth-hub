import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play,
  Clock,
  Target,
  Zap,
  CheckCircle2,
  Circle,
  ChevronRight,
  Flame,
  BookOpen,
  PenTool,
  RotateCcw,
  CalendarDays,
  ArrowRight
} from 'lucide-react';

// Types
type TaskType = 'Learn' | 'Practice' | 'Revision';
type ExamMode = 'Learning Mode' | 'Preparation Mode' | 'Exam Mode';
type ReadinessLevel = 'High' | 'Medium' | 'Low';
type CalendarDayType = 'study' | 'revision' | 'exam' | 'rest';

interface Task {
  id: number;
  title: string;
  type: TaskType;
  subject: string;
  chapter?: string;
  duration: string;
  completed: boolean;
  date: string;
}

interface CalendarDay {
  day: number;
  type: CalendarDayType;
  label: string;
}

// Mock data
const todaysFocus = {
  title: "Revise Algebra Basics",
  type: "Revision" as TaskType,
  subject: "Mathematics",
  chapter: "Chapter 2: Linear Equations",
  duration: "15 mins",
  progress: 0,
  route: "/student/learning"
};

const secondaryTask = {
  title: "Quick Practice: Linear Equations",
  type: "Practice" as TaskType,
  duration: "5 mins",
  route: "/student/practice"
};

const examMode = {
  mode: "Preparation Mode" as ExamMode,
  daysUntilExam: 14,
  examName: "Mid-Term Mathematics",
  modeDescription: "Focus shifts to revision and practice. New concepts are paused."
};

const learningReadiness = {
  level: "High" as ReadinessLevel,
  message: "You're energized and ready to learn!",
  taskAdjustment: "Full-length tasks enabled"
};

const taskTimeline: Task[] = [
  { id: 1, title: "Quadratic Equations - Concept", type: "Learn", subject: "Mathematics", duration: "20 mins", completed: true, date: "Today" },
  { id: 2, title: "Linear Equations Practice", type: "Practice", subject: "Mathematics", duration: "15 mins", completed: true, date: "Yesterday" },
  { id: 3, title: "Algebra Basics Review", type: "Revision", subject: "Mathematics", duration: "10 mins", completed: false, date: "2 days ago" },
];

const calendarDays: CalendarDay[] = [
  { day: 27, type: "study", label: "M" },
  { day: 28, type: "revision", label: "T" },
  { day: 29, type: "study", label: "W" },
  { day: 30, type: "exam", label: "T" },
  { day: 31, type: "study", label: "F" },
  { day: 1, type: "rest", label: "S" },
  { day: 2, type: "study", label: "S" },
];

const streakData = {
  currentStreak: 7,
  graceUsed: false,
  gracePeriodDays: 1,
  message: "Keep it going! You have a 1-day grace period."
};

// Helper functions
const getTaskTypeIcon = (type: TaskType) => {
  switch (type) {
    case 'Learn': return <BookOpen className="w-3.5 h-3.5" />;
    case 'Practice': return <PenTool className="w-3.5 h-3.5" />;
    case 'Revision': return <RotateCcw className="w-3.5 h-3.5" />;
  }
};

const getReadinessColor = (level: ReadinessLevel) => {
  switch (level) {
    case 'High': return 'text-emerald-600';
    case 'Medium': return 'text-amber-500';
    case 'Low': return 'text-red-500';
  }
};

const StudentPlanner = () => {
  const navigate = useNavigate();
  const [showSecondaryTask] = useState(true);
  const [showModeInfo, setShowModeInfo] = useState(false);

  const handleStartTask = (route: string) => {
    navigate(route);
  };

  return (
    <StudentDashboardLayout title="Planner">
      <div className="space-y-5 max-w-5xl">
        {/* Top Row: Today's Focus + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Today's Focus */}
          <Card className="lg:col-span-2 border border-border bg-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">Today's Focus</span>
                </div>
                <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
                  {getTaskTypeIcon(todaysFocus.type)}
                  <span className="ml-1">{todaysFocus.type}</span>
                </Badge>
              </div>
              
              <h2 className="text-xl font-semibold mb-1">{todaysFocus.title}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {todaysFocus.subject} • {todaysFocus.chapter}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{todaysFocus.duration}</span>
                </div>
                <span className="text-primary/70">AI-selected</span>
              </div>

              <Button 
                className="h-10 px-6 rounded-lg gradient-primary hover:opacity-90 transition-opacity"
                onClick={() => handleStartTask(todaysFocus.route)}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Learning
              </Button>
            </CardContent>
          </Card>

          {/* Streak Card */}
          <Card className="border border-border bg-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xl font-semibold">{streakData.currentStreak} Days</p>
                  <p className="text-xs text-muted-foreground">Current Streak</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Grace Period</span>
                  <span className="font-medium">{streakData.graceUsed ? '0' : streakData.gracePeriodDays} day</span>
                </div>
                <Progress value={streakData.graceUsed ? 0 : 100} className="h-1.5" />
                <p className="text-[11px] text-muted-foreground">{streakData.message}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Zap className={`w-4 h-4 ${getReadinessColor(learningReadiness.level)}`} />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Energy</p>
                  <p className={`text-sm font-semibold ${getReadinessColor(learningReadiness.level)}`}>
                    {learningReadiness.level}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Target className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Exam In</p>
                  <p className="text-sm font-semibold text-amber-600">{examMode.daysUntilExam} Days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Done</p>
                  <p className="text-sm font-semibold text-emerald-600">2 Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="border border-border bg-card cursor-pointer hover:bg-muted/30 transition-colors" 
            onClick={() => setShowModeInfo(!showModeInfo)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <CalendarDays className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Mode</p>
                  <p className="text-sm font-semibold text-blue-600">Prep</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mode Info */}
        {showModeInfo && (
          <Card className="border border-amber-300 bg-amber-50/50">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 bg-amber-100 mb-2">
                  {examMode.mode}
                </Badge>
                <p className="text-sm text-muted-foreground">{examMode.modeDescription}</p>
              </div>
              <button 
                onClick={() => setShowModeInfo(false)} 
                className="text-muted-foreground hover:text-foreground text-lg"
              >
                ×
              </button>
            </CardContent>
          </Card>
        )}

        {/* Bottom Row: Timeline + Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Task Timeline */}
          <Card className="border border-border bg-card">
            <CardHeader className="pb-3 px-5 pt-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <button className="text-xs text-primary hover:underline flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-2">
              {taskTimeline.map((task) => (
                <div 
                  key={task.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <div>
                      <p className={`text-sm font-medium ${task.completed ? 'text-muted-foreground' : ''}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{task.date} • {task.duration}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-border">
                    {task.type}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Calendar + Secondary Task */}
          <div className="space-y-4">
            {/* Secondary Task */}
            {showSecondaryTask && (
              <Card 
                className="border border-dashed border-border bg-card hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => handleStartTask(secondaryTask.route)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                        <PenTool className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground">Optional follow-up</p>
                        <p className="text-sm font-medium">{secondaryTask.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{secondaryTask.duration}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Calendar */}
            <Card className="border border-border bg-card">
              <CardHeader className="pb-3 px-5 pt-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">This Week</CardTitle>
                  <span className="text-[11px] text-muted-foreground">AI-planned</span>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {calendarDays.map((day, index) => (
                    <div key={index} className="text-center">
                      <p className="text-[10px] text-muted-foreground mb-1">{day.label}</p>
                      <div className={`
                        w-9 h-9 rounded-lg flex items-center justify-center text-xs font-medium mx-auto border
                        ${day.type === 'study' ? 'bg-primary/5 text-primary border-primary/20' : ''}
                        ${day.type === 'revision' ? 'bg-amber-50 text-amber-600 border-amber-200' : ''}
                        ${day.type === 'exam' ? 'bg-red-50 text-red-600 border-red-300' : ''}
                        ${day.type === 'rest' ? 'bg-muted text-muted-foreground border-border' : ''}
                      `}>
                        {day.day}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded border border-primary/20 bg-primary/10" />
                    <span>Study</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded border border-amber-200 bg-amber-50" />
                    <span>Revision</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded border border-red-300 bg-red-50" />
                    <span>Exam</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded border border-border bg-muted" />
                    <span>Rest</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentPlanner;
