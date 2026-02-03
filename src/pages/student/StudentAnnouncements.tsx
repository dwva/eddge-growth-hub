import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell,
  Calendar,
  MapPin,
  Clock,
  Users,
  Megaphone,
  PartyPopper,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

// Mock announcements data
const announcements = [
  {
    id: '1',
    title: 'Annual Day Celebration',
    description: 'Join us for the grand Annual Day celebration with cultural performances, awards ceremony, and refreshments.',
    type: 'event',
    date: '2026-02-15',
    time: '10:00 AM',
    location: 'School Auditorium',
    priority: 'high',
    isNew: true,
  },
  {
    id: '2',
    title: 'Parent-Teacher Meeting',
    description: 'PTM for Class 10 students. Parents are requested to attend to discuss academic progress.',
    type: 'meeting',
    date: '2026-02-20',
    time: '09:00 AM - 01:00 PM',
    location: 'Respective Classrooms',
    priority: 'high',
    isNew: true,
  },
  {
    id: '3',
    title: 'Holiday Notice - Republic Day',
    description: 'School will remain closed on account of Republic Day. Classes resume on 27th January.',
    type: 'holiday',
    date: '2026-01-26',
    priority: 'medium',
    isNew: false,
  },
  {
    id: '4',
    title: 'Science Exhibition',
    description: 'Inter-school Science Exhibition. Students can submit their project proposals by 10th Feb.',
    type: 'event',
    date: '2026-02-25',
    time: '09:00 AM - 04:00 PM',
    location: 'Science Block',
    priority: 'medium',
    isNew: true,
  },
  {
    id: '5',
    title: 'Library Book Return',
    description: 'All library books must be returned by 28th Feb for annual stock verification.',
    type: 'notice',
    date: '2026-02-28',
    priority: 'low',
    isNew: false,
  },
  {
    id: '6',
    title: 'Sports Day Trials',
    description: 'Trials for Annual Sports Day events. Register with your PE teacher by 5th Feb.',
    type: 'event',
    date: '2026-02-10',
    time: '02:00 PM',
    location: 'Sports Ground',
    priority: 'medium',
    isNew: false,
  },
];

const upcomingEvents = announcements.filter(a => a.type === 'event').slice(0, 3);

const StudentAnnouncements = () => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'event': return <PartyPopper className="w-5 h-5 text-purple-500" />;
      case 'meeting': return <Users className="w-5 h-5 text-blue-500" />;
      case 'holiday': return <Calendar className="w-5 h-5 text-green-500" />;
      case 'notice': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      default: return <Megaphone className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event': return 'bg-purple-100 text-purple-700';
      case 'meeting': return 'bg-blue-100 text-blue-700';
      case 'holiday': return 'bg-green-100 text-green-700';
      case 'notice': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-amber-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  return (
    <StudentDashboardLayout title="Events & Announcements">
      <div className="space-y-6">
        {/* Upcoming Events */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <PartyPopper className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{event.title}</h3>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{event.time}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Announcements */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="event">Events</TabsTrigger>
            <TabsTrigger value="notice">Notices</TabsTrigger>
            <TabsTrigger value="holiday">Holidays</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {announcements.map((announcement) => (
              <Card 
                key={announcement.id} 
                className={`border-l-4 ${getPriorityColor(announcement.priority)} hover:shadow-md transition-shadow`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        {getTypeIcon(announcement.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-medium">{announcement.title}</h3>
                          {announcement.isNew && (
                            <Badge className="bg-primary text-white text-xs">New</Badge>
                          )}
                          <Badge className={`text-xs capitalize ${getTypeColor(announcement.type)}`}>
                            {announcement.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{announcement.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(announcement.date).toLocaleDateString('en-US', { 
                              weekday: 'short',
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                          {announcement.time && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {announcement.time}
                            </span>
                          )}
                          {announcement.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {announcement.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {['event', 'notice', 'holiday'].map((type) => (
            <TabsContent key={type} value={type} className="space-y-3">
              {announcements.filter(a => a.type === type).map((announcement) => (
                <Card 
                  key={announcement.id} 
                  className={`border-l-4 ${getPriorityColor(announcement.priority)} hover:shadow-md transition-shadow`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          {getTypeIcon(announcement.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-medium">{announcement.title}</h3>
                            {announcement.isNew && (
                              <Badge className="bg-primary text-white text-xs">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{announcement.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(announcement.date).toLocaleDateString('en-US', { 
                                weekday: 'short',
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                            {announcement.time && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {announcement.time}
                              </span>
                            )}
                            {announcement.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {announcement.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentAnnouncements;
