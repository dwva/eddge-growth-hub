import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Medal, Award, Zap, Target } from 'lucide-react';

const achievements = [
  { id: 1, name: 'First Steps', description: 'Complete your first lesson', icon: '🎯', earned: true, date: '2026-01-15' },
  { id: 2, name: 'Week Warrior', description: 'Study 7 days in a row', icon: '🔥', earned: true, date: '2026-01-22' },
  { id: 3, name: 'Quiz Master', description: 'Score 100% on any quiz', icon: '⭐', earned: true, date: '2026-01-25' },
  { id: 4, name: 'Speed Learner', description: 'Complete 5 lessons in one day', icon: '⚡', earned: false, progress: 60 },
  { id: 5, name: 'Perfect Month', description: '30 day learning streak', icon: '👑', earned: false, progress: 23 },
  { id: 6, name: 'Subject Champion', description: 'Master all chapters in a subject', icon: '🏆', earned: false, progress: 45 },
];

const StudentAchievements = () => {
  const earnedCount = achievements.filter(a => a.earned).length;

  return (
    <StudentDashboardLayout title="Achievements">
      <div className="space-y-6">
        {/* Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{earnedCount}</p>
              <p className="text-sm text-muted-foreground">Earned</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-amber-500" />
              <p className="text-2xl font-bold">{achievements.length - earnedCount}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">2,450</p>
              <p className="text-sm text-muted-foreground">Total XP</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">Level 5</p>
              <p className="text-sm text-muted-foreground">Current Rank</p>
            </CardContent>
          </Card>
        </div>

        {/* Earned Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Medal className="w-5 h-5 text-primary" />
              Earned Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.filter(a => a.earned).map((achievement) => (
                <div 
                  key={achievement.id}
                  className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{achievement.name}</h3>
                      <Badge className="bg-primary/10 text-primary">Earned</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(achievement.date!).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.filter(a => !a.earned).map((achievement) => (
                <div 
                  key={achievement.id}
                  className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border"
                >
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-2xl opacity-60">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentAchievements;