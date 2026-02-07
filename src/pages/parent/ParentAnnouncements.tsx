import { useState } from 'react';
import ParentDashboardLayout from '@/components/layout/ParentDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { announcements } from '@/data/parentMockData';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Search,
  Calendar,
  AlertCircle,
  Bell,
  School,
  Info,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ParentAnnouncementsContent = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'holiday', label: 'Holiday' },
    { id: 'event', label: 'Event' },
    { id: 'information', label: 'Information' },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Calendar className="w-5 h-5" />;
      case 'fee': return <DollarSign className="w-5 h-5" />;
      case 'holiday': return <Bell className="w-5 h-5" />;
      case 'event': return <School className="w-5 h-5" />;
      case 'information': return <Info className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      meeting: 'bg-blue-100 text-blue-700',
      fee: 'bg-amber-100 text-amber-700',
      holiday: 'bg-green-100 text-green-700',
      event: 'bg-purple-100 text-purple-700',
      information: 'bg-gray-100 text-gray-700',
    };
    return styles[type] || 'bg-gray-100 text-gray-700';
  };

  const filteredAnnouncements = announcements
    .filter(a => {
      const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'all' || a.type === activeFilter;
      // Exclude fee and meeting type announcements entirely
      const isNotFee = a.type !== 'fee';
      const isNotMeeting = a.type !== 'meeting';
      return matchesSearch && matchesFilter && isNotFee && isNotMeeting;
    })
    .sort((a, b) => {
      if (a.important && !b.important) return -1;
      if (!a.important && b.important) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <div className="space-y-3 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold">{t('nav.announcements')}</h1>
        <p className="text-muted-foreground">Stay updated with school announcements</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search announcements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
              activeFilter === filter.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      {filteredAnnouncements.length > 0 ? (
        <div className="space-y-4 text-xs">
          {filteredAnnouncements.map((announcement) => (
            <Card
              key={announcement.id}
              className={cn(
                'overflow-hidden',
                announcement.important && 'border-red-200 bg-red-50/50'
              )}
            >
              <CardContent className="p-4 text-xs">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'p-2 rounded-lg',
                    announcement.important ? 'bg-red-100' : 'bg-primary/10'
                  )}>
                    {announcement.important ? (
                      <AlertCircle className={cn(
                        'w-5 h-5',
                        announcement.important ? 'text-red-600' : 'text-primary'
                      )} />
                    ) : (
                      getTypeIcon(announcement.type)
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <h3 className="font-semibold text-sm">{announcement.title}</h3>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      By {announcement.author}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-2">
                      {announcement.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-3">
                      {new Date(announcement.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="w-12 h-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No announcements found</h3>
            <p className="text-muted-foreground mt-1">
              {searchQuery || activeFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No announcements available at the moment'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const ParentAnnouncements = () => {
  return (
    <ParentDashboardLayout>
      <ParentAnnouncementsContent />
    </ParentDashboardLayout>
  );
};

export default ParentAnnouncements;
