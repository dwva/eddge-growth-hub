import { useState, useMemo, useCallback, type ReactNode } from 'react';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { LayoutDashboard, Calendar as CalendarIcon, AlertCircle, Brain, Swords, RotateCcw, FlaskConical, Wrench } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { plannerStubs } from '@/data/planner.stubs';

// ----- Planner types (merged from planner.types.ts) -----
export type TaskIntent = 'learn' | 'practice' | 'revision' | 'test' | 'fixWeakArea';
export type TaskOrigin = 'ai' | 'user';
export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export const intentToLabel: Record<TaskIntent, string> = {
  learn: 'Learn',
  practice: 'Practice',
  revision: 'Revision',
  test: 'Test',
  fixWeakArea: 'Fix Weak Area',
};

export type Task = {
  id: string;
  name: string;
  subject: string;
  duration: string;
  priority: Priority;
  status: TaskStatus;
  intent: TaskIntent;
  reason: string;
  origin: TaskOrigin;
  dueDate?: Date;
  allocatedDate?: Date;
  startTime?: string;
  endTime?: string;
  resources?: { label: string; status: 'required' | 'recommended' }[];
  aiInsight?: string;
  performanceScore?: number;
};

export type NewTaskForm = {
  name: string;
  intent: TaskIntent;
  subject: string;
  priority: Priority;
  duration: string;
  due: string;
};

export const defaultNewTask: NewTaskForm = {
  name: '',
  intent: 'practice',
  subject: 'Mathematics',
  priority: 'medium',
  duration: '',
  due: '',
};

export type SuggestionStub = {
  id: string;
  name: string;
  subject: string;
  duration: string;
  priority: Priority;
  why?: string;
};

// ----- Planner UI config (merged from planner.config.tsx) -----
export const intentConfig: Record<
  TaskIntent,
  { label: string; short: string; icon: ReactNode; pillClass: string }
> = {
  learn: { label: 'Learn', short: 'L', icon: <Brain className="w-3 h-3" />, pillClass: 'bg-blue-100 text-blue-700 border-blue-200' },
  practice: { label: 'Practice', short: 'P', icon: <Swords className="w-3 h-3" />, pillClass: 'bg-amber-100 text-amber-700 border-amber-200' },
  revision: { label: 'Revise', short: 'R', icon: <RotateCcw className="w-3 h-3" />, pillClass: 'bg-green-100 text-green-700 border-green-200' },
  test: { label: 'Test', short: 'T', icon: <FlaskConical className="w-3 h-3" />, pillClass: 'bg-purple-100 text-purple-700 border-purple-200' },
  fixWeakArea: { label: 'Fix Weak Area', short: 'W', icon: <Wrench className="w-3 h-3" />, pillClass: 'bg-red-100 text-red-700 border-red-200' },
};

export const priorityColors: Record<Priority, string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

export const priorityBarColors: Record<Priority, string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

export const calendarEventColors: Record<Priority, string> = {
  high: '#c2410c',
  medium: '#a16207',
  low: '#15803d',
};

export const subjectAccent: Record<string, string> = {
  Mathematics: '#6366f1',
  Physics: '#0ea5e9',
  Chemistry: '#10b981',
  Science: '#f59e0b',
};

// ----- Page component -----
import { PlannerStats } from '@/components/planner/PlannerStats';
import { TodaysSchedule } from '@/components/planner/TodaysSchedule';
import { PlannerDeadlinesAndFocus } from '@/components/planner/PlannerDeadlinesAndFocus';
import { PlannerCalendar } from '@/components/planner/PlannerCalendar';
import { TaskDetailDialog } from '@/components/planner/TaskDetailDialog';
import { AddTaskDialog } from '@/components/planner/AddTaskDialog';

