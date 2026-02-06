import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import { useTeacherMode } from '@/contexts/TeacherModeContext';
import StatCard from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, BarChart3, AlertTriangle, Calendar, MessageCircle, BookOpen, 
  TrendingUp, TrendingDown, Award, Sparkles, ClipboardList,
  ArrowRight, Crown, Clock, Bell, CheckCircle2, FileText, ChevronRight,
  Target, Zap, Activity, GraduationCap, Plus
} from 'lucide-react';
import {
  upcomingEvents,
  messagesOverview,
  behaviourNotes,
  classAnalyticsData,
  recentActivities,
  topPerformers,
  subjectClasses,
  chapters,
  assessments,
  teacherTasks,
  parentEngagementData,
} from '@/data/teacherMockData';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type ClassSummaryRange = '30' | '60' | '90';

const CLASS_SUMMARY_DATA: Record<ClassSummaryRange, { label: string; value: number }[]> = {
  '30': classAnalyticsData.performanceTrend.map((p, idx) => ({
    label: `W${idx + 1}`,
    value: p.score,
  })),
  '60': [
    { label: 'W1', value: 66 },
    { label: 'W2', value: 68 },
    { label: 'W3', value: 71 },
    { label: 'W4', value: 73 },
    { label: 'W5', value: 75 },
    { label: 'W6', value: 76 },
  ],
  '90': [
    { label: 'M1', value: 70 },
    { label: 'M2', value: 72 },
    { label: 'M3', value: 74 },
    { label: 'M4', value: 76 },
    { label: 'M5', value: 75 },
    { label: 'M6', value: 73 },
  ],
};

const CLASS_SUMMARY_COLOR = '#4f46e5';

