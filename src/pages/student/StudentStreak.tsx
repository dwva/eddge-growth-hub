import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, ArrowLeft, Target, Zap, Calendar } from 'lucide-react';
import { type ContributionMap } from '@/components/ContributionHeatmap';
import { StreakTimeline } from '@/components/shared/StreakTimeline';

/** Mock contributions for streak calculation (same logic as home). */
function getMockContributions(): ContributionMap {
  const map: ContributionMap = {};
  const year = new Date().getFullYear();
  const today = new Date();
  for (let d = new Date(year, 0, 1); d <= today; d.setDate(d.getDate() + 1)) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const daysAgo = Math.floor((today.getTime() - d.getTime()) / 86400000);
    if (daysAgo > 60) continue;
    if (isWeekend) map[key] = Math.random() > 0.6 ? 1 : 0;
    else map[key] = Math.floor(Math.random() * 5) + 1;
  }
  return map;
}

function getCurrentStreak(contributions: ContributionMap): number {
  const today = new Date();
  let streak = 0;
  for (let offset = 0; ; offset++) {
    const d = new Date(today);
    d.setDate(today.getDate() - offset);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if ((contributions[key] ?? 0) > 0) streak += 1;
    else break;
  }
  return streak;
}

const StudentStreak = () => {
  const navigate = useNavigate();
  const contributions = useMemo(() => getMockContributions(), []);
  const currentStreak = useMemo(() => getCurrentStreak(contributions), [contributions]);
  const bestStreak = Math.max(currentStreak, 14); // mock "best" for display

  return (
    <StudentDashboardLayout title="Streak">
      <main className="container px-4 py-6 space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-2 -ml-2"
          onClick={() => navigate('/student')}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Button>

        {/* Hero streak card */}
        <Card className="rounded-2xl border-0 shadow-lg bg-gradient-to-br from-purple-100 via-violet-100 to-purple-200 dark:from-purple-950/50 dark:via-violet-950/40 dark:to-purple-900/60 border border-purple-200/60 dark:border-purple-800/40 overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="rounded-2xl bg-purple-500/20 p-4 flex-shrink-0">
                <Flame className="w-14 h-14 text-purple-600 dark:text-purple-400" aria-hidden />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {currentStreak}-day streak
                </h1>
                <p className="text-purple-600 dark:text-purple-300 mt-1">
                  {currentStreak === 0
                    ? 'Complete one activity today to start your streak.'
                    : 'You’re on fire! Keep learning every day to grow your streak.'}
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4">
                  <div className="rounded-xl bg-white/60 dark:bg-white/10 px-4 py-2">
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Current</p>
                    <p className="text-xl font-bold text-purple-900 dark:text-white tabular-nums">{currentStreak} days</p>
                  </div>
                  <div className="rounded-xl bg-white/60 dark:bg-white/10 px-4 py-2">
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Best streak</p>
                    <p className="text-xl font-bold text-purple-900 dark:text-white tabular-nums">{bestStreak} days</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="rounded-2xl border border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Keep your streak alive
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Do at least one learning activity every day — practice, revision, or a lesson. Missing a day resets your streak to zero.
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
              <li>Complete a practice set or a few MCQs</li>
              <li>Revise one topic or flashcard set</li>
              <li>Finish a lesson or watch a short video</li>
            </ul>
            <Button
              className="mt-2"
              onClick={() => navigate('/student/planner')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Open today’s plan
            </Button>
          </CardContent>
        </Card>

        {/* Streak timeline – don’t break the chain */}
        <Card className="rounded-2xl border border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Your streak timeline
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Each day with activity keeps your streak alive. Complete today to avoid breaking the chain.
            </p>
          </CardHeader>
          <CardContent>
            <StreakTimeline contributions={contributions} daysToShow={7} showDaysToggle />
          </CardContent>
        </Card>
      </main>
    </StudentDashboardLayout>
  );
};

export default StudentStreak;
