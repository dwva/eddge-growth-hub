import { useState } from 'react';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play,
  Clock,
  Target,
  Calendar,
  Zap,
  CheckCircle2,
  Circle,
  ChevronRight,
  Flame,
  BookOpen,
  PenTool,
  RotateCcw,
  Brain,
  CalendarDays,
  History
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for planner
const todaysFocus = {
  title: "Revise Algebra Basics",
  type: "Revision" as const,
  subject: "Mathematics",
  chapter: "Chapter 2",
  duration: "15 mins",
  progress: 0,
};

const secondaryTask = {
  title: "Quick Practice: Linear Equations",
  type: "Practice" as const,
  duration: "5 mins",
};

const examMode = {
  mode: "Preparation Mode" as const,
  daysUntilExam: 14,
  examName: "Mid-Term Mathematics",
};

const learningReadiness = {
  level: "High" as const,
  message: "You're energized and ready to learn!",
};

const taskHistory = [
  { id: 1, title: "Quadratic Equations - Concept", type: "Learn", completed: true, date: "Yesterday" },
  { id: 2, title: "Linear Equations Practice", type: "Practice", completed: true, date: "Yesterday" },
  { id: 3, title: "Algebra Basics Review", type: "Revision", completed: false, date: "2 days ago" },
];

const calendarDays = [
  { day: 27, type: "study", label: "M" },
  { day: 28, type: "revision", label: "T" },
  { day: 29, type: "study", label: "W" },
  { day: 30, type: "exam", label: "T" },
  { day: 31, type: "study", label: "F" },
  { day: 1, type: "rest", label: "S" },
  { day: 2, type: "study", label: "S" },
];

const getTaskTypeIcon = (type: string) => {
  switch (type) {
    case 'Learn': return <BookOpen className="w-4 h-4" />;
    case 'Practice': return <PenTool className="w-4 h-4" />;
    case 'Revision': return <RotateCcw className="w-4 h-4" />;
    default: return <BookOpen className="w-4 h-4" />;
  }
};

const getTaskTypeColor = (type: string) => {
  switch (type) {
    case 'Learn': return 'bg-blue-500/10 text-blue-600 border-blue-200';
    case 'Practice': return 'bg-amber-500/10 text-amber-600 border-amber-200';
    case 'Revision': return 'bg-primary/10 text-primary border-primary/20';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getReadinessColor = (level: string) => {
  switch (level) {
    case 'High': return 'text-primary';
    case 'Medium': return 'text-amber-500';
    case 'Low': return 'text-red-500';
    default: return 'text-muted-foreground';
  }
};

const StudentPlanner = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Student';
  const [showSecondaryTask] = useState(true);

  return (
    <StudentDashboardLayout title="Planner">
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Learning Readiness Indicator */}
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
              <p className="text-sm text-muted-foreground hidden sm:block">
                {learningReadiness.message}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Exam Mode Controller */}
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Target className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300 mb-1">
                    {examMode.mode}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{examMode.examName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-amber-600">{examMode.daysUntilExam}</p>
                <p className="text-xs text-muted-foreground">days left</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TODAY'S FOCUS - Primary Feature */}
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
            </div>

            <Button className="w-full h-12 text-lg gradient-primary hover:opacity-90 transition-opacity">
              <Play className="w-5 h-5 mr-2" />
              Start Learning
            </Button>
          </CardContent>
        </Card>

        {/* Secondary Task (Optional) */}
        {showSecondaryTask && (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <PenTool className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Optional follow-up</p>
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

        {/* Context Calendar (Read-Only) */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Learning Calendar</CardTitle>
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

        {/* Planner History (Read-Only) */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {taskHistory.map((task) => (
              <div 
                key={task.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className={task.completed ? 'text-muted-foreground' : 'font-medium'}>
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{task.date}</p>
                  </div>
                </div>
                <Badge variant="outline" className={getTaskTypeColor(task.type)}>
                  {task.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Streak & Mercy System */}
        <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-lg">7 Day Streak! 🔥</p>
                  <p className="text-sm text-muted-foreground">
                    Keep it going! You have a 1-day grace period.
                  </p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground">Streak Safe</p>
                <Progress value={100} className="w-20 h-2 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentPlanner;
