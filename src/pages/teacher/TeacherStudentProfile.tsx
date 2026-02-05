import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import { useTeacherMode } from '@/contexts/TeacherModeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft, Phone, MessageCircle, Mail, TrendingUp, TrendingDown,
  Calendar, AlertTriangle, CheckCircle, Sparkles, FileText, Plus,
  Download, BookOpen, Target, Activity, Clock, Users, AlertCircle as AlertCircleIcon
} from 'lucide-react';
import { getStudentProfile, teacherTasks, remedialInterventions } from '@/data/teacherMockData';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const TeacherStudentProfileContent = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const { currentMode } = useTeacherMode();
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isRemedialDialogOpen, setIsRemedialDialogOpen] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    type: 'Call Parent',
    priority: 'medium',
    dueDate: '',
    description: '',
  });

  // Mode restriction
  if (currentMode !== 'class_teacher') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircleIcon className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-sm font-semibold mb-2">Class Teacher Mode Required</h2>
        <p className="text-muted-foreground mb-4">Student profiles are only accessible in Class Teacher mode.</p>
        <Button onClick={() => navigate('/teacher')}>Back to Dashboard</Button>
      </div>
    );
  }

  if (!studentId) {
    navigate('/teacher/my-class/students');
    return null;
  }

  const studentProfile = getStudentProfile(studentId);

  if (!studentProfile || !studentProfile.name) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Users className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-sm font-semibold mb-2">Student Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested student profile could not be found.</p>
        <Button onClick={() => navigate('/teacher/my-class/students')}>Back to Students</Button>
      </div>
    );
  }

  const getBehaviourStyle = (behaviour: string) => {
    switch (behaviour) {
      case 'Excellent': return 'bg-emerald-500';
      case 'Good': return 'bg-blue-500';
      case 'Needs Attention': return 'bg-amber-500';
      case 'Concern': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleCreateTask = () => {
    if (!taskFormData.dueDate || !taskFormData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Task created successfully');
    setIsTaskDialogOpen(false);
    setTaskFormData({ type: 'Call Parent', priority: 'medium', dueDate: '', description: '' });
  };

  const activeInterventions = studentProfile.interventions?.filter(i => i.status === 'active') || [];
  const completedInterventions = studentProfile.interventions?.filter(i => i.status === 'completed') || [];
  const pendingTasks = studentProfile.tasks?.filter(t => t.status === 'pending') || [];
  const activeTasks = studentProfile.tasks?.filter(t => t.status === 'in-progress') || [];

  return (
    <div className="space-y-6 max-w-[1800px] pb-8">
      {/* Header Navigation */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/teacher/my-class/students')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Students
        </Button>
        <div className="flex-1" />
        <Button variant="outline" size="sm" className="gap-2">
          <FileText className="w-4 h-4" />
          Print Profile
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export PDF
        </Button>
      </div>

      {/* Student Header Card */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: Avatar & Basic Info */}
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                  <AvatarFallback className="bg-primary text-white text-sm font-bold">
                    {studentProfile.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${getBehaviourStyle(studentProfile.behaviour)}`} />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900 mb-1">{studentProfile.name}</h1>
                <div className="space-y-0.5 text-xs text-gray-600">
                  <p>Roll Number: <span className="font-medium">{studentProfile.rollNumber}</span></p>
                  <p>Class: <span className="font-medium">10-A</span></p>
                  <p>Rank: <span className="font-medium">#{studentProfile.rank}</span></p>
                </div>
              </div>
            </div>

            {/* Center: Performance Metrics */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-xs text-gray-500 uppercase">Overall</span>
                </div>
                <p className={`text-base font-bold ${getPerformanceColor(studentProfile.overallScore)}`}>
                  {studentProfile.overallScore}%
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {studentProfile.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={`text-xs ${studentProfile.trendValue > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {studentProfile.trendValue > 0 ? '+' : ''}{studentProfile.trendValue}%
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-gray-500 uppercase">Attendance</span>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {studentProfile.attendanceHistory?.[studentProfile.attendanceHistory.length - 1]?.percentage || 95}%
                </p>
                <Progress value={studentProfile.attendanceHistory?.[studentProfile.attendanceHistory.length - 1]?.percentage || 95} className="h-1.5 mt-2" />
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-purple-500" />
                  <span className="text-xs text-gray-500 uppercase">Behavior</span>
                </div>
                <Badge className={`${getBehaviourStyle(studentProfile.behaviour)} text-white border-0`}>
                  {studentProfile.behaviour}
                </Badge>
                <p className="text-xs text-gray-500 mt-2">{studentProfile.behaviorNotes?.length || 0} notes</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-xs text-gray-500 uppercase">Tasks</span>
                </div>
                <p className="text-base font-bold text-gray-900">{pendingTasks.length + activeTasks.length}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {pendingTasks.length} pending
                </p>
              </div>
            </div>

            {/* Right: Quick Actions */}
            <div className="flex flex-col gap-2 min-w-[140px]">
              <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="w-full gap-2 h-9">
                    <Plus className="w-4 h-4" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Task for {studentProfile.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Task Type</Label>
                      <Select value={taskFormData.type} onValueChange={(v) => setTaskFormData(prev => ({ ...prev, type: v }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Call Parent">Call Parent</SelectItem>
                          <SelectItem value="Remedial Plan">Remedial Plan</SelectItem>
                          <SelectItem value="Monitor Progress">Monitor Progress</SelectItem>
                          <SelectItem value="Submit Report">Submit Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select value={taskFormData.priority} onValueChange={(v) => setTaskFormData(prev => ({ ...prev, priority: v }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Input type="date" value={taskFormData.dueDate} onChange={(e) => setTaskFormData(prev => ({ ...prev, dueDate: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea rows={3} value={taskFormData.description} onChange={(e) => setTaskFormData(prev => ({ ...prev, description: e.target.value }))} />
                    </div>
                    <Button onClick={handleCreateTask} className="w-full">Create Task</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" className="w-full gap-2 h-9">
                <MessageCircle className="w-4 h-4" />
                Message
              </Button>
              <Button variant="outline" size="sm" className="w-full gap-2 h-9">
                <Phone className="w-4 h-4" />
                Call Parent
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Summary Card */}
      {studentProfile.aiInsights && (
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-purple/5 shadow-sm rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Sparkles className="w-5 h-5 text-primary" />
              AI-Generated Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {studentProfile.aiInsights.strengths.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-emerald-700 mb-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  STRENGTHS
                </p>
                <ul className="space-y-1">
                  {studentProfile.aiInsights.strengths.map((strength, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {studentProfile.aiInsights.weaknesses.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-amber-700 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  AREAS FOR IMPROVEMENT
                </p>
                <ul className="space-y-1">
                  {studentProfile.aiInsights.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {studentProfile.aiInsights.recommendations.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-primary mb-1 flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  RECOMMENDED ACTIONS
                </p>
                <ul className="space-y-1">
                  {studentProfile.aiInsights.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="academic" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-11">
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="parent">Parent</TabsTrigger>
          <TabsTrigger value="interventions">Interventions</TabsTrigger>
        </TabsList>

        {/* Academic Performance Tab */}
        <TabsContent value="academic" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Subject Cards */}
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm">Subject Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(studentProfile.subjects || {}).map(([subject, score]) => (
                  <div key={subject} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{subject}</span>
                      </div>
                      <span className={`text-sm font-bold ${getPerformanceColor(score as number)}`}>
                        {score}%
                      </span>
                    </div>
                    <Progress 
                      value={score as number} 
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance Trend Chart */}
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm">6-Month Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={studentProfile.performanceHistory || []}>
                      <defs>
                        <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                        fill="url(#scoreGradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Attendance History Tab */}
        <TabsContent value="attendance" className="space-y-4 mt-4">
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm">Monthly Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={studentProfile.attendanceHistory || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="percentage" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {studentProfile.attendanceHistory?.map((record, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">{record.month}</p>
                    <p className="text-sm font-bold text-gray-900">{record.percentage}%</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {record.present}P / {record.absent}A
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Behavior & Notes Tab */}
        <TabsContent value="behavior" className="space-y-4 mt-4">
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm">Behavior Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {studentProfile.behaviorNotes && studentProfile.behaviorNotes.length > 0 ? (
                <div className="space-y-3">
                  {studentProfile.behaviorNotes.map((note) => {
                    const typeConfig = {
                      positive: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: CheckCircle, iconColor: 'text-emerald-500' },
                      attention: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: AlertTriangle, iconColor: 'text-amber-500' },
                      concern: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: AlertCircleIcon, iconColor: 'text-red-500' },
                    }[note.type];
                    
                    const Icon = typeConfig.icon;
                    
                    return (
                      <div key={note.id} className={`p-4 rounded-xl border ${typeConfig.bg} ${typeConfig.border}`}>
                        <div className="flex items-start gap-3">
                          <Icon className={`w-5 h-5 ${typeConfig.iconColor} mt-0.5 flex-shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-xs font-semibold uppercase ${typeConfig.text}`}>
                                {note.type}
                              </span>
                              <span className="text-xs text-gray-500">{note.date} • {note.time}</span>
                            </div>
                            <p className="text-sm text-gray-700">{note.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No behavior notes recorded yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parent Communication Tab */}
        <TabsContent value="parent" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm">Parent Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Parent Name</p>
                  <p className="font-medium">{studentProfile.parentName || 'Not Available'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="font-medium">{studentProfile.parentPhone || 'Not Available'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="font-medium text-sm">{studentProfile.parentEmail || 'Not Available'}</p>
                  </div>
                </div>
                <div className="pt-4 flex gap-2">
                  <Button size="sm" className="flex-1 gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Send Message
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Phone className="w-4 h-4" />
                    Call
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm">Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-500">Engagement Level</p>
                    <Badge variant="outline" className={getEngagementColor(studentProfile.engagementLevel || 'medium')}>
                      {studentProfile.engagementLevel || 'Medium'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-500">Response Rate</p>
                    <p className="font-bold">{studentProfile.responseRate || 0}%</p>
                  </div>
                  <Progress value={studentProfile.responseRate || 0} className="h-2" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Avg Response Time</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="font-medium">{studentProfile.avgResponseTime || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Last Contacted</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="font-medium">{studentProfile.lastContactedDate || 'Never'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Messages</p>
                  <p className="font-medium">{studentProfile.communicationFrequency || 0} messages</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Interventions Tab */}
        <TabsContent value="interventions" className="space-y-4 mt-4">
          {/* Active Interventions */}
          {activeInterventions.length > 0 && (
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Active Interventions</CardTitle>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                    {activeInterventions.length} Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeInterventions.map((intervention) => (
                  <div key={intervention.id} className="border rounded-xl p-4 bg-blue-50/50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{intervention.subject} - {intervention.topic}</h4>
                        <p className="text-sm text-gray-600">{intervention.actionType}</p>
                      </div>
                      <Badge className="bg-blue-500 text-white">In Progress</Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Before</p>
                        <p className="text-sm font-bold text-red-600">{intervention.beforeScore}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Current</p>
                        <p className="text-sm font-bold text-amber-600">{intervention.currentScore}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Target</p>
                        <p className="text-sm font-bold text-emerald-600">{intervention.targetScore}%</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Progress</p>
                      <Progress 
                        value={((intervention.currentScore - intervention.beforeScore) / (intervention.targetScore - intervention.beforeScore)) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{intervention.startDate} - {intervention.endDate}</span>
                      </div>
                      {intervention.notes && (
                        <p className="text-sm text-gray-700 bg-white rounded-lg p-3">{intervention.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Completed Interventions */}
          {completedInterventions.length > 0 && (
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Completed Interventions</CardTitle>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    {completedInterventions.length} Completed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {completedInterventions.map((intervention) => (
                  <div key={intervention.id} className="border rounded-xl p-4 bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{intervention.subject} - {intervention.topic}</h4>
                        <p className="text-sm text-gray-600">{intervention.actionType}</p>
                      </div>
                      <Badge className={intervention.outcome === 'improved' ? 'bg-emerald-500 text-white' : 'bg-gray-500 text-white'}>
                        {intervention.outcome === 'improved' ? 'Improved' : intervention.outcome === 'no-change' ? 'No Change' : 'Needs Attention'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Before → After</p>
                        <p className="text-sm font-bold">
                          <span className="text-red-600">{intervention.beforeScore}%</span>
                          <span className="mx-2">→</span>
                          <span className="text-emerald-600">{intervention.afterScore}%</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Improvement</p>
                        <p className="text-sm font-bold text-emerald-600">
                          +{(intervention.afterScore || 0) - intervention.beforeScore}%
                        </p>
                      </div>
                    </div>
                    
                    {intervention.notes && (
                      <p className="text-sm text-gray-700 bg-white rounded-lg p-3">{intervention.notes}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeInterventions.length === 0 && completedInterventions.length === 0 && (
            <Card className="rounded-xl shadow-sm">
              <CardContent className="py-12 text-center">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-sm font-semibold text-gray-900 mb-2">No Interventions Yet</h3>
                <p className="text-gray-500 mb-4">Create a remedial plan to track student improvement</p>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Intervention
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const TeacherStudentProfile = () => {
  return (
    <TeacherDashboardLayout>
      <TeacherStudentProfileContent />
    </TeacherDashboardLayout>
  );
};

export default TeacherStudentProfile;
