import { useParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import AdminDashboardLayout from '@/components/layout/AdminDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useAdminData } from '@/contexts/AdminDataContext';
import { 
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { format, subDays } from 'date-fns';
import { Label } from '@/components/ui/label';

const ClassDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useAdminData();

  const classData = useMemo(() => {
    return state.classes.find(c => c.id === id);
  }, [state.classes, id]);

  const classTeacher = useMemo(() => {
    if (!classData?.classTeacherId) return null;
    return state.teachers.find(t => t.id === classData.classTeacherId);
  }, [classData, state.teachers]);

  const studentsInClass = useMemo(() => {
    if (!classData) return [];
    return state.students.filter(s => s.classId === classData.id);
  }, [classData, state.students]);

  const studentCount = studentsInClass.length;
  const averagePerformance = studentCount > 0
    ? Math.round(studentsInClass.reduce((sum, s) => sum + s.performanceScore, 0) / studentCount)
    : 0;
  const averageAttendance = studentCount > 0
    ? Math.round(studentsInClass.reduce((sum, s) => sum + s.attendancePercentage, 0) / studentCount)
    : 0;

  // Attendance breakdown over time
  const attendanceBreakdown = useMemo(() => {
    if (!classData) return [];
    const classRecords = state.attendanceRecords
      .filter(r => r.classId === classData.id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30);
    
    return classRecords.map(record => {
      const total = record.presentCount + record.absentCount + record.lateCount;
      return {
        date: format(new Date(record.date), 'MMM dd'),
        attendance: total > 0 ? Math.round((record.presentCount / total) * 100) : 0,
      };
    });
  }, [classData, state.attendanceRecords]);

  // Performance trends
  const performanceTrend = useMemo(() => {
    if (studentCount === 0) return [];
    return Array.from({ length: 7 }, (_, i) => ({
      month: format(subDays(new Date(), (6 - i) * 30), 'MMM'),
      score: Math.max(60, Math.min(100, averagePerformance + (Math.random() * 10 - 5))),
    }));
  }, [studentCount, averagePerformance]);

  if (!classData) {
    return (
      <AdminDashboardLayout pageTitle="Class Not Found" pageDescription="">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">Class not found</p>
          <Button onClick={() => navigate('/admin/classes')}>Back to Classes</Button>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout 
      pageTitle={`Class ${classData.grade}-${classData.section}`}
      pageDescription="Class Detail View"
    >
      <div className="space-y-2 sm:space-y-4 md:space-y-6">
        <Button variant="ghost" onClick={() => navigate('/admin/classes')} className="gap-1.5 sm:gap-2 text-sm h-8 sm:h-10">
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Back to Classes
        </Button>

        {/* Class Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Class Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <Label className="text-muted-foreground text-xs sm:text-sm">Grade & Section</Label>
                <p className="font-medium text-base sm:text-lg">Class {classData.grade}-{classData.section}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Class Teacher</Label>
                <p className="font-medium">
                  {classTeacher ? (
                    <span 
                      className="cursor-pointer hover:underline"
                      onClick={() => navigate(`/admin/teachers/${classTeacher.id}`)}
                    >
                      {classTeacher.name}
                    </span>
                  ) : (
                    'Not Assigned'
                  )}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs sm:text-sm">Student Count</Label>
                <p className="font-medium text-base sm:text-lg">{studentCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-lg sm:text-2xl font-bold">{studentCount}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-lg sm:text-2xl font-bold">{averageAttendance}%</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Avg. Attendance</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-lg sm:text-2xl font-bold">{averagePerformance}%</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Avg. Performance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {attendanceBreakdown.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No attendance data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={attendanceBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="attendance" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[60, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Student Roster */}
        <Card>
          <CardHeader>
            <CardTitle>Student Roster ({studentCount})</CardTitle>
          </CardHeader>
          <CardContent>
            {studentCount === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No students enrolled in this class
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Roll No.</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Attendance</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Performance</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {studentsInClass.map((student) => (
                      <tr 
                        key={student.id} 
                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => navigate(`/admin/students/${student.id}`)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                              {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{student.rollNumber}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{student.attendancePercentage}%</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{student.performanceScore}%</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge 
                            className={student.status === 'Active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                            }
                          >
                            {student.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
};

export default ClassDetail;

