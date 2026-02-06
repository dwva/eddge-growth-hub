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

type LevelStatus = 'completed' | 'active' | 'locked';

type LevelStep = {
  id: string;
  name: string;
  minXp: number;
  status: LevelStatus;
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

const levelsWithStatus: LevelStep[] = [
  { id: 'level-1', name: 'New Explorer', minXp: 0, status: 'completed' },
  { id: 'level-2', name: 'Active Learner', minXp: 600, status: 'completed' },
  { id: 'level-3', name: 'Focused Learner', minXp: 1200, status: 'active' },
  { id: 'level-4', name: 'Exam-Ready', minXp: 1600, status: 'locked' },
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
              { label: 'Predicted Score Boost', value: '+6–9 marks', sub: 'From your current trajectory' },
              { label: 'Class Rank Effect', value: '↑ Top 12%', sub: 'Keep earning XP to climb' },
              { label: 'Readiness Gain', value: '+12%', sub: 'Exam preparation boost' },
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

        {/* ─── 4. XP Levels & Titles ─── */}
        <section>
          <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <CardContent className={`${CARD_PAD} space-y-4`}>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-5 h-5 text-purple-600 shrink-0" />
                <h2 className="text-base font-bold text-gray-900">XP Levels &amp; Titles</h2>
              </div>
              <div className="space-y-2">
                {levelsWithStatus.map((level) => {
                  const isCompleted = level.status === 'completed';
                  const isActive = level.status === 'active';
                  return (
                    <div
                      key={level.id}
                      className={[
                        'flex items-center gap-3 rounded-xl px-4 py-3',
                        isActive
                          ? 'bg-purple-50 border border-purple-200'
                          : isCompleted
                            ? 'bg-gray-50/80 border border-gray-200/80'
                            : 'bg-white border border-gray-200/60 opacity-70',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          'w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0',
                          isActive
                            ? 'border-purple-500 bg-purple-100'
                            : isCompleted
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-300 bg-gray-50',
                        ].join(' ')}
                      >
                        {isCompleted && <Flame className="w-3 h-3 text-green-600" />}
                        {isActive && <Award className="w-3 h-3 text-purple-600" />}
                        {level.status === 'locked' && <Zap className="w-3 h-3 text-gray-400" />}
                      </div>
                      <div className="flex-1 flex items-baseline justify-between gap-3">
                        <p className="text-sm font-semibold text-gray-900">{level.name}</p>
                        <p className="text-xs font-medium text-gray-500 tabular-nums">{level.minXp} XP+</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ─── 5. XP Story ─── */}
        <section>
          <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <CardContent className={`${CARD_PAD} space-y-4`}>
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-5 h-5 text-purple-600 shrink-0" />
                <h2 className="text-base font-bold text-gray-900">XP Story</h2>
              </div>
              <div className="space-y-3">
                {[
                  { icon: <Zap className="w-4 h-4 text-purple-500 shrink-0" />, text: '+40 XP – Completed daily learning plan', time: 'Today · 6:20 PM' },
                  { icon: <Award className="w-4 h-4 text-purple-500 shrink-0" />, text: '+60 XP – Fixed mistakes from recent test', time: 'Yesterday · 8:10 PM' },
                  { icon: <BookOpen className="w-4 h-4 text-purple-500 shrink-0" />, text: '+30 XP – Completed focused revision block', time: '2 days ago · 7:15 PM' },
                ].map((entry, i) => (
                  <div key={i} className="grid grid-cols-[minmax(0,1fr)_176px] items-center gap-4 py-1">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {entry.icon}
                      <p className="text-sm text-gray-800 truncate">{entry.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 whitespace-nowrap text-right">{entry.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

      </main>
    </StudentDashboardLayout>
  );
};

export default StudentXpDashboard;
