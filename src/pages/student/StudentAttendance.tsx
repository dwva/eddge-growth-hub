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
  const [range, setRange] = useState<'thisMonth' | 'lastMonth' | 'all'>('thisMonth');

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

  const filteredRecentDays = attendance.recentDays.filter((day) => {
    const date = new Date(day.date);
    const now = new Date();

    if (range === 'all') return true;

    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const lastMonthDate = new Date(thisYear, thisMonth - 1, 1);
    const lastMonth = lastMonthDate.getMonth();
    const lastYear = lastMonthDate.getFullYear();

    if (range === 'thisMonth') {
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    }

    if (range === 'lastMonth') {
      return date.getMonth() === lastMonth && date.getFullYear() === lastYear;
    }

    return true;
  });

  return (
    <StudentDashboardLayout title="Attendance">
      <div className="space-y-6">
        {/* Overall Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
          <StatCard
            title="Late Arrivals"
            value={attendance.lateDays}
            icon={<Clock className="w-5 h-5" />}
          />
        </div>

        {/* Attendance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="hsl(var(--muted))"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="hsl(var(--primary))"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(attendance.percentage / 100) * 352} 352`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{attendance.percentage}%</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Present ({attendance.presentDays})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span>Absent ({attendance.absentDays})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span>Late ({attendance.lateDays})</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Days */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle className="text-lg">Recent Attendance</CardTitle>
            <Select value={range} onValueChange={(value) => setRange(value as 'thisMonth' | 'lastMonth' | 'all')}>
              <SelectTrigger className="h-8 w-[160px] text-xs">
                <SelectValue placeholder="This month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thisMonth">This month</SelectItem>
                <SelectItem value="lastMonth">Last month</SelectItem>
                <SelectItem value="all">All records</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {filteredRecentDays.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-gray-900">
                  No attendance data for this period
                </p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Attendance data will appear once classes begin or when records are available for the selected range.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRecentDays.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(day.status)}
                      <span className="font-medium">
                        {new Date(day.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getStatusBadge(day.status)}
                      {day.status === 'late' && (
                        <p className="text-[11px] text-amber-700">
                          {typeof (day as any).lateByMinutes === 'number'
                            ? `Late by ${(day as any).lateByMinutes} minutes`
                            : (day as any).arrivalTime
                            ? `Arrived at ${(day as any).arrivalTime}`
                            : 'Late arrival'}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentAttendance;