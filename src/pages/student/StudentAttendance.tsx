import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import StatCard from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { attendance } from '@/data/mockData';

const StudentAttendance = () => {
  const [range, setRange] = useState<'thisMonth' | 'lastMonth'>('thisMonth');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle2 className="w-5 h-5 text-primary" />;
      case 'absent':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'late':
        return <Clock className="w-5 h-5 text-amber-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-primary/10 text-primary">Present</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      case 'late':
        return <Badge className="bg-amber-100 text-amber-700">Late</Badge>;
      default:
        return null;
    }
  };

  // Calendar view helpers
  const now = new Date();
  const thisMonthDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const viewMonthDate = range === 'lastMonth' ? lastMonthDate : thisMonthDate;
  const viewYear = viewMonthDate.getFullYear();
  const viewMonth = viewMonthDate.getMonth(); // 0-11

  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0-6 (Sun-Sat)
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const dayStatusMap = attendance.recentDays.reduce<Record<string, string>>((map, day) => {
    map[day.date] = (day as any).status;
    return map;
  }, {});

  const getStatusForDay = (day: number): 'present' | 'absent' | 'late' | null => {
    const date = new Date(viewYear, viewMonth, day);
    const iso = date.toISOString().slice(0, 10);
    const status = dayStatusMap[iso];
    if (!status) return null;
    if (status === 'present' || status === 'absent' || status === 'late') {
      return status;
    }
    return null;
  };

  return (
    <StudentDashboardLayout title="Attendance">
      <div className="space-y-6">
        {/* Overall Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Attendance Rate"
            value={`${attendance.percentage}%`}
            icon={<CheckCircle2 className="w-5 h-5" />}
          />
          <StatCard
            title="Days Present"
            value={attendance.presentDays}
            icon={<Calendar className="w-5 h-5" />}
          />
          <StatCard
            title="Days Absent"
            value={attendance.absentDays}
            icon={<XCircle className="w-5 h-5" />}
          />
        </div>

        {/* Attendance Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-baseline justify-between gap-2">
              <CardTitle className="text-lg">Attendance Overview</CardTitle>
              <p className="text-xs text-muted-foreground">
                Based on {attendance.totalDays} working days
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center md:items-center md:justify-between gap-6">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
                <svg className="w-full h-full transform -rotate-90 relative">
                  <circle
                    cx="80"
                    cy="80"
                    r="64"
                    stroke="hsl(var(--muted))"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="64"
                    stroke="url(#attendanceGradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(attendance.percentage / 100) * 402} 402`}
                  />
                  <defs>
                    <linearGradient id="attendanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--primary-foreground))" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{attendance.percentage}%</span>
                  <span className="text-xs text-muted-foreground mt-1">Overall attendance</span>
                </div>
              </div>

              <div className="w-full md:w-auto space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                    <span className="font-medium">Present</span>
                  </div>
                  <span className="text-muted-foreground">
                    {attendance.presentDays} days
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${(attendance.presentDays / attendance.totalDays) * 100}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-destructive" />
                    <span className="font-medium">Absent</span>
                  </div>
                  <span className="text-muted-foreground">
                    {attendance.absentDays} days
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-destructive"
                    style={{
                      width: `${(attendance.absentDays / attendance.totalDays) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Attendance Calendar */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle className="text-lg">Attendance Calendar</CardTitle>
            <Select value={range} onValueChange={(value) => setRange(value as 'thisMonth' | 'lastMonth')}>
              <SelectTrigger className="h-8 w-[160px] text-xs">
                <SelectValue placeholder="This month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thisMonth">This month</SelectItem>
                <SelectItem value="lastMonth">Last month</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">
                  {viewMonthDate.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span>Present</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
                    <span>Absent</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-[11px] text-muted-foreground mb-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center font-medium">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-xs">
                {Array.from({ length: firstDayOfWeek }).map((_, index) => (
                  <div key={`empty-${index}`} className="h-9 rounded-md bg-transparent" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const status = getStatusForDay(day);
                  const isToday =
                    viewYear === now.getFullYear() &&
                    viewMonth === now.getMonth() &&
                    day === now.getDate();

                  let bgClass = 'bg-muted';
                  let textClass = 'text-gray-700';

                  if (status === 'present' || status === 'late') {
                    bgClass = 'bg-emerald-500/80';
                    textClass = 'text-white';
                  } else if (status === 'absent') {
                    bgClass = 'bg-rose-500/85';
                    textClass = 'text-white';
                  }

                  return (
                    <div
                      key={day}
                      className={`flex h-9 items-center justify-center rounded-md text-xs ${bgClass} ${textClass} ${
                        !status ? 'bg-muted/40 text-gray-600' : ''
                      } ${isToday ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentAttendance;