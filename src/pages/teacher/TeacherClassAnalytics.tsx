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
  AlertTriangle, Download, TrendingDown, MessageSquare
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

  return (
    <div className="space-y-8 max-w-[1600px]">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Class Analytics & Summary</h1>
          <p className="text-sm text-gray-500 mt-1">Performance overview for Class 10-A</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 h-9 rounded-lg"
          onClick={() => toast.success('Exporting report...')}
        >
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Class Average" 
          value={`${classAnalyticsData.classAverage}%`} 
          icon={<Target className="w-5 h-5" />} 
          trend={{ value: 3, isPositive: true }}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard 
          title="Total Students" 
          value={classAnalyticsData.totalStudents} 
          icon={<Users className="w-5 h-5" />} 
          iconBg="bg-blue-50 text-blue-600"
        />
        <StatCard 
          title="Pass Rate" 
          value={`${classAnalyticsData.overallAccuracy}%`} 
          icon={<BarChart3 className="w-5 h-5" />} 
          iconBg="bg-violet-50 text-violet-600"
        />
        <StatCard 
          title="At-Risk" 
          value={atRiskData.length} 
          icon={<AlertTriangle className="w-5 h-5" />} 
          iconBg="bg-red-50 text-red-600"
        />
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

          {/* Distribution and Subject Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Distribution */}
            <Card className="border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Performance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 items-center">
                  <div className="h-36 w-36 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={pieData} 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={35} 
                          outerRadius={60} 
                          paddingAngle={4} 
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} 
                          formatter={(v: number) => [`${v} students`]} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-3">
                    {[
                      { label: 'High (≥80%)', color: '#10b981', value: pieData[0].value },
                      { label: 'Medium (60-79%)', color: '#f59e0b', value: pieData[1].value },
                      { label: 'Low (<60%)', color: '#ef4444', value: pieData[2].value }
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-600 flex-1">{item.label}</span>
                        <span className="text-sm font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>
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
          </div>

          {/* Subject Details Grid */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Subject Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {classAnalyticsData.subjectPerformance.map((subject) => (
                <Card key={subject.subject} className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-sm">{subject.subject}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{subject.teacher}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        subject.avgScore >= 75 ? 'bg-emerald-50 text-emerald-700' :
                        subject.avgScore >= 60 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {subject.avgScore}%
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Avg Score</span>
                          <span className="font-semibold">{subject.avgScore}%</span>
                        </div>
                        <Progress value={subject.avgScore} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Pass Rate</span>
                          <span className="font-semibold">{subject.passRate}%</span>
                        </div>
                        <Progress value={subject.passRate} className="h-1.5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                    subject.avgScore >= 75 ? 'bg-emerald-50 text-emerald-700' :
                    subject.avgScore >= 60 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {subject.avgScore}%
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-500">Average Score</span>
                      <span className="font-semibold text-gray-900">{subject.avgScore}%</span>
                    </div>
                    <Progress value={subject.avgScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-500">Pass Rate</span>
                      <span className="font-semibold text-gray-900">{subject.passRate}%</span>
                    </div>
                    <Progress value={subject.passRate} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
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
