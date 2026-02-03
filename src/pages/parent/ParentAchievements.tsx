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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{selectedChild?.name}'s Achievements</h1>
        <p className="text-muted-foreground">Celebrating progress and success</p>
      </div>

      {/* Positive Reinforcement Banner */}
      <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-200">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-yellow-200">
              <Sparkles className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">
                Great Job, {selectedChild?.name}! 🎉
              </h3>
              <p className="text-yellow-700">
                Keep up the amazing work! Every achievement is a step towards excellence.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Milestones</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Badges & Recognitions */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Badges & Recognitions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <Card key={badge.id} className="text-center hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div
                  className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${badge.color}20` }}
                >
                  <div style={{ color: badge.color }}>
                    {iconMap[badge.icon] || <Star className="w-6 h-6" />}
                  </div>
                </div>
                <h4 className="font-semibold text-sm">{badge.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                <Badge className="mt-2 bg-green-100 text-green-700 text-[10px]">Earned</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Improvement Highlights */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Improvement Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Recent Achievements Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          {recentAchievements.length > 0 ? (
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted" />
              <div className="space-y-4">
                {recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="relative pl-8">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{achievement.title}</h4>
                        <span className="text-xs text-muted-foreground">{achievement.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No recent achievements yet</p>
            </div>
          )}
        </CardContent>
      </Card>
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