import ParentDashboardLayout from '@/components/layout/ParentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useChild } from '@/contexts/ChildContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { 
  Loader2,
  Calculator,
  Microscope,
  BookOpen,
  Globe,
  Palette,
  TrendingUp,
  Calendar,
  FileText,
  MessageSquare,
  Clock,
  Circle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { homeworkList, announcements } from '@/data/parentMockData';
import { CircularProgress } from '@/components/shared/CircularProgress';

// Subject icon mapping
const subjectIcons: { [key: string]: any } = {
  'Mathematics': Calculator,
  'Science': Microscope,
  'English': BookOpen,
  'History': Globe,
  'Geography': Globe,
  'Art': Palette,
};

const subjectColors: { [key: string]: { bg: string; icon: string } } = {
  'Mathematics': { bg: 'bg-blue-50', icon: 'text-blue-600' },
  'Science': { bg: 'bg-purple-50', icon: 'text-purple-600' },
  'English': { bg: 'bg-pink-50', icon: 'text-pink-600' },
  'History': { bg: 'bg-amber-50', icon: 'text-amber-600' },
  'Geography': { bg: 'bg-teal-50', icon: 'text-teal-600' },
};

const ParentDashboardHomeContent = () => {
  const { selectedChild, isLoading } = useChild();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Mock upcoming events
  const upcomingEvents = [
    { id: '1', title: 'Parent-Teacher Meeting', date: 'Feb 5', type: 'meeting' },
    { id: '2', title: 'Science Fair', date: 'Feb 10', type: 'event' },
    { id: '3', title: 'Math Test', date: 'Feb 8', type: 'test' },
  ];

  // Get homework queue (pending items)
  const homeworkQueue = homeworkList.filter(hw => hw.status === 'pending').slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!selectedChild) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-3xl">👶</div>
          <h3 className="mt-4 text-lg font-semibold">No Child Linked</h3>
          <p className="text-muted-foreground">Please link a child to view the dashboard.</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const attendanceRate = 92;
  const subjectsCompleted = selectedChild.subjects?.length || 0;
  const overallPerformance = Math.round(
    selectedChild.subjects?.reduce((sum, s) => sum + s.score, 0) / (selectedChild.subjects?.length || 1)
  );

  // Important announcements for hero section (top 2, important only)
  const heroAnnouncements = announcements
    .filter((a) => a.important)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);

  return (
    <div className="w-full space-y-3 md:space-y-4">
      {/* Hero Section - Full Width Gradient Card */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-xl p-3 md:p-4 lg:p-6 min-h-[160px] md:min-h-[240px] overflow-hidden z-0">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 md:w-64 h-40 md:h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 z-0" />
        <div className="absolute bottom-0 left-1/2 w-24 md:w-32 h-24 md:h-32 bg-white/5 rounded-full translate-y-1/2 z-0" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
          {/* Left: Parent Overview + Hero Announcements */}
          <div className="lg:col-span-2 space-y-3 md:space-y-5">
            <div>
              <p className="text-purple-200 text-[10px] md:text-[11px] font-medium tracking-wider uppercase mb-1 md:mb-2 leading-relaxed">
                Parent Portal
              </p>
              <h1 className="text-base md:text-xl lg:text-2xl font-bold text-white mb-1 md:mb-2 leading-tight">
                Track {selectedChild.name}'s Progress
              </h1>
              <div className="flex items-center gap-2 text-purple-200 text-xs md:text-sm leading-relaxed">
                <span>{selectedChild?.class || 'Grade 10-A'}</span>
                <span>•</span>
                <span>{subjectsCompleted} Subjects</span>
              </div>
            </div>

            {heroAnnouncements.length > 0 && (
              <div className="space-y-2.5 max-w-lg">
                {heroAnnouncements.map((ann) => (
                  <button
                    key={ann.id}
                    type="button"
                    onClick={() => navigate('/parent/announcements')}
                    className="w-full inline-flex items-center gap-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 px-4 py-3 text-left transition-colors"
                  >
                    <span className="inline-flex flex-shrink-0 items-center justify-center w-7 h-7 rounded-full bg-white/90 text-[11px] font-semibold text-purple-600">
                      !
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] md:text-xs font-semibold text-white leading-snug">
                        {ann.title}
                      </p>
                      <p className="text-[10px] md:text-[11px] text-purple-100/90 mt-1 leading-relaxed line-clamp-2">
                        {new Date(ann.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        · {ann.description}
                      </p>
                    </div>
                  </button>
                ))}
                <p className="text-[10px] md:text-[11px] text-purple-100/80 pt-1 leading-relaxed">
                  Tap an announcement to see full details and earlier updates.
                </p>
              </div>
            )}
          </div>

          {/* Right: Compact Stat Cards */}
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 md:gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-4 border border-white/20">
              <p className="text-purple-200 text-[9px] md:text-xs mb-0.5 md:mb-1">Attendance</p>
              <p className="text-base md:text-xl font-bold text-white">{attendanceRate}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-4 border border-white/20">
              <p className="text-purple-200 text-[9px] md:text-xs mb-0.5 md:mb-1">Subjects</p>
              <p className="text-base md:text-xl font-bold text-white">{subjectsCompleted}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-4 border border-white/20">
              <p className="text-purple-200 text-[9px] md:text-xs mb-0.5 md:mb-1">Performance</p>
              <p className="text-base md:text-xl font-bold text-white">{overallPerformance}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Larger tiles */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <button
          onClick={() => navigate(`/parent/child-progress/${selectedChild.id}`)}
          className="group p-2.5 md:p-4 rounded-lg md:rounded-xl bg-blue-50/70 hover:bg-blue-100 border border-blue-200/60 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <div className="flex flex-col md:flex-row items-center gap-1.5 md:gap-3.5">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center flex-shrink-0 transition-colors">
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-[10px] md:text-sm text-gray-800 leading-tight">Attendance</h3>
              <p className="text-[9px] md:text-xs text-gray-500 mt-0.5 truncate hidden sm:block">View records</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate('/parent/homework')}
          className="group p-2.5 md:p-4 rounded-lg md:rounded-xl bg-pink-50/70 hover:bg-pink-100 border border-pink-200/60 hover:border-pink-300 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <div className="flex flex-col md:flex-row items-center gap-1.5 md:gap-3.5">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-pink-100 group-hover:bg-pink-200 flex items-center justify-center flex-shrink-0 transition-colors">
              <FileText className="w-4 h-4 md:w-5 md:h-5 text-pink-600" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-[10px] md:text-sm text-gray-800 leading-tight">Homework</h3>
              <p className="text-[9px] md:text-xs text-gray-500 mt-0.5 truncate hidden sm:block">View assignments</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate('/parent/communications')}
          className="group p-2.5 md:p-4 rounded-lg md:rounded-xl bg-teal-50/70 hover:bg-teal-100 border border-teal-200/60 hover:border-teal-300 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <div className="flex flex-col md:flex-row items-center gap-1.5 md:gap-3.5">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-teal-100 group-hover:bg-teal-200 flex items-center justify-center flex-shrink-0 transition-colors">
              <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-teal-600" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-[10px] md:text-sm text-gray-800 leading-tight">Messages</h3>
              <p className="text-[9px] md:text-xs text-gray-500 mt-0.5 truncate hidden sm:block">Communicate</p>
            </div>
          </div>
        </button>
      </div>

      {/* Main Content Section - 12 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
        {/* Left: Academic Performance (col-span-8) */}
        <Card className="lg:col-span-8 border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-1 md:pb-2 px-3 md:px-6">
            <CardTitle className="text-xs md:text-base font-semibold text-gray-800">Academic Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 md:space-y-1.5 pt-0 px-2 md:px-6">
            {/* Subject Progress - Circular grid: 3 on first row, 2 on second */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-1.5 md:gap-3">
              {selectedChild.subjects?.map((subject, index) => {
                const Icon = subjectIcons[subject.name] || BookOpen;
                const colors = subjectColors[subject.name] || { bg: 'bg-gray-50', icon: 'text-gray-600' };
                
                return (
                  <div 
                    key={index} 
                    className="group p-2 md:p-2.5 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200 cursor-pointer flex flex-col items-center"
                    onClick={() => navigate(`/parent/child-progress/${selectedChild.id}`)}
                  >
                    <CircularProgress
                      value={subject.score}
                      size={70}
                      strokeWidth={6}
                    />
                    <div className="mt-1.5 flex items-center justify-center gap-1">
                      <div className={`w-5 h-5 md:w-6 md:h-6 rounded-md ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-3 h-3 md:w-3.5 md:h-3.5 ${colors.icon}`} />
                      </div>
                      <div className="text-center">
                        <p className="text-[11px] md:text-xs font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                          {subject.name}
                        </p>
                        <p className="text-[9px] text-gray-500">
                          {subject.score}% completed
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Right: Homework Queue (col-span-4) */}
        <Card className="lg:col-span-4 border-0 shadow-sm">
          <CardHeader className="px-3 md:px-6 py-2 md:py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs md:text-lg font-semibold text-gray-800">Homework Queue</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/parent/homework')}
                className="text-xs text-primary hover:text-primary/80"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-3 md:px-6">
            <div className="space-y-2 md:space-y-3">
              {homeworkQueue.length > 0 ? (
                homeworkQueue.map((homework) => (
                  <div 
                    key={homework.id}
                    className="p-3 rounded-lg border border-gray-100 hover:border-primary/20 hover:bg-gray-50/50 transition-all cursor-pointer"
                    onClick={() => navigate('/parent/homework')}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-800 truncate">{homework.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{homework.subject}</p>
                      </div>
                      <Circle className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>Due {new Date(homework.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No pending homework</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ParentDashboardHome = () => {
  return (
    <ParentDashboardLayout>
      <ParentDashboardHomeContent />
    </ParentDashboardLayout>
  );
};

export default ParentDashboardHome;