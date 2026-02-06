import { useState } from 'react';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Rocket,
  Flame,
  Zap,
  BookOpen,
  Target,
  Trophy,
  CheckSquare,
  Crown,
  Heart,
  RotateCcw,
  Lightbulb,
  TrendingUp,
  Coins,
  Flag,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// STATS BAR — same layout, new meaning
// ─────────────────────────────────────────────────────────────────────────────
const learningMaturityLevel = 1;
const effortPoints = 0;
const milestonesReached = 3;
const consistencyStreak = 0;
const lastActiveDaysAgo = 2; // when streak is 0, show "Last active X days ago — welcome back"

function StatsBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="rounded-2xl border border-gray-200/90 dark:border-border bg-white dark:bg-card shadow-sm hover:shadow-md transition-shadow cursor-help overflow-hidden">
            <CardContent className="p-4 sm:p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold tabular-nums text-foreground">{learningMaturityLevel}</p>
                <p className="text-sm text-muted-foreground">Learning Maturity</p>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[240px]">
          Grows with revision, concept mastery, and consistency. Not speed-based.
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="rounded-2xl border border-gray-200/90 dark:border-border bg-white dark:bg-card shadow-sm hover:shadow-md transition-shadow cursor-help overflow-hidden">
            <CardContent className="p-4 sm:p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400">
                <Coins className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold tabular-nums text-foreground">{effortPoints}</p>
                <p className="text-sm text-muted-foreground">Effort Points</p>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[260px]">
          Earned through learning, revision, and fixing mistakes. No farming. No grind.
        </TooltipContent>
      </Tooltip>
      <Card className="rounded-2xl border border-gray-200/90 dark:border-border bg-white dark:bg-card shadow-sm overflow-hidden">
        <CardContent className="p-4 sm:p-5 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
            <Flag className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-bold tabular-nums text-foreground">{milestonesReached}</p>
            <p className="text-sm text-muted-foreground">Milestones Reached</p>
          </div>
        </CardContent>
      </Card>
      <Card className={cn(
        'rounded-2xl border overflow-hidden transition-shadow',
        consistencyStreak > 0
          ? 'border-gray-200/90 dark:border-border bg-white dark:bg-card shadow-sm'
          : 'border-sky-200/60 dark:border-sky-800/40 bg-sky-50/50 dark:bg-sky-950/20 shadow-sm'
      )}>
        <CardContent className="p-4 sm:p-5 flex items-start gap-3">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
            consistencyStreak > 0 ? 'bg-primary/10 text-primary' : 'bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400'
          )}>
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            {consistencyStreak > 0 ? (
              <>
                <p className="text-2xl font-bold tabular-nums text-foreground">{consistencyStreak}</p>
                <p className="text-sm text-muted-foreground">Consistency Streak</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-foreground">Welcome back</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Last active {lastActiveDaysAgo} day{lastActiveDaysAgo !== 1 ? 's' : ''} ago. No pressure — glad you’re here.
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACHIEVEMENT TYPES — 4 categories (no loud labels), new copy
// ─────────────────────────────────────────────────────────────────────────────
type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  progress?: number; // 0–100 for soft label
  tooltip?: string;
};

const achievements: Achievement[] = [
  // Learning Journey
  { id: 'first-steps', title: 'First Steps', description: 'Completed your first learning topic.', icon: <Rocket className="w-6 h-6" />, earned: true },
  { id: 'chapter-champion', title: 'Chapter Champion', description: 'Built a complete understanding of a chapter.', icon: <BookOpen className="w-6 h-6" />, earned: false, progress: 60 },
  // Consistency & Care
  { id: 'week-warrior', title: 'Week Warrior', description: 'You showed up 7 days in a row.', icon: <Flame className="w-6 h-6" />, earned: true },
  { id: 'consistency-builder', title: 'Consistency Builder', description: 'Reach a 14-day consistency streak.', icon: <Flame className="w-6 h-6" />, earned: false, progress: 35, tooltip: 'Consistency matters more than perfection.' },
  // Mastery & Clarity
  { id: 'xp-explorer', title: 'Effort Explorer', description: 'Earned effort points through learning and revision.', icon: <Zap className="w-6 h-6" />, earned: true },
  { id: 'concept-clarity', title: 'Concept Clarity', description: 'Solved a topic cleanly with understanding.', icon: <Lightbulb className="w-6 h-6" />, earned: false, progress: 80, tooltip: 'Deep understanding over speed.' },
  { id: 'doubt-crusher', title: 'Doubt Crusher', description: "You didn't ignore confusion — you cleared it.", icon: <Target className="w-6 h-6" />, earned: false, progress: 20 },
  { id: 'planner-pro', title: 'Planner Pro', description: 'Completed 20 planner tasks.', icon: <CheckSquare className="w-6 h-6" />, earned: false, progress: 45 },
  // Comeback & Recovery
  { id: 'century-club', title: 'Century Club', description: 'Earn 1000 effort points over time.', icon: <Crown className="w-6 h-6" />, earned: false, progress: 0 },
  { id: 'back-on-track', title: 'Back on Track', description: 'Returned to learning after a break.', icon: <Heart className="w-6 h-6" />, earned: false, tooltip: 'Coming back is what counts.' },
  { id: 'weak-to-strong', title: 'Weak → Strong', description: 'Revised and fixed a weak topic.', icon: <RotateCcw className="w-6 h-6" />, earned: false },
  { id: 'revision-ready', title: 'Revision Ready', description: 'Completed a full revision cycle.', icon: <Trophy className="w-6 h-6" />, earned: false },
];

function progressLabel(progress: number): string {
  if (progress >= 80) return 'Almost ready';
  if (progress >= 60) return 'More than halfway there';
  if (progress >= 40) return 'Getting there';
  if (progress > 0) return 'In progress';
  return 'In progress';
}

function AchievementCard({ a }: { a: Achievement }) {
  const earned = a.earned;
  const card = (
    <Card
      className={cn(
        'rounded-2xl border transition-all duration-200',
        earned
          ? 'border-emerald-200/60 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-950/25 shadow-sm hover:shadow-md'
          : 'border-gray-200 dark:border-border bg-card shadow-sm hover:shadow-md hover:border-gray-300/80 dark:hover:border-border'
      )}
    >
      <CardContent className="p-5">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-3 shrink-0', earned ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' : 'bg-muted text-muted-foreground')}>
          {a.icon}
        </div>
        <h3 className="font-semibold text-foreground text-sm">{a.title}</h3>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{a.description}</p>
        {earned ? (
          <Button size="sm" variant="secondary" className="mt-4 h-8 text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 hover:bg-emerald-200/50 dark:hover:bg-emerald-800/50 border-0 rounded-lg" disabled>
            Unlocked!
          </Button>
        ) : (
          <>
            <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">You'll unlock this as you continue learning. No rush.</p>
            {a.progress != null && a.progress > 0 && (
              <div className="mt-3">
                <p className="text-[11px] text-muted-foreground">{progressLabel(a.progress)}</p>
                <div className="w-full h-2 rounded-full bg-muted mt-1.5 overflow-hidden">
                  <div className="h-full rounded-full bg-primary/60 dark:bg-primary/50 transition-all duration-500" style={{ width: `${a.progress}%` }} />
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
  if (a.tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild className="block h-full text-left">
          {card}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[220px]">
          {a.tooltip}
        </TooltipContent>
      </Tooltip>
    );
  }
  return card;
}

// Show first 9 in grid (3x3); can extend to 12 with same layout
const displayedAchievements = achievements.slice(0, 9);
const unlockedInGrid = displayedAchievements.filter((a) => a.earned).length;
const earnedForBadges = achievements.filter((a) => a.earned).slice(0, 6); // Moments You Earned

function MomentsYouEarned() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">Moments You Earned</h3>
        <p className="text-xs text-muted-foreground mt-1">Each moment reflects a behavior that helped your learning — not what you &quot;won&quot;.</p>
      </div>
      {earnedForBadges.length > 0 ? (
        <div className="flex flex-wrap gap-5 pt-1">
          {earnedForBadges.map((a) => (
            <Tooltip key={a.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="w-14 h-14 rounded-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-200/60 dark:border-emerald-800/40 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
                >
                  <span className="[&>svg]:w-6 [&>svg]:h-6">{a.icon}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[220px]">
                <p className="font-medium">{a.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{a.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground py-4 text-center rounded-xl bg-muted/30 dark:bg-muted/20">
          Your earned moments will appear here as you unlock milestones.
        </p>
      )}
    </div>
  );
}

const StudentAchievements = () => {
  const [sortBy, setSortBy] = useState<'default' | 'progress' | 'earned-first'>('default');
  const [showFilter, setShowFilter] = useState<'all' | 'earned' | 'in-progress'>('all');

  const filtered = [...displayedAchievements].filter((a) => {
    if (showFilter === 'earned') return a.earned;
    if (showFilter === 'in-progress') return !a.earned;
    return true;
  });

  const sorted = [...filtered].sort((x, y) => {
    if (sortBy === 'earned-first') return (x.earned ? 0 : 1) - (y.earned ? 0 : 1);
    if (sortBy === 'progress') return (y.progress ?? 0) - (x.progress ?? 0);
    return 0;
  });

  return (
    <TooltipProvider>
      <StudentDashboardLayout title="Achievements">
        <div className="space-y-8 pb-12">
          <div>
            <p className="text-sm text-muted-foreground max-w-xl">Track your progress and celebrate your wins.</p>
          </div>
          <StatsBar />

          {/* Your Learning Journey */}
          <section className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold text-foreground tracking-tight">Your Learning Journey</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Sort</span>
                  <div className="flex rounded-full bg-muted/60 p-0.5 gap-0.5">
                    {(['default', 'progress', 'earned-first'] as const).map((s) => (
                      <Button
                        key={s}
                        variant={sortBy === s ? 'secondary' : 'ghost'}
                        size="sm"
                        className={cn('h-7 text-xs rounded-full', sortBy === s && 'shadow-sm')}
                        onClick={() => setSortBy(s)}
                      >
                        {s === 'default' ? 'Default' : s === 'progress' ? 'Progress' : 'Earned first'}
                      </Button>
                    ))}
                  </div>
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Show</span>
                  <div className="flex rounded-full bg-muted/60 p-0.5 gap-0.5">
                    {(['all', 'earned', 'in-progress'] as const).map((f) => (
                      <Button
                        key={f}
                        variant={showFilter === f ? 'secondary' : 'ghost'}
                        size="sm"
                        className={cn('h-7 text-xs rounded-full', showFilter === f && 'shadow-sm')}
                        onClick={() => setShowFilter(f)}
                      >
                        {f === 'all' ? 'All' : f === 'earned' ? 'Earned' : 'In progress'}
                      </Button>
                    ))}
                  </div>
                </span>
                <span className="text-muted-foreground text-xs tabular-nums">{unlockedInGrid} of {displayedAchievements.length} unlocked</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sorted.map((a) => (
                <AchievementCard key={a.id} a={a} />
              ))}
            </div>
          </section>

          <Card className="rounded-2xl border border-gray-200/90 dark:border-border bg-gray-50/50 dark:bg-muted/20 shadow-sm overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <MomentsYouEarned />
            </CardContent>
          </Card>
        </div>
      </StudentDashboardLayout>
    </TooltipProvider>
  );
};

export default StudentAchievements;