const StudentPlanner = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>(plannerStubs.initialTasks);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [calendarDate, setCalendarDate] = useState<Date>(() => new Date());
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [allocateDate, setAllocateDate] = useState('');
  const [allocateStart, setAllocateStart] = useState('');
  const [allocateEnd, setAllocateEnd] = useState('');
  const [newTask, setNewTask] = useState<NewTaskForm>(defaultNewTask);
  const [hasSuggestions, setHasSuggestions] = useState(true);

  const getTaskDate = useCallback((t: Task) => t.allocatedDate ?? t.dueDate, []);
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const tasksToday = useMemo(
    () => tasks.filter((t) => {
      const d = getTaskDate(t);
      return d && isSameDay(d, today);
    }),
    [tasks, getTaskDate, today]
  );
  const completedToday = useMemo(
    () => tasksToday.filter((t) => t.status === 'completed').length,
    [tasksToday]
  );
  const selectedTask = useMemo(
    () => (selectedTaskId ? tasks.find((t) => t.id === selectedTaskId) : null),
    [selectedTaskId, tasks]
  );
  const getEventsForDay = useCallback(
    (date: Date) =>
      tasks.filter((t) => {
        const d = getTaskDate(t);
        return d && isSameDay(d, date);
      }),
    [tasks, getTaskDate]
  );
  const calendarHasEvents = useMemo(() => tasks.some((t) => getTaskDate(t)), [tasks, getTaskDate]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);
  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (selectedTaskId === id) setSelectedTaskId(null);
  }, [selectedTaskId]);
  const setTaskStatus = useCallback((id: string, status: TaskStatus) => {
    updateTask(id, { status });
  }, [updateTask]);
  const advanceTaskStatus = useCallback((id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    if (task.status === 'pending') setTaskStatus(id, 'in_progress');
    else if (task.status === 'in_progress') setTaskStatus(id, 'completed');
    else setTaskStatus(id, 'completed');
  }, [tasks, setTaskStatus]);

  const openTaskDetail = useCallback((task: Task) => {
    setSelectedTaskId(task.id);
    setAllocateDate(task.allocatedDate ? format(task.allocatedDate, 'yyyy-MM-dd') : '');
    setAllocateStart(task.startTime ?? '');
    setAllocateEnd(task.endTime ?? '');
  }, []);

  const handleAllocateTime = useCallback(() => {
    if (!selectedTaskId || !allocateDate || !allocateStart) return;
    const d = new Date(allocateDate);
    updateTask(selectedTaskId, { allocatedDate: d, startTime: allocateStart, endTime: allocateEnd || undefined });
  }, [selectedTaskId, allocateDate, allocateStart, allocateEnd, updateTask]);

  const handleTaskMove = useCallback(
    (taskId: string, newDate: Date) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      const d = new Date(newDate);
      d.setHours(0, 0, 0, 0);
      updateTask(taskId, { allocatedDate: d, dueDate: d });
    },
    [tasks, updateTask]
  );

  const handleSetDetailStatus = useCallback(
    (status: TaskStatus) => {
      if (!selectedTaskId) return;
      setTaskStatus(selectedTaskId, status);
      if (status === 'completed') setSelectedTaskId(null);
    },
    [selectedTaskId, setTaskStatus]
  );

  const addSuggestionAsTask = useCallback((s: SuggestionStub) => {
    const dueDate = new Date();
    dueDate.setHours(0, 0, 0, 0);
    setTasks((prev) => [
      ...prev,
      {
        id: `task-${Date.now()}`,
        name: s.name,
        subject: s.subject,
        duration: s.duration,
        priority: s.priority,
        status: 'pending' as TaskStatus,
        intent: 'practice' as TaskIntent,
        reason: s.why ?? 'Added from suggestion',
        origin: 'ai' as TaskOrigin,
        dueDate,
        allocatedDate: dueDate,
      },
    ]);
    setHasSuggestions(false);
  }, []);

  const handleAutoGeneratePlan = useCallback(() => {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const { weakAreas } = plannerStubs;
    const newTasks: Task[] = weakAreas.slice(0, 3).map((area, i) => ({
      id: `auto-${Date.now()}-${i}`,
      name: `${area} practice`,
      subject: area.includes('Motion') ? 'Science' : 'Mathematics',
      duration: '25 min',
      priority: 'high' as Priority,
      status: 'pending' as TaskStatus,
      intent: 'practice' as TaskIntent,
      reason: 'Auto-generated from weak area',
      origin: 'ai' as TaskOrigin,
      dueDate: todayDate,
      allocatedDate: todayDate,
    }));
    setTasks((prev) => [...prev, ...newTasks]);
  }, []);

  const handleGeneratePracticeSet = useCallback(() => {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const { weakAreas } = plannerStubs;
    const newTasks: Task[] = weakAreas.map((area, i) => ({
      id: `practice-${Date.now()}-${i}`,
      name: `${area} – practice set`,
      subject: area.includes('Motion') ? 'Science' : 'Mathematics',
      duration: '30 min',
      priority: 'high' as Priority,
      status: 'pending' as TaskStatus,
      intent: 'practice' as TaskIntent,
      reason: 'Focus area practice',
      origin: 'user' as TaskOrigin,
      dueDate: todayDate,
      allocatedDate: todayDate,
    }));
    setTasks((prev) => [...prev, ...newTasks]);
  }, []);

  const handleAddTask = useCallback(() => {
    if (!newTask.name.trim()) return;
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const dueDate = newTask.due ? new Date(newTask.due) : todayDate;
    setTasks((prev) => [
      ...prev,
      {
        id: `task-${Date.now()}`,
        name: newTask.name.trim(),
        subject: newTask.subject,
        duration: newTask.duration ? `${newTask.duration} min` : '30 min',
        priority: newTask.priority,
        status: 'pending' as TaskStatus,
        intent: newTask.intent,
        reason: 'Added by you',
        origin: 'user' as TaskOrigin,
        dueDate,
        allocatedDate: dueDate,
      },
    ]);
    setNewTask(defaultNewTask);
    setAddTaskOpen(false);
  }, [newTask]);

  const resetNewTask = useCallback(() => setNewTask(defaultNewTask), []);

  return (
    <StudentDashboardLayout>
      <div className="w-full space-y-3 md:space-y-6">
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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="max-w-[280px] w-full bg-white dark:bg-card border border-gray-200 dark:border-border shadow-sm rounded-lg p-0.5 h-auto">
                <TabsTrigger value="dashboard" className="gap-1.5 data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md px-3 py-1.5 text-sm">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="calendar" className="gap-1.5 data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md px-3 py-1.5 text-sm">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  Calendar
                </TabsTrigger>
              </TabsList>

              <div className={`${activeTab === 'dashboard' ? 'grid gap-6 mt-3 grid-cols-1 lg:grid-cols-1' : 'mt-2'}`}>
                <div
                  className={`${activeTab === 'dashboard' ? 'flex flex-col min-w-0 min-h-0 max-h-[calc(100vh-6rem)] overflow-y-auto' : ''}`}
                >
                  <TabsContent value="dashboard" className="mt-0 flex flex-col flex-1 min-h-0 min-w-0">
                    <div className="shrink-0 space-y-6">
                      <PlannerStats
                        completedToday={completedToday}
                        tasksTodayCount={tasksToday.length}
                        pendingCount={tasks.filter((t) => t.status !== 'completed').length}
                        cognitiveLoad={plannerStubs.cognitiveLoad}
                        onAutoGeneratePlan={handleAutoGeneratePlan}
                      />
                    </div>
                    <div className="shrink-0 min-h-[280px] max-h-[42vh] overflow-hidden mt-6">
                      <TodaysSchedule
                        tasks={tasksToday}
                        onViewCalendar={() => setActiveTab('calendar')}
                        onAddTask={() => setAddTaskOpen(true)}
                        onStart={(id) => setTaskStatus(id, 'in_progress')}
                        onComplete={(id) => setTaskStatus(id, 'completed')}
                        onRemove={removeTask}
                      />
                    </div>
                    <div className="shrink-0 mt-6">
                      <PlannerDeadlinesAndFocus
                        deadlines={plannerStubs.deadlines}
                        cognitiveLoad={plannerStubs.cognitiveLoad}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="calendar" className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                    <PlannerCalendar
                      calendarDate={calendarDate}
                      onCalendarDateChange={setCalendarDate}
                      getEventsForDay={getEventsForDay}
                      onTaskClick={openTaskDetail}
                      onTaskMove={handleTaskMove}
                      onRemove={removeTask}
                      hasEvents={calendarHasEvents}
                    />
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </>
        )}

        <TaskDetailDialog
          task={selectedTask}
          open={!!selectedTaskId}
          onOpenChange={(open) => !open && setSelectedTaskId(null)}
          allocateDate={allocateDate}
          allocateStart={allocateStart}
          allocateEnd={allocateEnd}
          onAllocateDateChange={setAllocateDate}
          onAllocateStartChange={setAllocateStart}
          onAllocateEndChange={setAllocateEnd}
          onAllocateTime={handleAllocateTime}
          onSetStatus={handleSetDetailStatus}
        />

        <AddTaskDialog
          open={addTaskOpen}
          onOpenChange={setAddTaskOpen}
          form={newTask}
          onFormChange={(updates) => setNewTask((prev) => ({ ...prev, ...updates }))}
          onSubmit={handleAddTask}
          onReset={resetNewTask}
        />
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentPlanner;
