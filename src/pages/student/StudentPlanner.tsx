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
  History,
  RefreshCw,
  ArrowRight,
  Sparkles
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

// Mock data for planner - Feature 1: Today's Focus
const todaysFocus = {
  title: "Revise Algebra Basics",
  type: "Revision" as TaskType,
  subject: "Mathematics",
  chapter: "Chapter 2: Linear Equations",
  duration: "15 mins",
  progress: 0,
  route: "/student/learning"
};

// Feature 2: Secondary Task (Optional)
const secondaryTask = {
  title: "Quick Practice: Linear Equations",
  type: "Practice" as TaskType,
  duration: "5 mins",
  route: "/student/practice"
};

// Feature 4: Exam Mode Controller
const examMode = {
  mode: "Preparation Mode" as ExamMode,
  daysUntilExam: 14,
  examName: "Mid-Term Mathematics",
  modeDescription: "Focus shifts to revision and practice. New concepts are paused."
};

// Feature 7: Learning Readiness Indicator
const learningReadiness = {
  level: "High" as ReadinessLevel,
  message: "You're energized and ready to learn!",
  taskAdjustment: "Full-length tasks enabled"
};

// Feature 9: Task Timeline (System-generated history)
const taskTimeline: Task[] = [
  { id: 1, title: "Quadratic Equations - Concept", type: "Learn", subject: "Mathematics", duration: "20 mins", completed: true, date: "Today, 10:30 AM" },
  { id: 2, title: "Linear Equations Practice", type: "Practice", subject: "Mathematics", duration: "15 mins", completed: true, date: "Yesterday" },
  { id: 3, title: "Algebra Basics Review", type: "Revision", subject: "Mathematics", duration: "10 mins", completed: false, date: "2 days ago" },
  { id: 4, title: "Polynomials Introduction", type: "Learn", subject: "Mathematics", duration: "25 mins", completed: true, date: "3 days ago" },
];

// Feature 10: Planner History
const plannerHistory = {
  yesterdayTask: { title: "Linear Equations Practice", completed: true },
  lastCompleted: { title: "Quadratic Equations - Concept", date: "Today, 10:30 AM" },
  missedTask: { title: "Algebra Basics Review", daysAgo: 2 }
};

// Feature 8: Context Calendar (Read-Only)
const calendarDays: CalendarDay[] = [
  { day: 27, type: "study", label: "M" },
  { day: 28, type: "revision", label: "T" },
  { day: 29, type: "study", label: "W" },
  { day: 30, type: "exam", label: "T" },
  { day: 31, type: "study", label: "F" },
  { day: 1, type: "rest", label: "S" },
  { day: 2, type: "study", label: "S" },
];

// Feature 6: Mercy & Recovery System
const streakData = {
  currentStreak: 7,
  graceUsed: false,
  gracePeriodDays: 1,
  message: "Keep it going! You have a 1-day grace period."
};

// Helper functions
const getTaskTypeIcon = (type: TaskType) => {
  switch (type) {
    case 'Learn': return <BookOpen className="w-4 h-4" />;
    case 'Practice': return <PenTool className="w-4 h-4" />;
    case 'Revision': return <RotateCcw className="w-4 h-4" />;
  }
};

const getTaskTypeColor = (type: TaskType) => {
  switch (type) {
    case 'Learn': return 'bg-blue-500/10 text-blue-600 border-blue-200';
    case 'Practice': return 'bg-amber-500/10 text-amber-600 border-amber-200';
    case 'Revision': return 'bg-primary/10 text-primary border-primary/20';
  }
};

const getReadinessColor = (level: ReadinessLevel) => {
  switch (level) {
    case 'High': return 'text-primary';
    case 'Medium': return 'text-amber-500';
    case 'Low': return 'text-red-500';
  }
};

const getExamModeColor = (mode: ExamMode) => {
  switch (mode) {
    case 'Learning Mode': return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'Preparation Mode': return 'bg-amber-100 text-amber-700 border-amber-300';
    case 'Exam Mode': return 'bg-red-100 text-red-700 border-red-300';
  }
};

