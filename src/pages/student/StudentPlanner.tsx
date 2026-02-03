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
} from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useAuth } from '@/contexts/AuthContext';

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

// Stub data
const stubTasks = [
  { id: '1', name: 'Quadratic Equations practice', subject: 'Mathematics', type: 'Practice', duration: '30 min', priority: 'high' as Priority, completed: false, aiRecommended: true },
  { id: '2', name: 'Laws of Motion revision', subject: 'Science', type: 'Revision', duration: '15 min', priority: 'medium' as Priority, completed: true, aiRecommended: false },
];
const stubDeadlines = [
  { date: 'Feb 15', month: 'Feb', day: '15', name: 'Math assignment', subject: 'Mathematics', priority: 'high' as Priority },
  { date: 'Feb 20', month: 'Feb', day: '20', name: 'Science project', subject: 'Science', priority: 'medium' as Priority },
];
const stubWeakAreas = ['Quadratic Equations', 'Laws of Motion'];
const stubExam = { name: 'Annual Exam', date: 'Mar 15, 2026', daysLeft: 40 };
const stubSuggestions = [
  { id: 's1', name: 'Algebra drill', subject: 'Mathematics', duration: '20 min', priority: 'high' as Priority, why: 'Weak area practice' },
];

const StudentPlanner = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<{ name: string; subject: string; type: string; priority: Priority; duration: string; due: string; why?: string; env?: string } | null>(null);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [examState, setExamState] = useState<'loading' | 'error' | 'success' | 'none'>('success');
  const [hasSuggestions] = useState(true);

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
                    {/* Top row: 3 stat cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Card className="border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl overflow-hidden">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Target className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-gray-900">1 / 2</p>
                                <p className="text-xs text-gray-500">Tasks completed today</p>
                              </div>
                            </div>
                            <Badge className="rounded-full bg-blue-100 text-blue-700 border-0">50%</Badge>
                          </div>
                          <Progress value={50} className="h-1.5 mt-3 bg-blue-200 [&>div]:bg-blue-500" />
                        </CardContent>
                      </Card>
                      <Card className="border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl overflow-hidden">
                        <CardContent className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                              <Zap className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-gray-900">7</p>
                              <p className="text-xs text-gray-500">Loading streak data...</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl overflow-hidden">
                        <CardContent className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                              <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-gray-900">--</p>
                              <p className="text-xs text-gray-500">Based on task completion & timing</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

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
                            {stubTasks.map((task) => (
                              <li key={task.id} className="flex items-center gap-4 py-3 group">
                                <div className={`w-1.5 h-12 rounded-full flex-shrink-0 ${priorityBarColors[task.priority]}`} />
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>{task.name}</p>
                                  <p className="text-xs text-gray-500">{task.subject} · {task.duration}</p>
                                  {task.aiRecommended && (
                                    <span className="inline-flex items-center gap-1 text-xs text-blue-600 mt-0.5">
                                      <Zap className="w-3 h-3" /> AI Recommended
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {task.completed ? (
                                    <Badge className="bg-green-100 text-green-700 border-0">Completed</Badge>
                                  ) : (
                                    <span className="text-xs text-gray-500">{task.duration}</span>
                                  )}
                                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">Start</Button>
                                </div>
                              </li>
                            ))}
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
                    <Card className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-9 w-9"><ChevronLeft className="w-4 h-4" /></Button>
                            <Button variant="outline" size="icon" className="h-9 w-9"><ChevronRight className="w-4 h-4" /></Button>
                            <Button variant="outline" size="sm" className="h-9">Today</Button>
                            <span className="text-base font-semibold text-gray-900 px-2">February 2026</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <CalendarComponent mode="single" selected={calendarDate} onSelect={setCalendarDate} className="rounded-lg border-0" />
                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className="text-xs text-gray-500">Events:</span>
                            <span className="inline-flex items-center gap-1.5 text-xs"><span className="w-2 h-2 rounded-full bg-[#ef4444]" /> High</span>
                            <span className="inline-flex items-center gap-1.5 text-xs"><span className="w-2 h-2 rounded-full bg-[#eab308]" /> Medium</span>
                            <span className="inline-flex items-center gap-1.5 text-xs"><span className="w-2 h-2 rounded-full bg-[#22c55e]" /> Low</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
                          <ul className="space-y-2">
                            {stubTasks.map((task) => (
                              <li key={task.id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 group">
                                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                                  {task.completed && <span className="text-green-600 text-xs">✓</span>}
                                </div>
                                <div className="flex-1 min-w-0">
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
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>

                {/* Right sidebar ~1/4 */}
                <div className="space-y-4 lg:max-w-[320px]">
                  {/* AI Study Planner card */}
                  <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-yellow-300" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">AI Study Planner</h3>
                          <p className="text-xs text-white/90">Personalized for {user?.name?.split(' ')[0] || 'You'}</p>
                        </div>
                      </div>
                      <p className="text-sm text-white/90 mt-2">
                        Generate a custom study plan based on your weak areas and learning style.
                      </p>
                      <Button className="w-full mt-4 bg-white text-indigo-600 hover:bg-white/90 hover:scale-[1.02] transition-transform font-semibold rounded-xl">
                        Auto-Generate Plan
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
                                  <span className={`w-1.5 h-1.5 rounded-full ${priorityColors[s.priority]}`} />
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

        {/* Event detail modal (Calendar tab) */}
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="sm:max-w-md rounded-xl">
            <DialogHeader>
              <DialogTitle>{selectedEvent?.name}</DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-3 text-sm">
                <p><span className="text-gray-500">Subject:</span> {selectedEvent.subject}</p>
                <p><span className="text-gray-500">Type:</span> {selectedEvent.type}</p>
                <p><span className="text-gray-500">Priority:</span> {selectedEvent.priority}</p>
                <p><span className="text-gray-500">Duration:</span> {selectedEvent.duration}</p>
                <p><span className="text-gray-500">Due:</span> {selectedEvent.due}</p>
                {selectedEvent.why && <p><span className="text-gray-500">Why:</span> {selectedEvent.why}</p>}
                {selectedEvent.env && <p><span className="text-gray-500">Environment:</span> {selectedEvent.env}</p>}
                <div className="pt-2">
                  <Label className="text-xs">Time slot</Label>
                  <Input type="text" placeholder="Edit time" className="mt-1" />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedEvent(null)}>Close</Button>
              <Button>Mark complete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Task modal */}
        <Dialog open={addTaskOpen} onOpenChange={setAddTaskOpen}>
          <DialogContent className="sm:max-w-md rounded-xl">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="task-name">Task Name</Label>
                <Input id="task-name" placeholder="e.g. Complete chapter 5" />
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
                <Label>Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="learn">Learn</SelectItem>
                    <SelectItem value="practice">Practice</SelectItem>
                    <SelectItem value="revision">Revision</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Priority</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
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
