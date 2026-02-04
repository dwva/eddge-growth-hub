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
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, Clock, MapPin, Pencil, Trash2, Share, Bell, CheckCircle } from 'lucide-react';
import { events as mockEvents } from '@/data/teacherMockData';
import { toast } from 'sonner';

const TeacherEventsContent = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState(mockEvents);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<typeof mockEvents[0] | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    classGroup: '',
    description: '',
    date: '',
    time: '',
    location: '',
    sendReminder: false,
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.classGroup || !formData.description || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingEvent) {
      setEvents(prev => prev.map(e => 
        e.id === editingEvent.id 
          ? { ...e, ...formData, reminderSent: formData.sendReminder }
          : e
      ));
      toast.success('Event updated');
    } else {
      const newEvent = {
        id: `e${Date.now()}`,
        title: formData.title,
        classGroup: formData.classGroup,
        description: formData.description,
        date: formData.date,
        time: formData.time || 'TBD',
        location: formData.location || 'TBD',
        reminderSent: formData.sendReminder,
      };
      setEvents(prev => [...prev, newEvent]);
      toast.success('Event created');
    }

    resetForm();
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
    setFormData({ title: '', classGroup: '', description: '', date: '', time: '', location: '', sendReminder: false });
  };

  const handleEdit = (event: typeof mockEvents[0]) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      classGroup: event.classGroup,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      sendReminder: event.reminderSent,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    toast.success('Event deleted');
  };

  const handleSendReminder = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, reminderSent: true } : e));
    toast.success('Reminder sent to parents');
  };

  return (
    <div className="space-y-10 max-w-[1600px]">
      {/* Page Header - Clean */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events & Announcements</h1>
          <p className="text-sm text-gray-500 mt-2">Create and manage school events and announcements</p>
        </div>
        <Button size="sm" onClick={() => setIsFormOpen(!isFormOpen)} className="gap-2 h-10 rounded-xl">
          <Plus className="w-4 h-4" />
          Create New Event
        </Button>
      </div>

      {/* Create/Edit Form */}
      {isFormOpen && (
        <Card className="rounded-xl shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Event Title *</Label>
                <Input
                  placeholder="e.g., Parent-Teacher Meeting"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Class/Group *</Label>
                <Select value={formData.classGroup} onValueChange={(v) => setFormData(prev => ({ ...prev, classGroup: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class or group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Class 10-A">Class 10-A</SelectItem>
                    <SelectItem value="Class 10-B">Class 10-B</SelectItem>
                    <SelectItem value="Class 9-A">Class 9-A</SelectItem>
                    <SelectItem value="All Classes">All Classes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                placeholder="Event description..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="e.g., School Auditorium"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="reminder"
                checked={formData.sendReminder}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sendReminder: checked as boolean }))}
              />
              <label htmlFor="reminder" className="text-sm">Send reminder to parents</label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit}>
                {editingEvent ? 'Update Event' : 'Post Event'}
              </Button>
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <Card key={event.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <Badge variant="outline" className="mt-1">{event.classGroup}</Badge>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(event)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                {event.reminderSent ? (
                  <Button variant="outline" size="sm" disabled className="gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Reminder Sent
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => handleSendReminder(event.id)} className="gap-1">
                    <Bell className="w-3 h-3" />
                    Send Reminder
                  </Button>
                )}
                <Button variant="outline" size="sm" className="gap-1">
                  <Share className="w-3 h-3" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const TeacherEvents = () => {
  return (
    <TeacherDashboardLayout>
      <TeacherEventsContent />
    </TeacherDashboardLayout>
  );
};

export default TeacherEvents;

