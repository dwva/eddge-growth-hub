import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Calendar, Clock, User, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { meetings as mockMeetings, classStudents } from '@/data/teacherMockData';
import { toast } from 'sonner';

const TeacherMeetingsContent = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState(mockMeetings);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    date: '',
    time: '',
    duration: '30',
    type: '',
    notes: '',
  });

  // Get current date info for calendar
  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  // Generate days for calendar (simplified)
  const getDaysInMonth = () => {
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const days = getDaysInMonth();

  const getMeetingsForDay = (day: number) => {
    const dateStr = `2026-02-${day.toString().padStart(2, '0')}`;
    return meetings.filter(m => m.date === dateStr);
  };

  const handleSchedule = () => {
    const student = classStudents.find(s => s.id === formData.studentId);
    if (!student || !formData.date || !formData.time || !formData.type) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newMeeting = {
      id: `m${Date.now()}`,
      parentName: `Parent of ${student.name}`,
      studentName: student.name,
      date: formData.date,
      time: formData.time,
      duration: `${formData.duration} mins`,
      type: formData.type,
      status: 'pending' as const,
    };

    setMeetings(prev => [...prev, newMeeting]);
    setIsDialogOpen(false);
    setFormData({ studentId: '', date: '', time: '', duration: '30', type: '', notes: '' });
    toast.success('Meeting scheduled');
  };

  const handleConfirm = (id: string) => {
    setMeetings(prev => prev.map(m => m.id === id ? { ...m, status: 'confirmed' as const } : m));
    toast.success('Meeting confirmed');
  };

  const handleCancel = (id: string) => {
    setMeetings(prev => prev.filter(m => m.id !== id));
    toast.success('Meeting cancelled');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/teacher')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">PTM Scheduling</h1>
            <p className="text-muted-foreground">Schedule and manage parent-teacher meetings</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Schedule Meeting
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Meeting</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Select Student/Parent *</Label>
                <Select value={formData.studentId} onValueChange={(v) => setFormData(prev => ({ ...prev, studentId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {classStudents.map(student => (
                      <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time *</Label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select value={formData.duration} onValueChange={(v) => setFormData(prev => ({ ...prev, duration: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Meeting Type *</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData(prev => ({ ...prev, type: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Progress Review">Progress Review</SelectItem>
                      <SelectItem value="Academic Discussion">Academic Discussion</SelectItem>
                      <SelectItem value="Concern Meeting">Concern Meeting</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                  placeholder="Add any notes for the meeting..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                />
              </div>
              <Button onClick={handleSchedule} className="w-full">Schedule Meeting</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {currentMonth}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-sm font-medium text-muted-foreground py-2">{day}</div>
              ))}
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`p-2 min-h-[80px] border rounded-lg ${
                    day === today.getDate() ? 'border-primary bg-primary/5' : 'border-transparent'
                  } ${day ? 'hover:bg-muted/50' : ''}`}
                >
                  {day && (
                    <>
                      <span className={`text-sm ${day === today.getDate() ? 'font-bold text-primary' : ''}`}>
                        {day}
                      </span>
                      <div className="space-y-1 mt-1">
                        {getMeetingsForDay(day).slice(0, 2).map(meeting => (
                          <div
                            key={meeting.id}
                            className={`text-xs px-1 py-0.5 rounded truncate ${
                              meeting.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {meeting.time}
                          </div>
                        ))}
                        {getMeetingsForDay(day).length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{getMeetingsForDay(day).length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Meetings */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Meetings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{meeting.parentName}</span>
                  </div>
                  <Badge variant={meeting.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                    {meeting.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Re: {meeting.studentName}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {meeting.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {meeting.time}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{meeting.type} • {meeting.duration}</p>
                <div className="flex gap-2">
                  {meeting.status === 'pending' && (
                    <Button size="sm" variant="outline" onClick={() => handleConfirm(meeting.id)} className="gap-1 flex-1">
                      <CheckCircle className="w-3 h-3" />
                      Confirm
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="gap-1 flex-1">
                    <RefreshCw className="w-3 h-3" />
                    Reschedule
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleCancel(meeting.id)} className="text-destructive">
                    <XCircle className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const TeacherMeetings = () => {
  return (
    <TeacherDashboardLayout>
      <TeacherMeetingsContent />
    </TeacherDashboardLayout>
  );
};

export default TeacherMeetings;
