import { useNavigate } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import { useTeacherMode } from '@/contexts/TeacherModeContext';
import StatCard from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Users, BarChart3, AlertTriangle, Calendar, MessageCircle, BookOpen, 
  TrendingUp, TrendingDown, Award, Sparkles, ClipboardList,
  ArrowRight, Crown, Clock, Bell, CheckCircle2, FileText, ChevronRight,
  Target, Zap, Activity, GraduationCap
} from 'lucide-react';
import { 
  upcomingEvents, messagesOverview, behaviourNotes, classAnalyticsData, 
  recentActivities, topPerformers, subjectClasses, chapters, assessments
} from '@/data/teacherMockData';
import { cn } from '@/lib/utils';

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
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Subject Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 relative overflow-hidden">
        <div className="relative z-10">
          <Badge className="bg-emerald-50 text-emerald-600 border-0 mb-3 px-3">Subject Teacher</Badge>
          <h1 className="text-3xl font-bold text-gray-900">Mathematics Dashboard</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            {dateStr}
          </p>
          <div className="flex items-center gap-3 mt-6">
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-5 font-semibold shadow-lg shadow-primary/20" onClick={() => navigate('/teacher/ai-tools/question-generator')}>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Questions
            </Button>
            <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-10 px-5" onClick={() => navigate('/teacher/subject-analytics/chapters')}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Detailed Analytics
            </Button>
          </div>
        </div>
        
        {/* Quick Stats Banner */}
        <div className="relative z-10 grid grid-cols-2 gap-3 lg:gap-4">
          <div className="p-4 rounded-3xl bg-blue-50/50 border border-blue-100/50 min-w-[140px]">
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Students</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{totalStudents}</p>
          </div>
          <div className="p-4 rounded-3xl bg-emerald-50/50 border border-emerald-100/50 min-w-[140px]">
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Mastery</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{avgScore}%</p>
          </div>
        </div>

        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-1/2 w-24 h-24 bg-blue-500/5 rounded-full -ml-12 -mb-12" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Classes Overview (2/3) */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="rounded-[2.5rem] border-0 shadow-sm bg-white overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-bold text-gray-900">Active Classes</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 rounded-xl h-8" onClick={() => navigate('/teacher/my-subject/classes')}>
                Manage <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjectClasses.map((cls) => (
                  <div 
                    key={cls.id} 
                    className="p-5 rounded-[2rem] bg-gray-50/50 border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all group cursor-pointer"
                    onClick={() => navigate(`/teacher/my-subject/students?class=${cls.id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">{cls.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{cls.students} Enrolled Students</p>
                      </div>
                      <div className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm",
                        cls.avgScore >= 75 ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                      )}>
                        {cls.avgScore}%
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        <span>Course Completion</span>
                        <span className="text-gray-900">{cls.completion}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-1000"
                          style={{ width: `${cls.completion}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick AI Tools Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Quiz Gen', icon: Sparkles, color: 'text-violet-600', bg: 'bg-violet-50', path: '/teacher/ai-tools/question-generator' },
              { label: 'Assessments', icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50', path: '/teacher/assessments' },
              { label: 'Study Mats', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50', path: '/teacher/ai-tools/lesson-planner' },
            ].map((tool) => (
              <button 
                key={tool.label}
                onClick={() => navigate(tool.path)}
                className="flex items-center gap-4 p-5 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all group"
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform", tool.bg)}>
                  <tool.icon className={cn("w-6 h-6", tool.color)} />
                </div>
                <span className="text-sm font-bold text-gray-900">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Sidebar (1/3) */}
        <div className="space-y-6">
          <Card className="rounded-[2.5rem] border-0 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Syllabus Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-5 rounded-3xl bg-red-50/50 border border-red-100">
                <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-3">Critical Mastery Issues</p>
                <div className="space-y-3">
                  {chapters.filter(ch => ch.mastery === 'low').map((ch) => (
                    <div key={ch.id} className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{ch.name}</p>
                        <p className="text-[11px] text-red-600 font-medium">Avg Score: {ch.masteryPercent}%</p>
                      </div>
                      <Button size="sm" variant="outline" className="h-8 text-[10px] rounded-xl border-red-200 text-red-700 hover:bg-red-50">
                        Fix Now
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-blue-50/50 border border-blue-100">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Status</p>
                <p className="text-sm font-bold text-gray-900">7 Chapters Completed</p>
                <p className="text-xs text-gray-500 mt-1">3 more to cover by Mid-Term</p>
                <Progress value={70} className="h-1.5 mt-3 bg-blue-100" />
              </div>
            </CardContent>
          </Card>

          {/* Performance Trend */}
          <Card className="rounded-[2.5rem] border-0 shadow-sm bg-[#1e293b] text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-[10px]">+12.4%</Badge>
              </div>
              <h3 className="text-xl font-bold">Performance Up</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">Your class average improved significantly after the recent practice session.</p>
              <Button variant="outline" className="w-full mt-6 border-slate-700 hover:bg-slate-800 text-slate-300 rounded-2xl h-11">
                View Insight Report
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
