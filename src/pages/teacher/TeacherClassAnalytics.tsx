import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import { useTeacherMode } from '@/contexts/TeacherModeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Target, Users, BarChart3, TrendingUp, TrendingDown, AlertCircle, AlertTriangle, Calendar } from 'lucide-react';
import { classAnalyticsData, atRiskStudents as atRiskData } from '@/data/teacherMockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#22c55e', '#eab308', '#ef4444'];

const TeacherClassAnalyticsContent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentMode } = useTeacherMode();
  const defaultTab = searchParams.get('tab') || 'overall';
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Mode restriction
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

  const pieData = [
    { name: 'High (≥80%)', value: classAnalyticsData.distribution.high },
    { name: 'Medium (60-79%)', value: classAnalyticsData.distribution.medium },
    { name: 'Low (<60%)', value: classAnalyticsData.distribution.low },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/teacher')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Class Analytics</h1>
          <p className="text-muted-foreground">View comprehensive performance metrics for your class</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overall">Overall Performance</TabsTrigger>
          <TabsTrigger value="subject-wise">Subject-wise</TabsTrigger>
          <TabsTrigger value="at-risk">At-Risk Students</TabsTrigger>
        </TabsList>

        {/* Overall Performance Tab */}
        <TabsContent value="overall" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Class Average</span>
                </div>
                <p className="text-3xl font-bold">{classAnalyticsData.classAverage}%</p>
                <Progress value={classAnalyticsData.classAverage} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Total Students</span>
                </div>
                <p className="text-3xl font-bold">{classAnalyticsData.totalStudents}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Overall Accuracy</span>
                </div>
                <p className="text-3xl font-bold">{classAnalyticsData.overallAccuracy}%</p>
                <Progress value={classAnalyticsData.overallAccuracy} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Performance Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Performance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={classAnalyticsData.performanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribution Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="flex-1">High Performers (≥80%)</span>
                  <span className="font-semibold">{classAnalyticsData.distribution.high}</span>
                  <Progress value={(classAnalyticsData.distribution.high / classAnalyticsData.totalStudents) * 100} className="w-24" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="flex-1">Medium Performers (60-79%)</span>
                  <span className="font-semibold">{classAnalyticsData.distribution.medium}</span>
                  <Progress value={(classAnalyticsData.distribution.medium / classAnalyticsData.totalStudents) * 100} className="w-24" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="flex-1">Low Performers (&lt;60%)</span>
                  <span className="font-semibold">{classAnalyticsData.distribution.low}</span>
                  <Progress value={(classAnalyticsData.distribution.low / classAnalyticsData.totalStudents) * 100} className="w-24" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Distribution Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${value}`}
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subject-wise Tab */}
        <TabsContent value="subject-wise" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[...classAnalyticsData.subjectPerformance].sort((a, b) => a.avgScore - b.avgScore)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="avgScore" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classAnalyticsData.subjectPerformance.map((subject) => (
              <Card key={subject.subject}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{subject.subject}</h3>
                    <Badge variant={subject.avgScore >= 75 ? 'default' : subject.avgScore >= 60 ? 'secondary' : 'destructive'}>
                      {subject.avgScore}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Teacher: {subject.teacher}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span>Pass Rate</span>
                    <span className="font-medium">{subject.passRate}%</span>
                  </div>
                  <Progress value={subject.passRate} className="mt-1" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* At-Risk Students Tab */}
        <TabsContent value="at-risk" className="space-y-6">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <div>
                  <h3 className="font-semibold">At-Risk Criteria</h3>
                  <p className="text-sm text-muted-foreground">
                    Students with overall score below 60%, declining trend, or low attendance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                At-Risk Students ({atRiskData.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Overall Score</TableHead>
                      <TableHead>Weakest Subject</TableHead>
                      <TableHead>Trend</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {atRiskData.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9">
                              <AvatarFallback className="bg-red-100 text-red-600 text-sm">
                                {student.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">{student.overallScore}%</Badge>
                        </TableCell>
                        <TableCell>{student.weakestSubject}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-red-500">
                            <TrendingDown className="w-4 h-4" />
                            <span className="text-sm">{student.trend}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={student.attendance < 80 ? 'text-red-500' : ''}>{student.attendance}%</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">View Details</Button>
                            <Button size="sm" variant="outline" className="gap-1">
                              <Calendar className="w-3 h-3" />
                              Schedule Meeting
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
