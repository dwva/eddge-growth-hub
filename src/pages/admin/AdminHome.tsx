import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  GraduationCap, 
  FileText, 
  Bell, 
  Settings,
  School,
  TrendingUp,
  Calendar,
  UserPlus
} from 'lucide-react';
import { schoolStats, recentAnnouncements } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { label: 'Home', icon: <Home className="w-5 h-5" />, path: '/admin' },
  { label: 'Users', icon: <Users className="w-5 h-5" />, path: '/admin/users' },
  { label: 'Academics', icon: <GraduationCap className="w-5 h-5" />, path: '/admin/academics' },
  { label: 'Reports', icon: <FileText className="w-5 h-5" />, path: '/admin/reports' },
  { label: 'Announcements', icon: <Bell className="w-5 h-5" />, path: '/admin/announcements' },
  { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/admin/settings' },
];

const AdminHome = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout navItems={navItems} title="School Admin Dashboard">
      <div className="space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-5">
          <h2 className="text-xl font-semibold">Welcome back, {user?.name}! 🏫</h2>
          <p className="text-muted-foreground">Here's an overview of your school's performance.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Students" 
            value={schoolStats.totalStudents.toLocaleString()} 
            icon={<Users className="w-5 h-5" />}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard 
            title="Total Teachers" 
            value={schoolStats.totalTeachers} 
            icon={<School className="w-5 h-5" />} 
          />
          <StatCard 
            title="Avg. Attendance" 
            value={`${schoolStats.averageAttendance}%`} 
            icon={<Calendar className="w-5 h-5" />} 
          />
          <StatCard 
            title="Avg. Performance" 
            value={`${schoolStats.averagePerformance}%`} 
            icon={<TrendingUp className="w-5 h-5" />} 
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <UserPlus className="w-5 h-5" />
                <span>Add Student</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Users className="w-5 h-5" />
                <span>Add Teacher</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Bell className="w-5 h-5" />
                <span>New Announcement</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <FileText className="w-5 h-5" />
                <span>Generate Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Announcements</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAnnouncements.map((announcement) => (
              <div key={announcement.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div>
                  <p className="font-medium">{announcement.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(announcement.date).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={
                  announcement.type === 'event' ? 'default' : 
                  announcement.type === 'meeting' ? 'secondary' : 
                  'outline'
                }>
                  {announcement.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Class Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Class Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Class 9', 'Class 10', 'Class 11', 'Class 12'].map((cls, index) => (
                <div key={cls} className="p-4 bg-secondary/50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">{[320, 310, 315, 305][index]}</p>
                  <p className="text-sm text-muted-foreground">{cls}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminHome;
