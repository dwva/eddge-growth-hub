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

// XP and level spine (mocked)
const CURRENT_LEVEL = 4;
const CURRENT_LEVEL_LABEL = 'Focused learner';
const CURRENT_XP = 1280;
const NEXT_LEVEL_XP = 1600;
const XP_PROGRESS_PCT = Math.round((CURRENT_XP / NEXT_LEVEL_XP) * 100);

type XpCheckpoint = {
  id: string;
  label: string;
  reason: string;
  xp: number;
  unlocked: boolean;
};

const XP_CHECKPOINTS: XpCheckpoint[] = [
  {
    id: 'first-steps',
    label: 'First Steps',
    reason: 'Completed your first learning topic.',
    xp: 200,
    unlocked: true,
  },
  {
    id: 'week-warrior',
    label: 'Week Warrior',
    reason: 'Maintained a 7-day consistency streak.',
    xp: 600,
    unlocked: true,
  },
  {
    id: 'concept-clarity',
    label: 'Concept Clarity',
    reason: 'Improved accuracy after revision on a weak topic.',
    xp: 1100,
    unlocked: false,
  },
  {
    id: 'exam-ready',
    label: 'Exam Ready',
    reason: 'Target line for Level 5.',
    xp: NEXT_LEVEL_XP,
    unlocked: false,
  },
];

// Grouping by meaning
const consistencyAchievements = achievements.filter((a) =>
  ['first-steps', 'week-warrior', 'consistency-builder', 'back-on-track'].includes(a.id),
);

const qualityAchievements = achievements.filter((a) =>
  ['concept-clarity', 'doubt-crusher', 'weak-to-strong', 'xp-explorer'].includes(a.id),
);

const examAchievements = achievements.filter((a) =>
  ['chapter-champion', 'planner-pro', 'revision-ready', 'century-club'].includes(a.id),
);

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
          ? 'border-emerald-200/60 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-950/25 shadow-sm'
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
          <p className="mt-3 inline-flex items-center text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
            ✓ Unlocked
          </p>
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

// Recently earned badges
const displayedAchievements = achievements.slice(0, 9);
const unlockedInGrid = displayedAchievements.filter((a) => a.earned).length;
const earnedForBadges = achievements.filter((a) => a.earned).slice(0, 5);

function MomentsYouEarned() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">Recently earned</h3>
        <p className="text-xs text-muted-foreground mt-1">
          A calm view of what you&apos;ve unlocked recently — behaviours that support your exam readiness.
        </p>
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
  const totalEarned = achievements.filter((a) => a.earned).length;

  return (
    <TooltipProvider>
      <StudentDashboardLayout title="Achievements">
        <div className="space-y-8 pb-12 max-w-6xl mx-auto px-4 md:px-0">
          {/* XP spine */}
          <section>
            <Card className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Level {CURRENT_LEVEL} · {CURRENT_LEVEL_LABEL}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Progress to Level {CURRENT_LEVEL + 1}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    XP is quality-weighted — driven by revision, improvement, and fixing mistakes.
                  </p>
                </div>
                <div className="relative w-full h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500"
                    style={{ width: `${XP_PROGRESS_PCT}%` }}
                  />
                  {/* checkpoint markers */}
                  {XP_CHECKPOINTS.map((cp) => {
                    const left = (cp.xp / NEXT_LEVEL_XP) * 100;
                    const isPast = cp.unlocked;
                    return (
                      <Tooltip key={cp.id}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="absolute -top-1.5"
                            style={{ left: `calc(${left}% - 8px)` }}
                          >
                            <span
                              className={cn(
                                'block w-4 h-4 rounded-full border-2 bg-card',
                                isPast
                                  ? 'border-emerald-500'
                                  : 'border-muted-foreground/40',
                              )}
                            />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p className="text-xs font-medium">{cp.label}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {cp.reason}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Learning summary */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Card className="rounded-2xl border border-border bg-card shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Learning level
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  Level {CURRENT_LEVEL} · {CURRENT_LEVEL_LABEL}
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border border-border bg-card shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Consistency state
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  Building a steady streak
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border border-border bg-card shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Total achievements earned
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {totalEarned} badges unlocked so far
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Grouped achievements */}
          <section className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">Consistency & discipline</h2>
              <p className="text-sm text-muted-foreground">
                Badges that recognise how regularly you show up and stay on track.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {consistencyAchievements.map((a) => (
                <AchievementCard key={a.id} a={a} />
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">Learning quality</h2>
              <p className="text-sm text-muted-foreground">
                Evidence that you&apos;re building deep understanding and fixing weak spots.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {qualityAchievements.map((a) => (
                <AchievementCard key={a.id} a={a} />
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">Exam readiness</h2>
              <p className="text-sm text-muted-foreground">
                Badges that align directly with your chapter coverage and exam-style practice.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {examAchievements.map((a) => (
                <AchievementCard key={a.id} a={a} />
              ))}
            </div>
          </section>

          {/* Recently earned */}
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
