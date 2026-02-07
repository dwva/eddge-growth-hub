import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboardLayout from '@/components/layout/AdminDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  GraduationCap, 
  FileText, 
  Bell, 
  TrendingUp,
  Calendar,
  UserPlus,
  AlertTriangle,
  Plus,
  ArrowUpRight,
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
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
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
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg md:rounded-xl h-8 md:h-9 px-3 md:px-4 text-[10px] md:text-xs hidden sm:flex"
          onClick={() => navigate('/admin/students')}
        >
          <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5" />
          Quick Add
        </Button>
      }
    >
      <div className="space-y-3 md:space-y-4">
        {/* Page Header - Neutral Style */}
        <div>
          <h1 className="text-base md:text-lg font-bold text-gray-900">School Overview</h1>
          <p className="text-[9px] md:text-[10px] text-gray-500 mt-0.5">
            Welcome back, {user?.name?.split(' ')[0] || 'Admin'}. Here's what's happening at your school today.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card 
            className="border-0 shadow-sm rounded-lg md:rounded-xl bg-white cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/admin/students')}
          >
            <CardContent className="p-3 md:p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-[10px] md:text-xs text-gray-500 font-medium">{schoolStats.totalStudents.toLocaleString()}</p>
                  <p className="text-xs md:text-sm font-bold text-gray-900">Total Students</p>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card 
            className="border-0 shadow-sm rounded-lg md:rounded-xl bg-white cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/admin/teachers')}
          >
            <CardContent className="p-3 md:p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-[10px] md:text-xs text-gray-500 font-medium">{schoolStats.totalTeachers}</p>
                  <p className="text-xs md:text-sm font-bold text-gray-900">Total Teachers</p>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card 
            className="border-0 shadow-sm rounded-lg md:rounded-xl bg-white cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/admin/attendance')}
          >
            <CardContent className="p-3 md:p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-[10px] md:text-xs text-gray-500 font-medium">{schoolStats.averageAttendance}%</p>
                  <p className="text-xs md:text-sm font-bold text-gray-900">Avg. Attendance</p>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card 
            className="border-0 shadow-sm rounded-lg md:rounded-xl bg-white cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/admin/reports')}
          >
            <CardContent className="p-3 md:p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-[10px] md:text-xs text-gray-500 font-medium">{schoolStats.averagePerformance}%</p>
                  <p className="text-xs md:text-sm font-bold text-gray-900">Avg. Performance</p>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
          {/* Performance Chart - 2/3 width */}
          <Card className="lg:col-span-2 border-0 shadow-sm rounded-lg md:rounded-xl bg-white">
            <CardHeader className="px-3 md:px-5 py-2.5 md:py-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xs md:text-sm font-bold text-gray-900">Performance Trends</CardTitle>
                  <p className="text-[9px] md:text-[10px] text-gray-500 mt-0.5">Monthly average scores across all classes</p>
                </div>
                <Tabs value={chartPeriod} onValueChange={setChartPeriod}>
                  <TabsList className="bg-gray-100 p-0.5 rounded-lg h-7 md:h-8">
                    <TabsTrigger value="weekly" className="px-2 md:px-2.5 py-1 text-[9px] md:text-[10px] rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly" className="px-2 md:px-2.5 py-1 text-[9px] md:text-[10px] rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary">Monthly</TabsTrigger>
                    <TabsTrigger value="yearly" className="px-2 md:px-2.5 py-1 text-[9px] md:text-[10px] rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Yearly</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-3 md:pb-4 px-3 md:px-5">
              <div className="h-48 md:h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2ff" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem',
                      }} 
                    />
                    <Area type="natural" dataKey="score" stroke="#4f46e5" fill="url(#colorScore)" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions - List Style */}
          <Card className="border-0 shadow-sm rounded-lg md:rounded-xl bg-white">
            <CardHeader className="px-3 md:px-5 py-2.5 md:py-3 border-b border-gray-100">
              <CardTitle className="text-xs md:text-sm font-bold text-gray-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-3 md:pb-4 px-3 md:px-5">
              <div className="space-y-1.5 md:space-y-2">
                {[
                  { icon: UserPlus, label: 'Add Student', path: '/admin/students' },
                  { icon: Users, label: 'Add Teacher', path: '/admin/teachers' },
                  { icon: Bell, label: 'New Announcement', path: '/admin/announcements' },
                  { icon: FileText, label: 'Generate Report', path: '/admin/reports' },
                ].map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => navigate(action.path)}
                      className="w-full flex items-center gap-2.5 md:gap-3 p-2 md:p-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                      </div>
                      <span className="text-[10px] md:text-xs font-medium text-gray-700 group-hover:text-gray-900">{action.label}</span>
                      <ArrowUpRight className="w-3 h-3 md:w-3.5 md:h-3.5 ml-auto text-gray-400 group-hover:text-primary transition-colors" />
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
          {/* Alerts/Notices */}
          <Card className="border-0 shadow-sm rounded-lg md:rounded-xl bg-white">
            <CardHeader className="px-3 md:px-5 py-2.5 md:py-3 border-b border-gray-100">
              <CardTitle className="text-xs md:text-sm font-bold text-gray-900">Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-3 md:pb-4 px-3 md:px-5">
              {recentAlerts.length === 0 ? (
                <div className="text-center py-6 md:py-8 text-muted-foreground text-[10px] md:text-xs">
                  No active alerts
                </div>
              ) : (
                <div className="space-y-2 md:space-y-2.5">
                  {recentAlerts.map((alert) => {
                    const entity = alert.entityType === 'student' 
                      ? state.students.find(s => s.id === alert.entityId)
                      : state.classes.find(c => c.id === alert.entityId);
                    const entityName = alert.entityType === 'student'
                      ? entity?.name || 'Unknown Student'
                      : entity ? `Class ${entity.grade}-${entity.section}` : 'Unknown Class';
                    
                    return (
                      <div 
                        key={alert.id}
                        className="flex items-start gap-2.5 md:gap-3 p-2.5 md:p-3 rounded-lg bg-amber-50 border border-amber-200"
                      >
                        <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[10px] md:text-xs font-semibold text-gray-900">
                            {alert.type === 'LowAttendance' ? 'Low Attendance' : 'Low Performance'}
                          </h4>
                          <p className="text-[9px] md:text-[10px] text-gray-600 mt-0.5">
                            {entityName}: {alert.reason}
                          </p>
                          <div className="flex items-center gap-1.5 mt-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 md:h-7 px-2 text-[9px] md:text-[10px] text-gray-700 hover:bg-amber-100"
                              onClick={() => handleAddNote(alert.entityType, alert.entityId)}
                            >
                              Add Note
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 md:h-7 px-2 text-[9px] md:text-[10px] text-gray-700 hover:bg-amber-100"
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
                              className="h-6 md:h-7 px-2 text-[9px] md:text-[10px] text-gray-700 hover:bg-amber-100"
                              onClick={() => handleResolveAlert(alert.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Announcements */}
          <Card className="border-0 shadow-sm rounded-lg md:rounded-xl bg-white">
            <CardHeader className="px-3 md:px-5 py-2.5 md:py-3 border-b border-gray-100 flex flex-row items-center justify-between">
              <CardTitle className="text-xs md:text-sm font-bold text-gray-900">Recent Announcements</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 md:h-7 px-2 text-[9px] md:text-[10px] text-primary hover:bg-primary/5"
                onClick={() => navigate('/admin/announcements')}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent className="pt-0 pb-3 md:pb-4 px-3 md:px-5">
              <div className="space-y-1.5 md:space-y-2">
                {recentAnnouncements.slice(0, 3).map((announcement) => (
                  <div 
                    key={announcement.id} 
                    className="flex items-center justify-between p-2 md:p-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate('/admin/announcements')}
                  >
                    <div className="flex items-center gap-2 md:gap-2.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        announcement.type === 'event' ? 'bg-blue-500' :
                        announcement.type === 'meeting' ? 'bg-primary' :
                        'bg-gray-400'
                      }`} />
                      <div>
                        <p className="text-[10px] md:text-xs font-medium text-gray-900">{announcement.title}</p>
                        <p className="text-[9px] md:text-[10px] text-gray-500">
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
                      className={`text-[8px] md:text-[9px] h-4 md:h-5 px-1.5 capitalize ${
                        announcement.type === 'event' ? 'text-blue-600 border-blue-200 bg-blue-50' :
                        announcement.type === 'meeting' ? 'text-primary border-primary/20 bg-primary/5' :
                        'text-gray-600 border-gray-200 bg-gray-50'
                      }`}
                    >
                      {announcement.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Class Distribution */}
        <Card className="border-0 shadow-sm rounded-lg md:rounded-xl bg-white">
          <CardHeader className="px-3 md:px-5 py-2.5 md:py-3 border-b border-gray-100">
            <CardTitle className="text-xs md:text-sm font-bold text-gray-900">Class Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-3 md:pb-4 px-3 md:px-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              {classDistribution.length === 0 ? (
                <div className="col-span-4 text-center py-6 md:py-8 text-muted-foreground text-[10px] md:text-xs">
                  No classes yet
                </div>
              ) : (
                classDistribution.map((cls) => (
                  <div 
                    key={cls.name} 
                    className="p-3 md:p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer text-center"
                    onClick={() => {
                      const grade = cls.name.split(' ')[1];
                      navigate(`/admin/classes?grade=${grade}`);
                    }}
                  >
                    <p className="text-lg md:text-2xl font-bold text-gray-900">
                      {cls.count}
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-600 mt-0.5 font-medium">{cls.name}</p>
                    <p className="text-[9px] md:text-[10px] text-gray-400 mt-0.5">students</p>
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
