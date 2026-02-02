import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import StatCard from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { attendance } from '@/data/mockData';

const StudentAttendance = () => {
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
          <CardHeader>
            <CardTitle className="text-lg">Recent Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendance.recentDays.map((day, index) => (
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
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  {getStatusBadge(day.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentAttendance;