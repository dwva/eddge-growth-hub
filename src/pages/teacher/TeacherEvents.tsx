import { useState } from 'react';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, Clock, MapPin, Pencil, Trash2, X } from 'lucide-react';
import { events as mockEvents } from '@/data/teacherMockData';
import { toast } from 'sonner';

const TeacherEventsContent = () => {
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
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.classGroup || !formData.description || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingEvent) {
      setEvents(prev => prev.map(e => 
        e.id === editingEvent.id 
          ? { ...e, ...formData }
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
        reminderSent: false,
      };
      setEvents(prev => [...prev, newEvent]);
      toast.success('Event created');
    }

    resetForm();
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
    setFormData({ title: '', classGroup: '', description: '', date: '', time: '', location: '' });
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
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    toast.success('Event deleted');
  };

  return (
    <div className="space-y-3 md:space-y-5 max-w-[1600px]">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-2 md:gap-4">
        <div>
          <h1 className="text-base md:text-lg font-bold text-gray-900">Announcements</h1>
          <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">{events.length} active</p>
        </div>
        <Button size="sm" onClick={() => setIsFormOpen(!isFormOpen)} className="gap-1.5 h-7 md:h-8 text-[10px] md:text-xs rounded-lg">
          <Plus className="w-3 h-3 md:w-4 md:h-4" />
          New
        </Button>
      </div>

      {/* Create/Edit Form */}
      {isFormOpen && (
        <Card className="shadow-sm rounded-lg md:rounded-xl">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="font-semibold text-xs md:text-sm">{editingEvent ? 'Edit Announcement' : 'New Announcement'}</h3>
              <Button variant="ghost" size="icon" onClick={resetForm} className="h-6 w-6 md:h-8 md:w-8">
                <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Button>
            </div>
            <div className="space-y-2 md:space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                <div className="space-y-1 md:space-y-1.5">
                  <Label className="text-[10px] md:text-xs">Title</Label>
                  <Input
                    placeholder="Event title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="h-8 md:h-9 text-xs rounded-lg"
                  />
                </div>
                <div className="space-y-1 md:space-y-1.5">
                  <Label className="text-[10px] md:text-xs">Class/Group</Label>
                  <Select value={formData.classGroup} onValueChange={(v) => setFormData(prev => ({ ...prev, classGroup: v }))}>
                    <SelectTrigger className="h-8 md:h-9 text-xs rounded-lg">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Class 10-A">Class 10-A</SelectItem>
                      <SelectItem value="Class 10-B">Class 10-B</SelectItem>
                      <SelectItem value="All Classes">All Classes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Description</Label>
                <Textarea
                  placeholder="Event details..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Time</Label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Location</Label>
                  <Input
                    placeholder="Location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="h-9"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleSubmit} size="sm" className="h-9">
                  {editingEvent ? 'Update' : 'Create'}
                </Button>
                <Button variant="outline" onClick={resetForm} size="sm" className="h-9">Cancel</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
        {events.map((event) => (
          <Card key={event.id} className="rounded-lg md:rounded-xl">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-start justify-between mb-2 md:mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-xs md:text-sm mb-1 truncate">{event.title}</h3>
                  <span className="inline-block px-1.5 md:px-2 py-0.5 text-[9px] md:text-xs bg-primary/10 text-primary rounded">
                    {event.classGroup}
                  </span>
                </div>
                <div className="flex gap-0.5 md:gap-1 ml-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(event)} className="h-6 w-6 md:h-7 md:w-7">
                    <Pencil className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)} className="h-6 w-6 md:h-7 md:w-7">
                    <Trash2 className="w-3 h-3 md:w-3.5 md:h-3.5 text-red-500" />
                  </Button>
                </div>
              </div>
              <p className="text-[10px] md:text-sm text-gray-600 mb-2 md:mb-3 line-clamp-2">{event.description}</p>
              <div className="space-y-1 md:space-y-1.5 text-[9px] md:text-xs text-gray-500">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  <span>{event.location}</span>
                </div>
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

