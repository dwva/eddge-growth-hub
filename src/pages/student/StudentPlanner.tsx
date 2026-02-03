import { useState } from 'react';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  ListTodo,
  Zap,
  CalendarDays,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Filter,
} from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

const StudentPlanner = () => {
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());

  return (
    <StudentDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Study Planner</h1>
            <p className="text-sm text-gray-500">Your personalized path to success</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="bg-gray-100 p-1 rounded-lg h-auto">
            <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <CalendarIcon className="w-4 h-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <ListTodo className="w-4 h-4" />
              Tasks
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mt-6">
            {/* Main content */}
            <div className="space-y-6 min-w-0">
              <TabsContent value="dashboard" className="mt-0 space-y-6">
                {/* Today's Schedule */}
                <Card className="border border-gray-100 shadow-sm rounded-2xl">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-primary" />
                        <h3 className="text-base font-semibold text-gray-900">Today's Schedule</h3>
                      </div>
                      <button className="text-sm text-primary hover:underline flex items-center gap-1">
                        View Full Calendar <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="py-8 text-center text-gray-500 rounded-xl bg-gray-50 border border-dashed border-gray-200">
                      <p className="font-medium text-gray-700">No tasks scheduled for today.</p>
                      <p className="text-sm mt-1">Add a task.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="border border-gray-100 shadow-sm rounded-2xl">
                    <CardContent className="p-4">
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Daily Goal</h4>
                      <p className="text-xl font-semibold text-gray-900 mt-1">0/0 Tasks completed today</p>
                      <Progress value={0} className="h-2 mt-3" />
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-100 shadow-sm rounded-2xl">
                    <CardContent className="p-4">
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Current Streak</h4>
                      <p className="text-sm text-gray-500 mt-1">-- Loading streak data...</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-100 shadow-sm rounded-2xl">
                    <CardContent className="p-4">
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Focus Score</h4>
                      <p className="text-sm text-gray-500 mt-1">-- Based on task completion & timing.</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-100 shadow-sm rounded-2xl">
                    <CardContent className="p-4">
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Exam Countdown</h4>
                      <p className="text-2xl font-bold text-primary mt-1">40 days</p>
                      <p className="text-xs text-gray-500 mt-0.5">Annual Exam Mar 15, 2026</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Upcoming Deadlines */}
                <Card className="border border-gray-100 shadow-sm rounded-2xl">
                  <CardContent className="p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Upcoming Deadlines</h3>
                    <p className="text-sm text-gray-500">No upcoming deadlines.</p>
                  </CardContent>
                </Card>

                {/* Focus Areas */}
                <Card className="border border-gray-100 shadow-sm rounded-2xl">
                  <CardContent className="p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Focus Areas</h3>
                    <p className="text-sm text-gray-500">
                      Based on your recent performance, we recommend focusing on these topics:
                    </p>
                    <p className="text-sm text-gray-400 mt-2">No focus areas yet. Complete some tasks to get recommendations.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="calendar" className="mt-0">
                <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
                  <CardContent className="p-0">
                    {/* Calendar controls */}
                    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-9 w-9">
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-9 w-9">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-9">
                          Today
                        </Button>
                        <span className="text-base font-semibold text-gray-900 px-2">
                          February 2026
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
                          <option>Monthly</option>
                          <option>Weekly</option>
                        </select>
                        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                          <button className="px-3 py-2 bg-primary text-white text-sm">Grid</button>
                          <button className="px-3 py-2 bg-white text-gray-600 text-sm hover:bg-gray-50">List</button>
                        </div>
                      </div>
                    </div>
                    {/* Calendar */}
                    <div className="p-4 flex flex-col items-center justify-center min-h-[360px]">
                      <CalendarComponent
                        mode="single"
                        selected={calendarDate}
                        onSelect={setCalendarDate}
                        className="rounded-md border-0"
                      />
                      <div className="mt-6 text-center text-gray-500 py-4">
                        <CalendarIcon className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                        <p className="font-medium text-gray-600">No tasks scheduled</p>
                        <p className="text-sm mt-1">No tasks found for the visible date range.</p>
                        <p className="text-sm mt-0.5">Create a task to get started with your study plan.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tasks" className="mt-0">
                <Card className="border border-gray-100 shadow-sm rounded-2xl">
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <Button variant="outline" className="gap-2">
                        <Filter className="w-4 h-4" />
                        All Tasks
                      </Button>
                      <Button className="gap-2">
                        + Add Task
                      </Button>
                    </div>
                    <div className="py-16 text-center text-gray-500">
                      <ListTodo className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p className="font-medium text-gray-600">No tasks found matching your filter.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>

            {/* Right sidebar */}
            <div className="space-y-4 lg:max-w-[320px]">
              <Card className="border-0 shadow-sm rounded-2xl bg-gradient-to-br from-primary to-purple-700 overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">AI Study Planner</h3>
                  </div>
                  <p className="text-sm text-white/90 font-medium">Personalized for You</p>
                  <p className="text-sm text-white/80 mt-2">
                    Generate a custom study plan based on your weak areas and learning style.
                  </p>
                  <Button className="w-full mt-4 bg-white text-primary hover:bg-white/90 font-semibold gap-2">
                    <Sparkles className="w-4 h-4" />
                    Auto-Generate Plan
                  </Button>
                </CardContent>
              </Card>

              <Card className="border border-gray-100 shadow-sm rounded-2xl">
                <CardContent className="p-5">
                  <h3 className="text-sm font-semibold text-gray-900">Exam Countdown</h3>
                  <p className="text-3xl font-bold text-primary mt-2">40 days</p>
                  <p className="text-sm text-gray-600 mt-1">Annual Exam</p>
                  <p className="text-sm text-gray-500">Mar 15, 2026</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentPlanner;
