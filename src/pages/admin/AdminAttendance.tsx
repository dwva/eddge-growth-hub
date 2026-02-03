import { useState } from 'react';
import AdminDashboardLayout from '@/components/layout/AdminDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { 
  Users,
  UserCheck,
  UserX,
  Clock,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const classAttendanceData = [
  { class: '9-A', present: 32, absent: 3, late: 1, total: 36, percentage: 88.9 },
  { class: '9-B', present: 30, absent: 2, late: 0, total: 32, percentage: 93.8 },
  { class: '10-A', present: 28, absent: 4, late: 2, total: 34, percentage: 82.4 },
  { class: '10-B', present: 26, absent: 1, late: 1, total: 28, percentage: 92.9 },
  { class: '11-A', present: 24, absent: 1, late: 0, total: 25, percentage: 96.0 },
  { class: '11-B', present: 25, absent: 2, late: 1, total: 28, percentage: 89.3 },
];

const weeklyTrend = [
  { day: 'Mon', attendance: 92 },
  { day: 'Tue', attendance: 88 },
  { day: 'Wed', attendance: 95 },
  { day: 'Thu', attendance: 90 },
  { day: 'Fri', attendance: 85 },
];

const AdminAttendance = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedClass, setSelectedClass] = useState('all');

  const totalPresent = classAttendanceData.reduce((sum, c) => sum + c.present, 0);
  const totalAbsent = classAttendanceData.reduce((sum, c) => sum + c.absent, 0);
  const totalLate = classAttendanceData.reduce((sum, c) => sum + c.late, 0);
  const totalStudents = classAttendanceData.reduce((sum, c) => sum + c.total, 0);
  const overallPercentage = ((totalPresent / totalStudents) * 100).toFixed(1);

  return (
    <AdminDashboardLayout 
      pageTitle="Attendance" 
      pageDescription="Track and manage student attendance"
    >
      <div className="space-y-6">
        {/* Overall Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{overallPercentage}%</div>
                <div className="text-sm text-muted-foreground">Overall Attendance</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalPresent}</div>
                <div className="text-sm text-muted-foreground">Present Today</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalAbsent}</div>
                <div className="text-sm text-muted-foreground">Absent Today</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalLate}</div>
                <div className="text-sm text-muted-foreground">Late Arrivals</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar & Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
              <div className="mt-4 space-y-3">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="9-A">Class 9-A</SelectItem>
                    <SelectItem value="9-B">Class 9-B</SelectItem>
                    <SelectItem value="10-A">Class 10-A</SelectItem>
                    <SelectItem value="10-B">Class 10-B</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                  <Download className="w-4 h-4" />
                  Export Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Class-wise Attendance */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Class-wise Attendance</CardTitle>
              <div className="text-sm text-muted-foreground">
                {selectedDate?.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classAttendanceData.map((cls) => (
                  <div key={cls.class} className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">Class {cls.class}</div>
                          <div className="text-sm text-muted-foreground">{cls.total} students</div>
                        </div>
                      </div>
                      <Badge 
                        className={cls.percentage >= 90 
                          ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                          : cls.percentage >= 80 
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                            : 'bg-red-100 text-red-700 hover:bg-red-100'
                        }
                      >
                        {cls.percentage}%
                      </Badge>
                    </div>
                    <Progress value={cls.percentage} className="h-2 mb-2" />
                    <div className="flex gap-4 text-sm">
                      <span className="text-green-600">✓ {cls.present} Present</span>
                      <span className="text-red-600">✗ {cls.absent} Absent</span>
                      <span className="text-amber-600">⏱ {cls.late} Late</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-4 h-40">
              {weeklyTrend.map((day) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/30"
                    style={{ height: `${day.attendance}%` }}
                  >
                    <div 
                      className="w-full bg-primary rounded-t-lg"
                      style={{ height: '100%' }}
                    />
                  </div>
                  <span className="text-sm font-medium">{day.day}</span>
                  <span className="text-xs text-muted-foreground">{day.attendance}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminAttendance;
