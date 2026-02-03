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
  ArrowRight, Crown, Clock, Bell, CheckCircle2, FileText, ChevronRight
} from 'lucide-react';
import { 
  upcomingEvents, messagesOverview, behaviourNotes, classAnalyticsData, 
  recentActivities, topPerformers, subjectClasses, chapters, assessments
} from '@/data/teacherMockData';

const ClassTeacherModeView = () => {
  const navigate = useNavigate();
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">{dateStr}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 h-9 rounded-xl" onClick={() => navigate('/teacher/communication')}>
            <MessageCircle className="w-4 h-4" />
            Messages
            <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-[10px]">{messagesOverview.unreadMessages}</Badge>
          </Button>
          <Button size="sm" className="gap-2 h-9 rounded-xl" onClick={() => navigate('/teacher/assessments')}>
            <ClipboardList className="w-4 h-4" />
            New Assessment
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value="32"
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Class Average"
          value={`${classAnalyticsData.classAverage}%`}
          icon={<BarChart3 className="w-5 h-5" />}
          trend={{ value: 3, isPositive: true }}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Attendance Today"
          value="94%"
          icon={<CheckCircle2 className="w-5 h-5" />}
          description="30 of 32 present"
          iconBg="bg-violet-50 text-violet-600"
        />
        <StatCard
          title="Pending Tasks"
          value={assessments.filter(a => a.status === 'draft').length}
          icon={<Clock className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Users, label: 'View Students', path: '/teacher/my-class/students', color: 'bg-blue-500' },
          { icon: BarChart3, label: 'Class Analytics', path: '/teacher/class-analytics', color: 'bg-emerald-500' },
          { icon: Calendar, label: 'Mark Attendance', path: '/teacher/my-class/attendance', color: 'bg-violet-500' },
          { icon: FileText, label: 'Class Summary', path: '/teacher/reports/class-summary', color: 'bg-amber-500' },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center text-white group-hover:scale-105 transition-transform`}>
              <action.icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-700">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Performance Card - Takes 2 columns */}
        <Card className="lg:col-span-2 rounded-2xl shadow-sm border-gray-100 overflow-hidden">
          <CardHeader className="pb-4 flex flex-row items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
            <div>
              <CardTitle className="text-lg font-semibold">Class Performance</CardTitle>
              <p className="text-sm text-gray-500 mt-0.5">Class 10-A Overview</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-primary" onClick={() => navigate('/teacher/class-analytics')}>
              View Details <ChevronRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Performance Distribution */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <div className="text-2xl font-bold text-emerald-600">{classAnalyticsData.distribution.high}</div>
                <div className="text-xs text-gray-600 mt-1">High Performers</div>
                <div className="text-[10px] text-gray-400">≥80%</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                <div className="text-2xl font-bold text-amber-600">{classAnalyticsData.distribution.medium}</div>
                <div className="text-xs text-gray-600 mt-1">Average</div>
                <div className="text-[10px] text-gray-400">60-79%</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-red-50/50 border border-red-100">
                <div className="text-2xl font-bold text-red-600">{classAnalyticsData.distribution.low}</div>
                <div className="text-xs text-gray-600 mt-1">Need Attention</div>
                <div className="text-[10px] text-gray-400">&lt;60%</div>
              </div>
            </div>

            {/* Subject Progress */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Subject-wise Progress</h4>
              {classAnalyticsData.subjectPerformance.slice(0, 4).map((subject) => (
                <div key={subject.subject} className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 w-24 truncate">{subject.subject}</span>
                  <div className="flex-1">
                    <Progress value={subject.avgScore} className="h-2" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">{subject.avgScore}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Reminders */}
        <Card className="rounded-2xl shadow-sm border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              Alerts & Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* PTM Reminder */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">PTM Tomorrow</p>
                  <p className="text-xs text-amber-600 mt-0.5">3 parents confirmed</p>
                </div>
              </div>
            </div>
            
            {/* At-Risk Alert */}
            <div className="p-3 rounded-xl bg-red-50 border border-red-100">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">2 At-Risk Students</p>
                  <p className="text-xs text-red-600 mt-0.5">Need immediate attention</p>
                </div>
              </div>
            </div>

            {/* Assessment Due */}
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Assessment Pending</p>
                  <p className="text-xs text-blue-600 mt-0.5">Due in 2 days</p>
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full mt-2 rounded-xl" onClick={() => navigate('/teacher/class-analytics/at-risk')}>
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="rounded-2xl shadow-sm border-gray-100">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            <span className="text-xs text-gray-400">Last 24 hours</span>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentActivities.slice(0, 5).map((activity, idx) => (
                <div key={activity.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    activity.type === 'assessment' ? 'bg-emerald-500' : 
                    activity.type === 'homework' ? 'bg-blue-500' : 'bg-amber-500'
                  }`} />
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                      {activity.studentName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{activity.studentName}</span> {activity.activity}
                    </p>
                    <p className="text-xs text-gray-400">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="rounded-2xl shadow-sm border-gray-100">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Top Performers
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => navigate('/teacher/my-class/students')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.slice(0, 4).map((student, index) => (
                <div key={student.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {index === 0 ? (
                      <Crown className="w-5 h-5 text-amber-500" />
                    ) : (
                      <span className="text-gray-400">#{index + 1}</span>
                    )}
                  </div>
                  <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {student.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                    <p className="text-xs text-emerald-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +{student.improvement}% this month
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{student.score}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events Row */}
      <Card className="rounded-2xl shadow-sm border-gray-100">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Upcoming Events
          </CardTitle>
          <Button variant="ghost" size="sm" className="gap-1 text-primary" onClick={() => navigate('/teacher/announcements/events')}>
            View All <ArrowRight className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary">
                    <span className="text-xs font-medium">{event.date.split(' ')[0]}</span>
                    <span className="text-sm font-bold">{event.date.split(' ')[1]?.replace(',', '')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{event.time}</p>
                    <Badge variant="secondary" className="mt-2 text-[10px]">{event.classGroup}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">{dateStr}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 h-9 rounded-xl" onClick={() => navigate('/teacher/subject-analytics/chapters')}>
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Button>
          <Button size="sm" className="gap-2 h-9 rounded-xl" onClick={() => navigate('/teacher/ai-tools/question-generator')}>
            <Sparkles className="w-4 h-4" />
            Generate Questions
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Average Score"
          value={`${avgScore}%`}
          icon={<BarChart3 className="w-5 h-5" />}
          trend={{ value: 2, isPositive: true }}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Completion Rate"
          value={`${avgCompletion}%`}
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="bg-violet-50 text-violet-600"
        />
        <StatCard
          title="Weak Chapters"
          value={weakChapters}
          icon={<AlertTriangle className="w-5 h-5" />}
          iconBg="bg-red-50 text-red-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Sparkles, label: 'AI Questions', path: '/teacher/ai-tools/question-generator', color: 'bg-violet-500' },
          { icon: BarChart3, label: 'Chapter Analytics', path: '/teacher/subject-analytics/chapters', color: 'bg-emerald-500' },
          { icon: ClipboardList, label: 'Assessments', path: '/teacher/assessments', color: 'bg-blue-500' },
          { icon: Users, label: 'My Classes', path: '/teacher/my-subject/classes', color: 'bg-amber-500' },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center text-white group-hover:scale-105 transition-transform`}>
              <action.icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-700">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Classes */}
        <Card className="lg:col-span-2 rounded-2xl shadow-sm border-gray-100">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">My Classes</CardTitle>
              <p className="text-sm text-gray-500 mt-0.5">Mathematics</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-primary" onClick={() => navigate('/teacher/my-subject/classes')}>
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjectClasses.map((cls) => (
                <div 
                  key={cls.id} 
                  className="p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate(`/teacher/my-subject/students?class=${cls.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{cls.name}</h4>
                      <p className="text-xs text-gray-500">{cls.students} students</p>
                    </div>
                    <Badge variant={cls.avgScore >= 75 ? 'default' : cls.avgScore >= 60 ? 'secondary' : 'destructive'}>
                      {cls.avgScore}%
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Completion</span>
                      <span className="font-medium">{cls.completion}%</span>
                    </div>
                    <Progress value={cls.completion} className="h-1.5" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weak Chapters Alert */}
        <Card className="rounded-2xl shadow-sm border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Attention Needed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {chapters.filter(ch => ch.mastery === 'low').map((ch) => (
              <div key={ch.id} className="p-3 rounded-xl bg-red-50/50 border border-red-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{ch.name}</p>
                    <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                      <TrendingDown className="w-3 h-3" />
                      {ch.masteryPercent}% mastery
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-7 text-xs rounded-lg"
                    onClick={() => navigate('/teacher/ai-tools/question-generator')}
                  >
                    Practice
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
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
