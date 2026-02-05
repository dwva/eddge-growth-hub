import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Brain,
  Activity,
  Target,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  performanceDashboard,
  type KnowledgeHealth,
} from '@/data/mockData';

// ─── Section 1: Learning Readiness (Top Row) ─────────────────────────────────
function ReadinessRow() {
  const { readiness, stability, focusLoad } = performanceDashboard;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="rounded-2xl border border-gray-200/90 dark:border-border bg-white dark:bg-card shadow-sm overflow-hidden cursor-help">
            <CardContent className="p-5 flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                <Brain className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Learning Readiness</p>
                <p className="text-lg font-semibold text-foreground mt-0.5">
                  Exam Readiness: {readiness}
                </p>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[260px]">
          Based on your understanding and recent revision.
        </TooltipContent>
      </Tooltip>

      <Card className="rounded-2xl border border-gray-200/90 dark:border-border bg-white dark:bg-card shadow-sm overflow-hidden">
        <CardContent className="p-5 flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
            <Activity className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Learning Stability</p>
            <p className="text-lg font-semibold text-foreground mt-0.5">{stability}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-gray-200/90 dark:border-border bg-white dark:bg-card shadow-sm overflow-hidden">
        <CardContent className="p-5 flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center shrink-0 text-sky-600 dark:text-sky-400">
            <Target className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Focus Load</p>
            <p className="text-lg font-semibold text-foreground mt-0.5">{focusLoad}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Section 2: Knowledge Health Map ──────────────────────────────────────────
const healthConfig: Record<KnowledgeHealth, { label: string; icon: React.ReactNode; chipClass: string }> = {
  strong: {
    label: 'Strong',
    icon: <CheckCircle2 className="w-4 h-4" />,
    chipClass: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border-emerald-200/60 dark:border-emerald-800/40',
  },
  'needs-refresh': {
    label: 'Needs refresh',
    icon: <RefreshCw className="w-4 h-4" />,
    chipClass: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border-amber-200/60 dark:border-amber-800/40',
  },
  'needs-attention': {
    label: 'Needs attention',
    icon: <AlertCircle className="w-4 h-4" />,
    chipClass: 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200 border-rose-200/60 dark:border-rose-800/40',
  },
};

function KnowledgeHealthMap() {
  const navigate = useNavigate();
  const { knowledgeHealthMap } = performanceDashboard;
  const byHealth = {
    strong: knowledgeHealthMap.filter((t) => t.health === 'strong'),
    'needs-refresh': knowledgeHealthMap.filter((t) => t.health === 'needs-refresh'),
    'needs-attention': knowledgeHealthMap.filter((t) => t.health === 'needs-attention'),
  };

  const handleTopicClick = () => {
    navigate('/student/revision');
  };

  return (
    <Card className="rounded-2xl border border-gray-200/90 dark:border-border bg-white dark:bg-card shadow-sm overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Knowledge Health Map</CardTitle>
        <p className="text-sm text-muted-foreground mt-0.5">
          Topics by how ready they are. Tap one to open Revision.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {(['strong', 'needs-refresh', 'needs-attention'] as const).map((health) => {
          const items = byHealth[health];
          const config = healthConfig[health];
          if (items.length === 0) return null;
          return (
            <div key={health}>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className={cn('rounded p-0.5', config.chipClass)}>{config.icon}</span>
                {config.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={handleTopicClick}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',
                      config.chipClass
                    )}
                  >
                    {config.icon}
                    <span>{t.name}</span>
                    <span className="text-[10px] opacity-80">({t.subject})</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// ─── Section 3: Improvement Trajectory ────────────────────────────────────────
function ImprovementTrajectory() {
  const { improvementTrajectory } = performanceDashboard;
  return (
    <Card className="rounded-2xl border border-gray-200/90 dark:border-border bg-white dark:bg-card shadow-sm overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Improvement Trajectory</CardTitle>
        <p className="text-sm text-muted-foreground mt-0.5">
          Learning signals — not exam noise.
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {improvementTrajectory.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// ─── Section 4: Strengths & Currently Building ───────────────────────────────
function StrengthsAndBuilding() {
  const { strengths, currentlyBuilding } = performanceDashboard;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="rounded-2xl border border-gray-200/90 dark:border-border bg-white dark:bg-card shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Strengths</CardTitle>
          <p className="text-sm text-muted-foreground mt-0.5">
            Reliable topics — can be used for confidence.
          </p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {strengths.map((s) => (
              <li key={s.id} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-foreground">{s.name}</strong> — {s.note}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card className="rounded-2xl border border-gray-200/90 dark:border-border bg-white dark:bg-card shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Currently Building</CardTitle>
          <p className="text-sm text-muted-foreground mt-0.5">
            No rush. One more revision or clarity focus helps.
          </p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {currentlyBuilding.map((c) => (
              <li key={c.id} className="flex items-start gap-2 text-sm">
                <RefreshCw className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong className="text-foreground">{c.name}</strong> — {c.note}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Section 5: AI Coach Panel (Prominent) ───────────────────────────────────
function CoachCard() {
  const [showWhy, setShowWhy] = useState(false);
  const { coachAction } = performanceDashboard;
  return (
    <Card className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/15 dark:bg-primary/25 flex items-center justify-center shrink-0 text-primary">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground text-base">{coachAction.title}</h3>
            <p className="text-sm text-foreground mt-2 font-medium">{coachAction.action}</p>
            <button
              type="button"
              onClick={() => setShowWhy((v) => !v)}
              className="mt-3 text-xs font-medium text-primary hover:underline flex items-center gap-1"
            >
              {showWhy ? 'Hide why this matters' : 'Why this matters'}
              {showWhy ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showWhy && (
              <p className="text-sm text-muted-foreground mt-2 pl-0">{coachAction.whyMatters}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Section 6: Calm Exit Message ────────────────────────────────────────────
function CalmExitMessage() {
  return (
    <p className="text-center text-sm text-muted-foreground py-2">
      You're progressing steadily. Keep going.
    </p>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
const StudentPerformance = () => {
  return (
    <TooltipProvider>
      <StudentDashboardLayout title="Performance">
        <div className="space-y-8 pb-12">
          <p className="text-sm text-muted-foreground max-w-xl">
            How ready you are, how stable your learning is, and what to focus on next.
          </p>

          {/* Section 1: Learning Readiness */}
          <ReadinessRow />

          {/* Section 2: Knowledge Health Map */}
          <KnowledgeHealthMap />

          {/* Section 3: Improvement Trajectory */}
          <ImprovementTrajectory />

          {/* Section 4: Strengths & Currently Building */}
          <StrengthsAndBuilding />

          {/* Section 5: AI Coach (Prominent) */}
          <CoachCard />

          {/* Section 6: Calm exit */}
          <CalmExitMessage />
        </div>
      </StudentDashboardLayout>
    </TooltipProvider>
  );
};

export default StudentPerformance;
