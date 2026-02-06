import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, BookOpen, Flame, Award, Zap, AlertCircle } from 'lucide-react';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/* ── types ── */
type Priority = 'high' | 'medium';

type XpSource = {
  id: string;
  title: string;
  emoji: string;
  priority: Priority;
  xp: number;
};

type AchievementBadge = {
  id: string;
  name: string;
  description: string;
  xpRequired: number;
  icon: JSX.Element;
};

/* ── mock data ── */
const mockCurrentXp = 1280;
const mockNextLevelXp = 1600;
const mockNextLevelName = 'Focused Learner';

const xpRemaining = Math.max(mockNextLevelXp - mockCurrentXp, 0);
const progressPct = Math.min(100, Math.round((mockCurrentXp / mockNextLevelXp) * 100));
const sessionsToNext = xpRemaining > 0 ? Math.max(1, Math.ceil(xpRemaining / 120)) : 0;

const xpSources: XpSource[] = [
  { id: 'weak-topics', title: 'Fix weak topics with focused practice', emoji: '🎯', priority: 'high', xp: 120 },
  { id: 'revision-block', title: 'Complete a 30-minute revision block', emoji: '📚', priority: 'medium', xp: 80 },
  { id: 'test-review', title: 'Review and correct recent test mistakes', emoji: '🧠', priority: 'high', xp: 100 },
];

const achievementBadges: AchievementBadge[] = [
  {
    id: 'steady-start',
    name: 'Steady Start',
    description: 'Crossed your first 500 quality-weighted XP.',
    xpRequired: 500,
    icon: <BookOpen className="w-4 h-4 text-purple-600" />,
  },
  {
    id: 'focused-learner',
    name: 'Focused Learner',
    description: 'Reached the focus band for regular learning.',
    xpRequired: 1200,
    icon: <Flame className="w-4 h-4 text-orange-500" />,
  },
  {
    id: 'exam-ready',
    name: 'Exam-Ready',
    description: 'Hit the XP target linked to your exam plan.',
    xpRequired: 1600,
    icon: <Award className="w-4 h-4 text-emerald-500" />,
  },
  {
    id: 'xp-champion',
    name: 'XP Champion',
    description: 'Long-term XP growth with consistent effort.',
    xpRequired: 2200,
    icon: <Zap className="w-4 h-4 text-indigo-500" />,
  },
];

/* ── shared spacing tokens ── */
const SECTION_GAP = 'space-y-10'; // 40 px between sections
const CARD_PAD = 'p-6';           // 24 px card padding