function ClassPerformanceSummary() {
  const [range, setRange] = useState<ClassSummaryRange>('30');
  const data = CLASS_SUMMARY_DATA[range];

  return (
    <Card className="rounded-lg md:rounded-2xl border-0 shadow-sm bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2 md:pb-3 px-3 md:px-5">
        <div>
          <CardTitle className="text-xs md:text-sm font-bold text-gray-900">Class Performance Summary</CardTitle>
          <p className="text-[9px] md:text-[10px] text-gray-500 mt-0.5">
            Average scores across the class over the last {range} days.
          </p>
        </div>
        <div className="inline-flex items-center rounded-full bg-gray-100 p-0.5">
          {(['30', '60', '90'] as ClassSummaryRange[]).map((opt) => {
            const isActive = range === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setRange(opt)}
                className={cn(
                  'px-2.5 md:px-3 py-1 text-[9px] md:text-[10px] rounded-full font-medium transition-colors',
                  isActive
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/70',
                )}
              >
                {opt}D
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-3 md:pb-4 px-3 md:px-5">
        <div className="h-48 md:h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="classSummaryFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CLASS_SUMMARY_COLOR} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={CLASS_SUMMARY_COLOR} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2ff" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[60, 100]}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  fontSize: 12,
                }}
                formatter={(value: number) => [`${value}`, 'Avg score']}
              />
              <ReferenceLine
                y={75}
                stroke="#e5e7eb"
                strokeDasharray="4 4"
                ifOverflow="extendDomain"
              />
              <Area
                type="natural"
                dataKey="value"
                stroke={CLASS_SUMMARY_COLOR}
                strokeWidth={2}
                fill="url(#classSummaryFill)"
                dot={{ r: 2 }}
                activeDot={{ r: 3 }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

const ClassTeacherModeView = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-3 md:space-y-4">
      {/* Hero Section - Class Overview */}
      <div className="relative overflow-hidden rounded-xl md:rounded-2xl gradient-primary p-4 md:p-6 text-white shadow-lg">
        <div className="relative z-10">
          {/* Top Row: Header + KPIs */}
          <div className="flex flex-col gap-3 md:gap-4 mb-4 md:mb-5">
            <div className="space-y-1">
              <Badge variant="outline" className="bg-white/10 text-white border-white/20 px-2 md:px-2.5 py-0.5 text-[7px] md:text-[8px] uppercase tracking-wider font-semibold">
                Class Teacher • Grade 10-A
              </Badge>
              <h1 className="text-sm md:text-lg font-bold tracking-tight">Class Overview</h1>
              <p className="text-white/60 text-[9px] md:text-[11px] max-w-sm">
                {assessments.filter(a => a.status === 'draft').length} pending assessments • PTM tomorrow
              </p>
            </div>

            {/* KPIs - Below title on mobile */}
            <div className="flex gap-2">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl flex items-center gap-1.5 md:gap-2">
                <Users className="w-3.5 md:w-4 h-3.5 md:h-4 text-white/70" />
                <div>
                  <p className="text-[7px] md:text-[8px] text-white/50 uppercase tracking-wide">Students</p>
                  <p className="text-[11px] md:text-xs font-bold">32</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl flex items-center gap-1.5 md:gap-2">
                <Target className="w-3.5 md:w-4 h-3.5 md:h-4 text-white/70" />
                <div>
                  <p className="text-[7px] md:text-[8px] text-white/50 uppercase tracking-wide">Attendance</p>
                  <p className="text-[11px] md:text-xs font-bold">94%</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-lg md:rounded-xl px-2.5 md:px-3 h-6 md:h-7 text-[9px] md:text-[10px]"
                onClick={() => navigate('/teacher/communication')}
              >
                <MessageCircle className="w-2.5 md:w-3 h-2.5 md:h-3 mr-1" />
                Messages
                <Badge className="ml-1 bg-red-500 text-white border-0 h-3 md:h-3.5 px-1 min-w-[12px] md:min-w-[14px] text-[7px] md:text-[8px]">
                  {messagesOverview.unreadMessages}
                </Badge>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-lg md:rounded-xl px-2.5 md:px-3 h-6 md:h-7 text-[9px] md:text-[10px]"
                onClick={() => navigate('/teacher/announcements/events')}
              >
                <FileText className="w-2.5 md:w-3 h-2.5 md:h-3 mr-1" />
                Announcements
              </Button>
            </div>
          </div>

          {/* (Next Events calendar section removed as requested) */}
        </div>
        
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Quick Actions - Horizontal Row (larger cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: 'Attendance', icon: CheckCircle2, path: '/teacher/my-class/attendance', desc: 'Daily records' },
          { label: 'Students', icon: Users, path: '/teacher/my-class/students', desc: 'Class roster' },
          { label: 'Reports', icon: FileText, path: '/teacher/reports/class-summary', desc: 'Summary' },
          { label: 'Analytics', icon: BarChart3, path: '/teacher/class-analytics', desc: 'Performance' },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="flex items-center gap-3 md:gap-3.5 p-3 md:p-4 h-20 md:h-24 bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all group"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
              <action.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <div className="text-left min-w-0">
              <span className="text-[10px] md:text-sm font-semibold text-gray-900 block">{action.label}</span>
              <span className="text-[8px] md:text-xs text-gray-500 hidden sm:block">{action.desc}</span>
            </div>
          </button>
        ))}
      </div>

      {/* New Feature Widgets - Tasks & Parent Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {/* Tasks Summary Widget */}
        <Card className="rounded-lg md:rounded-xl border-0 shadow-sm bg-white">
          <CardHeader className="py-2.5 md:py-3 px-3 md:px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs md:text-sm font-bold text-gray-900">Tasks & Follow-ups</CardTitle>
              <Button variant="ghost" size="sm" className="h-6 md:h-7 text-[10px] md:text-xs text-primary hover:bg-primary/5" onClick={() => navigate('/teacher/tasks')}>
                View All <ChevronRight className="w-3 md:w-3.5 h-3 md:h-3.5 ml-0.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-3 md:pb-4 px-3 md:px-5">
            <div className="grid grid-cols-3 gap-2 md:gap-3 mb-3 md:mb-4">
              {[
                { 
                  label: 'Pending', 
                  count: teacherTasks.filter(t => t.status === 'pending').length, 
                  color: 'text-gray-600', 
                  bg: 'bg-gray-50' 
                },
                { 
                  label: 'In Progress', 
                  count: teacherTasks.filter(t => t.status === 'in-progress').length, 
                  color: 'text-blue-600', 
                  bg: 'bg-blue-50' 
                },
                { 
                  label: 'Overdue', 
                  count: teacherTasks.filter(t => {
                    if (t.status === 'completed') return false;
                    const dueDate = new Date(t.dueDate);
                    const today = new Date();
                    return dueDate < today;
                  }).length, 
                  color: 'text-red-600', 
                  bg: 'bg-red-50' 
                },
              ].map((stat) => (
                <div key={stat.label} className={cn("px-2 md:px-3 py-1.5 md:py-2 rounded-lg", stat.bg)}>
                  <p className="text-[8px] md:text-[10px] text-gray-600 font-medium">{stat.label}</p>
                  <p className={cn("text-sm md:text-base font-bold", stat.color)}>{stat.count}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-1.5 md:space-y-2">
              {teacherTasks.filter(t => t.status === 'pending').slice(0, 2).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-1.5 md:p-2 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] md:text-xs font-medium text-gray-900 truncate">{task.type}</p>
                    <p className="text-[9px] md:text-[10px] text-gray-600">{task.studentName}</p>
                  </div>
                  <Badge className={cn(
                    "text-[8px] md:text-[9px] h-4 md:h-5 px-1.5 md:px-2",
                    task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                  )}>
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
            
            <Button size="sm" variant="outline" className="w-full mt-2.5 md:mt-3 h-7 md:h-8 text-[10px] md:text-xs" onClick={() => navigate('/teacher/tasks')}>
              <Plus className="w-3 md:w-3.5 h-3 md:h-3.5 mr-1 md:mr-1.5" />
              Create Task
            </Button>
          </CardContent>
        </Card>

        {/* Parent Engagement Widget */}
        <Card className="rounded-lg md:rounded-xl border-0 shadow-sm bg-white">
          <CardHeader className="py-2.5 md:py-3 px-3 md:px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs md:text-sm font-bold text-gray-900">Parent Engagement</CardTitle>
              <Button variant="ghost" size="sm" className="h-6 md:h-7 text-[10px] md:text-xs text-primary hover:bg-primary/5" onClick={() => navigate('/teacher/parent-engagement')}>
                View All <ChevronRight className="w-3 md:w-3.5 h-3 md:h-3.5 ml-0.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-3 md:pb-4 px-3 md:px-5">
            <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3 md:mb-4">
              <div className="px-2 md:px-3 py-1.5 md:py-2 rounded-lg bg-emerald-50">
                <p className="text-[8px] md:text-[10px] text-gray-600 font-medium">High Engagement</p>
                <p className="text-sm md:text-base font-bold text-emerald-600">
                  {parentEngagementData.filter(p => p.engagementLevel === 'high').length}
                </p>
              </div>
              <div className="px-2 md:px-3 py-1.5 md:py-2 rounded-lg bg-red-50">
                <p className="text-[8px] md:text-[10px] text-gray-600 font-medium">Low Engagement</p>
                <p className="text-sm md:text-base font-bold text-red-600">
                  {parentEngagementData.filter(p => p.engagementLevel === 'low').length}
                </p>
              </div>
            </div>
            
            <div className="space-y-1.5 md:space-y-2 mb-2 md:mb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] md:text-xs text-gray-600">Avg Response Rate</span>
                <span className="text-xs md:text-sm font-bold text-primary">
                  {Math.round(parentEngagementData.reduce((acc, p) => acc + p.responseRate, 0) / parentEngagementData.length)}%
                </span>
              </div>
              <Progress 
                value={Math.round(parentEngagementData.reduce((acc, p) => acc + p.responseRate, 0) / parentEngagementData.length)} 
                className="h-1.5 md:h-2"
              />
            </div>

            {parentEngagementData.filter(p => p.engagementLevel === 'low').length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2 md:p-3">
                <p className="text-[10px] md:text-xs font-semibold text-red-700 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-2.5 md:w-3 h-2.5 md:h-3" />
                  Non-Responsive Parents
                </p>
                <div className="space-y-0.5 md:space-y-1">
                  {parentEngagementData.filter(p => p.engagementLevel === 'low').slice(0, 2).map((parent) => (
                    <div key={parent.id} className="flex items-center justify-between">
                      <p className="text-[9px] md:text-[10px] text-red-600">{parent.parentName}</p>
                      <span className="text-[8px] md:text-[9px] text-red-500">{parent.responseRate}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Class Performance Summary - 30D / 60D / 90D */}
      <ClassPerformanceSummary />

        {/* (Academic Performance + Action Required grid removed as requested) */}
    </div>
  );
};

const SubjectTeacherModeView = () => {
  const navigate = useNavigate();
  const totalStudents = subjectClasses.reduce((acc, c) => acc + c.students, 0);
  const avgScore = Math.round(subjectClasses.reduce((acc, c) => acc + c.avgScore, 0) / subjectClasses.length);
  const avgCompletion = Math.round(subjectClasses.reduce((acc, c) => acc + c.completion, 0) / subjectClasses.length);
  const weakChapters = chapters.filter(ch => ch.mastery === 'low').length;

  return (
    <div className="space-y-3">
      {/* Page Header */}
      <div>
        <h1 className="text-base md:text-lg font-bold text-gray-900">Mathematics Teaching Hub</h1>
        <p className="text-[9px] md:text-[10px] text-gray-500 mt-0.5">Manage your subject across all classes</p>
      </div>

      {/* Hero Cards Row */}
      <div className="grid grid-cols-1 gap-3">
        {/* AI Tools Card - Full Width */}
        <Card className="bg-gradient-to-br from-purple-100 via-violet-100 to-fuchsia-100 border border-purple-200/60 shadow-md rounded-xl md:rounded-2xl overflow-hidden relative">
          <CardContent className="p-4 md:p-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Left: Main Content */}
              <div className="lg:col-span-2">
                <div className="mb-3 md:mb-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/40 backdrop-blur-sm flex items-center justify-center mb-2 md:mb-3">
                    <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h2 className="text-sm md:text-base font-bold text-gray-900 mb-1.5 md:mb-2">Explore AI Tools,<br/>Create & Engage!</h2>
                  <p className="text-xs md:text-sm text-gray-600 max-w-[480px] mb-3 md:mb-4">
                    Generate quizzes, create lesson plans, and analyze student performance with AI. 
                    Use our intelligent tools to create targeted practice questions and worksheets.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg md:rounded-xl h-8 md:h-9 px-3 md:px-4 text-[10px] md:text-xs"
                      onClick={() => navigate('/teacher/ai-tools/question-generator')}
                    >
                      <Sparkles className="w-3 md:w-3.5 h-3 md:h-3.5 mr-1 md:mr-1.5" />
                      Question Generator
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50 rounded-lg md:rounded-xl h-8 md:h-9 px-3 md:px-4 text-[10px] md:text-xs"
                      onClick={() => navigate('/teacher/ai-tools/worksheet-generator')}
                    >
                      <FileText className="w-3 md:w-3.5 h-3 md:h-3.5 mr-1 md:mr-1.5" />
                      Worksheet
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right: Attention Alert */}
              <div className="lg:col-span-1">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-orange-50 h-full">
                  <CardContent className="p-4 md:p-5">
                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-red-500 flex items-center justify-center">
                        <AlertTriangle className="w-3.5 md:w-4 h-3.5 md:h-4 text-white" />
                      </div>
                      <h3 className="text-xs md:text-sm font-bold text-gray-900">Attention</h3>
                    </div>
                    <p className="text-[10px] md:text-xs text-gray-700 mb-2 md:mb-3">
                      {weakChapters} chapters showing low mastery. Consider creating practice quizzes.
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full border-red-200 text-red-700 hover:bg-red-50 rounded-lg md:rounded-xl h-7 md:h-8 text-[10px] md:text-xs"
                      onClick={() => navigate('/teacher/ai-tools/question-generator')}
                    >
                      Generate Quiz
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-200/30 rounded-full -mr-16 -mb-16" />
        </Card>
      </div>

      {/* Task Cards Section */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm md:text-base font-bold text-gray-900">Quick Actions & Tasks</h2>
        <div className="flex gap-1 md:gap-1.5">
          <Button size="sm" variant="ghost" className="h-6 md:h-7 px-2 md:px-3 text-[10px] md:text-xs rounded-lg bg-gray-900 text-white hover:bg-gray-800">
            All
          </Button>
          <Button size="sm" variant="ghost" className="h-6 md:h-7 px-2 md:px-3 text-[10px] md:text-xs rounded-lg hover:bg-gray-100">
            Ongoing
          </Button>
          <Button size="sm" variant="ghost" className="h-6 md:h-7 px-2 md:px-3 text-[10px] md:text-xs rounded-lg hover:bg-gray-100">
            Past
          </Button>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Task Card 1 - Classes Overview */}
        <Card className="border-0 shadow-sm rounded-xl md:rounded-2xl bg-white">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-blue-50 flex items-center justify-center">
                  <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-gray-500">Task</p>
                  <h3 className="text-xs md:text-sm font-bold text-gray-900">Classes & Students</h3>
                </div>
              </div>
              <Badge className="bg-blue-50 text-blue-700 border-0 text-[9px] md:text-[10px] h-4 md:h-5 px-1.5 md:px-2">
                {subjectClasses.length} classes
              </Badge>
            </div>
            
            <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
              <div className="flex items-center justify-between text-[10px] md:text-xs">
                <span className="text-gray-600">Task:</span>
                <span className="font-medium text-gray-900">Manage {totalStudents} students</span>
              </div>
              <div className="flex items-center justify-between text-[10px] md:text-xs">
                <span className="text-gray-600">Progress:</span>
                <span className="font-bold text-gray-900">{avgCompletion}% completion</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] md:text-xs text-gray-500 mb-2 md:mb-3">
              <span>{avgCompletion}/{100} completed</span>
            </div>
            
            <Button 
              size="sm" 
              className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg md:rounded-xl h-8 md:h-9 text-[10px] md:text-xs"
              onClick={() => navigate('/teacher/my-subject/classes')}
            >
              Manage Classes
            </Button>
          </CardContent>
        </Card>

        {/* Task Card 2 - Chapter Analytics */}
        <Card className="border-0 shadow-sm rounded-xl md:rounded-2xl bg-white">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-purple-50 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-gray-500">Task</p>
                  <h3 className="text-xs md:text-sm font-bold text-gray-900">Chapter Performance</h3>
                </div>
              </div>
              <Badge className="bg-red-50 text-red-700 border-0 text-[9px] md:text-[10px] h-4 md:h-5 px-1.5 md:px-2">
                {weakChapters} weak
              </Badge>
            </div>
            
            <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
              <div className="flex items-center justify-between text-[10px] md:text-xs">
                <span className="text-gray-600">Task:</span>
                <span className="font-medium text-gray-900">Review {weakChapters} struggling chapters</span>
              </div>
              <div className="flex items-center justify-between text-[10px] md:text-xs">
                <span className="text-gray-600">Average:</span>
                <span className="font-bold text-gray-900">{avgScore}% mastery</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] md:text-xs text-gray-500 mb-2 md:mb-3">
              <span>{chapters.length - weakChapters}/{chapters.length} chapters on track</span>
            </div>
            
            <Button 
              size="sm" 
              className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg md:rounded-xl h-8 md:h-9 text-[10px] md:text-xs"
              onClick={() => navigate('/teacher/subject-analytics/chapters')}
            >
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid - Classes and Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        {/* Classes List */}
        <div className="xl:col-span-2">
          <Card className="border-0 shadow-sm rounded-xl md:rounded-2xl bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 md:pb-3">
              <div className="flex items-center gap-1.5">
                <CardTitle className="text-xs md:text-sm font-bold text-gray-900">Your Classes</CardTitle>
                <span className="text-[10px] md:text-xs text-gray-400 hidden sm:inline">·</span>
                <p className="text-[10px] md:text-xs text-gray-500 hidden sm:block">Teaching {subjectClasses.length} classes</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary hover:bg-primary/5 rounded-lg h-6 md:h-7 px-2 text-[10px] md:text-xs"
                onClick={() => navigate('/teacher/my-subject/classes')}
              >
                View All <ChevronRight className="w-2.5 md:w-3 h-2.5 md:h-3 ml-0.5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                {subjectClasses.map((cls) => (
                  <div 
                    key={cls.id} 
                    className="p-3 md:p-4 rounded-lg md:rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-[0.98] transition-all cursor-pointer group"
                    onClick={() => navigate(`/teacher/my-subject/students?class=${cls.id}`)}
                  >
                    <div className="flex items-start justify-between mb-2 md:mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900 text-xs md:text-sm">{cls.name}</h4>
                        <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">{cls.students} students</p>
                      </div>
                      <div className={cn(
                        "w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center font-bold text-[10px] md:text-xs",
                        cls.avgScore >= 75 ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                      )}>
                        {cls.avgScore}%
                      </div>
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <div className="flex items-center justify-between text-[10px] md:text-xs font-medium text-gray-500">
                        <span>Completion</span>
                        <span className="text-gray-900">{cls.completion}%</span>
                      </div>
                      <div className="h-1 md:h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${cls.completion}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats & Alerts Sidebar */}
        <div className="space-y-3">
          {/* Stats Card */}
          <Card className="border-0 shadow-sm rounded-xl md:rounded-2xl bg-white">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="w-3.5 md:w-4 h-3.5 md:h-4 text-primary" />
                </div>
                <h3 className="text-xs md:text-sm font-bold text-gray-900">Overview</h3>
              </div>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] md:text-xs text-gray-600">Total Students</span>
                  <span className="text-xs md:text-sm font-bold text-gray-900">{totalStudents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] md:text-xs text-gray-600">Avg Performance</span>
                  <span className="text-xs md:text-sm font-bold text-gray-900">{avgScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] md:text-xs text-gray-600">Course Progress</span>
                  <span className="text-xs md:text-sm font-bold text-gray-900">{avgCompletion}%</span>
                </div>
                <div className="border-t border-gray-100 pt-2 md:pt-3 mt-2 md:mt-3">
                  <div className="flex items-center justify-between mb-1.5 md:mb-2">
                    <span className="text-[10px] md:text-xs text-gray-600">Active Chapters</span>
                    <span className="text-xs md:text-sm font-bold text-gray-900">{chapters.length}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1.5 md:mb-2">
                    <span className="text-[10px] md:text-xs text-gray-600">Weak Chapters</span>
                    <span className="text-xs md:text-sm font-bold text-red-600">{weakChapters}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] md:text-xs text-gray-600">Strong Performance</span>
                    <span className="text-xs md:text-sm font-bold text-green-600">{chapters.length - weakChapters}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const TeacherHomeContent = () => {
  const { currentMode } = useTeacherMode();
  return currentMode === 'class_teacher' ? <ClassTeacherModeView /> : <SubjectTeacherModeView />;
};

const TeacherHome = () => {
  return (
    <TeacherDashboardLayout>
      <TeacherHomeContent />
    </TeacherDashboardLayout>
  );
};

export default TeacherHome;
