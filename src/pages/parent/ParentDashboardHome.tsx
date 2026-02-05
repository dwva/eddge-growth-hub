import ParentDashboardLayout from '@/components/layout/ParentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useChild } from '@/contexts/ChildContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
  const [animatedValues, setAnimatedValues] = useState<Record<number, number>>({});

  // Animate progress bars on mount
  useEffect(() => {
    if (selectedChild?.subjects) {
      const timer = setTimeout(() => {
        const values: Record<number, number> = {};
        selectedChild.subjects?.forEach((_, index) => {
          values[index] = 0;
        });
        setAnimatedValues(values);

        // Animate each progress bar
        selectedChild.subjects?.forEach((subject, index) => {
          setTimeout(() => {
            setAnimatedValues((prev) => ({
              ...prev,
              [index]: subject.score,
            }));
          }, index * 150); // Stagger animation
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedChild]);

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
    <div className="w-full space-y-4">
      {/* Hero Section - Full Width Gradient Card */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-xl p-3 md:p-4 overflow-hidden z-0">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 z-0" />
        <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 z-0" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
          {/* Left: Parent Overview + Hero Announcements */}
          <div className="lg:col-span-2">
            <p className="text-purple-200 text-[11px] font-medium tracking-wider uppercase mb-1.5">Parent Portal</p>
            <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
              Track {selectedChild.name}'s Progress
            </h1>
            <div className="flex items-center gap-2 text-purple-200 text-xs md:text-sm mb-3">
              <span>{selectedChild?.class || 'Grade 10-A'}</span>
              <span>•</span>
              <span>{subjectsCompleted} Subjects</span>
            </div>

            {heroAnnouncements.length > 0 && (
              <div className="space-y-1.5 max-w-lg">
                {heroAnnouncements.map((ann) => (
                  <button
                    key={ann.id}
                    type="button"
                    onClick={() => navigate('/parent/announcements')}
                    className="w-full inline-flex items-center gap-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 px-3 py-1.5 transition-colors"
                  >
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/90 text-[11px] font-semibold text-purple-600">
                      !
                    </span>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-[11px] font-semibold text-white truncate">
                        {ann.title}
                      </p>
                      <p className="text-[10px] text-purple-100/90 truncate">
                        {new Date(ann.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        · {ann.description}
                      </p>
                    </div>
                  </button>
                ))}
                <p className="text-[10px] text-purple-100/80 pt-0.5">
                  Tap an announcement to see full details and earlier updates.
                </p>
              </div>
            )}
          </div>

          {/* Right: Compact Stat Cards */}
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20">
              <p className="text-purple-200 text-[10px] mb-0.5">Attendance</p>
              <p className="text-lg font-bold text-white">{attendanceRate}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20">
              <p className="text-purple-200 text-[10px] mb-0.5">Subjects</p>
              <p className="text-lg font-bold text-white">{subjectsCompleted}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20">
              <p className="text-purple-200 text-[10px] mb-0.5">Performance</p>
              <p className="text-lg font-bold text-white">{overallPerformance}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Compact Small Style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          onClick={() => navigate(`/parent/child-progress/${selectedChild.id}`)}
          className="group p-3 rounded-lg bg-blue-50/50 hover:bg-blue-100/50 border border-blue-200/30 hover:border-blue-300/50 transition-all duration-200"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center flex-shrink-0 transition-colors">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h3 className="font-semibold text-xs text-gray-800 leading-tight">Attendance</h3>
              <p className="text-[10px] text-gray-500 mt-0.5 truncate">View records</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate(`/parent/child-progress/${selectedChild.id}`)}
          className="group p-3 rounded-lg bg-purple-50/50 hover:bg-purple-100/50 border border-purple-200/30 hover:border-purple-300/50 transition-all duration-200"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center flex-shrink-0 transition-colors">
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h3 className="font-semibold text-xs text-gray-800 leading-tight">Tests</h3>
              <p className="text-[10px] text-gray-500 mt-0.5 truncate">Recent tests</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate('/parent/homework')}
          className="group p-3 rounded-lg bg-pink-50/50 hover:bg-pink-100/50 border border-pink-200/30 hover:border-pink-300/50 transition-all duration-200"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-100 group-hover:bg-pink-200 flex items-center justify-center flex-shrink-0 transition-colors">
              <FileText className="w-4 h-4 text-pink-600" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h3 className="font-semibold text-xs text-gray-800 leading-tight">Homework</h3>
              <p className="text-[10px] text-gray-500 mt-0.5 truncate">View assignments</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate('/parent/communications')}
          className="group p-3 rounded-lg bg-teal-50/50 hover:bg-teal-100/50 border border-teal-200/30 hover:border-teal-300/50 transition-all duration-200"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 group-hover:bg-teal-200 flex items-center justify-center flex-shrink-0 transition-colors">
              <MessageSquare className="w-4 h-4 text-teal-600" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h3 className="font-semibold text-xs text-gray-800 leading-tight">Messages</h3>
              <p className="text-[10px] text-gray-500 mt-0.5 truncate">Communicate</p>
            </div>
          </div>
        </button>
      </div>

      {/* Main Content Section - 12 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
        {/* Left: Academic Performance (col-span-8) */}
        <Card className="lg:col-span-8 border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base font-semibold text-gray-800">Academic Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 md:space-y-2">
            {/* Subject Progress Bars - Dynamic Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-1.5 md:gap-2">
              {selectedChild.subjects?.map((subject, index) => {
                const Icon = subjectIcons[subject.name] || BookOpen;
                const colors = subjectColors[subject.name] || { bg: 'bg-gray-50', icon: 'text-gray-600' };
                
                return (
                  <div 
                    key={index} 
                    className="group p-2 md:p-2.5 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200 cursor-pointer"
                    onClick={() => navigate(`/parent/child-progress/${selectedChild.id}`)}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg ${colors.bg} group-hover:scale-110 flex items-center justify-center flex-shrink-0 transition-transform duration-200`}>
                            <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${colors.icon}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-gray-800 truncate group-hover:text-gray-900 transition-colors">{subject.name}</p>
                            <p className="text-[10px] text-gray-500 truncate">{subject.score}% completed</p>
                          </div>
                        </div>
                        <span className="text-xs md:text-sm font-bold text-gray-800 flex-shrink-0 group-hover:text-primary transition-colors">{subject.score}%</span>
                      </div>
                      <div className="relative overflow-hidden rounded-full">
                        <Progress 
                          value={animatedValues[index] ?? 0} 
                          className="h-1 md:h-1.5 transition-all duration-[3000ms] ease-out group-hover:h-1.5 md:group-hover:h-2"
                          style={{
                            transition: 'width 3s ease-out',
                          }}
                        />
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
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-800">Homework Queue</CardTitle>
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
          <CardContent>
            <div className="space-y-3">
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