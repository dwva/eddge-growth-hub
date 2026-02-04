import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { 
  Calendar,
  MapPin,
  Clock,
  Users,
  Megaphone,
  PartyPopper,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

type AnnouncementType = 'event' | 'meeting' | 'holiday' | 'notice';
type Priority = 'high' | 'medium' | 'low';

type Announcement = {
  id: string;
  title: string;
  description: string;
  type: AnnouncementType;
  date: string;      // ISO
  time?: string;
  location?: string;
  priority: Priority;
  createdAt: string; // ISO, for fading “New”
};

// Mock announcements data
const announcements: Announcement[] = [
  {
    id: '1',
    title: 'Annual Day Celebration',
    description: 'Join us for the grand Annual Day celebration with cultural performances, awards ceremony, and refreshments.',
    type: 'event',
    date: '2026-02-15',
    time: '10:00 AM',
    location: 'School Auditorium',
    priority: 'high',
    createdAt: '2026-02-01',
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
    createdAt: '2026-02-02',
  },
  {
    id: '3',
    title: 'Holiday Notice - Republic Day',
    description: 'School will remain closed on account of Republic Day. Classes resume on 27th January.',
    type: 'holiday',
    date: '2026-01-26',
    priority: 'medium',
    createdAt: '2026-01-15',
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
    createdAt: '2026-02-05',
  },
  {
    id: '5',
    title: 'Library Book Return',
    description: 'All library books must be returned by 28th Feb for annual stock verification.',
    type: 'notice',
    date: '2026-02-28',
    priority: 'low',
    createdAt: '2026-01-10',
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
    createdAt: '2026-01-25',
  },
];

const StudentAnnouncements = () => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const getTypeIcon = (type: AnnouncementType) => {
    switch (type) {
      case 'event': return <PartyPopper className="w-5 h-5 text-purple-500" />;
      case 'meeting': return <Users className="w-5 h-5 text-blue-500" />;
      case 'holiday': return <Calendar className="w-5 h-5 text-green-500" />;
      case 'notice': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      default: return <Megaphone className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: AnnouncementType) => {
    switch (type) {
      case 'event': return 'bg-purple-100 text-purple-700';
      case 'meeting': return 'bg-blue-100 text-blue-700';
      case 'holiday': return 'bg-green-100 text-green-700';
      case 'notice': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-amber-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const shouldShowNewBadge = (announcement: Announcement) => {
    const created = new Date(announcement.createdAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays <= 3;
  };

  const filterByTab = (tab: 'all' | 'events' | 'notices' | 'holidays' | 'completed') => {
    switch (tab) {
      case 'events':
        return announcements.filter((a) => a.type === 'event' || a.type === 'meeting');
      case 'notices':
        return announcements.filter((a) => a.type === 'notice');
      case 'holidays':
        return announcements.filter((a) => a.type === 'holiday');
      case 'completed': {
        const now = new Date();
        return announcements.filter((a) => {
          const d = new Date(a.date);
          return (
            d < now &&
            (a.type === 'event' || a.type === 'meeting' || a.type === 'holiday')
          );
        });
      }
      default:
        return announcements;
    }
  };

  const today = new Date();
  const sortedAnnouncements = [...announcements].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const upcomingAnnouncements = sortedAnnouncements.filter((a) => {
    const d = new Date(a.date);
    return d >= today && (a.type === 'event' || a.type === 'meeting' || a.type === 'holiday');
  });

  const nextEvent = upcomingAnnouncements[0];
  const secondaryEvent = upcomingAnnouncements[1];

  return (
    <StudentDashboardLayout title="Events & Announcements">
      <div className="space-y-6">
        {/* Upcoming Events */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-muted-foreground">Upcoming events</h2>
            <span className="text-[11px] text-muted-foreground">
              Your next 3 school activities
            </span>
          </div>
          {nextEvent ? (
            <div className="space-y-3">
              <Card
                className="group hover:shadow-xl transition-shadow cursor-pointer border border-primary/25 bg-primary/5 min-h-[168px]"
                onClick={() => setSelectedAnnouncement(nextEvent)}
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {nextEvent.type === 'meeting' ? (
                          <Users className="w-6 h-6 text-primary" />
                        ) : nextEvent.type === 'holiday' ? (
                          <Calendar className="w-6 h-6 text-primary" />
                        ) : (
                          <PartyPopper className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate text-gray-900">
                          {nextEvent.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {nextEvent.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="inline-flex items-center rounded-full bg-white/80 text-[10px] font-semibold text-primary px-2 py-0.5">
                        Next up
                      </span>
                      <span className="inline-flex items-center rounded-full bg-white/60 text-[10px] font-medium text-gray-700 px-2 py-0.5">
                        High priority
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(nextEvent.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    {nextEvent.time && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {nextEvent.time}
                      </span>
                    )}
                    {nextEvent.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {nextEvent.location}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>

              {secondaryEvent && (
                <Card
                  className="group hover:shadow-md transition-shadow cursor-pointer border border-primary/15 bg-white"
                  onClick={() => setSelectedAnnouncement(secondaryEvent)}
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                          {secondaryEvent.type === 'meeting' ? (
                            <Users className="w-5 h-5 text-primary" />
                          ) : secondaryEvent.type === 'holiday' ? (
                            <Calendar className="w-5 h-5 text-primary" />
                          ) : (
                            <PartyPopper className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold truncate text-gray-900">
                            {secondaryEvent.title}
                          </h3>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">
                            {secondaryEvent.description}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-white text-[10px] text-primary border border-primary/20">
                        Coming up
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(secondaryEvent.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      {secondaryEvent.time && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {secondaryEvent.time}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 py-8 px-4 text-center text-sm text-muted-foreground">
              No upcoming events. You’re all caught up!
            </div>
          )}
        </div>

        {/* All Announcements */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="inline-flex rounded-full bg-gray-50 border border-gray-100 p-1">
            <TabsTrigger
              value="all"
              className="rounded-full px-3 py-1 text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="rounded-full px-3 py-1 text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              Events
            </TabsTrigger>
            <TabsTrigger
              value="notices"
              className="rounded-full px-3 py-1 text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              Notices
            </TabsTrigger>
            <TabsTrigger
              value="holidays"
              className="rounded-full px-3 py-1 text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              Holidays
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="rounded-full px-3 py-1 text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {filterByTab('all').map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  getPriorityColor={getPriorityColor}
                  getTypeIcon={getTypeIcon}
                  getTypeColor={getTypeColor}
                  shouldShowNewBadge={shouldShowNewBadge}
                  onSelect={setSelectedAnnouncement}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events">
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {filterByTab('events').map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  getPriorityColor={getPriorityColor}
                  getTypeIcon={getTypeIcon}
                  getTypeColor={getTypeColor}
                  shouldShowNewBadge={shouldShowNewBadge}
                  onSelect={setSelectedAnnouncement}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="notices">
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {filterByTab('notices').map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  getPriorityColor={getPriorityColor}
                  getTypeIcon={getTypeIcon}
                  getTypeColor={getTypeColor}
                  shouldShowNewBadge={shouldShowNewBadge}
                  onSelect={setSelectedAnnouncement}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="holidays">
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {filterByTab('holidays').map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  getPriorityColor={getPriorityColor}
                  getTypeIcon={getTypeIcon}
                  getTypeColor={getTypeColor}
                  shouldShowNewBadge={shouldShowNewBadge}
                  onSelect={setSelectedAnnouncement}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="completed">
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {filterByTab('completed').map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  getPriorityColor={getPriorityColor}
                  getTypeIcon={getTypeIcon}
                  getTypeColor={getTypeColor}
                  shouldShowNewBadge={shouldShowNewBadge}
                  onSelect={setSelectedAnnouncement}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Details dialog */}
        <Dialog open={!!selectedAnnouncement} onOpenChange={(open) => !open && setSelectedAnnouncement(null)}>
          {selectedAnnouncement && (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedAnnouncement.title}</DialogTitle>
                <DialogDescription>
                  {selectedAnnouncement.type === 'holiday'
                    ? 'Holiday'
                    : selectedAnnouncement.type === 'meeting'
                    ? 'Event / Meeting'
                    : 'Event / Notice'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">{selectedAnnouncement.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(selectedAnnouncement.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  {selectedAnnouncement.time && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedAnnouncement.time}
                    </span>
                  )}
                  {selectedAnnouncement.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedAnnouncement.location}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={getTypeColor(selectedAnnouncement.type)}>
                    {selectedAnnouncement.type}
                  </Badge>
                  {new Date(selectedAnnouncement.date) < today && (
                    <Badge className="bg-gray-100 text-gray-700 border border-gray-200">
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </StudentDashboardLayout>
  );
};

type AnnouncementCardProps = {
  announcement: Announcement;
  getPriorityColor: (p: Priority) => string;
  getTypeIcon: (t: AnnouncementType) => JSX.Element;
  getTypeColor: (t: AnnouncementType) => string;
  shouldShowNewBadge: (a: Announcement) => boolean;
  onSelect: (a: Announcement) => void;
};

const AnnouncementCard = ({
  announcement,
  getPriorityColor,
  getTypeIcon,
  getTypeColor,
  shouldShowNewBadge,
  onSelect,
}: AnnouncementCardProps) => {
  const showNew = shouldShowNewBadge(announcement);
  const isImportant = announcement.priority === 'high';
  const isCompleted = new Date(announcement.date) < new Date();

  return (
    <Card
      className={`
        group relative cursor-pointer border border-gray-100
        hover:shadow-md transition-shadow
        border-l-4 ${getPriorityColor(announcement.priority)}
      `}
      onClick={() => onSelect(announcement)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              {getTypeIcon(announcement.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold">{announcement.title}</h3>
                {showNew && (
                  <Badge className="bg-primary text-white text-[10px] px-1.5 py-0">New</Badge>
                )}
                <Badge className={`text-[10px] capitalize px-1.5 py-0 ${getTypeColor(announcement.type)}`}>
                  {announcement.type === 'meeting' ? 'Event' : announcement.type}
                </Badge>
                {isCompleted && (announcement.type === 'holiday' || announcement.type === 'event' || announcement.type === 'meeting') && (
                  <Badge className="text-[10px] px-1.5 py-0 bg-gray-100 text-gray-700 border border-gray-200">
                    Completed
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {announcement.description}
              </p>

              {/* AI insight strip for important items */}
              {isImportant && (
                <div className="mt-2 rounded-lg bg-primary/5 px-3 py-1.5 text-[11px] text-primary flex items-center gap-1.5">
                  <span className="font-semibold">AI tip:</span>
                  <span className="text-primary/80">
                    Attendance recommended based on your progress and upcoming plans.
                  </span>
                </div>
              )}

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

          {/* Right-side actions + chevron */}
          <div className="flex flex-col items-end gap-2">
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            <div className="hidden md:flex items-center gap-1 text-[11px] text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
              <button className="px-1.5 py-0.5 rounded-full hover:bg-gray-100">
                Add to calendar
              </button>
              <span>·</span>
              <button className="px-1.5 py-0.5 rounded-full hover:bg-gray-100">
                Set reminder
              </button>
              <span>·</span>
              <button className="px-1.5 py-0.5 rounded-full hover:bg-gray-100">
                Mark as read
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentAnnouncements;
