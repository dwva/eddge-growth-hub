import ParentDashboardLayout from '@/components/layout/ParentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useChild } from '@/contexts/ChildContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Calendar, 
  FileText, 
  Award,
  MessageSquare,
  BookOpen,
  Bell,
  ChevronRight,
  Loader2
} from 'lucide-react';

const ParentDashboardHome = () => {
  const { selectedChild, isLoading } = useChild();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'text-green-600';
    if (progress >= 75) return 'text-blue-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getProgressBadge = (progress: number) => {
    if (progress >= 90) return { label: 'Excellent', variant: 'default' as const, className: 'bg-green-100 text-green-700' };
    if (progress >= 75) return { label: 'Good', variant: 'default' as const, className: 'bg-blue-100 text-blue-700' };
    if (progress >= 60) return { label: 'Needs Attention', variant: 'default' as const, className: 'bg-yellow-100 text-yellow-700' };
    return { label: 'Needs Attention', variant: 'default' as const, className: 'bg-orange-100 text-orange-700' };
  };

  const quickActions = [
    { label: t('actions.viewProgress'), icon: TrendingUp, path: `/parent/child-progress/${selectedChild?.id || '1'}`, color: 'bg-blue-100 text-blue-600' },
    { label: t('actions.viewAchievements'), icon: Award, path: '/parent/achievements', color: 'bg-yellow-100 text-yellow-600' },
    { label: t('actions.scheduleMeeting'), icon: Calendar, path: '/parent/meetings', color: 'bg-green-100 text-green-600' },
    { label: t('actions.viewMessages'), icon: MessageSquare, path: '/parent/communications', color: 'bg-purple-100 text-purple-600' },
    { label: t('actions.viewHomework'), icon: BookOpen, path: '/parent/homework', color: 'bg-orange-100 text-orange-600' },
    { label: t('actions.viewAnnouncements'), icon: Bell, path: '/parent/announcements', color: 'bg-red-100 text-red-600' },
  ];

  if (isLoading) {
    return (
      <ParentDashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">{t('common.loading')}</p>
          </div>
        </div>
      </ParentDashboardLayout>
    );
  }

  if (!selectedChild) {
    return (
      <ParentDashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Award className="w-12 h-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Child Linked</h3>
            <p className="text-muted-foreground">Please link a child to view the dashboard.</p>
          </div>
        </div>
      </ParentDashboardLayout>
    );
  }

  const progressBadge = getProgressBadge(selectedChild.progress || 0);

  return (
    <ParentDashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-5">
          <h1 className="text-2xl font-bold">
            {t('dashboard.welcome')} {selectedChild.name}'s Dashboard 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's how {selectedChild.name} is doing this week.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('stats.overallProgress')}</p>
                  <p className={`text-xl font-bold ${getProgressColor(selectedChild.progress || 0)}`}>
                    {selectedChild.progress}%
                  </p>
                </div>
              </div>
              <Progress value={selectedChild.progress} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('stats.attendance')}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-green-600">{selectedChild.attendance}%</p>
                    {(selectedChild.attendance || 0) >= 90 && (
                      <Badge className="bg-green-100 text-green-700 text-[10px]">{t('stats.excellent')}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('stats.assignments')}</p>
                  <p className="text-xl font-bold">4/6</p>
                  <p className="text-[10px] text-muted-foreground">67% completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('stats.achievements')}</p>
                  <p className="text-xl font-bold">{selectedChild.achievements?.length || 0}</p>
                  <button
                    onClick={() => navigate('/parent/achievements')}
                    className="text-[10px] text-primary hover:underline"
                  >
                    {t('common.viewAll')}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-3">{t('dashboard.quickActions')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action) => (
              <Card
                key={action.path}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(action.path)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center ${action.color}`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium mt-2">{action.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Child Summary Card */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
                {selectedChild.avatar}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{selectedChild.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedChild.class}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={progressBadge.className}>{progressBadge.label}</Badge>
                  {selectedChild.streak && selectedChild.streak > 0 && (
                    <Badge variant="outline" className="text-[10px]">🔥 {selectedChild.streak} day streak</Badge>
                  )}
                </div>
              </div>
              <button
                onClick={() => navigate(`/parent/child-progress/${selectedChild.id}`)}
                className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                {t('actions.viewProgress')}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 p-3 bg-white/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Teacher's Comment:</span> {selectedChild.name} has shown excellent improvement in Mathematics this month. Keep up the good work!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ParentDashboardLayout>
  );
};

export default ParentDashboardHome;
