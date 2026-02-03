import { useState } from 'react';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  ListTodo,
  Sparkles,
  Target,
  Zap,
  TrendingUp,
  CalendarDays,
  AlertCircle,
  Filter,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Grid3X3,
  List,
  Clock,
  CheckCircle2,
  Brain,
  Swords,
  RotateCcw,
  FlaskConical,
  Wrench,
  Play,
  Bot,
  Pencil,
} from 'lucide-react';
import { format, addMonths, subMonths, isSameDay } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/contexts/AuthContext';
import type { DayContentProps } from 'react-day-picker';

type TaskIntent = 'learn' | 'practice' | 'revision' | 'test' | 'fixWeakArea';
type TaskOrigin = 'ai' | 'user';
type CognitiveLoad = 'low' | 'balanced' | 'high';

const intentConfig: Record<TaskIntent, { label: string; short: string; icon: React.ReactNode; pillClass: string }> = {
  learn: { label: 'Learn', short: 'L', icon: <Brain className="w-3 h-3" />, pillClass: 'bg-blue-100 text-blue-700 border-blue-200' },
  practice: { label: 'Practice', short: 'P', icon: <Swords className="w-3 h-3" />, pillClass: 'bg-amber-100 text-amber-700 border-amber-200' },
  revision: { label: 'Revise', short: 'R', icon: <RotateCcw className="w-3 h-3" />, pillClass: 'bg-green-100 text-green-700 border-green-200' },
  test: { label: 'Test', short: 'T', icon: <FlaskConical className="w-3 h-3" />, pillClass: 'bg-purple-100 text-purple-700 border-purple-200' },
  fixWeakArea: { label: 'Fix Weak Area', short: 'W', icon: <Wrench className="w-3 h-3" />, pillClass: 'bg-red-100 text-red-700 border-red-200' },
};

type Priority = 'high' | 'medium' | 'low';
const priorityColors: Record<Priority, string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};
const priorityBarColors: Record<Priority, string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

// Stub data (UI only – no backend)
const stubTasks = [
  { id: '1', name: 'Quadratic Equations practice', subject: 'Mathematics', type: 'Practice', duration: '30 min', priority: 'high' as Priority, completed: false, aiRecommended: true, intent: 'practice' as TaskIntent, reason: 'Weak area identified', origin: 'ai' as TaskOrigin },
  { id: '2', name: 'Laws of Motion revision', subject: 'Science', type: 'Revision', duration: '15 min', priority: 'medium' as Priority, completed: true, aiRecommended: false, intent: 'revision' as TaskIntent, reason: 'Upcoming exam topic', origin: 'user' as TaskOrigin },
  { id: '3', name: 'Algebra basics', subject: 'Mathematics', type: 'Learn', duration: '25 min', priority: 'high' as Priority, completed: false, aiRecommended: true, intent: 'learn' as TaskIntent, reason: 'New topic this week', origin: 'ai' as TaskOrigin },
];
const stubNextBestAction = { title: 'Continue Quadratic Equations practice (30 min)', hint: 'You already learned the concept yesterday' };
const stubCognitiveLoad: CognitiveLoad = 'balanced';
const stubLearningBlocksToday = { completed: 2, total: 3 };
const stubStreakDays = 7;
const stubDeadlines = [
  { date: 'Feb 15', month: 'Feb', day: '15', name: 'Math assignment', subject: 'Mathematics', priority: 'high' as Priority },
  { date: 'Feb 20', month: 'Feb', day: '20', name: 'Science project', subject: 'Science', priority: 'medium' as Priority },
];
const stubWeakAreas = ['Quadratic Equations', 'Laws of Motion'];
const stubExam = { name: 'Annual Exam', date: 'Mar 15, 2026', daysLeft: 40 };
const stubSuggestions = [
  { id: 's1', name: 'Algebra drill', subject: 'Mathematics', duration: '20 min', priority: 'high' as Priority, why: 'Weak area practice' },
];

