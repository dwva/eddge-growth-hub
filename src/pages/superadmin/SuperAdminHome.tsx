import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  LayoutDashboard, 
  School, 
  Brain, 
  Shield, 
  HeadphonesIcon,
  Settings,
  Activity,
  Users,
  Server,
  Database
} from 'lucide-react';
import { platformStats, schoolsList } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" />, path: '/superadmin' },
  { label: 'Schools', icon: <School className="w-5 h-5" />, path: '/superadmin/schools' },
  { label: 'AI Control', icon: <Brain className="w-5 h-5" />, path: '/superadmin/ai' },
  { label: 'Security', icon: <Shield className="w-5 h-5" />, path: '/superadmin/security' },
  { label: 'Support', icon: <HeadphonesIcon className="w-5 h-5" />, path: '/superadmin/support' },
  { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/superadmin/settings' },
];

const SuperAdminHome = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout navItems={navItems} title="Super Admin Dashboard">
      <div className="space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-5">
          <h2 className="text-xl font-semibold">Platform Overview ⚙️</h2>
          <p className="text-muted-foreground">System health: Excellent • All services operational</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Schools" 
            value={platformStats.totalSchools} 
            icon={<School className="w-5 h-5" />}
          />
          <StatCard 
            title="Total Users" 
            value={platformStats.totalUsers.toLocaleString()} 
            icon={<Users className="w-5 h-5" />} 
          />
          <StatCard 
            title="Active Users" 
            value={platformStats.activeUsers.toLocaleString()} 
            icon={<Activity className="w-5 h-5" />} 
          />
          <StatCard 
            title="System Health" 
            value={`${platformStats.systemHealth}%`} 
            icon={<Server className="w-5 h-5" />} 
          />
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                AI Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">API Calls This Month</span>
                    <span className="font-medium">{platformStats.aiCalls.toLocaleString()}</span>
                  </div>
                  <Progress value={62} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center p-3 bg-secondary/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">98%</p>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">1.2s</p>
                    <p className="text-xs text-muted-foreground">Avg. Response</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Storage Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Used Storage</span>
                    <span className="font-medium">{platformStats.storageUsed} / 5 TB</span>
                  </div>
                  <Progress value={48} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center p-3 bg-secondary/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">1.8 TB</p>
                    <p className="text-xs text-muted-foreground">Documents</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">0.6 TB</p>
                    <p className="text-xs text-muted-foreground">Media</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schools List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Schools Overview</CardTitle>
            <Button size="sm">Add School</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {schoolsList.map((school) => (
                <div key={school.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <School className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{school.name}</p>
                      <p className="text-sm text-muted-foreground">{school.city} • {school.students} students</p>
                    </div>
                  </div>
                  <Badge variant={school.status === 'active' ? 'default' : 'secondary'}>
                    {school.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminHome;
