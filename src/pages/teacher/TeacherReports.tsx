import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import { useTeacherMode } from '@/contexts/TeacherModeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, FileText, Download, Users, BarChart3, BookOpen, Calendar } from 'lucide-react';
import { classStudents, classAnalyticsData } from '@/data/teacherMockData';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TeacherReportsContent = () => {
  const navigate = useNavigate();
  const { currentMode } = useTeacherMode();
  const [studentReport, setStudentReport] = useState({
    studentId: '',
    reportType: '',
    dateRange: '',
  });
  const [classSummary, setClassSummary] = useState({
    dateRange: '',
  });

  const handleGenerateStudentReport = () => {
    if (!studentReport.studentId || !studentReport.reportType) {
      toast.error('Please select student and report type');
      return;
    }
    toast.success('Report generated! Download will start shortly.');
  };

  const handleGenerateClassReport = () => {
    toast.success('Class summary report generated!');
  };

  const handleExportPDF = () => {
    toast.success('Exporting as PDF...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/teacher')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and export reports</p>
        </div>
      </div>

      <Tabs defaultValue="student-reports">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="student-reports">Student Reports</TabsTrigger>
          <TabsTrigger value="class-summary">Class Summary</TabsTrigger>
          {currentMode === 'subject_teacher' && (
            <TabsTrigger value="subject-performance">Subject Performance</TabsTrigger>
          )}
        </TabsList>

        {/* Student Reports Tab */}
        <TabsContent value="student-reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Generate Student Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Select Student</Label>
                  <Select 
                    value={studentReport.studentId} 
                    onValueChange={(v) => setStudentReport(prev => ({ ...prev, studentId: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose student" />
                    </SelectTrigger>
                    <SelectContent>
                      {classStudents.map(student => (
                        <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <Select 
                    value={studentReport.reportType} 
                    onValueChange={(v) => setStudentReport(prev => ({ ...prev, reportType: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="progress">Progress Report</SelectItem>
                      <SelectItem value="term">Term Summary</SelectItem>
                      <SelectItem value="custom">Custom Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Input
                    type="month"
                    value={studentReport.dateRange}
                    onChange={(e) => setStudentReport(prev => ({ ...prev, dateRange: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleGenerateStudentReport} className="gap-2">
                  <FileText className="w-4 h-4" />
                  Generate Report
                </Button>
                <Button variant="outline" onClick={handleExportPDF} className="gap-2">
                  <Download className="w-4 h-4" />
                  Export as PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sample Report Preview */}
          {studentReport.studentId && (
            <Card>
              <CardHeader>
                <CardTitle>Report Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-6 bg-muted/20">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold">Student Progress Report</h2>
                    <p className="text-muted-foreground">
                      {classStudents.find(s => s.id === studentReport.studentId)?.name} • Class 10-A
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-background rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {classStudents.find(s => s.id === studentReport.studentId)?.overallScore}%
                      </p>
                      <p className="text-sm text-muted-foreground">Overall Score</p>
                    </div>
                    <div className="text-center p-4 bg-background rounded-lg">
                      <p className="text-2xl font-bold">#{classStudents.find(s => s.id === studentReport.studentId)?.rank}</p>
                      <p className="text-sm text-muted-foreground">Class Rank</p>
                    </div>
                    <div className="text-center p-4 bg-background rounded-lg">
                      <p className="text-2xl font-bold text-green-500">95%</p>
                      <p className="text-sm text-muted-foreground">Attendance</p>
                    </div>
                    <div className="text-center p-4 bg-background rounded-lg">
                      <p className="text-2xl font-bold">
                        {classStudents.find(s => s.id === studentReport.studentId)?.behaviour}
                      </p>
                      <p className="text-sm text-muted-foreground">Behaviour</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Full report will include subject-wise breakdown, attendance details, and teacher remarks.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

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
                <Button onClick={handleGenerateClassReport} className="gap-2">
                  <FileText className="w-4 h-4" />
                  Generate Summary
                </Button>
                <Button variant="outline" onClick={handleExportPDF} className="gap-2">
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

            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={classAnalyticsData.subjectPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="avgScore" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {classStudents.slice(0, 5).map((student, index) => (
                    <div key={student.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant={index === 0 ? 'default' : 'outline'}>#{index + 1}</Badge>
                        <span className="font-medium">{student.name}</span>
                      </div>
                      <span className="text-sm font-semibold">{student.overallScore}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Average Attendance</span>
                  <span className="font-bold">92%</span>
                </div>
                <Progress value={92} />
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-xl font-bold text-green-500">28</p>
                    <p className="text-sm text-muted-foreground">Regular</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-xl font-bold text-red-500">4</p>
                    <p className="text-sm text-muted-foreground">Irregular</p>
                  </div>
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
                  <Button className="gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Generate Report
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Class Comparison - Mathematics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { class: 'Class 9-A', avgScore: 72 },
                      { class: 'Class 9-B', avgScore: 75 },
                      { class: 'Class 10-A', avgScore: 78 },
                      { class: 'Class 10-B', avgScore: 70 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="class" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="avgScore" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
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