// Calendar events (stub) – empty array = empty state; with items = events on calendar
// Softer saturation for study planner: readable, calm (red / amber / green)
const calendarEventColors: Record<Priority, string> = {
  high: '#c2410c',   // softer red (orange-700)
  medium: '#a16207', // softer amber
  low: '#15803d',    // softer green (green-700)
};
const subjectAccent: Record<string, string> = { Mathematics: '#6366f1', Physics: '#0ea5e9', Chemistry: '#10b981', Science: '#f59e0b' };
const stubCalendarEvents = [
  { id: 'e1', title: 'Algebra – Linear Eq', date: new Date(2026, 1, 3), priority: 'high' as Priority, subject: 'Mathematics', type: 'Practice', duration: '30 min', durationShort: '30m', intent: 'learn' as TaskIntent, status: 'pending' as const, allocatedDate: new Date(2026, 1, 3), startTime: '09:00', endTime: '09:30', resources: [{ label: 'Calculator', status: 'required' as const }], aiInsight: 'Focus on quadratic formula today.', performanceScore: 85 },
  { id: 'e2', title: 'Mechanics – numerical', date: new Date(2026, 1, 3), priority: 'medium' as Priority, subject: 'Physics', type: 'Practice', duration: '45 min', durationShort: '45m', intent: 'practice' as TaskIntent, status: 'pending' as const, resources: [{ label: 'Quiet room', status: 'recommended' as const }] },
  { id: 'e3', title: 'Organic chemistry', date: new Date(2026, 1, 3), priority: 'low' as Priority, subject: 'Chemistry', type: 'Revision', duration: '20 min', durationShort: '20m', intent: 'revision' as TaskIntent, status: 'pending' as const },
];

type CalendarViewValue = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
type ViewToggleType = 'grid' | 'list';

type TaskDetail = {
  id: string;
  name: string;
  subject: string;
  type: string;
  priority: Priority;
  duration: string;
  due: string;
  status: 'pending' | 'completed';
  allocatedDate?: Date;
  startTime?: string;
  endTime?: string;
  resources?: { label: string; status: 'required' | 'recommended' }[];
  aiInsight?: string;
  performanceScore?: number;
};

