import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import PageHeader from '@/components/teacher/PageHeader';
import { useTeacherMode } from '@/contexts/TeacherModeContext';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FileText, Download, Users, BarChart3, BookOpen, Calendar, AlertTriangle, TrendingDown, MessageSquare } from 'lucide-react';
import { classStudents, classAnalyticsData, atRiskStudents } from '@/data/teacherMockData';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TeacherReportsContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentMode } = useTeacherMode();
  
  // Determine active tab from URL path
  const getTabFromPath = () => {
    if (location.pathname.includes('class-summary')) return 'class-summary';
    if (location.pathname.includes('subject-performance')) return 'subject-performance';
    return currentMode === 'class_teacher' ? 'class-summary' : 'subject-performance';
  };
  
  const [activeTab, setActiveTab] = useState(getTabFromPath());
  
  // Update tab when URL changes
  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);
  
  // Handle tab change and update URL
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const routeMap: Record<string, string> = {
      'class-summary': '/teacher/reports/class-summary',
      'subject-performance': '/teacher/reports/subject-performance',
    };
    navigate(routeMap[value] || '/teacher/reports/class-summary');
  };
  
  const [classSummary, setClassSummary] = useState({
    dateRange: '',
  });

  const handleGenerateClassReport = () => {
    toast.success('Class summary report generated!');
  };

  const handleExportPDF = () => {
    toast.success('Exporting as PDF...');
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <PageHeader
        title="Reports"
        subtitle="Generate and export reports"
        action={
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs rounded-lg gap-1.5" onClick={handleExportPDF}>
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className={cn(
          "h-8 p-1 rounded-lg bg-gray-100 mb-6",
          currentMode === 'subject_teacher' ? "inline-flex" : "inline-flex"
        )}>
          {currentMode === 'class_teacher' && (
            <TabsTrigger value="class-summary" className="text-xs px-2.5 py-1.5 h-7 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">Class Summary</TabsTrigger>
          )}
          {currentMode === 'subject_teacher' && (
            <TabsTrigger value="subject-performance" className="text-xs px-2.5 py-1.5 h-7 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">Subject Performance</TabsTrigger>
          )}
        </TabsList>

        {/* Class Summary Tab */}
        <TabsContent value="class-summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Class Summary Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Input
                    type="month"
                    value={classSummary.dateRange}
                    onChange={(e) => setClassSummary({ dateRange: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleGenerateClassReport} className="gap-1.5 h-8 text-xs">
                  <FileText className="w-4 h-4" />
                  Generate Summary
                </Button>
                <Button size="sm" variant="outline" onClick={handleExportPDF} className="gap-1.5 h-8 text-xs">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Summary Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Class Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Class Average</span>
                  <span className="font-bold">{classAnalyticsData.classAverage}%</span>
                </div>
                <Progress value={classAnalyticsData.classAverage} />
                <div className="space-y-2 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-500" />
                      High Performers
                    </span>
                    <span>{classAnalyticsData.distribution.high} students</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-yellow-500" />
                      Medium Performers
                    </span>
                    <span>{classAnalyticsData.distribution.medium} students</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500" />
                      Low Performers
                    </span>
                    <span>{classAnalyticsData.distribution.low} students</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm border-gray-100">
              <CardHeader>
                <CardTitle className="text-base">Subject-wise Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 rounded-lg bg-gradient-to-b from-gray-50/50 to-transparent p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={classAnalyticsData.subjectPerformance} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                      <defs>
                        <linearGradient id="reportsBarGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.85} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7280' }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} formatter={(v: number) => [`${v}%`, 'Score']} />
                      <Bar dataKey="avgScore" fill="url(#reportsBarGrad)" radius={[6, 6, 0, 0]} maxBarSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm border-gray-100">
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-semibold">Top Performers</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-3">
                <div className="space-y-2 max-h-[180px] overflow-y-auto">
                  {classStudents.slice(0, 5).map((student, index) => (
                    <div key={student.id} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2">
                        <Badge variant={index === 0 ? 'default' : 'outline'} className="h-5 px-1.5 text-xs">#{index + 1}</Badge>
                        <span className="font-medium text-sm">{student.name}</span>
                      </div>
                      <span className="text-xs font-semibold">{student.overallScore}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* At-Risk Students Section */}
            <Card className="rounded-xl shadow-sm border-gray-100">
              <CardHeader className="py-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  At-Risk Students ({atRiskStudents.length})
                </CardTitle>
                <p className="text-xs text-muted-foreground">Students needing immediate attention</p>
              </CardHeader>
              <CardContent className="py-0 pb-3">
                <div className="space-y-2 max-h-[180px] overflow-y-auto">
                  {atRiskStudents.map((student) => (
                    <div key={student.id} className="flex items-center gap-3 p-2 rounded-lg bg-red-50/50 border border-red-100">
                      <Avatar className="w-9 h-9 border border-red-100 flex-shrink-0">
                        <AvatarFallback className="bg-red-100 text-red-600 font-semibold text-xs">
                          {student.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-semibold text-gray-900 text-sm truncate">{student.name}</p>
                          <Badge variant="destructive" className="text-[10px] h-5 px-1.5">{student.overallScore}%</Badge>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-0.5 text-[11px] text-gray-600">
                          <span className="text-red-700"><TrendingDown className="w-2.5 h-2.5 inline mr-0.5" />{student.trend}</span>
                          <span>{student.attendance}% attendance</span>
                          <span>Weak: {student.weakestSubject}</span>
                        </div>
                        <Button size="sm" variant="outline" className="h-6 text-[10px] rounded-md mt-1.5 px-2" onClick={() => navigate('/teacher/communication')}>
                          <MessageSquare className="w-2.5 h-2.5 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subject Performance Tab (Subject Teacher Only) */}
        {currentMode === 'subject_teacher' && (
          <TabsContent value="subject-performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Subject Performance Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Select Subject</Label>
                    <Select defaultValue="mathematics">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <Input type="month" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="gap-1.5 h-8 text-xs">
                    <BarChart3 className="w-4 h-4" />
                    Generate Report
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm border-gray-100">
              <CardHeader>
                <CardTitle className="text-base">Class Comparison - Mathematics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 rounded-lg bg-gradient-to-b from-gray-50/50 to-transparent p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { class: 'Class 9-A', avgScore: 72 },
                      { class: 'Class 9-B', avgScore: 75 },
                      { class: 'Class 10-A', avgScore: 78 },
                      { class: 'Class 10-B', avgScore: 70 },
                    ]} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="subjectPerfBarGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.85} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="class" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} formatter={(v: number) => [`${v}%`, 'Avg Score']} />
                      <Bar dataKey="avgScore" fill="url(#subjectPerfBarGrad)" radius={[8, 8, 0, 0]} maxBarSize={56} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

const TeacherReports = () => {
  return (
    <TeacherDashboardLayout>
      <TeacherReportsContent />
    </TeacherDashboardLayout>
  );
};

export default TeacherReports;
