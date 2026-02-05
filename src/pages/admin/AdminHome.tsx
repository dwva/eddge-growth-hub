import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboardLayout from '@/components/layout/AdminDashboardLayout';
import AdminStatCard from '@/components/admin/AdminStatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  FileText, 
  Bell, 
  Settings,
  School,
  TrendingUp,
  Calendar,
  UserPlus,
  BookOpen,
  ClipboardList,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Plus,
  ArrowUpRight,
  MoreHorizontal,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminData } from '@/contexts/AdminDataContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar
} from 'recharts';

const AdminHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state, dispatch } = useAdminData();
  const [chartPeriod, setChartPeriod] = useState('monthly');
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<{ type: 'student' | 'class'; id: string } | null>(null);
  const [noteText, setNoteText] = useState('');

  const handleResolveAlert = (alertId: string) => {
    dispatch({ type: 'RESOLVE_RISK_ALERT', payload: { id: alertId } });
    toast({
      title: 'Alert Resolved',
      description: 'The alert has been marked as resolved.',
    });
  };

  const handleAddNote = (entityType: 'student' | 'class', entityId: string) => {
    setSelectedEntity({ type: entityType, id: entityId });
    setNoteDialogOpen(true);
  };

  const handleSaveNote = () => {
    if (!noteText.trim() || !selectedEntity) return;
    // For now, just show a toast - can be enhanced to store notes
    toast({
      title: 'Note Added',
      description: `Note added for ${selectedEntity.type === 'student' ? 'student' : 'class'}.`,
    });
    setNoteText('');
    setNoteDialogOpen(false);
    setSelectedEntity(null);
  };

  // Compute school stats from store
  const schoolStats = useMemo(() => {
    const totalStudents = state.students.length;
    const totalTeachers = state.teachers.length;
    const totalClasses = state.classes.length;
    
    // Compute average attendance from students
    const avgAttendance = totalStudents > 0
      ? state.students.reduce((sum, s) => sum + s.attendancePercentage, 0) / totalStudents
      : 0;
    
    // Compute average performance from students
    const avgPerformance = totalStudents > 0
      ? state.students.reduce((sum, s) => sum + s.performanceScore, 0) / totalStudents
      : 0;
    
    return {
      totalStudents,
      totalTeachers,
      totalClasses,
      averageAttendance: Math.round(avgAttendance * 10) / 10,
      averagePerformance: Math.round(avgPerformance * 10) / 10,
    };
  }, [state.students, state.teachers, state.classes]);

  // Compute performance trend data (last 7 months)
  const performanceData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    // For now, use average performance with some variation
    // In a real app, this would come from historical data
    const baseScore = schoolStats.averagePerformance;
    return months.map((name, index) => ({
      name,
      score: Math.max(60, Math.min(100, baseScore + (Math.random() * 10 - 5))),
    }));
  }, [schoolStats.averagePerformance]);

  // Get recent risk alerts (unresolved, sorted by date)
  const recentAlerts = useMemo(() => {
    return state.riskAlerts
      .filter(alert => !alert.resolvedAt)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [state.riskAlerts]);

  // Simple announcements (can be enhanced later)
  const recentAnnouncements = useMemo(() => {
    // For now, return empty or create from risk alerts
    return recentAlerts.map((alert, idx) => ({
      id: `alert-${alert.id}`,
      title: alert.type === 'LowAttendance' ? 'Low Attendance Alert' : 'Low Performance Alert',
      date: alert.createdAt,
      type: alert.type === 'LowAttendance' ? 'academic' : 'academic' as const,
    }));
  }, [recentAlerts]);

  // Compute class distribution by grade
  const classDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    state.classes.forEach(cls => {
      const grade = `Class ${cls.grade}`;
      if (!distribution[grade]) {
        distribution[grade] = 0;
      }
      distribution[grade] += state.students.filter(s => s.classId === cls.id).length;
    });
    return Object.entries(distribution).map(([name, count]) => ({
      name,
      count,
      color: name === 'Class 9' ? 'blue' : name === 'Class 10' ? 'purple' : name === 'Class 11' ? 'emerald' : 'amber',
    }));
  }, [state.classes, state.students]);

  return (
    <AdminDashboardLayout 
      pageTitle="Dashboard"
      pageDescription="Overview of your school's performance"
      headerActions={
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg hidden sm:flex">
          <Plus className="w-4 h-4 mr-2" />
          Quick Add
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 gradient-primary text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
          
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h2>
            <p className="text-white/80 text-lg max-w-xl">
              Here's what's happening at your school today. You have 3 pending approvals and 2 new announcements to review.
            </p>
            
            <div className="flex flex-wrap gap-3 mt-6">
              <Button 
                className="bg-white text-primary hover:bg-white/90 rounded-xl font-semibold shadow-lg"
                onClick={() => navigate('/admin/students')}
              >
                <ClipboardList className="w-4 h-4 mr-2" />
                View Students
              </Button>
              <Button 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 rounded-xl"
                onClick={() => navigate('/admin/announcements')}
              >
                <Bell className="w-4 h-4 mr-2" />
                Announcements
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            className="cursor-pointer"
            onClick={() => navigate('/admin/students')}
          >
            <AdminStatCard 
              title="Total Students" 
              value={schoolStats.totalStudents.toLocaleString()} 
              icon={<GraduationCap className="w-full h-full" />}
              trend={{ value: 5.2, isPositive: true }}
              gradient="blue"
            />
          </div>
          <div 
            className="cursor-pointer"
            onClick={() => navigate('/admin/teachers')}
          >
            <AdminStatCard 
              title="Total Teachers" 
              value={schoolStats.totalTeachers} 
              icon={<Users className="w-full h-full" />}
              trend={{ value: 2.1, isPositive: true }}
              gradient="purple"
            />
          </div>
          <div 
            className="cursor-pointer"
            onClick={() => navigate('/admin/attendance')}
          >
            <AdminStatCard 
              title="Avg. Attendance" 
              value={`${schoolStats.averageAttendance}%`} 
              icon={<Calendar className="w-full h-full" />}
              trend={{ value: 1.5, isPositive: false }}
              gradient="green"
            />
          </div>
          <div 
            className="cursor-pointer"
            onClick={() => navigate('/admin/reports')}
          >
            <AdminStatCard 
              title="Avg. Performance" 
              value={`${schoolStats.averagePerformance}%`} 
              icon={<TrendingUp className="w-full h-full" />}
              trend={{ value: 8.3, isPositive: true }}
              gradient="amber"
            />
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Chart - 2/3 width */}
          <Card className="lg:col-span-2 shadow-sm border-gray-100 rounded-xl overflow-hidden">
            <CardHeader className="px-6 py-4 border-b border-gray-100 flex flex-row items-center justify-between bg-gray-50/50">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Performance Trends</CardTitle>
                <p className="text-sm text-gray-500">Monthly average scores across all classes</p>
              </div>
              <Tabs value={chartPeriod} onValueChange={setChartPeriod}>
                <TabsList className="bg-gray-100/80 p-1 rounded-lg">
                  <TabsTrigger value="weekly" className="px-3 py-1.5 text-xs rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly" className="px-3 py-1.5 text-xs rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly" className="px-3 py-1.5 text-xs rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Yearly</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[60, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Area type="monotone" dataKey="score" stroke="#3b82f6" fill="url(#colorScore)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Actions - 1/3 width */}
          <Card className="shadow-sm border-gray-100 rounded-xl">
            <CardHeader className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {[
                { icon: <UserPlus className="w-5 h-5" />, label: 'Add Student', color: 'blue' },
                { icon: <Users className="w-5 h-5" />, label: 'Add Teacher', color: 'purple' },
                { icon: <Bell className="w-5 h-5" />, label: 'New Announcement', color: 'amber' },
                { icon: <FileText className="w-5 h-5" />, label: 'Generate Report', color: 'green' },
              ].map((action, idx) => (
                <button
                  key={idx}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all duration-200 group"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    action.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    action.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                    action.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    {action.icon}
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{action.label}</span>
                  <ArrowUpRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-blue-500 transition-colors" />
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alerts/Notices */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
            
            {recentAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No active alerts
              </div>
            ) : (
              recentAlerts.map((alert) => {
                const entity = alert.entityType === 'student' 
                  ? state.students.find(s => s.id === alert.entityId)
                  : state.classes.find(c => c.id === alert.entityId);
                const entityName = alert.entityType === 'student'
                  ? entity?.name || 'Unknown Student'
                  : entity ? `Class ${entity.grade}-${entity.section}` : 'Unknown Class';
                
                return (
                  <div 
                    key={alert.id}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-amber-800">
                        {alert.type === 'LowAttendance' ? 'Low Attendance Alert' : 'Low Performance Alert'}
                      </h4>
                      <p className="text-sm text-amber-700 mt-1">
                        {entityName}: {alert.reason}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-amber-700 hover:bg-amber-100"
                        onClick={() => handleAddNote(alert.entityType, alert.entityId)}
                      >
                        Add Note
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-amber-700 hover:bg-amber-100"
                        onClick={() => {
                          if (alert.entityType === 'student') {
                            navigate(`/admin/students/${alert.entityId}`);
                          } else {
                            navigate(`/admin/classes/${alert.entityId}`);
                          }
                        }}
                      >
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-amber-700 hover:bg-amber-100"
                        onClick={() => handleResolveAlert(alert.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Recent Announcements */}
          <Card className="shadow-sm border-gray-100 rounded-xl">
            <CardHeader className="px-6 py-4 border-b border-gray-100 flex flex-row items-center justify-between bg-gray-50/50">
              <CardTitle className="text-lg font-semibold text-gray-900">Recent Announcements</CardTitle>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                View All
              </Button>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {recentAnnouncements.slice(0, 3).map((announcement) => (
                <div 
                  key={announcement.id} 
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      announcement.type === 'event' ? 'bg-blue-500' :
                      announcement.type === 'meeting' ? 'bg-purple-500' :
                      'bg-gray-400'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">{announcement.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(announcement.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline"
                    className={`capitalize ${
                      announcement.type === 'event' ? 'text-blue-600 border-blue-200 bg-blue-50' :
                      announcement.type === 'meeting' ? 'text-purple-600 border-purple-200 bg-purple-50' :
                      'text-gray-600 border-gray-200 bg-gray-50'
                    }`}
                  >
                    {announcement.type}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Class Distribution */}
        <Card className="shadow-sm border-gray-100 rounded-xl">
          <CardHeader className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-lg font-semibold text-gray-900">Class Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {classDistribution.length === 0 ? (
                <div className="col-span-4 text-center py-8 text-muted-foreground">
                  No classes yet
                </div>
              ) : (
                classDistribution.map((cls) => (
                  <div 
                    key={cls.name} 
                    className={`p-6 rounded-xl text-center transition-all duration-200 hover:-translate-y-1 cursor-pointer ${
                      cls.color === 'blue' ? 'bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg hover:shadow-blue-100' :
                      cls.color === 'purple' ? 'bg-gradient-to-br from-purple-50 to-violet-50 hover:shadow-lg hover:shadow-purple-100' :
                      cls.color === 'emerald' ? 'bg-gradient-to-br from-emerald-50 to-green-50 hover:shadow-lg hover:shadow-emerald-100' :
                      'bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-lg hover:shadow-amber-100'
                    }`}
                    onClick={() => {
                      const grade = cls.name.split(' ')[1];
                      navigate(`/admin/classes?grade=${grade}`);
                    }}
                  >
                    <p className={`text-3xl font-bold ${
                      cls.color === 'blue' ? 'text-blue-600' :
                      cls.color === 'purple' ? 'text-purple-600' :
                      cls.color === 'emerald' ? 'text-emerald-600' :
                      'text-amber-600'
                    }`}>
                      {cls.count}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 font-medium">{cls.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">students</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Note Dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Admin Note</DialogTitle>
            <DialogDescription>
              Add a note about this {selectedEntity?.type === 'student' ? 'student' : 'class'}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Note</Label>
              <Textarea 
                placeholder="Enter your note here..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setNoteDialogOpen(false);
              setNoteText('');
              setSelectedEntity(null);
            }}>Cancel</Button>
            <Button onClick={handleSaveNote}>Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminDashboardLayout>
  );
};

export default AdminHome;