const StudentPlanner = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [calendarDate, setCalendarDate] = useState<Date>(() => new Date(2026, 1, 1));
  const [calendarView, setCalendarView] = useState<CalendarViewValue>('dayGridMonth');
  const [viewToggle, setViewToggle] = useState<ViewToggleType>('grid');
  const [selectedEvent, setSelectedEvent] = useState<TaskDetail | null>(null);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [examState, setExamState] = useState<'loading' | 'error' | 'success' | 'none'>('success');
  const [hasSuggestions] = useState(true);

  const goToPrevMonth = () => setCalendarDate((d) => subMonths(d, 1));
  const goToNextMonth = () => setCalendarDate((d) => addMonths(d, 1));
  const goToToday = () => setCalendarDate(new Date());

  const getEventsForDay = (date: Date) =>
    stubCalendarEvents.filter((e) => isSameDay(e.date, date));

  const CalendarDayContent = (props: DayContentProps) => {
    const { date, activeModifiers } = props;
    const events = getEventsForDay(date).slice(0, 3);
    const durationShort = (d: string) => (d.replace(/\s*min\s*/i, 'm').replace(/\s*minute(s)?\s*/i, 'm') || d);
    const isToday = isSameDay(date, new Date());
    const isSelected = activeModifiers?.selected;
    return (
      <div className="flex h-full min-h-[5rem] w-full flex-col p-2 text-left">
        <div className="mb-1.5 flex items-center justify-between">
          <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold tabular-nums ${isSelected ? 'bg-white/20 text-white' : 'text-foreground'}`}>
            {date.getDate()}
          </span>
          {isToday && !isSelected && (
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" title="Today" />
          )}
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-hidden">
          {events.map((ev) => {
            const dur = (ev as { durationShort?: string }).durationShort ?? durationShort(ev.duration);
            const accent = subjectAccent[ev.subject] ?? calendarEventColors[ev.priority];
            return (
              <button
                key={ev.id}
                type="button"
                className={`group flex h-8 min-h-8 w-full cursor-pointer items-center gap-2 rounded-lg border-0 px-2.5 py-1.5 text-left text-xs transition-all hover:shadow-sm ${
                  isSelected ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-50/90 hover:bg-gray-100'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEvent({
                    id: ev.id,
                    name: ev.title,
                    subject: ev.subject,
                    type: ev.type,
                    priority: ev.priority,
                    duration: ev.duration,
                    due: format(ev.date, 'MMM d, yyyy'),
                    status: ev.status,
                    allocatedDate: ev.allocatedDate,
                    startTime: ev.startTime,
                    endTime: ev.endTime,
                    resources: ev.resources,
                    aiInsight: ev.aiInsight,
                    performanceScore: ev.performanceScore,
                  });
                }}
              >
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.9)' : accent }} />
                <span className={`min-w-0 flex-1 truncate font-medium ${isSelected ? 'text-white' : 'text-foreground'}`}>{ev.title}</span>
                <span className={`shrink-0 text-[10px] font-medium ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>{dur}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <StudentDashboardLayout>
      <div className="space-y-6">
        {/* Page-level load error */}
        {loadError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-800">Failed to load tasks</p>
                <p className="text-sm text-red-600">{loadError}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-100" onClick={() => setLoadError(null)}>
              Retry
            </Button>
          </div>
        )}

        {/* Initial load skeleton */}
        {loading ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <Skeleton className="h-10 w-[400px]" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-6 lg:col-span-2">
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="h-48 w-full rounded-2xl" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-40 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Page header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Study Planner</h1>
                <p className="text-sm text-gray-500">Your personalized path to success</p>
              </div>
            </div>

            {/* Tab bar */}
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="max-w-[400px] w-full bg-white border border-gray-200 shadow-sm rounded-xl p-1 h-auto">
                <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg px-4 py-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="calendar" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg px-4 py-2">
                  <CalendarIcon className="w-4 h-4" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="tasks" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg px-4 py-2">
                  <ListTodo className="w-4 h-4" />
                  Tasks
                </TabsTrigger>
              </TabsList>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mt-6">
                {/* Main content ~3/4 */}
                <div className="space-y-6 min-w-0">
                  <TabsContent value="dashboard" className="mt-0 space-y-6">
                    {/* Learning signals: 3 cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Card className="border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl overflow-hidden">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Target className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-gray-900">{stubLearningBlocksToday.completed} / {stubLearningBlocksToday.total}</p>
                                <p className="text-xs text-gray-500">Learning blocks completed today</p>
                              </div>
                            </div>
                            <Badge className="rounded-full bg-blue-100 text-blue-700 border-0">
                              {Math.round((stubLearningBlocksToday.completed / stubLearningBlocksToday.total) * 100)}%
                            </Badge>
                          </div>
                          <Progress value={(stubLearningBlocksToday.completed / stubLearningBlocksToday.total) * 100} className="h-1.5 mt-3 bg-blue-200 [&>div]:bg-blue-500" />
                        </CardContent>
                      </Card>
                      <Card className="border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl overflow-hidden">
                        <CardContent className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                              <Zap className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-gray-900">{stubStreakDays}</p>
                              <p className="text-xs text-gray-500">Days studied without breaking flow</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl overflow-hidden">
                        <CardContent className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                              <Brain className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-lg font-bold text-gray-900 capitalize">{stubCognitiveLoad}</p>
                              <p className="text-xs text-gray-500">Cognitive load indicator</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Next Best Action (AI Suggested) */}
                    <Card className="border border-purple-200 bg-gradient-to-br from-purple-50/80 to-indigo-50/80 rounded-2xl overflow-hidden shadow-sm">
                      <CardContent className="p-5">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                          <Brain className="w-4 h-4 text-purple-600" />
                          Next Best Action (AI Suggested)
                        </h3>
                        <p className="text-base font-medium text-gray-900 mt-2">{stubNextBestAction.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{stubNextBestAction.hint}</p>
                        <Button className="mt-4 gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg">
                          <Play className="w-4 h-4" />
                          Start Now
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Today's Schedule */}
                    <Card className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-5 h-5 text-gray-700" />
                            <h3 className="text-base font-semibold text-gray-900">Today's Schedule</h3>
                          </div>
                          <Button variant="outline" size="sm" className="rounded-lg">View Full Calendar</Button>
                        </div>
                        {stubTasks.length === 0 ? (
                          <div className="py-10 text-center">
                            <p className="font-medium text-gray-700">No tasks scheduled for today.</p>
                            <button className="text-sm text-primary hover:underline mt-1">Add a task</button>
                          </div>
                        ) : (
                          <ul className="space-y-0 divide-y divide-gray-100">
                            {stubTasks.map((task) => {
                              const config = intentConfig[task.intent];
                              return (
                                <li key={task.id} className="flex items-center gap-4 py-3 group">
                                  <div className={`w-1.5 h-12 rounded-full flex-shrink-0 ${priorityBarColors[task.priority]}`} />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${config.pillClass}`}>
                                        {config.icon}
                                        {config.label}
                                      </span>
                                    </div>
                                    <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>{task.name}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Why: {task.reason}</p>
                                    <p className="text-xs text-gray-500">{task.subject} · {task.duration}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {task.completed ? (
                                      <Badge className="bg-green-100 text-green-700 border-0">Completed</Badge>
                                    ) : (
                                      <>
                                        <span className="text-xs text-gray-500">{task.duration}</span>
                                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">Start</Button>
                                      </>
                                    )}
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </CardContent>
                    </Card>

                    {/* Bottom row: Upcoming Deadlines + Focus Areas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                        <CardContent className="p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="w-5 h-5 text-orange-700" />
                            <h3 className="text-base font-semibold text-orange-700">Upcoming Deadlines</h3>
                          </div>
                          <ul className="space-y-3">
                            {stubDeadlines.map((d, i) => (
                              <li key={i} className="flex items-center gap-3">
                                <div className="w-12 h-10 rounded-lg bg-orange-50 flex flex-col items-center justify-center text-orange-700 text-xs font-medium flex-shrink-0">
                                  <span>{d.month}</span>
                                  <span className="font-bold">{d.day}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900">{d.name}</p>
                                  <p className="text-xs text-gray-500">{d.subject}</p>
                                </div>
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityColors[d.priority]}`} />
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      <Card className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                        <CardContent className="p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <Target className="w-5 h-5 text-red-700" />
                            <h3 className="text-base font-semibold text-red-700">Focus Areas</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">Based on your recent performance, we recommend focusing on these topics.</p>
                          {stubWeakAreas.length > 0 ? (
                            <>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {stubWeakAreas.map((area, i) => (
                                  <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">{area}</span>
                                ))}
                              </div>
                              <Button variant="outline" size="sm" className="text-red-700 border-red-200 hover:bg-red-50">Generate Practice Set</Button>
                            </>
                          ) : (
                            <p className="text-sm text-gray-500">No weak areas identified yet.</p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="calendar" className="mt-0">
                    <div className="flex flex-col gap-5 w-full min-h-[620px]">
                      {/* Toolbar – minimal, clean */}
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5 rounded-full bg-gray-100 p-0.5">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={goToPrevMonth} aria-label="Previous month">
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 rounded-full px-3 text-sm font-medium" onClick={goToToday}>
                              Today
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={goToNextMonth} aria-label="Next month">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                          <h2 className="ml-2 text-xl font-semibold tracking-tight text-foreground">
                            {format(calendarDate, 'MMMM yyyy')}
                          </h2>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select value={calendarView} onValueChange={(v) => setCalendarView(v as CalendarViewValue)}>
                            <SelectTrigger className="h-9 w-[130px] rounded-lg border-gray-200 bg-gray-50/80">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dayGridMonth">Monthly</SelectItem>
                              <SelectItem value="timeGridWeek">Weekly</SelectItem>
                              <SelectItem value="timeGridDay">Daily</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex rounded-lg border border-gray-200 bg-gray-50/80 p-0.5">
                            <Button
                              variant={viewToggle === 'grid' ? 'secondary' : 'ghost'}
                              size="icon"
                              className="h-8 w-8 rounded-md"
                              onClick={() => setViewToggle('grid')}
                              aria-label="Monthly view"
                            >
                              <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={viewToggle === 'list' ? 'secondary' : 'ghost'}
                              size="icon"
                              className="h-8 w-8 rounded-md"
                              onClick={() => setViewToggle('list')}
                              aria-label="Weekly view"
                            >
                              <List className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Calendar – clean card, minimal grid */}
                      <Card className="relative flex-1 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm min-h-[540px]">
                        {stubCalendarEvents.length === 0 && (
                          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-2xl bg-white/95 p-12 backdrop-blur-[2px]">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
                              <CalendarIcon className="h-10 w-10 text-gray-400" />
                            </div>
                            <div className="space-y-1 text-center">
                              <p className="text-lg font-semibold text-foreground">No tasks scheduled</p>
                              <p className="max-w-sm text-sm text-muted-foreground">No tasks in this date range. Add a task from the Tasks tab to see it here.</p>
                            </div>
                          </div>
                        )}
                        <div className="relative p-4 sm:p-5">
                          <CalendarComponent
                            mode="single"
                            month={calendarDate}
                            onMonthChange={(date) => date && setCalendarDate(date)}
                            selected={calendarDate}
                            onSelect={(date) => date && setCalendarDate(date)}
                            className="w-full rounded-xl [&_.rdp-month]:w-full"
                            classNames={{
                              caption: 'hidden',
                              nav: 'hidden',
                              months: 'w-full',
                              month: 'w-full',
                              table: 'w-full',
                              head_row: 'flex w-full',
                              head_cell: 'flex-1 min-w-0 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground',
                              row: 'flex w-full border-b border-gray-100 last:border-b-0',
                              cell: 'flex-1 min-w-0 min-h-[5rem] border-r border-gray-100 last:border-r-0 p-0 align-top [&:has([aria-selected])]:bg-violet-50/50 focus-within:relative focus-within:z-10',
                              day: 'h-full min-h-[5rem] w-full flex flex-col overflow-hidden p-0 font-normal rounded-none text-left',
                              day_today: 'bg-violet-50/70 text-foreground',
                              day_selected: 'bg-violet-500 text-white hover:bg-violet-600 focus:bg-violet-600 [&_.text-foreground]:!text-white [&_.text-muted-foreground]:!text-white/80',
                              day_outside: 'text-muted-foreground/60',
                            }}
                            components={{
                              Caption: () => null,
                              DayContent: CalendarDayContent,
                            }}
                          />
                        </div>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="tasks" className="mt-0">
                    <Card className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                      <CardContent className="p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                          <Select defaultValue="all">
                            <SelectTrigger className="w-[150px] gap-2">
                              <Filter className="w-4 h-4" />
                              <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button onClick={() => setAddTaskOpen(true)} className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Task
                          </Button>
                        </div>
                        {stubTasks.length === 0 ? (
                          <div className="py-12 text-center text-gray-500">
                            <p className="font-medium text-gray-600">No tasks found matching your filter.</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {(['learn', 'practice', 'revision', 'test', 'fixWeakArea'] as TaskIntent[]).map((intent) => {
                              const tasksInSection = stubTasks.filter((t) => t.intent === intent);
                              if (tasksInSection.length === 0) return null;
                              const config = intentConfig[intent];
                              const sectionTitle = config.label + ' Tasks';
                              return (
                                <Collapsible key={intent} defaultOpen className="group">
                                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-100">
                                    <span className="flex items-center gap-2">
                                      {config.icon}
                                      {sectionTitle}
                                    </span>
                                    <ChevronDown className="w-4 h-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <ul className="mt-2 space-y-2 pl-1">
                                      {tasksInSection.map((task) => (
                                        <li key={task.id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 group">
                                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                                            {task.completed && <span className="text-green-600 text-xs">✓</span>}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                                              <span className="text-[10px] text-muted-foreground">
                                                {task.origin === 'ai' ? (
                                                  <span className="inline-flex items-center gap-0.5"><Bot className="w-3 h-3" /> AI Suggested</span>
                                                ) : (
                                                  <span className="inline-flex items-center gap-0.5"><Pencil className="w-3 h-3" /> Added by You</span>
                                                )}
                                              </span>
                                            </div>
                                            <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>{task.name}</p>
                                            <div className="flex flex-wrap gap-1.5 mt-1">
                                              <Badge variant="secondary" className="text-xs rounded-md">{task.subject}</Badge>
                                              <Badge variant="outline" className="text-xs rounded-md">{task.type}</Badge>
                                              <span className="text-xs text-gray-500">{task.duration}</span>
                                            </div>
                                          </div>
                                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityColors[task.priority]}`} />
                                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-destructive opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></Button>
                                        </li>
                                      ))}
                                    </ul>
                                  </CollapsibleContent>
                                </Collapsible>
                              );
                            })}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>

                {/* Right sidebar ~1/4 */}
                <div className="space-y-4 lg:max-w-[320px]">
                  {/* AI Study Planner card – intelligence cues */}
                  <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                          <Brain className="w-5 h-5 text-yellow-300" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">AI Study Planner</h3>
                          <p className="text-xs text-white/90">Personalized for {user?.name?.split(' ')[0] || 'You'}</p>
                        </div>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3">
                          <p className="font-semibold text-white mb-1">Today&apos;s Risk</p>
                          <p className="text-white/90 text-xs">Skipping today may affect Algebra accuracy.</p>
                        </div>
                        <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3">
                          <p className="font-semibold text-white mb-2">Weak Areas Detected</p>
                          <ul className="space-y-1">
                            {stubWeakAreas.map((area, i) => (
                              <li key={i} className="text-xs text-white/90 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                                {area}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <Button className="w-full mt-4 bg-white text-indigo-600 hover:bg-white/90 font-semibold rounded-xl gap-2">
                        <Sparkles className="w-4 h-4" />
                        Auto-Generate Today&apos;s Plan
                      </Button>
                      {hasSuggestions && (
                        <div className="mt-4 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold">New Suggestions</span>
                            <Badge className="bg-white/20 text-white border-0 rounded-full">{stubSuggestions.length} New</Badge>
                          </div>
                          <ul className="space-y-2">
                            {stubSuggestions.map((s) => (
                              <li key={s.id} className="p-2 rounded-lg bg-white/5">
                                <p className="text-sm font-medium">{s.name}</p>
                                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                  <Badge variant="secondary" className="text-[10px] rounded bg-white/20 text-white border-0">{s.subject}</Badge>
                                  <span className="text-xs text-white/80">{s.duration}</span>
                                </div>
                                {s.why && <p className="text-xs text-white/70 mt-1">Why: {s.why}</p>}
                                <Button size="sm" className="mt-2 h-7 text-indigo-600 bg-white hover:bg-white/90 rounded-lg text-xs">Add to Schedule</Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Exam Countdown card */}
                  {examState === 'loading' && (
                    <Card className="border border-gray-200 rounded-2xl overflow-hidden">
                      <CardContent className="p-5">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-8 w-20 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </CardContent>
                    </Card>
                  )}
                  {examState === 'error' && (
                    <Card className="border border-amber-200 bg-amber-50 rounded-2xl overflow-hidden">
                      <CardContent className="p-5">
                        <h3 className="text-sm font-semibold text-gray-900">Exam Countdown</h3>
                        <p className="text-sm text-amber-800 mt-2">Failed to load exam date.</p>
                        <Button variant="outline" size="sm" className="mt-3">Retry</Button>
                      </CardContent>
                    </Card>
                  )}
                  {examState === 'success' && (
                    <Card className="border border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl overflow-hidden">
                      <CardContent className="p-5">
                        <h3 className="text-sm font-semibold text-gray-900">Exam Countdown</h3>
                        <p className="text-2xl font-bold text-purple-600 mt-2">{stubExam.daysLeft} days</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">{stubExam.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{stubExam.date}</p>
                      </CardContent>
                    </Card>
                  )}
                  {examState === 'none' && (
                    <Card className="border border-gray-200 bg-gray-50 rounded-2xl overflow-hidden">
                      <CardContent className="p-5">
                        <h3 className="text-sm font-semibold text-gray-900">Exam Countdown</h3>
                        <p className="text-sm text-gray-500 mt-2">No exam date set. Add one in settings.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </Tabs>
          </>
        )}

        {/* Task detail modal (Calendar – on event click) */}
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="sm:max-w-[600px] p-6 max-h-[90vh] overflow-y-auto rounded-xl">
            {selectedEvent && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor:
                          selectedEvent.priority === 'high'
                            ? '#ef4444'
                            : selectedEvent.priority === 'medium'
                              ? '#eab308'
                              : '#22c55e',
                      }}
                    />
                    <DialogTitle className="text-xl">{selectedEvent.name}</DialogTitle>
                  </div>
                  <p className="sr-only">Task details: {selectedEvent.subject}, {selectedEvent.type}, {selectedEvent.duration}</p>
                </DialogHeader>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Subject</Label>
                    <p className="font-semibold truncate">{selectedEvent.subject}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Type</Label>
                    <div className="mt-0.5">
                      <Badge variant="secondary" className="capitalize">{selectedEvent.type}</Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Duration</Label>
                    <p className="flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {selectedEvent.duration}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Status</Label>
                    <div className="mt-0.5">
                      <Badge variant={selectedEvent.status === 'completed' ? 'default' : 'outline'} className="capitalize">
                        {selectedEvent.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                {selectedEvent.allocatedDate && (selectedEvent.startTime ?? selectedEvent.endTime) && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                    <div className="flex items-center gap-2 text-blue-600 text-sm font-bold mb-2">
                      <CalendarIcon className="w-4 h-4" />
                      Current Allocation
                    </div>
                    <p className="text-sm text-blue-900">
                      Date: {format(selectedEvent.allocatedDate, 'EEE, MMM d')}
                    </p>
                    <p className="text-sm text-blue-900">
                      Time: {selectedEvent.startTime ?? '—'}
                      {selectedEvent.endTime ? ` – ${selectedEvent.endTime}` : ''}
                    </p>
                  </div>
                )}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    Allocate Task Time
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Date</Label>
                      <Input type="date" className="mt-0.5 h-9" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Start Time</Label>
                      <Input type="time" className="mt-0.5 h-9" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">End Time</Label>
                      <Input type="time" className="mt-0.5 h-9" />
                    </div>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2" disabled>
                    <CalendarIcon className="w-4 h-4" />
                    Allocate Time Slot
                  </Button>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                    Required Resources & Environment
                  </div>
                  {selectedEvent.resources && selectedEvent.resources.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedEvent.resources.map((r, i) => (
                        <li
                          key={i}
                          className={`flex items-center gap-3 p-3 rounded-lg border ${
                            r.status === 'required'
                              ? 'bg-red-50 border-red-200'
                              : 'bg-amber-50 border-amber-200'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full flex-shrink-0 ${r.status === 'required' ? 'bg-red-500' : 'bg-amber-500'}`} />
                          <span className="text-sm font-medium">{r.label}</span>
                          <Badge variant={r.status === 'required' ? 'destructive' : 'secondary'} className="capitalize ml-auto">
                            {r.status}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50 border-gray-200">
                      <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">No specific requirements for this task</span>
                    </div>
                  )}
                </div>
                {selectedEvent.aiInsight && (
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-sm text-indigo-900 mb-4">
                    <p className="font-bold text-indigo-700 flex items-center gap-1 mb-1">
                      <AlertCircle className="w-4 h-4" />
                      AI Insight:
                    </p>
                    <p className="text-indigo-800">{selectedEvent.aiInsight}</p>
                  </div>
                )}
                {selectedEvent.performanceScore != null && (
                  <div className="mb-4">
                    <Label className="text-sm text-muted-foreground">Performance Score</Label>
                    <p className="font-medium mt-0.5">{selectedEvent.performanceScore}%</p>
                    <div className="h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${selectedEvent.performanceScore}%`,
                          backgroundColor:
                            selectedEvent.performanceScore >= 80
                              ? '#22c55e'
                              : selectedEvent.performanceScore >= 60
                                ? '#eab308'
                                : '#ef4444',
                        }}
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                    Close
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium">
                    Start Task
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Task modal */}
        <Dialog open={addTaskOpen} onOpenChange={setAddTaskOpen}>
          <DialogContent className="sm:max-w-md rounded-xl">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <p className="text-xs text-muted-foreground font-normal">Some fields may be auto-suggested by AI.</p>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="task-name">Task Name</Label>
                <Input id="task-name" placeholder="e.g. Complete chapter 5" />
              </div>
              <div className="grid gap-2">
                <Label>Task Intent <span className="text-destructive">*</span></Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select intent" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="learn">Learn (new topic)</SelectItem>
                    <SelectItem value="practice">Practice</SelectItem>
                    <SelectItem value="revision">Revision</SelectItem>
                    <SelectItem value="test">Test / Mock</SelectItem>
                    <SelectItem value="fixWeakArea">Fix Weak Area</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Subject</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">Mathematics</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Exam Impact</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select weight" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> High exam weight</span></SelectItem>
                    <SelectItem value="medium"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Medium exam weight</span></SelectItem>
                    <SelectItem value="low"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> Low exam weight</span></SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (min)</Label>
                <Input id="duration" type="number" placeholder="30" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="due">Due Date</Label>
                <Input id="due" type="date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="attachment" className="text-gray-500">Attachment (optional)</Label>
                <Input id="attachment" type="text" placeholder="Optional" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddTaskOpen(false)}>Cancel</Button>
              <Button onClick={() => setAddTaskOpen(false)}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentPlanner;
