import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import StatCard from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { attendance } from '@/data/mockData';

const StudentAttendance = () => {
  const now = new Date();
  const [viewDate, setViewDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));

  const goToPrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
  };

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
  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth(); // 0-11

  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0-6 (Sun-Sat)
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const totalCells = firstDayOfWeek + daysInMonth;
  const trailingEmptyCells = (7 - (totalCells % 7)) % 7;

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
      <div className="space-y-3 md:space-y-6">
        {/* Overall Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <div className="flex flex-col gap-6">
              {/* Main stacked attendance bar */}
              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Overall attendance
                    </p>
                    <p className="text-xl md:text-3xl font-bold text-gray-900 leading-tight">
                      {attendance.percentage}%
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {attendance.presentDays} days present · {attendance.absentDays} days absent
                  </p>
                </div>
                <div className="h-3 w-full rounded-full bg-muted/70 overflow-hidden flex shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-primary/80 to-primary/60"
                    style={{
                      width: `${(attendance.presentDays / attendance.totalDays) * 100}%`,
                    }}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-rose-400 to-rose-500"
                    style={{
                      width: `${(attendance.absentDays / attendance.totalDays) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Present / Absent breakdown + last 7 days chips */}
              <div className="grid gap-4 md:grid-cols-[2fr,1.5fr] text-sm">
                <div className="space-y-3 border rounded-xl p-4 bg-white shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                      <span className="font-medium">Present</span>
                    </div>
                    <span className="text-muted-foreground">
                      {attendance.presentDays} days (
                      {Math.round((attendance.presentDays / attendance.totalDays) * 100)}%)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
                      <span className="font-medium">Absent</span>
                    </div>
                    <span className="text-muted-foreground">
                      {attendance.absentDays} days (
                      {Math.round((attendance.absentDays / attendance.totalDays) * 100)}%)
                    </span>
                  </div>
                </div>

                <div className="space-y-2 rounded-xl bg-muted/40 p-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-gray-700">Last 7 days snapshot</span>
                    <span>
                      {attendance.recentDays.filter((d) => d.status === 'present').length} present ·{' '}
                      {attendance.recentDays.filter((d) => d.status === 'absent').length} absent
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {attendance.recentDays.map((day, index) => {
                      const status = (day as any).status;
                      const bg =
                        status === 'present'
                          ? 'bg-emerald-500'
                          : status === 'absent'
                          ? 'bg-rose-500'
                          : 'bg-muted';
                      return (
                        <div
                          key={index}
                          className={`h-3 w-6 rounded-full ${bg}`}
                          aria-hidden="true"
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Attendance Calendar */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={goToPrevMonth}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-sm font-medium"
                  onClick={goToToday}
                >
                  Today
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={goToNextMonth}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-bold text-gray-900 ml-4">
                  {viewDate.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="monthly">
                  <SelectTrigger className="h-9 w-[130px] text-sm">
                    <SelectValue placeholder="Monthly" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center border rounded-md">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-r-none">
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-l-none border-l">
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="border rounded-xl overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b bg-white">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="py-3 text-center text-sm font-semibold text-gray-800 border-r last:border-r-0"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Month grid */}
              <div className="grid grid-cols-7">
                {Array.from({ length: firstDayOfWeek }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="h-20 bg-gray-50/50 border-r border-b last:border-r-0"
                  />
                ))}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const status = getStatusForDay(day);
                  const isToday =
                    viewYear === now.getFullYear() &&
                    viewMonth === now.getMonth() &&
                    day === now.getDate();

                  let cellBg = 'bg-white';
                  let textColor = 'text-gray-700';

                  if (status === 'present' || status === 'late') {
                    cellBg = 'bg-emerald-50 border-emerald-200';
                    textColor = 'text-emerald-900';
                  } else if (status === 'absent') {
                    cellBg = 'bg-rose-50 border-rose-200';
                    textColor = 'text-rose-900';
                  } else if (isToday) {
                    cellBg = 'bg-amber-50 border-amber-200';
                  }

                  return (
                    <div
                      key={day}
                      className={`h-20 ${cellBg} border-r border-b last:border-r-0 relative`}
                    >
                      <span className={`absolute top-2 right-3 text-sm font-medium ${textColor}`}>
                        {day}
                      </span>
                    </div>
                  );
                })}
                {Array.from({ length: trailingEmptyCells }).map((_, index) => (
                  <div
                    key={`trailing-${index}`}
                    className="h-20 bg-gray-50/50 border-r border-b last:border-r-0"
                  />
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-4 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex h-3 w-3 rounded bg-gradient-to-br from-emerald-400 to-emerald-500" />
                <span>Present</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex h-3 w-3 rounded bg-gradient-to-br from-rose-400 to-rose-500" />
                <span>Absent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex h-3 w-3 rounded bg-amber-50 border border-amber-200" />
                <span>Today</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentAttendance;