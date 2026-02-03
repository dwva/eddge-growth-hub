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

const plannerHistory = {
  yesterdayTask: { title: "Linear Equations Practice", completed: true },
  lastCompleted: { title: "Quadratic Equations - Concept", date: "Today, 10:30 AM" },
  missedTask: { title: "Algebra Basics Review", daysAgo: 2 }
};

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

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => setIsRegenerating(false), 1500);
  };

  const handleStartTask = (route: string) => {
    navigate(route);
  };

  return (
    <StudentDashboardLayout title="Planner">
      <div className="space-y-6">
        {/* Top Row: Today's Focus + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Focus - Takes 2 columns */}
          <Card className="lg:col-span-2 border-0 shadow-sm bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary">Today's Focus</span>
                </div>
                <Badge className={getTaskTypeColor(todaysFocus.type)}>
                  {getTaskTypeIcon(todaysFocus.type)}
                  <span className="ml-1">{todaysFocus.type}</span>
                </Badge>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">{todaysFocus.title}</h2>
              <p className="text-muted-foreground mb-4">
                {todaysFocus.subject} • {todaysFocus.chapter}
              </p>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{todaysFocus.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-primary">AI-selected for you</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  className="flex-1 h-12 rounded-full gradient-primary hover:opacity-90 transition-opacity text-base"
                  onClick={() => handleStartTask(todaysFocus.route)}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Learning
                </Button>
                <Button variant="outline" className="h-12 px-6 rounded-full">
                  Top Sellers
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{streakData.currentStreak} Days</p>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Grace Period</span>
                  <span className="font-medium">{streakData.graceUsed ? '0' : streakData.gracePeriodDays} day</span>
                </div>
                <Progress value={streakData.graceUsed ? 0 : 100} className="h-2" />
                <p className="text-xs text-muted-foreground">{streakData.message}</p>
              </div>
              
              <button className="flex items-center gap-1 text-sm text-primary font-medium mt-4 hover:underline">
                View history <ArrowRight className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Second Row: Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Energy Level */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className={`w-5 h-5 ${getReadinessColor(learningReadiness.level)}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Energy</p>
                  <p className={`font-semibold ${getReadinessColor(learningReadiness.level)}`}>
                    {learningReadiness.level}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exam Countdown */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Target className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Exam In</p>
                  <p className="font-semibold text-amber-600">{examMode.daysUntilExam} Days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Completed */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="font-semibold text-green-600">2 Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mode */}
          <Card className="border-0 shadow-sm cursor-pointer" onClick={() => setShowModeInfo(!showModeInfo)}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Mode</p>
                  <p className="font-semibold text-blue-600 text-sm">Prep</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mode Info Tooltip */}
        {showModeInfo && (
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="outline" className={getExamModeColor(examMode.mode)}>
                    {examMode.mode}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">{examMode.modeDescription}</p>
                </div>
                <button onClick={() => setShowModeInfo(false)} className="text-muted-foreground hover:text-foreground">
                  ✕
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Third Row: Timeline + Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Timeline */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </div>
                <button className="text-sm text-primary hover:underline flex items-center gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {taskTimeline.map((task) => (
                <div 
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <div>
                      <p className={`font-medium text-sm ${!task.completed ? '' : 'text-muted-foreground'}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{task.date} • {task.duration}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`${getTaskTypeColor(task.type)} text-xs`}>
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
              <Card className="border-0 shadow-sm border-dashed hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => handleStartTask(secondaryTask.route)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                        <PenTool className="w-5 h-5 text-amber-600" />
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

            {/* Calendar */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-primary" />
                    <CardTitle className="text-base">This Week</CardTitle>
                  </div>
                  <span className="text-xs text-muted-foreground">AI-planned</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {calendarDays.map((day, index) => (
                    <div key={index} className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">{day.label}</p>
                      <div className={`
                        w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium mx-auto
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
          </div>
        </div>

        {/* Regenerate Button */}
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

        {/* Footer Note */}
        <div className="text-center text-xs text-muted-foreground py-2">
          <Sparkles className="w-3 h-3 inline-block mr-1" />
          Plan adapts based on your progress • No stacking of missed tasks
        </div>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentPlanner;
