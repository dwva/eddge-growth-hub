import ParentDashboardLayout from '@/components/layout/ParentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useChild } from '@/contexts/ChildContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { 
  Loader2,
  Calculator,
  Microscope,
  BookOpen,
  Globe,
  Palette,
  TrendingUp,
  Calendar,
  FileText,
  MessageSquare,
  Clock,
  Circle,
  AlertCircle,
  CheckCircle2,
  X,
  Bell,
  Flame,
  Target,
  TrendingDown,
  Heart,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { homeworkList, actionAlerts, studyHabits, examReadiness, classBenchmark, wellbeingSignals, feedbackItems } from '@/data/parentMockData';
import { useState } from 'react';

// Subject icon mapping
const subjectIcons: { [key: string]: any } = {
  'Mathematics': Calculator,
  'Science': Microscope,
  'English': BookOpen,
  'History': Globe,
  'Geography': Globe,
  'Art': Palette,
};

const subjectColors: { [key: string]: { bg: string; icon: string } } = {
  'Mathematics': { bg: 'bg-blue-50', icon: 'text-blue-600' },
  'Science': { bg: 'bg-purple-50', icon: 'text-purple-600' },
  'English': { bg: 'bg-pink-50', icon: 'text-pink-600' },
  'History': { bg: 'bg-amber-50', icon: 'text-amber-600' },
  'Geography': { bg: 'bg-teal-50', icon: 'text-teal-600' },
};

const ParentDashboardHomeContent = () => {
  const { selectedChild, isLoading } = useChild();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  // Mock data for line chart - using subject scores over time
  const dailyActivityData = selectedChild?.subjects?.map((subject, index) => ({
    name: subject.name.substring(0, 3),
    score: subject.score,
    fullName: subject.name
  })) || [];

  // Mock upcoming events
  const upcomingEvents = [
    { id: '1', title: 'Parent-Teacher Meeting', date: 'Feb 5', type: 'meeting' },
    { id: '2', title: 'Science Fair', date: 'Feb 10', type: 'event' },
    { id: '3', title: 'Math Test', date: 'Feb 8', type: 'test' },
  ];

  // Get homework queue (pending items)
  const homeworkQueue = homeworkList.filter(hw => hw.status === 'pending').slice(0, 5);

  // Filter active alerts
  const activeAlerts = actionAlerts.filter(alert => !dismissedAlerts.has(alert.id));
  
  const handleDismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => new Set(prev).add(alertId));
  };

  // Helper functions for new features
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'urgent': return 'bg-red-50 border-red-200 text-red-800';
      case 'attention': return 'bg-amber-50 border-amber-200 text-amber-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case 'high': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      default: return 'text-red-600 bg-red-50';
    }
  };

  const getBenchmarkColor = (position: string) => {
    switch (position) {
      case 'above': return 'bg-green-100';
      case 'at': return 'bg-blue-100';
      default: return 'bg-amber-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!selectedChild) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-3xl">👶</div>
          <h3 className="mt-4 text-lg font-semibold">No Child Linked</h3>
          <p className="text-muted-foreground">Please link a child to view the dashboard.</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const attendanceRate = 92;
  const subjectsCompleted = selectedChild.subjects?.length || 0;
  const overallPerformance = Math.round(
    selectedChild.subjects?.reduce((sum, s) => sum + s.score, 0) / (selectedChild.subjects?.length || 1)
  );

  return (
    <div className="w-full space-y-8">
      {/* Hero Section - Full Width Gradient Card */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-xl p-6 md:p-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Parent Overview */}
          <div className="lg:col-span-2">
            <p className="text-purple-200 text-xs font-medium tracking-wider uppercase mb-2">Parent Portal</p>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Track {selectedChild.name}'s Progress
            </h1>
            <p className="text-purple-200 text-sm mb-4 max-w-md">
              Monitor {selectedChild.name}'s academic journey, achievements, and growth all in one place.
            </p>
            <div className="flex items-center gap-2 text-purple-200 text-sm">
              <span>{selectedChild?.class || 'Grade 10-A'}</span>
              <span>•</span>
              <span>{subjectsCompleted} Subjects</span>
            </div>
          </div>

          {/* Right: Compact Stat Cards */}
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-purple-200 text-xs mb-1">Attendance</p>
              <p className="text-2xl font-bold text-white">{attendanceRate}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-purple-200 text-xs mb-1">Subjects</p>
              <p className="text-2xl font-bold text-white">{subjectsCompleted}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-purple-200 text-xs mb-1">Performance</p>
              <p className="text-2xl font-bold text-white">{overallPerformance}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - 4 Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card 
          className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer"
          onClick={() => navigate('/parent/attendance')}
        >
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-sm text-gray-800">Attendance</h3>
            <p className="text-xs text-gray-500 mt-1">View records</p>
          </CardContent>
        </Card>

        <Card 
          className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer"
          onClick={() => navigate('/parent/progress/recent-tests')}
        >
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-sm text-gray-800">Tests</h3>
            <p className="text-xs text-gray-500 mt-1">Recent tests</p>
          </CardContent>
        </Card>

        <Card 
          className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer"
          onClick={() => navigate('/parent/homework')}
        >
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="font-semibold text-sm text-gray-800">Homework</h3>
            <p className="text-xs text-gray-500 mt-1">View assignments</p>
          </CardContent>
        </Card>

        <Card 
          className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer"
          onClick={() => navigate('/parent/communications')}
        >
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mb-3">
              <MessageSquare className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="font-semibold text-sm text-gray-800">Messages</h3>
            <p className="text-xs text-gray-500 mt-1">Communicate</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Section - 12 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Academic Performance (col-span-8) */}
        <Card className="lg:col-span-8 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Academic Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Subject Progress Bars */}
            <div className="space-y-4">
              {selectedChild.subjects?.map((subject, index) => {
                const Icon = subjectIcons[subject.name] || BookOpen;
                const colors = subjectColors[subject.name] || { bg: 'bg-gray-50', icon: 'text-gray-600' };
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${colors.icon}`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{subject.name}</p>
                          <p className="text-xs text-gray-500">{subject.score}% completed</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{subject.score}%</span>
                    </div>
                    <Progress value={subject.score} className="h-2" />
                  </div>
                );
              })}
            </div>

            {/* Performance Trend Line Chart */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-800 mb-4">Performance Trend</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      domain={[0, 100]}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                      }}
                      formatter={(value: any, name: any, props: any) => [
                        `${value}% - ${props.payload.fullName}`,
                        'Score'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Homework Queue (col-span-4) */}
        <Card className="lg:col-span-4 border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-800">Homework Queue</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/parent/homework')}
                className="text-xs text-primary hover:text-primary/80"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {homeworkQueue.length > 0 ? (
                homeworkQueue.map((homework) => (
                  <div 
                    key={homework.id}
                    className="p-3 rounded-lg border border-gray-100 hover:border-primary/20 hover:bg-gray-50/50 transition-all cursor-pointer"
                    onClick={() => navigate('/parent/homework')}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-800 truncate">{homework.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{homework.subject}</p>
                      </div>
                      <Circle className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>Due {new Date(homework.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No pending homework</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Features Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Parent Action Center */}
        <Card className="lg:col-span-6 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Parent Action Center
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeAlerts.length > 0 ? (
              <div className="space-y-3">
                {activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={`text-xs ${getSeverityColor(alert.severity)} border-0`}>
                            {alert.severity === 'urgent' ? 'Urgent' : alert.severity === 'attention' ? 'Attention' : 'Info'}
                          </Badge>
                          <h4 className="text-sm font-semibold">{alert.title}</h4>
                        </div>
                        <p className="text-xs mt-1 opacity-90">{alert.description}</p>
                        <p className="text-xs mt-2 font-medium">💡 {alert.recommendedAction}</p>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7"
                            onClick={() => navigate('/parent/communications')}
                          >
                            Message Teacher
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs h-7"
                            onClick={() => navigate('/parent/child-progress/1')}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDismissAlert(alert.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p className="text-sm text-gray-600 font-medium">All good! No action needed.</p>
                <p className="text-xs text-gray-500 mt-1">Your child is doing well.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Study Habits & Consistency */}
        <Card className="lg:col-span-6 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Study Habits & Consistency
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-orange-50 border border-orange-100">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-4 h-4 text-orange-600" />
                  <span className="text-xs text-gray-600">Current Streak</span>
                </div>
                <p className="text-2xl font-bold text-orange-600">{studyHabits.currentStreak} days</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-gray-600">Best Streak</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{studyHabits.longestStreak} days</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Homework Submission</span>
                <span className="text-sm font-semibold text-gray-800">{studyHabits.submissionConsistency}%</span>
              </div>
              <Progress value={studyHabits.submissionConsistency} className="h-2" />
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-2">Weekly Study Time</p>
              <div className="space-y-2">
                {studyHabits.weeklyStudyTime.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-gray-700">{item.subject}</span>
                    <span className="font-medium text-gray-800">{item.hours}h</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-2">Study Calendar (Last 7 Days)</p>
              <div className="flex gap-1">
                {Array.from({ length: 7 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (6 - i));
                  const dateStr = date.toISOString().split('T')[0];
                  const studied = studyHabits.studyDays.includes(dateStr);
                  return (
                    <div
                      key={i}
                      className={`flex-1 h-8 rounded border transition-colors ${
                        studied
                          ? 'bg-green-500 border-green-600'
                          : 'bg-gray-100 border-gray-200'
                      }`}
                      title={date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    />
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-green-500 border border-green-600" />
                  <span>Studied</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-gray-100 border border-gray-200" />
                  <span>No study</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exam Readiness & Class Benchmark */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Exam Readiness Indicator */}
        <Card className="lg:col-span-6 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Exam Readiness Indicator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {examReadiness.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-800">{item.subject}</span>
                    <Badge className={`text-xs ${getReadinessColor(item.readiness)} border-0`}>
                      {item.readiness === 'high' ? 'High' : item.readiness === 'medium' ? 'Medium' : 'Low'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Progress value={item.score} className="h-1.5 flex-1" />
                    <span className="text-xs text-gray-600">{item.score}%</span>
                  </div>
                  <p className="text-xs text-gray-600">{item.explanation}</p>
                  {item.readiness === 'low' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7 mt-2"
                      onClick={() => navigate('/parent/communications')}
                    >
                      Message Teacher
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Anonymous Class Benchmark */}
        <Card className="lg:col-span-6 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Class Benchmark
            </CardTitle>
            <p className="text-xs text-gray-500 mt-1">Anonymous comparison with class average</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {classBenchmark.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">{item.subject}</span>
                    <Badge className={`text-xs ${getBenchmarkColor(item.position)} border-0 text-gray-700`}>
                      {item.position === 'above' ? 'Above Average' : item.position === 'at' ? 'At Average' : 'Below Average'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getBenchmarkColor(item.position)}`}
                          style={{ width: `${item.childScore}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 min-w-[80px] text-right">
                      {item.childScore}% vs {item.classAverage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                  This comparison helps you understand your child's performance context without creating unhealthy competition.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wellbeing Signals & Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Wellbeing Signals */}
        <Card className="lg:col-span-8 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              Wellbeing Signals
            </CardTitle>
            <p className="text-xs text-gray-500 mt-1">Non-diagnostic indicators for emotional awareness</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wellbeingSignals.map((signal) => (
                <div key={signal.id} className="p-4 rounded-lg border border-gray-100 bg-gray-50/50">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-pink-100">
                      <Heart className="w-4 h-4 text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">{signal.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{signal.description}</p>
                      <div className="p-2 rounded bg-white border border-gray-100">
                        <p className="text-xs text-gray-700">
                          <span className="font-medium">Suggestion:</span> {signal.suggestion}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Parent Feedback & Acknowledgement */}
        <Card className="lg:col-span-4 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Feedback & Acknowledgement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {feedbackItems.filter(item => item.status === 'pending').slice(0, 3).map((item) => (
                <div key={item.id} className="p-3 rounded-lg border border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-800 mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.content}</p>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-6 flex-1"
                      onClick={() => {
                        // In real app, this would update the status
                        console.log('Acknowledged:', item.id);
                      }}
                    >
                      ✓ Acknowledge
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-6"
                      onClick={() => navigate('/parent/communications')}
                    >
                      ?
                    </Button>
                  </div>
                </div>
              ))}
              {feedbackItems.filter(item => item.status === 'pending').length === 0 && (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p className="text-xs text-gray-600">All items acknowledged</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ParentDashboardHome = () => {
  return (
    <ParentDashboardLayout>
      <ParentDashboardHomeContent />
    </ParentDashboardLayout>
  );
};

export default ParentDashboardHome;