const StudentPlanner = () => {
  const navigate = useNavigate();
  const [showSecondaryTask] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showModeInfo, setShowModeInfo] = useState(false);

  // Feature 3: Silent Auto-Planning - Regenerate handler
  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => setIsRegenerating(false), 1500);
  };

  // Feature 11: Direct Routing to Learn Engine
  const handleStartTask = (route: string) => {
    navigate(route);
  };

  return (
    <StudentDashboardLayout title="Planner">
      <div className="space-y-6 max-w-4xl mx-auto">
        
        {/* Feature 7: Learning Readiness Indicator */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Zap className={`w-5 h-5 ${getReadinessColor(learningReadiness.level)}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Energy</p>
                  <p className={`font-semibold ${getReadinessColor(learningReadiness.level)}`}>
                    {learningReadiness.level} Readiness
                  </p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-sm text-muted-foreground">{learningReadiness.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{learningReadiness.taskAdjustment}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature 4: Exam Mode Controller */}
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Target className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <Badge variant="outline" className={getExamModeColor(examMode.mode)}>
                    {examMode.mode}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">{examMode.examName}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowModeInfo(!showModeInfo)}
                  className="text-xs text-amber-600 hover:underline"
                >
                  What changes now?
                </button>
                <div className="text-right">
                  <p className="text-2xl font-bold text-amber-600">{examMode.daysUntilExam}</p>
                  <p className="text-xs text-muted-foreground">days left</p>
                </div>
              </div>
            </div>
            {showModeInfo && (
              <div className="mt-3 pt-3 border-t border-amber-200">
                <p className="text-sm text-amber-700">{examMode.modeDescription}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feature 1: TODAY'S FOCUS - Primary Feature */}
        <Card className="border-2 border-primary shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Today's Focus</CardTitle>
              </div>
              <Badge className={getTaskTypeColor(todaysFocus.type)}>
                {getTaskTypeIcon(todaysFocus.type)}
                <span className="ml-1">{todaysFocus.type}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-bold mb-1">{todaysFocus.title}</h3>
              <p className="text-sm text-muted-foreground">
                {todaysFocus.subject} • {todaysFocus.chapter}
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{todaysFocus.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-primary">AI-selected for you</span>
              </div>
            </div>

            {/* Feature 11: Direct Routing - Start Button */}
            <Button 
              className="w-full h-12 text-lg gradient-primary hover:opacity-90 transition-opacity"
              onClick={() => handleStartTask(todaysFocus.route)}
            >
              <Play className="w-5 h-5 mr-2" />
              Start Learning
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Feature 2: Secondary Task (Optional) */}
        {showSecondaryTask && (
          <Card className="bg-muted/30 border-dashed hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => handleStartTask(secondaryTask.route)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <PenTool className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Optional follow-up</p>
                    <p className="font-medium">{secondaryTask.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{secondaryTask.duration}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feature 3: Silent Auto-Planning - Regenerate Option */}
        <div className="flex justify-center">
          <button 
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? 'Regenerating...' : 'Regenerate today\'s plan'}
          </button>
        </div>

        {/* Feature 10: Planner History */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Your Journey</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Yesterday's Task */}
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                  <p className="font-medium">{plannerHistory.yesterdayTask.title}</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Completed
              </Badge>
            </div>
            
            {/* Last Completed */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Last completed</p>
                  <p className="font-medium">{plannerHistory.lastCompleted.title}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{plannerHistory.lastCompleted.date}</span>
            </div>

            {/* Missed Task (shown softly) */}
            {plannerHistory.missedTask && (
              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg opacity-70">
                <div className="flex items-center gap-3">
                  <Circle className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Ready when you are</p>
                    <p className="text-muted-foreground">{plannerHistory.missedTask.title}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{plannerHistory.missedTask.daysAgo} days ago</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feature 9: Task Timeline */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Task Timeline</CardTitle>
              </div>
              <span className="text-xs text-muted-foreground">System-generated</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {taskTimeline.map((task) => (
              <div 
                key={task.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className={`font-medium truncate ${!task.completed ? '' : 'text-muted-foreground'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{task.subject}</span>
                      <span>•</span>
                      <span>{task.duration}</span>
                      <span>•</span>
                      <span>{task.date}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className={`${getTaskTypeColor(task.type)} flex-shrink-0`}>
                  {getTaskTypeIcon(task.type)}
                  <span className="ml-1 hidden sm:inline">{task.type}</span>
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Feature 8: Context Calendar (Read-Only) */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Learning Calendar</CardTitle>
              </div>
              <span className="text-xs text-muted-foreground">Read-only • AI-planned</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {calendarDays.map((day, index) => (
                <div key={index} className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">{day.label}</p>
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium mx-auto
                    ${day.type === 'study' ? 'bg-primary/10 text-primary' : ''}
                    ${day.type === 'revision' ? 'bg-amber-100 text-amber-600' : ''}
                    ${day.type === 'exam' ? 'bg-red-100 text-red-600 ring-2 ring-red-200' : ''}
                    ${day.type === 'rest' ? 'bg-muted text-muted-foreground' : ''}
                  `}>
                    {day.day}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-primary/20" />
                <span>Study</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-amber-100" />
                <span>Revision</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-red-100" />
                <span>Exam</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-muted" />
                <span>Rest</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature 6: Streak & Mercy System */}
        <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-lg">{streakData.currentStreak} Day Streak! 🔥</p>
                  <p className="text-sm text-muted-foreground">
                    {streakData.message}
                  </p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground">Grace Period</p>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={streakData.graceUsed ? 0 : 100} className="w-20 h-2" />
                  <span className="text-xs text-muted-foreground">
                    {streakData.graceUsed ? '0' : streakData.gracePeriodDays}/{streakData.gracePeriodDays}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature 5: Daily Adaptation Note (Subtle) */}
        <div className="text-center text-xs text-muted-foreground py-2">
          <Sparkles className="w-3 h-3 inline-block mr-1" />
          Plan adapts based on your progress • No stacking of missed tasks
        </div>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentPlanner;
