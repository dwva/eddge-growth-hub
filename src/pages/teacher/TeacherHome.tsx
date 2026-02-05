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
  upcomingEvents, messagesOverview, behaviourNotes, classAnalyticsData, 
  recentActivities, topPerformers, subjectClasses, chapters, assessments, teacherTasks, parentEngagementData
} from '@/data/teacherMockData';

const ClassTeacherModeView = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      {/* Hero Section - Class Overview */}
      <div className="relative overflow-hidden rounded-2xl gradient-primary p-6 text-white shadow-lg">
        <div className="relative z-10">
          {/* Top Row: Header + KPIs */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-5">
            <div className="space-y-1">
              <Badge variant="outline" className="bg-white/10 text-white border-white/20 px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-semibold">
                Class Teacher • Grade 10-A
              </Badge>
              <h1 className="text-2xl font-bold tracking-tight">Class Overview</h1>
              <p className="text-white/60 text-xs max-w-sm">
                {assessments.filter(a => a.status === 'draft').length} pending assessments • PTM tomorrow
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Button 
                  size="sm" 
                  className="bg-white text-primary hover:bg-white/90 rounded-xl px-4 h-8 text-xs font-medium shadow-lg"
                  onClick={() => navigate('/teacher/assessments')}
                >
                  <ClipboardList className="w-3.5 h-3.5 mr-1.5" />
                  New Assessment
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-xl px-4 h-8 text-xs"
                  onClick={() => navigate('/teacher/communication')}
                >
                  <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                  Messages
                  <Badge className="ml-1.5 bg-red-500 text-white border-0 h-4 px-1.5 min-w-[18px] text-[9px]">
                    {messagesOverview.unreadMessages}
                  </Badge>
                </Button>
              </div>
            </div>

            {/* KPIs */}
            <div className="flex gap-2">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl flex items-center gap-2">
                <Users className="w-4 h-4 text-white/70" />
                <div>
                  <p className="text-[9px] text-white/50 uppercase tracking-wide">Students</p>
                  <p className="text-sm font-bold">32</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl flex items-center gap-2">
                <Target className="w-4 h-4 text-white/70" />
                <div>
                  <p className="text-[9px] text-white/50 uppercase tracking-wide">Attendance</p>
                  <p className="text-sm font-bold">94%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Events - Full Width */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-violet-300" />
                Next Events
              </h3>
              <Button variant="ghost" size="sm" className="h-5 text-[9px] px-1.5 text-white/60 hover:text-white hover:bg-white/10" onClick={() => navigate('/teacher/announcements/events')}>
                Calendar
              </Button>
            </div>
            <div className="flex gap-3">
              {upcomingEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="bg-white/5 px-3 py-2 rounded-lg flex-1 min-w-0">
                  <p className="text-[9px] text-white/50 uppercase tracking-wide">{event.date.split(' ')[0]} {event.date.split(' ')[1]}</p>
                  <p className="text-[11px] font-medium mt-0.5 truncate">{event.title}</p>
                  <p className="text-[9px] text-white/40 flex items-center gap-0.5 mt-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {event.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Quick Actions - Horizontal Compact Row */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Attendance', icon: CheckCircle2, path: '/teacher/my-class/attendance', desc: 'Daily records' },
          { label: 'Students', icon: Users, path: '/teacher/my-class/students', desc: 'Class roster' },
          { label: 'Reports', icon: FileText, path: '/teacher/reports/class-summary', desc: 'Summary' },
          { label: 'Analytics', icon: BarChart3, path: '/teacher/class-analytics', desc: 'Performance' },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="flex items-center gap-2.5 p-3 bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
              <action.icon className="w-4 h-4 text-primary" />
            </div>
            <div className="text-left min-w-0">
              <span className="text-xs font-bold text-gray-900 block">{action.label}</span>
              <span className="text-[9px] text-gray-500">{action.desc}</span>
            </div>
          </button>
        ))}
      </div>

      {/* New Feature Widgets - Tasks & Parent Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tasks Summary Widget */}
        <Card className="rounded-xl border-0 shadow-sm bg-white">
          <CardHeader className="py-3 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-gray-900">Tasks & Follow-ups</CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:bg-primary/5" onClick={() => navigate('/teacher/tasks')}>
                View All <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-4 px-5">
            <div className="grid grid-cols-3 gap-3 mb-4">
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
                <div key={stat.label} className={cn("px-3 py-2 rounded-lg", stat.bg)}>
                  <p className="text-[10px] text-gray-600 font-medium">{stat.label}</p>
                  <p className={cn("text-xl font-bold", stat.color)}>{stat.count}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              {teacherTasks.filter(t => t.status === 'pending').slice(0, 2).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{task.type}</p>
                    <p className="text-[10px] text-gray-600">{task.studentName}</p>
                  </div>
                  <Badge className={cn(
                    "text-[9px] h-5 px-2",
                    task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                  )}>
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
            
            <Button size="sm" variant="outline" className="w-full mt-3 h-8 text-xs" onClick={() => navigate('/teacher/tasks')}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Create Task
            </Button>
          </CardContent>
        </Card>

        {/* Parent Engagement Widget */}
        <Card className="rounded-xl border-0 shadow-sm bg-white">
          <CardHeader className="py-3 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-gray-900">Parent Engagement</CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:bg-primary/5" onClick={() => navigate('/teacher/parent-engagement')}>
                View All <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-4 px-5">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="px-3 py-2 rounded-lg bg-emerald-50">
                <p className="text-[10px] text-gray-600 font-medium">High Engagement</p>
                <p className="text-xl font-bold text-emerald-600">
                  {parentEngagementData.filter(p => p.engagementLevel === 'high').length}
                </p>
              </div>
              <div className="px-3 py-2 rounded-lg bg-red-50">
                <p className="text-[10px] text-gray-600 font-medium">Low Engagement</p>
                <p className="text-xl font-bold text-red-600">
                  {parentEngagementData.filter(p => p.engagementLevel === 'low').length}
                </p>
              </div>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Avg Response Rate</span>
                <span className="text-sm font-bold text-primary">
                  {Math.round(parentEngagementData.reduce((acc, p) => acc + p.responseRate, 0) / parentEngagementData.length)}%
                </span>
              </div>
              <Progress 
                value={Math.round(parentEngagementData.reduce((acc, p) => acc + p.responseRate, 0) / parentEngagementData.length)} 
                className="h-2"
              />
            </div>

            {parentEngagementData.filter(p => p.engagementLevel === 'low').length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-red-700 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Non-Responsive Parents
                </p>
                <div className="space-y-1">
                  {parentEngagementData.filter(p => p.engagementLevel === 'low').slice(0, 2).map((parent) => (
                    <div key={parent.id} className="flex items-center justify-between">
                      <p className="text-[10px] text-red-600">{parent.parentName}</p>
                      <span className="text-[9px] text-red-500">{parent.responseRate}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch">
          
          {/* Left Column: Primary Content (2/3) */}
          <div className="xl:col-span-2">
            
            {/* Performance Overview */}
            <Card className="rounded-xl border-0 shadow-sm overflow-hidden bg-white h-full">
              <CardHeader className="flex flex-row items-center justify-between py-3 px-5">
                <div>
                  <CardTitle className="text-sm font-bold text-gray-900">Academic Performance</CardTitle>
                  <p className="text-[10px] text-gray-500 mt-0.5">Class progress overview</p>
                </div>
                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 rounded-lg h-7 px-2 text-xs" onClick={() => navigate('/teacher/class-analytics')}>
                  Details <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </Button>
              </CardHeader>
              <CardContent className="pt-0 pb-4 px-5">
                {/* Distribution Cards */}
                <div className="flex gap-2 mb-4">
                  {[
                    { label: 'High Achievers', value: classAnalyticsData.distribution.high, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: '≥80%' },
                    { label: 'Average', value: classAnalyticsData.distribution.medium, color: 'text-amber-600', bg: 'bg-amber-50', sub: '60-79%' },
                    { label: 'Needs Attention', value: classAnalyticsData.distribution.low, color: 'text-red-600', bg: 'bg-red-50', sub: '<60%' },
                  ].map((item) => (
                    <div key={item.label} className={cn("flex-1 px-3 py-2 rounded-lg flex items-center justify-between", item.bg)}>
                      <div>
                        <span className="text-[10px] text-gray-700 font-medium block">{item.label}</span>
                        <span className="text-[9px] text-gray-500">{item.sub}</span>
                      </div>
                      <span className={cn("text-xl font-bold", item.color)}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Subject Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide">Subject Average</h4>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-[10px] h-5 px-2">Avg: {classAnalyticsData.classAverage}%</Badge>
                  </div>
                  {classAnalyticsData.subjectPerformance.slice(0, 4).map((subject) => (
                    <div key={subject.subject} className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-700 w-24 truncate">{subject.subject}</span>
                      <div className="relative flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "absolute top-0 left-0 h-full rounded-full",
                            subject.avgScore >= 80 ? "bg-emerald-500" : subject.avgScore >= 60 ? "bg-primary" : "bg-red-500"
                          )}
                          style={{ width: `${subject.avgScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-12 text-right">{subject.avgScore}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Sidebar Content (1/3) */}
          <div>
            {/* Alerts & Tasks Section */}
            <Card className="rounded-xl border-0 shadow-sm bg-white overflow-hidden h-full">
              <CardHeader className="py-3 px-5 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-red-500" />
                  Action Required
                </CardTitle>
                <Badge className="bg-red-50 text-red-600 border-0 text-[9px] h-5 px-2">3 New</Badge>
              </CardHeader>
              <CardContent className="pt-0 pb-4 px-5 space-y-2.5">
                <div className="p-3 rounded-xl bg-red-50/70 border border-red-100 flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-500 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-red-900">Critical Performance</p>
                    <p className="text-[11px] text-red-700 mt-0.5">2 students below 40% in math test.</p>
                  </div>
                </div>
                
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0 text-white">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-amber-900">PTM Tomorrow</p>
                    <p className="text-[11px] text-amber-700 mt-0.5">3 parents requested feedback.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0 text-white">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-blue-900">Reports Due Friday</p>
                    <p className="text-[11px] text-blue-700 mt-0.5">Submit quarterly report cards.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Mathematics Teaching Hub</h1>
        <p className="text-xs text-gray-500 mt-0.5">Manage your subject across all classes</p>
      </div>

      {/* Hero Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Left Card - Light Blue */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-sm rounded-2xl overflow-hidden relative">
          <CardContent className="p-6 relative z-10">
            <div className="absolute top-3 left-3">
              <div className="w-8 h-8 rounded-lg bg-white/40 backdrop-blur-sm flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="pt-12">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Explore AI Tools,<br/>Create & Engage!</h2>
              <p className="text-xs text-gray-600 max-w-[280px]">Generate quizzes, create lesson plans, and analyze student performance with AI.</p>
            </div>
          </CardContent>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-200/30 rounded-full -mr-12 -mb-12" />
        </Card>

        {/* Right Card - Light Yellow/Beige */}
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-0 shadow-sm rounded-2xl overflow-hidden relative">
          <CardContent className="p-6 relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Track Class Performance</h2>
                <p className="text-xs text-gray-600 mb-4">Monitor chapter-wise mastery and identify struggling students early.</p>
                <Button 
                  size="sm" 
                  className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-9 px-4 text-xs"
                  onClick={() => navigate('/teacher/subject-analytics/chapters')}
                >
                  View Analytics →
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-12 h-12 rounded-full bg-yellow-200/50 backdrop-blur-sm flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-amber-600" />
                </div>
                <div className="w-10 h-10 rounded-full bg-yellow-300/40 backdrop-blur-sm flex items-center justify-center -mt-3 ml-6">
                  <Activity className="w-5 h-5 text-amber-700" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Cards Section */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-bold text-gray-900">Quick Actions & Tasks</h2>
        <div className="flex gap-1.5">
          <Button size="sm" variant="ghost" className="h-7 px-3 text-xs rounded-lg bg-gray-900 text-white hover:bg-gray-800">
            All
          </Button>
          <Button size="sm" variant="ghost" className="h-7 px-3 text-xs rounded-lg hover:bg-gray-100">
            Ongoing
          </Button>
          <Button size="sm" variant="ghost" className="h-7 px-3 text-xs rounded-lg hover:bg-gray-100">
            Past
          </Button>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Task Card 1 - Classes Overview */}
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Task</p>
                  <h3 className="text-sm font-bold text-gray-900">Classes & Students</h3>
                </div>
              </div>
              <Badge className="bg-blue-50 text-blue-700 border-0 text-[10px] h-5 px-2">
                {subjectClasses.length} classes
              </Badge>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Task:</span>
                <span className="font-medium text-gray-900">Manage {totalStudents} students across classes</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Progress:</span>
                <span className="font-bold text-gray-900">{avgCompletion}% completion</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>{avgCompletion}/{100} completed</span>
            </div>
            
            <Button 
              size="sm" 
              className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-9"
              onClick={() => navigate('/teacher/my-subject/classes')}
            >
              Manage Classes
            </Button>
          </CardContent>
        </Card>

        {/* Task Card 2 - Chapter Analytics */}
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Task</p>
                  <h3 className="text-sm font-bold text-gray-900">Chapter Performance</h3>
                </div>
              </div>
              <Badge className="bg-red-50 text-red-700 border-0 text-[10px] h-5 px-2">
                {weakChapters} weak
              </Badge>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Task:</span>
                <span className="font-medium text-gray-900">Review {weakChapters} struggling chapters</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Average:</span>
                <span className="font-bold text-gray-900">{avgScore}% mastery</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>{chapters.length - weakChapters}/{chapters.length} chapters on track</span>
            </div>
            
            <Button 
              size="sm" 
              className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-9"
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
          <Card className="border-0 shadow-sm rounded-2xl bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-gray-900">Your Classes</CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">Teaching {subjectClasses.length} classes</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary hover:bg-primary/5 rounded-lg h-7 px-2 text-xs"
                onClick={() => navigate('/teacher/my-subject/classes')}
              >
                View All <ChevronRight className="w-3 h-3 ml-0.5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {subjectClasses.map((cls) => (
                  <div 
                    key={cls.id} 
                    className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/teacher/my-subject/students?class=${cls.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{cls.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{cls.students} students</p>
                      </div>
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs",
                        cls.avgScore >= 75 ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                      )}>
                        {cls.avgScore}%
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                        <span>Completion</span>
                        <span className="text-gray-900">{cls.completion}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
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
          <Card className="border-0 shadow-sm rounded-2xl bg-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Overview</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Total Students</span>
                  <span className="text-sm font-bold text-gray-900">{totalStudents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Avg Performance</span>
                  <span className="text-sm font-bold text-gray-900">{avgScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Course Progress</span>
                  <span className="text-sm font-bold text-gray-900">{avgCompletion}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alert Card */}
          <Card className="border-0 shadow-sm rounded-2xl bg-gradient-to-br from-red-50 to-orange-50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Attention</h3>
              </div>
              <p className="text-xs text-gray-700 mb-3">
                {weakChapters} chapters showing low mastery. Consider creating practice quizzes.
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full border-red-200 text-red-700 hover:bg-red-50 rounded-xl h-8 text-xs"
                onClick={() => navigate('/teacher/ai-tools/question-generator')}
              >
                Generate Quiz
              </Button>
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
