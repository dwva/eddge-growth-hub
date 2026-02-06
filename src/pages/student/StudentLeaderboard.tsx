import { useState } from 'react';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ArrowLeft,
  Trophy,
  Crown,
  Medal,
  Award,
  TrendingUp,
  Flame,
  Star,
  Loader2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

type Scope = 'class' | 'section' | 'school';
type Timeframe = 'all-time' | 'week' | 'today';

type LeaderboardEntry = {
  id: string;
  name: string;
  epi: number;
  level: number;
  xp: number;
  streak: number;
  momentum: 'improving' | 'streak' | 'consistent';
  isYou?: boolean;
};

const mockEntries: LeaderboardEntry[] = [
  { id: 'you', name: 'You', epi: 92, level: 5, xp: 1280, streak: 7, momentum: 'streak', isYou: true },
  { id: 'a', name: 'Student A', epi: 89, level: 5, xp: 1210, streak: 5, momentum: 'improving' },
  { id: 'b', name: 'Student B', epi: 86, level: 4, xp: 1100, streak: 4, momentum: 'consistent' },
  { id: 'c', name: 'Student C', epi: 84, level: 4, xp: 1080, streak: 3, momentum: 'improving' },
  { id: 'd', name: 'Student D', epi: 81, level: 4, xp: 1040, streak: 2, momentum: 'consistent' },
];

function scopeMessage(scope: Scope): string {
  switch (scope) {
    case 'class':
      return 'competing with your classmates in Class 10-A';
    case 'section':
      return 'competing within your section';
    case 'school':
      return 'competing with students in your school';
    default:
      return 'competing with your classmates';
  }
}

function momentumChip(entry: LeaderboardEntry) {
  if (entry.momentum === 'improving') {
    return {
      label: 'Improving',
      className: 'bg-green-100 text-green-700',
      icon: TrendingUp,
    };
  }
  if (entry.momentum === 'streak') {
    return {
      label: 'On a streak',
      className: 'bg-orange-100 text-orange-700',
      icon: Flame,
    };
  }
  return {
    label: 'Consistent learner',
    className: 'bg-blue-100 text-blue-700',
    icon: Star,
  };
}

