import ParentDashboardLayout from '@/components/layout/ParentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useChild } from '@/contexts/ChildContext';
import { milestones, badges } from '@/data/parentMockData';
import {
  Sparkles,
  Trophy,
  Calendar,
  BookOpen,
  Star,
  Medal,
  Zap,
  TrendingUp,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  trophy: <Trophy className="w-6 h-6" />,
  calendar: <Calendar className="w-6 h-6" />,
  'book-open': <BookOpen className="w-6 h-6" />,
  star: <Star className="w-6 h-6" />,
  medal: <Medal className="w-6 h-6" />,
  sparkles: <Sparkles className="w-6 h-6" />,
  zap: <Zap className="w-6 h-6" />,
};

const ParentAchievementsContent = () => {
  const { selectedChild } = useChild();

  const recentAchievements = selectedChild?.achievements || [];

  return (
    <div className="space-y-3 md:space-y-6">
      {/* Header */}
      <div className="px-1">
        <h1 className="text-xl lg:text-2xl font-bold">{selectedChild?.name}'s Achievements</h1>
        <p className="text-sm lg:text-base text-muted-foreground">Celebrating progress and success</p>
      </div>

      {/* Recent Achievements & Badges - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 lg:gap-6">
        {/* Recent Achievements - 70% width */}
        <div className="lg:col-span-7">
          <Card className="border-0 shadow-sm lg:h-full">
            <CardHeader className="pb-2 px-4 lg:px-6">
              <CardTitle className="text-sm lg:text-base font-semibold text-gray-900">Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent className="pb-3 pt-0 px-4 lg:px-6">
              {recentAchievements.length > 0 ? (
                <div className="relative max-h-[280px] overflow-y-auto pr-2">
                  <div className="absolute left-2.5 lg:left-3 top-0 bottom-0 w-0.5 bg-gray-200" />
                  <div className="space-y-4 lg:space-y-6">
                    {recentAchievements.slice(0, 3).map((achievement, index) => (
                      <div key={achievement.id} className="relative pl-6 lg:pl-7">
                        <div className="absolute left-[10px] lg:left-[13px] top-1/2 w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-full bg-primary flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                        <div className="p-2.5 lg:p-2 rounded-lg bg-muted/50 border border-gray-200 shadow-sm">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                            <h4 className="font-semibold text-xs text-gray-900">{achievement.title}</h4>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">{achievement.date}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1 lg:mt-0.5 line-clamp-2 lg:line-clamp-1">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Trophy className="w-10 h-10 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground text-xs">No recent achievements yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Badges & Recognitions - 30% width */}
        <div className="lg:col-span-3">
          <Card className="border-0 shadow-sm lg:h-full">
            <CardHeader className="pb-2 px-4 lg:px-6">
              <CardTitle className="text-sm lg:text-base font-semibold text-gray-900">Badges & Recognitions</CardTitle>
            </CardHeader>
            <CardContent className="pb-3 pt-0 px-4 lg:px-6">
              <div className="space-y-2 max-h-[280px] overflow-y-auto">
                {badges.map((badge) => (
                  <Card key={badge.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-2.5 lg:p-2">
                      <div className="flex items-center gap-2.5 lg:gap-2">
                        <div
                          className="w-10 h-10 lg:w-9 lg:h-9 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${badge.color}15` }}
                        >
                          <div style={{ color: badge.color }}>
                            {iconMap[badge.icon] || <Star className="w-4 h-4 lg:w-3.5 lg:h-3.5" />}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-xs text-gray-900 truncate">{badge.title}</h4>
                          <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{badge.description}</p>
                          <Badge className="mt-1 bg-green-50 text-green-700 border-0 text-[9px] px-1.5 py-0">Earned</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Improvement Highlights */}
      <div>
        <h2 className="text-base lg:text-lg font-semibold mb-3 px-1">Improvement Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-800">Great Improvement!</h4>
                  <p className="text-sm text-green-700">Improved by 15% in Mathematics</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800">Consistent Growth!</h4>
                  <p className="text-sm text-blue-700">5 consecutive weeks of progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Milestones Section */}
      <div>
        <h2 className="text-base lg:text-lg font-semibold mb-3 px-1">Milestones</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {milestones.map((milestone) => (
            <Card key={milestone.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {iconMap[milestone.icon] || <Trophy className="w-6 h-6 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{milestone.title}</h4>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">{milestone.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
};

const ParentAchievements = () => {
  return (
    <ParentDashboardLayout>
      <ParentAchievementsContent />
    </ParentDashboardLayout>
  );
};

export default ParentAchievements;