import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import StatCard from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  BarChart3, 
  AlertTriangle,
  Clock,
  CheckCircle2,
  Home,
  ClipboardList
} from 'lucide-react';
import { teacherClasses, pendingTasks, atRiskStudents } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const TeacherHomeContent = () => {
  const { user } = useAuth();
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-5">
        <h2 className="text-xl font-semibold">{greeting}, {user?.name?.split(' ')[0]}! 👋</h2>
        <p className="text-muted-foreground">You have 3 classes today and 28 assignments to review.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value="97" icon={<Users className="w-5 h-5" />} />
        <StatCard title="Classes" value="3" icon={<Home className="w-5 h-5" />} />
        <StatCard title="Pending Reviews" value="28" icon={<ClipboardList className="w-5 h-5" />} />
        <StatCard title="Avg. Performance" value="78%" icon={<BarChart3 className="w-5 h-5" />} />
      </div>

      {/* Today's Classes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today's Classes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {teacherClasses.map((cls) => (
            <div key={cls.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
              <div>
                <p className="font-semibold">{cls.name}</p>
                <p className="text-sm text-muted-foreground">{cls.subject} • {cls.students} students</p>
              </div>
              <Badge variant="secondary">{cls.schedule.split(' - ')[1]}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pending Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Pending Tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pendingTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{task.task}</p>
                  <p className="text-sm text-muted-foreground">{task.class}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-primary">{new Date(task.deadline).toLocaleDateString()}</p>
                {task.count && <p className="text-xs text-muted-foreground">{task.count} items</p>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* At-Risk Students */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Students Needing Attention
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {atRiskStudents.map((student) => (
            <div key={student.id} className="flex items-center justify-between p-4 bg-destructive/5 rounded-lg border border-destructive/20">
              <div>
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-muted-foreground">{student.class} • {student.issue}</p>
              </div>
              <Button size="sm" variant="outline">View Profile</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const TeacherHome = () => {
  return (
    <TeacherDashboardLayout>
      <TeacherHomeContent />
    </TeacherDashboardLayout>
  );
};

export default TeacherHome;
