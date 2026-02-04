import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import PageHeader from '@/components/teacher/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Clock, User, CheckCircle, XCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // Calendar state
  const [viewDate, setViewDate] = useState(new Date());
  const today = new Date();
  const currentMonth = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const getDaysInMonth = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
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
  const isToday = (day: number | null) =>
    day !== null &&
    viewDate.getFullYear() === today.getFullYear() &&
    viewDate.getMonth() === today.getMonth() &&
    day === today.getDate();

  const getMeetingsForDay = (day: number) => {
    const month = (viewDate.getMonth() + 1).toString().padStart(2, '0');
    const dateStr = `${viewDate.getFullYear()}-${month}-${day.toString().padStart(2, '0')}`;
    return meetings.filter(m => m.date === dateStr);
  };

  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1));

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
    <div className="space-y-10 max-w-[1600px]">
      {/* Page Header - Clean */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">PTM Scheduling</h1>
          <p className="text-sm text-gray-500 mt-2">Schedule and manage parent-teacher meetings</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 h-10 rounded-xl">
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
              <Button size="sm" onClick={handleSchedule} className="w-full h-8 text-xs">Schedule Meeting</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList className="h-8 p-1 rounded-lg bg-gray-100 w-full sm:w-auto">
          <TabsTrigger value="calendar" className="text-xs px-3 py-1.5 h-7 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="schedule" className="text-xs px-3 py-1.5 h-7 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            Schedule
          </TabsTrigger>
        </TabsList>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 rounded-xl shadow-sm border-gray-100 overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    {currentMonth}
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button variant="outline" size="icon" className="h-7 w-7 rounded-md" onClick={prevMonth}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-7 w-7 rounded-md" onClick={nextMonth}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-xl overflow-hidden">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="bg-gray-50 py-2 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      {day}
                    </div>
                  ))}
                  {days.map((day, index) => (
                    <div
                      key={index}
                      className={`min-h-[72px] sm:min-h-[84px] p-2 bg-white ${
                        isToday(day) ? 'ring-2 ring-primary ring-inset rounded-lg' : ''
                      } ${day ? 'hover:bg-gray-50/80' : 'bg-gray-50/50'}`}
                    >
                      {day && (
                        <>
                          <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full ${
                            isToday(day) ? 'bg-primary text-white' : 'text-gray-700'
                          }`}>
                            {day}
                          </span>
                          <div className="space-y-1 mt-1.5">
                            {getMeetingsForDay(day).slice(0, 2).map(meeting => (
                              <div
                                key={meeting.id}
                                className={`text-[10px] px-1.5 py-0.5 rounded truncate ${
                                  meeting.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}
                              >
                                {meeting.time}
                              </div>
                            ))}
                            {getMeetingsForDay(day).length > 2 && (
                              <div className="text-[10px] text-gray-500">+{getMeetingsForDay(day).length - 2}</div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-sm border-gray-100">
              <CardHeader>
                <CardTitle className="text-base">Upcoming</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[360px] overflow-y-auto">
                {meetings.slice(0, 5).map((meeting) => (
                  <div key={meeting.id} className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-xs">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium">{meeting.parentName}</span>
                      <Badge variant={meeting.status === 'confirmed' ? 'default' : 'secondary'} className="text-[10px] h-4 px-1.5">
                        {meeting.status}
                      </Badge>
                    </div>
                    <p className="text-gray-500 text-[11px]">Re: {meeting.studentName}</p>
                    <p className="text-[11px] mt-1">{meeting.date} • {meeting.time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 rounded-xl shadow-sm border-gray-100 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    {currentMonth}
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button variant="outline" size="icon" className="h-7 w-7 rounded-md" onClick={prevMonth}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-7 w-7 rounded-md" onClick={nextMonth}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-xl overflow-hidden">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="bg-gray-50 py-1.5 text-center text-[10px] font-semibold text-gray-500">
                      {d}
                    </div>
                  ))}
                  {days.map((day, index) => (
                    <div
                      key={index}
                      className={`min-h-[36px] p-1 bg-white flex items-center justify-center ${
                        isToday(day) ? 'ring-2 ring-primary ring-inset rounded' : ''
                      } ${day ? 'hover:bg-gray-50' : 'bg-gray-50/50'}`}
                    >
                      {day && (
                        <span className={`text-xs ${isToday(day) ? 'font-bold text-primary' : 'text-gray-700'}`}>{day}</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-sm border-gray-100">
              <CardHeader>
                <CardTitle className="text-base">Upcoming Meetings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {meetings.map((meeting) => (
                  <div key={meeting.id} className="p-2.5 rounded-lg bg-gray-50/80 border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="font-medium text-xs">{meeting.parentName}</span>
                      </div>
                      <Badge variant={meeting.status === 'confirmed' ? 'default' : 'secondary'} className="text-[10px] h-4 px-1.5">
                        {meeting.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mb-1.5">Re: {meeting.studentName}</p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {meeting.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {meeting.time}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mb-2">{meeting.type} • {meeting.duration}</p>
                    <div className="flex gap-1.5">
                      {meeting.status === 'pending' && (
                        <Button size="sm" variant="outline" onClick={() => handleConfirm(meeting.id)} className="gap-1 h-7 text-[11px] px-2 flex-1">
                          <CheckCircle className="w-3 h-3" />
                          Confirm
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="gap-1 h-7 text-[11px] px-2 flex-1">
                        <RefreshCw className="w-3 h-3" />
                        Reschedule
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleCancel(meeting.id)} className="text-destructive h-7 w-7 p-0">
                        <XCircle className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
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

