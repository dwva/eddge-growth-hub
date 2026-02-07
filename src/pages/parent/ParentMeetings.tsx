import { useState } from 'react';
import ParentDashboardLayout from '@/components/layout/ParentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { meetings } from '@/data/parentMockData';
import {
  Video,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  List,
  Clock,
  FileText,
  Plus,
} from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const ParentMeetings = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'in-person': return <MapPin className="w-4 h-4" />;
      default: return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled': return <Badge className="bg-blue-100 text-blue-700">Scheduled</Badge>;
      case 'completed': return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case 'cancelled': return <Badge className="bg-red-100 text-red-700">Cancelled</Badge>;
      default: return null;
    }
  };

  const meetingsOnDate = selectedDate
    ? meetings.filter(m => isSameDay(parseISO(m.date), selectedDate))
    : [];

  const upcomingMeetings = meetings.filter(m => m.status === 'scheduled');
  const pastMeetings = meetings.filter(m => m.status !== 'scheduled');

  const datesWithMeetings = meetings.map(m => parseISO(m.date));

  return (
    <ParentDashboardLayout>
      <div className="space-y-3 md:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Teacher Meetings</h1>
            <p className="text-muted-foreground">Schedule and manage PTM sessions</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 ${viewMode === 'calendar' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
              >
                <CalendarIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Book PTM
            </Button>
          </div>
        </div>

        {viewMode === 'calendar' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-1">
              <CardContent className="p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md pointer-events-auto"
                  modifiers={{
                    hasMeeting: datesWithMeetings,
                  }}
                  modifiersStyles={{
                    hasMeeting: {
                      fontWeight: 'bold',
                      backgroundColor: 'hsl(var(--primary) / 0.1)',
                      color: 'hsl(var(--primary))',
                    },
                  }}
                />
              </CardContent>
            </Card>

            {/* Meetings for Selected Date */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">
                  Meetings on {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Selected Date'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {meetingsOnDate.length > 0 ? (
                  <div className="space-y-4">
                    {meetingsOnDate.map((meeting) => (
                      <div key={meeting.id} className="p-4 rounded-lg border">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              {getTypeIcon(meeting.type)}
                            </div>
                            <div>
                              <h4 className="font-semibold">{meeting.teacherName}</h4>
                              <p className="text-sm text-muted-foreground">{meeting.subject}</p>
                              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{meeting.time}</span>
                                <span>•</span>
                                <span>{meeting.duration}</span>
                              </div>
                            </div>
                          </div>
                          {getStatusBadge(meeting.status)}
                        </div>
                        <div className="flex gap-2 mt-4">
                          {meeting.status === 'scheduled' && meeting.type === 'video' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Video className="w-4 h-4 mr-1" />
                              Join Meeting
                            </Button>
                          )}
                          {meeting.status === 'completed' && meeting.notes && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <FileText className="w-4 h-4 mr-1" />
                                  View Notes
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Meeting Notes</DialogTitle>
                                </DialogHeader>
                                <div className="mt-4">
                                  <p className="text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">Teacher:</span> {meeting.teacherName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">Subject:</span> {meeting.subject}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">Date:</span> {meeting.date}
                                  </p>
                                  <div className="mt-4 p-3 rounded-lg bg-muted">
                                    <p className="text-sm">{meeting.notes}</p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">No meetings scheduled for this date</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Upcoming Meetings */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Upcoming Meetings</h2>
              {upcomingMeetings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingMeetings.map((meeting) => (
                    <Card key={meeting.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              {getTypeIcon(meeting.type)}
                            </div>
                            <div>
                              <h4 className="font-semibold">{meeting.teacherName}</h4>
                              <p className="text-sm text-muted-foreground">{meeting.subject}</p>
                            </div>
                          </div>
                          {getStatusBadge(meeting.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{meeting.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{meeting.time}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {meeting.type === 'video' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Video className="w-4 h-4 mr-1" />
                              Join
                            </Button>
                          )}
                          <Button size="sm" variant="outline">Reschedule</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">No upcoming meetings</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Meeting History */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Meeting History</h2>
              <Card>
                <CardContent className="divide-y">
                  {pastMeetings.map((meeting) => (
                    <div key={meeting.id} className="py-4 first:pt-4 last:pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            {getTypeIcon(meeting.type)}
                          </div>
                          <div>
                            <h4 className="font-medium">{meeting.teacherName}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{meeting.subject}</span>
                              <span>•</span>
                              <span>{meeting.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(meeting.status)}
                          {meeting.notes && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <FileText className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Meeting Notes</DialogTitle>
                                </DialogHeader>
                                <div className="mt-4 p-3 rounded-lg bg-muted">
                                  <p className="text-sm">{meeting.notes}</p>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </ParentDashboardLayout>
  );
};

export default ParentMeetings;
