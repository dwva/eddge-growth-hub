import { useNavigate } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import StatCard from '@/components/shared/StatCard';
import { useTeacherMode } from '@/contexts/TeacherModeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, Users, BarChart3, TrendingUp, AlertCircle, 
  AlertTriangle, Download, TrendingDown, MessageSquare, BookOpen, MessageCircle
} from 'lucide-react';
import { classAnalyticsData, atRiskStudents as atRiskData, classStudents } from '@/data/teacherMockData';
import { toast } from 'sonner';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';

const pieData = [
  { name: 'High', value: classAnalyticsData.distribution.high, color: '#10b981' },
  { name: 'Medium', value: classAnalyticsData.distribution.medium, color: '#f59e0b' },
  { name: 'Low', value: classAnalyticsData.distribution.low, color: '#ef4444' },
];

const TeacherClassAnalyticsContent = () => {
  const navigate = useNavigate();
  const { currentMode } = useTeacherMode();

  if (currentMode !== 'class_teacher') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Class Teacher Mode Required</h2>
        <p className="text-muted-foreground mb-4">This page is only accessible in Class Teacher mode.</p>
        <Button onClick={() => navigate('/teacher')}>Back to Dashboard</Button>
      </div>
    );
  }

  const totalUnread = 3;
  
  return (
    <div className="space-y-5 max-w-[1600px]">
      {/* Header Section */}
      <div className="flex items-start gap-4">
        {/* Transparent Card */}
        <div className="flex-1 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-xs font-medium mb-2 text-primary">
                CLASS TEACHER • GRADE 10-A
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Class Analytics</h1>
              <p className="text-gray-600 text-sm">Performance metrics • Updated today</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-2 h-8">
              <BarChart3 className="w-3.5 h-3.5" />
              View Reports
            </Button>
            <Button size="sm" variant="outline" className="gap-2 h-8 relative">
              <MessageCircle className="w-3.5 h-3.5" />
              Parent Messages
              {totalUnread > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {totalUnread}
                </span>
              )}
            </Button>
            <Button 
              size="sm"
              variant="outline"
              className="ml-auto gap-2 h-8"
              onClick={() => toast.success('Exporting report...')}
            >
              <Download className="w-3.5 h-3.5" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Square Stats Box */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-4 w-48 text-white">
          <div className="space-y-3">
            <div>
              <div className="text-xs text-white/70 mb-1">Class Average</div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{classAnalyticsData.classAverage}%</span>
                <span className="text-emerald-200 text-sm mb-1 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  3%
                </span>
              </div>
            </div>
            <div className="h-px bg-white/20" />
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-xs text-white/70 mb-1">Students</div>
                <div className="text-xl font-bold">{classAnalyticsData.totalStudents}</div>
              </div>
              <div>
                <div className="text-xs text-white/70 mb-1">At-Risk</div>
                <div className="text-xl font-bold">{atRiskData.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Analytics and Summary */}
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="inline-flex h-9 p-1 rounded-lg bg-gray-100">
          <TabsTrigger value="analytics" className="px-4">Analytics</TabsTrigger>
          <TabsTrigger value="summary" className="px-4">Summary</TabsTrigger>
        </TabsList>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 mt-6">
          {/* Performance Trend */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Performance Over Time</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Weekly class average scores</p>
                </div>
                <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">+3% this month</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={classAnalyticsData.performanceTrend}>
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis 
                      dataKey="week" 
                      tick={{ fontSize: 12, fill: '#9ca3af' }} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      tick={{ fontSize: 12, fill: '#9ca3af' }} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: 'none', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
                        padding: '8px 12px' 
                      }} 
                      formatter={(v: number) => [`${v}%`, 'Score']} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#8b5cf6" 
                      strokeWidth={2} 
                      fill="url(#areaGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Subject Comparison */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Subject Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[...classAnalyticsData.subjectPerformance].sort((a, b) => b.avgScore - a.avgScore)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis 
                      dataKey="subject" 
                      tick={{ fontSize: 11, fill: '#9ca3af' }} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      tick={{ fontSize: 12, fill: '#9ca3af' }} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: 'none', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
                        padding: '8px 12px' 
                      }} 
                      formatter={(v: number) => [`${v}%`, 'Avg Score']} 
                    />
                    <Bar dataKey="avgScore" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Subject Details Grid */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Subject Performance Details</h3>
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-4 min-w-max">
                {classAnalyticsData.subjectPerformance.map((subject) => (
                  <div key={subject.subject} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all w-64 flex-shrink-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <span className={`text-lg font-bold ${
                        subject.avgScore >= 75 ? 'text-emerald-600' :
                        subject.avgScore >= 60 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {subject.avgScore}%
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-1">{subject.subject}</h4>
                    <p className="text-xs text-gray-500 mb-3">{subject.teacher}</p>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Pass Rate</span>
                          <span className="font-medium">{subject.passRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="h-1.5 rounded-full bg-primary"
                            style={{ width: `${subject.passRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers */}
            <Card className="border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Top Performers</CardTitle>
                <p className="text-sm text-gray-500">Students with highest scores</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {classStudents.slice(0, 5).map((student, index) => (
                    <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Badge variant={index === 0 ? 'default' : 'outline'} className="h-6 px-2">
                          #{index + 1}
                        </Badge>
                        <Avatar className="w-9 h-9">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{student.name}</span>
                      </div>
                      <span className="text-sm font-bold text-primary">{student.overallScore}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* At-Risk Students */}
            <Card className="border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  At-Risk Students ({atRiskData.length})
                </CardTitle>
                <p className="text-sm text-gray-500">Students needing immediate attention</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {atRiskData.map((student) => (
                    <div key={student.id} className="p-3 rounded-lg bg-red-50 border border-red-100">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-9 h-9 border border-red-200">
                          <AvatarFallback className="bg-red-100 text-red-700 font-semibold text-xs">
                            {student.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-sm">{student.name}</p>
                            <Badge variant="destructive" className="text-xs h-5">
                              {student.overallScore}%
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-600">
                            <span className="text-red-700">
                              <TrendingDown className="w-3 h-3 inline mr-0.5" />
                              {student.trend}
                            </span>
                            <span>{student.attendance}% attendance</span>
                            <span>Weak: {student.weakestSubject}</span>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 text-xs mt-2"
                            onClick={() => navigate('/teacher/communication')}
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Contact Parent
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Class Performance Summary */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Class Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Class Average</span>
                    <span className="text-2xl font-bold text-primary">{classAnalyticsData.classAverage}%</span>
                  </div>
                  <Progress value={classAnalyticsData.classAverage} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-500" />
                      High Performers
                    </span>
                    <span className="font-semibold">{classAnalyticsData.distribution.high} students</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-yellow-500" />
                      Medium Performers
                    </span>
                    <span className="font-semibold">{classAnalyticsData.distribution.medium} students</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500" />
                      Low Performers
                    </span>
                    <span className="font-semibold">{classAnalyticsData.distribution.low} students</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-gray-600 mb-2">Best Performing Subject</div>
                  {(() => {
                    const best = [...classAnalyticsData.subjectPerformance].sort((a, b) => b.avgScore - a.avgScore)[0];
                    return (
                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                        <div className="font-semibold text-sm">{best.subject}</div>
                        <div className="text-xs text-gray-600 mt-0.5">{best.teacher}</div>
                        <div className="text-lg font-bold text-emerald-700 mt-1">{best.avgScore}%</div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const TeacherClassAnalytics = () => {
  return (
    <TeacherDashboardLayout>
      <TeacherClassAnalyticsContent />
    </TeacherDashboardLayout>
  );
};

export default TeacherClassAnalytics;