const StudentLeaderboard = () => {
  const [scope, setScope] = useState<Scope>('class');
  const [timeframe, setTimeframe] = useState<Timeframe>('week');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showXpDetails, setShowXpDetails] = useState(false);

  const sorted = [...mockEntries].sort((a, b) => {
    if (a.isYou) return -1;
    if (b.isYou) return 1;
    if (b.epi !== a.epi) return b.epi - a.epi;
    return b.streak - a.streak;
  });

  const you = sorted.find((e) => e.isYou)!;
  const peers = sorted.filter((e) => !e.isYou);
  const visiblePeers = peers; // could slice for mobile in UI logic

  const scopeLabel =
    scope === 'class'
      ? 'Class'
      : scope === 'section'
      ? 'Section'
      : 'School';

  const xpToNextRank = 200;
  const progressPct = 68;

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  return (
    <StudentDashboardLayout title="Leaderboard">
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <main className="container px-4 py-8 space-y-6">

            {/* Loading / error states when no entries */}
            {isLoading && sorted.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <p className="text-sm">Loading leaderboard…</p>
              </div>
            )}

            {hasError && sorted.length === 0 && (
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <CardTitle className="text-base">Could not load leaderboard</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Something went wrong while loading your readiness snapshot. Please try again.
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                    onClick={handleRetry}
                  >
                    <RefreshCw className="w-3 h-3" />
                    Try again
                  </button>
                </CardContent>
              </Card>
            )}

            {/* Small inline loading / error when we already have entries */}
            <div className="space-y-4">
              {isLoading && sorted.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Updating…</span>
                </div>
              )}

              {hasError && sorted.length > 0 && (
                <Card className="border-destructive/30 bg-destructive/10 px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-destructive">
                    <AlertCircle className="w-3 h-3" />
                    <span>Could not refresh leaderboard.</span>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-md border border-destructive/40 px-2 py-0.5 text-[11px] font-medium text-destructive hover:bg-destructive/10"
                    onClick={handleRetry}
                  >
                    <RefreshCw className="w-3 h-3" />
                    Try again
                  </button>
                </Card>
              )}
            </div>

            {/* Your Rank card */}
            <Card className="border border-primary/20 bg-gradient-to-r from-indigo-600 to-purple-600 text-primary-foreground shadow-sm">
              <CardContent className="p-4 md:p-6 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold">
                      YO
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Your Rank in {scopeLabel}
                      </p>
                      <p className="text-2xl font-semibold leading-tight">
                        #{sorted.findIndex((e) => e.isYou) + 1 || '—'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-xs uppercase tracking-wide opacity-80">Level</p>
                    <p className="text-sm font-semibold">Level {you.level}</p>
                    <p className="text-xs mt-1 opacity-80">{you.streak} day streak</p>
                  </div>
                </div>
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] opacity-90">
                    <span>{xpToNextRank} XP to next rank</span>
                    <span>({progressPct}% progress)</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-white/20 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-white/80"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <p className="text-[11px] italic opacity-90 mt-0.5">
                    💡 Completing today&apos;s plan can move you up.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <section className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                  Competition Scope
                </p>
                <div className="flex flex-wrap gap-2">
                  {(['class', 'section', 'school'] as Scope[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setScope(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        scope === s
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background text-muted-foreground border-border hover:bg-muted'
                      }`}
                    >
                      {s === 'class'
                        ? 'Class'
                        : s === 'section'
                        ? 'Section'
                        : s === 'school'
                        ? 'School'
                        : 'Friends'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                  Timeframe
                </p>
                <div className="flex flex-wrap gap-2">
                  {(['all-time', 'week', 'today'] as Timeframe[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTimeframe(t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        timeframe === t
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background text-muted-foreground border-border hover:bg-muted'
                      }`}
                    >
                      {t === 'all-time' ? 'All-Time' : t === 'week' ? 'This Week' : 'Today'}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* How XP is calculated – single widget with toggle */}
            <section className="mt-3 text-[11px] md:text-xs">
              <div className="w-full rounded-2xl border border-indigo-100 bg-indigo-50/60 px-4 py-3">
                <button
                  type="button"
                  onClick={() => setShowXpDetails((v) => !v)}
                  className="w-full flex items-center justify-between text-xs text-indigo-700"
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                      ⚡
                    </span>
                    <span className="font-medium">How XP is calculated</span>
                  </div>
                  <span className="text-[11px] font-medium">
                    {showXpDetails ? 'Hide' : 'Show'}
                  </span>
                </button>
                {showXpDetails && (
                  <div className="mt-3 pt-2 border-t border-indigo-100 text-muted-foreground space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Complete daily plan</span>
                      <span className="font-semibold text-primary">+10 XP</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Maintain streak</span>
                      <span className="font-semibold text-primary">+5 XP</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Test improvement</span>
                      <span className="font-semibold text-primary">+20 XP</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Accuracy increase</span>
                      <span className="font-semibold text-primary">+15 XP</span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Leaderboard list */}
            <section className="space-y-3">
              <p className="text-[11px] font-semibold uppercase text-muted-foreground tracking-wide">
                {sorted.length} students in class
              </p>
              <Card className="border border-border bg-card shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">
                    Exam Readiness Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-3">
                  <div className="space-y-3">
                    {sorted.map((entry, idx) => {
                    const rank = idx + 1;
                    let borderClass = 'border-border bg-background';
                    let badgeBg = 'bg-muted text-muted-foreground';
                    let RankIcon: React.ComponentType<any> = Trophy;

                    if (rank === 1) {
                      borderClass = 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50';
                      badgeBg = 'bg-yellow-100 text-yellow-800';
                      RankIcon = Crown;
                    } else if (rank === 2) {
                      borderClass = 'border-gray-300 bg-gradient-to-r from-gray-50 to-slate-50';
                      badgeBg = 'bg-gray-100 text-gray-700';
                      RankIcon = Medal;
                    } else if (rank === 3) {
                      borderClass = 'border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50';
                      badgeBg = 'bg-amber-100 text-amber-800';
                      RankIcon = Award;
                    }

                    const { label, className, icon: MomentumIcon } = momentumChip(entry);

                    return (
                      <div
                        key={entry.id}
                        className={`flex items-center justify-between gap-3 md:gap-4 rounded-xl border px-3 py-3 md:px-4 md:py-3 cursor-pointer transition hover:shadow-md ${
                          borderClass
                        }`}
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3 md:gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${badgeBg}`}>
                              <RankIcon className="w-4 h-4" />
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[11px] font-semibold text-muted-foreground">
                                {entry.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {entry.isYou ? 'You' : entry.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Level {entry.level}
                                </p>
                              </div>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium w-fit ${className}`}
                          >
                            <MomentumIcon className="w-3 h-3" />
                            <span>{label}</span>
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                          <span className="text-sm font-semibold text-foreground">
                            {entry.xp} XP
                          </span>
                          <span>{entry.streak} day streak</span>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </CardContent>
              </Card>

              {/* Philosophy banner */}
              <Card className="border border-amber-100 bg-amber-50/60 px-4 py-2">
                <p className="text-[11px] text-amber-900">
                  <span className="mr-1.5">❤️</span>
                  <span className="font-semibold">Our philosophy:</span>{' '}
                  Rankings celebrate <span className="font-semibold">growth, consistency, and effort</span> — not just
                  points. Every student has a unique path to success.
                </p>
              </Card>
            </section>
          </main>
        </div>
      </TooltipProvider>
    </StudentDashboardLayout>
  );
};

export default StudentLeaderboard;

