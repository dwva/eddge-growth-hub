import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  MessageSquare,
  Settings,
  TrendingUp,
  AlertCircle,
  FileText
} from 'lucide-react';
import { childInfo, childPerformance, attendance } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { label: 'Home', icon: <Home className="w-5 h-5" />, path: '/parent' },
  { label: 'Progress', icon: <TrendingUp className="w-5 h-5" />, path: '/parent/progress' },
  { label: 'Homework', icon: <BookOpen className="w-5 h-5" />, path: '/parent/homework' },
  { label: 'Attendance', icon: <Calendar className="w-5 h-5" />, path: '/parent/attendance' },
  { label: 'Communication', icon: <MessageSquare className="w-5 h-5" />, path: '/parent/communication' },
  { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/parent/settings' },
];

const ParentHome = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout navItems={navItems} title="Parent Dashboard">
      <div className="space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-5">
          <h2 className="text-xl font-semibold">Welcome, {user?.name?.split(' ')[0]}! 👋</h2>
          <p className="text-muted-foreground">Here's how {childInfo.name} is doing this week.</p>
        </div>

        {/* Child Overview Card */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
                {childInfo.avatar}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{childInfo.name}</h3>
                <p className="text-muted-foreground">{childInfo.class} • Roll No. {childInfo.rollNo}</p>
              </div>
              <div className="ml-auto text-right">
                <Badge className="text-lg px-3 py-1">{childPerformance.overallGrade}</Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  Rank {childPerformance.rank} of {childPerformance.totalStudents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Attendance" value={`${attendance.percentage}%`} icon={<Calendar className="w-5 h-5" />} />
          <StatCard title="Overall Grade" value={childPerformance.overallGrade} icon={<GraduationCap className="w-5 h-5" />} />
          <StatCard title="Class Rank" value={`#${childPerformance.rank}`} icon={<TrendingUp className="w-5 h-5" />} />
          <StatCard title="Assignments" value="3 pending" icon={<FileText className="w-5 h-5" />} />
        </div>

        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subject Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {childPerformance.subjects.map((subject, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">{subject.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">{subject.score}%</span>
                  <Badge className={subject.score >= 80 ? 'bg-primary/10 text-primary' : 'bg-amber-100 text-amber-700'}>
                    {subject.grade}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Important Notices */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Important Notices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="font-medium text-amber-800">Parent-Teacher Meeting</p>
              <p className="text-sm text-amber-700">Scheduled for February 20, 2026 at 10:00 AM</p>
            </div>
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="font-medium">Mid-Term Exams Starting</p>
              <p className="text-sm text-muted-foreground">Exams begin on February 10, 2026</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ParentHome;