/* ── component ── */
const StudentXpDashboard = () => {
  const navigate = useNavigate();
  const [loading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const highImpactXp = Math.max(...xpSources.map((s) => s.xp));
  const earnedBadges = achievementBadges.filter((b) => mockCurrentXp >= b.xpRequired);
  const lockedBadges = achievementBadges.filter((b) => mockCurrentXp < b.xpRequired);

  const handleRetry = () => {
    setError(null);
  };

  /* loading skeleton */
  if (loading && !error) {
    return (
      <StudentDashboardLayout title="">
        <main className={`container px-4 py-8 ${SECTION_GAP}`}>
          <div className="h-40 rounded-2xl bg-gray-100 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 rounded-xl bg-gray-100 animate-pulse" />
            <div className="h-24 rounded-xl bg-gray-100 animate-pulse" />
            <div className="h-24 rounded-xl bg-gray-100 animate-pulse" />
          </div>
        </main>
      </StudentDashboardLayout>
    );
  }

  /* error state */
  if (error && !loading) {
    return (
      <StudentDashboardLayout title="">
        <main className="container px-4 py-8">
          <Card className="rounded-2xl border border-red-200 bg-red-50">
            <CardContent className="py-8 px-6 text-center space-y-3">
              <div className="flex justify-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-sm font-medium text-red-700">{error}</p>
              <Button variant="outline" size="sm" onClick={handleRetry}>
                Retry
              </Button>
            </CardContent>
          </Card>
        </main>
      </StudentDashboardLayout>
    );
  }

  return (
    <StudentDashboardLayout title="">
      <main className={`container px-4 py-8 ${SECTION_GAP}`}>

        {/* ─── 1. XP Hero Card ─── */}
        <section>
          <Card className="relative overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-white shadow-sm">
            <div className="pointer-events-none absolute -top-10 right-0 h-40 w-40 rounded-full bg-purple-300/40 blur-3xl" />
            <CardContent className={`relative z-10 ${CARD_PAD}`}>
              <div className="flex items-center justify-between gap-6">
                {/* Left: XP value + bar as a single vertical stack */}
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-purple-600 mb-1">Current Progress</p>
                    <p className="text-3xl font-black text-gray-900 leading-tight">{mockCurrentXp} XP</p>
                    <p className="text-sm font-medium text-gray-700 mt-0.5">
                      {xpRemaining > 0
                        ? `${xpRemaining} XP to ${mockNextLevelName}`
                        : `You've reached ${mockNextLevelName}`}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-full rounded-full border border-purple-200 bg-gray-200 h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="flex items-baseline justify-between text-xs font-medium text-gray-600 leading-none">
                      <span>
                        {xpRemaining > 0
                          ? `You're ${sessionsToNext} high-impact sessions away`
                          : 'You\u2019re at max level progress for this tier.'}
                      </span>
                      <span>{progressPct}% towards next level</span>
                    </div>
                  </div>
                </div>
                {/* Right: sessions pill, vertically centred to XP value */}
                <div className="self-center shrink-0 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-right min-w-[120px]">
                  <p className="text-2xl font-black text-purple-600 leading-tight">
                    {xpRemaining > 0 ? sessionsToNext : 0}
                  </p>
                  <p className="text-[11px] font-medium text-gray-600 mt-0.5">High-impact sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ─── 2. Insight Cards ─── */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: 'How You Earn XP',
                value: 'Learning behaviours',
                sub: 'XP is awarded for actions that actually improve understanding and exam readiness.',
              },
              {
                label: 'XP Momentum',
                value: 'Steady growth',
                sub: 'Consistent XP growth matters more than short bursts of intense study.',
              },
              {
                label: 'Readiness Gain',
                value: 'Exam boost',
                sub: 'XP connects to your long-term exam preparation, not short-term points.',
              },
            ].map((card) => (
              <Card key={card.label} className="h-full bg-white rounded-2xl border border-gray-200 shadow-sm">
                <CardContent className={`h-full ${CARD_PAD} flex flex-col`}>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-3">{card.label}</p>
                  <p className="text-2xl font-black text-purple-600 leading-tight">{card.value}</p>
                  <p className="text-xs text-gray-600 mt-1.5">{card.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ─── 3. Earn XP Faster ─── */}
        <section>
          <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <CardContent className={`${CARD_PAD} space-y-4`}>
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-5 h-5 text-purple-600 shrink-0" />
                <h2 className="text-base font-bold text-gray-900">Earn XP Faster</h2>
              </div>
              {xpSources.length > 0 ? (
                <div className="space-y-3">
                  {xpSources.map((source) => {
                    const isHigh = source.priority === 'high';
                    const barWidth = Math.round((source.xp / highImpactXp) * 100);
                    return (
                    <button
                      key={source.id}
                      type="button"
                      className="w-full text-left bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200 cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="grid grid-cols-[minmax(0,1fr)_176px] items-center gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xl leading-none shrink-0">{source.emoji}</span>
                          <p className="font-semibold text-sm text-gray-900 truncate">{source.title}</p>
                        </div>
                        <div className="flex items-center justify-end gap-3">
                          <span
                            className={[
                              'h-7 px-3 rounded-full text-xs font-bold border whitespace-nowrap flex items-center',
                              isHigh
                                ? 'bg-purple-100 text-purple-700 border-purple-300'
                                : 'bg-purple-50 text-blue-700 border-blue-300',
                            ].join(' ')}
                          >
                            {isHigh ? 'Highest Impact' : 'Medium'}
                          </span>
                          <div className="text-right w-14">
                            <p className="text-lg font-black text-purple-700 leading-tight">
                              +{source.xp}
                            </p>
                            <p className="text-[11px] text-gray-600">XP</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-600"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  Complete planner tasks, learning sessions, and tests to see XP breakdown here.
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* ─── 4. Achievement Badges Earned ─── */}
        <section>
          <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <CardContent className={`${CARD_PAD} space-y-4`}>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-5 h-5 text-purple-600 shrink-0" />
                <h2 className="text-base font-bold text-gray-900">Achievement badges earned</h2>
              </div>
              {earnedBadges.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {earnedBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`flex flex-col rounded-2xl px-4 py-4 shadow-[0_0_0_1px_rgba(148,163,184,0.12)] ${
                        badge.id === 'steady-start' || badge.id === 'focused-learner'
                          ? 'border border-purple-300 bg-purple-50/90'
                          : 'border border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-gray-700">
                          {badge.icon}
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{badge.name}</p>
                        <p className="text-xs text-gray-600">{badge.description}</p>
                      </div>
                      <div className="mt-1 text-[11px] text-gray-500 space-y-0.5">
                        <p>Unlocked at {badge.xpRequired} XP</p>
                        <p className="text-emerald-700 font-medium">✓ Earned</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  As you continue learning, badges you earn will appear here.
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* ─── 5. Badges You Can Unlock Next ─── */}
        <section>
          <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <CardContent className={`${CARD_PAD} space-y-4`}>
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-5 h-5 text-purple-600 shrink-0" />
                <h2 className="text-base font-bold text-gray-900">Badges you can unlock next</h2>
              </div>
              {lockedBadges.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {lockedBadges.map((badge) => {
                    const xpLeft = Math.max(0, badge.xpRequired - mockCurrentXp);
                    return (
                      <div
                        key={badge.id}
                        className="flex flex-col rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-4"
                      >
                        <div className="flex flex-col items-center text-center gap-2 mb-2 opacity-80">
                          <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                            {badge.icon}
                          </div>
                          <p className="text-sm font-semibold text-gray-800">{badge.name}</p>
                          <p className="text-xs text-gray-600">{badge.description}</p>
                        </div>
                        <div className="mt-1 text-[11px] text-gray-600 space-y-0.5">
                          <p className="font-medium tabular-nums">{xpLeft} XP left to unlock</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  You&apos;ve unlocked all current badges. New milestones will appear here soon.
                </p>
              )}
            </CardContent>
          </Card>
        </section>

      </main>
    </StudentDashboardLayout>
  );
};

export default StudentXpDashboard;
