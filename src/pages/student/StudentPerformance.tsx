import { useState } from 'react';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
} from 'recharts';
import { studentPerformanceDashboard } from '@/data/mockData';

const EPI_BANDS = [
  { min: 0, max: 54, label: 'At Risk', color: '#ef4444' },
  { min: 55, max: 69, label: 'Building', color: '#f97316' },
  { min: 70, max: 84, label: 'Stable', color: '#3b82f6' },
  { min: 85, max: 100, label: 'Exam Ready', color: '#22c55e' },
] as const;

function getEpiBand(epi: number) {
  return EPI_BANDS.find((b) => epi >= b.min && epi <= b.max) ?? EPI_BANDS[0];
}

// ─── 1. HERO: EDDGE Performance Index (EPI) — Segmented readiness bar ─────

function EPIGauge() {
  const { epi, epiInsight } = studentPerformanceDashboard;
  const band = getEpiBand(epi);
  const scaleLabels = [0, 25, 50, 75, 100];

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <CardContent className="pt-6 pb-5 px-6">
        <div className="flex flex-col items-center">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            EDDGE Performance Index (EPI)
          </p>
          <div className="w-full max-w-[420px]" role="img" aria-label={`EPI score ${epi} out of 100, ${band.label}`}>
            <div className="relative h-5 w-full rounded-full bg-muted overflow-hidden">
              {/* Readiness bands as segmented bar, spans follow numeric ranges */}
              <div className="absolute inset-0 flex">
                {EPI_BANDS.map((b, idx) => {
                  const start = idx === 0 ? 0 : EPI_BANDS[idx - 1].max;
                  const end = b.max;
                  const width = end - start;
                  return (
                    <div
                      key={b.label}
                      style={{ width: `${width}%`, backgroundColor: b.color }}
                      className="h-full"
                    />
                  );
                })}
              </div>
              {/* Marker for current EPI */}
              <div
                className="absolute top-0 bottom-0 flex items-center"
                style={{ left: `${epi}%` }}
              >
                <div className="w-[2px] h-6 bg-white shadow-sm" />
                <div
                  className="w-3 h-3 rounded-full border-2 bg-background"
                  style={{ borderColor: band.color, marginLeft: '-6px' }}
                />
              </div>
            </div>
            {/* Ticks and numeric scale below */}
            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
              {scaleLabels.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
          {/* Readout — score and band */}
          <div className="mt-3 flex flex-col items-center rounded-xl border border-border bg-muted/10 px-6 py-3 min-w-[140px]">
            <p className="text-3xl md:text-2xl font-bold tabular-nums">
              <span style={{ color: band.color }}>{epi}</span>
              <span className="text-muted-foreground font-normal"> / 100</span>
            </p>
            <p
              className="text-[11px] font-semibold uppercase tracking-wider mt-1"
              style={{ color: band.color }}
            >
              {band.label}
            </p>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-2 px-2 max-w-md text-center leading-relaxed">
            {epiInsight}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 2. Overall Performance — Area chart with 30D / 60D / 90D, purple ─────
type OverallRangeKey = '30' | '60' | '90';
const OVERALL_PURPLE = '#8b5cf6';

function getOverallPerformanceData(range: OverallRangeKey) {
  const raw = studentPerformanceDashboard.learningTrajectory[range];
  return raw.map((p) => ({
    label: p.date.slice(5),
    value: Math.round((p.accuracy + p.difficultyWeightedScore + p.retention) / 3),
  }));
}

function OverallPerformance() {
  const [range, setRange] = useState<OverallRangeKey>('30');
  const data = getOverallPerformanceData(range);

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-semibold">Overall Performance</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              Performance trend over time.
            </p>
          </div>
          <ToggleGroup
            type="single"
            value={range}
            onValueChange={(v) => v && setRange(v as OverallRangeKey)}
            className="rounded-lg border border-border p-0.5"
          >
            <ToggleGroupItem value="30" className="text-xs px-3 py-1.5" aria-label="30 days">
              30D
            </ToggleGroupItem>
            <ToggleGroupItem value="60" className="text-xs px-3 py-1.5" aria-label="60 days">
              60D
            </ToggleGroupItem>
            <ToggleGroupItem value="90" className="text-xs px-3 py-1.5" aria-label="90 days">
              90D
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="overallFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={OVERALL_PURPLE} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={OVERALL_PURPLE} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={true} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[60, 100]}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                ticks={[60, 70, 80, 90, 100]}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--border))',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [value, 'Performance']}
                labelFormatter={(label) => label}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={OVERALL_PURPLE}
                strokeWidth={2}
                fill="url(#overallFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 3. Question Pattern Performance (CBSE) — 5 circular graphs ─────────────
const RING_SIZE = 100;
const RING_R = 38;
const RING_STROKE = 8;

function getAccuracyColor(accuracy: number) {
  if (accuracy >= 75) return '#22c55e';
  if (accuracy >= 55) return '#eab308';
  return '#ef4444';
}

function getAccuracyLabel(accuracy: number) {
  if (accuracy >= 75) return 'Strong';
  if (accuracy >= 55) return 'Building';
  return 'Needs repair';
}

function QuestionPatternRing({
  type,
  accuracy,
  avgTimeSec,
}: {
  type: string;
  accuracy: number;
  avgTimeSec: number;
}) {
  const color = getAccuracyColor(accuracy);
  const label = getAccuracyLabel(accuracy);
  const circumference = 2 * Math.PI * RING_R;
  const filled = (accuracy / 100) * circumference;
  const dashArray = `${filled} ${circumference - filled}`;

  const gradientId = `qp-${type.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  const [startColor, endColor] =
    accuracy >= 75
      ? ['#bbf7d0', '#22c55e'] // light → strong green
      : accuracy >= 55
      ? ['#fef9c3', '#eab308'] // light → amber
      : ['#fee2e2', '#ef4444']; // light → red

  const chipBg =
    accuracy >= 75
      ? 'bg-emerald-50 text-emerald-700'
      : accuracy >= 55
      ? 'bg-amber-50 text-amber-700'
      : 'bg-rose-50 text-rose-700';

  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-card/90 p-4 shadow-sm hover:shadow-md transition-shadow h-full">
      <p className="text-xs font-semibold text-foreground text-center leading-tight min-h-[2rem]">
        {type}
      </p>
      <span className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${chipBg}`}>
        {label}
      </span>
      <div className="relative mt-3 flex items-center justify-center" style={{ width: RING_SIZE, height: RING_SIZE }}>
        <svg
          width={RING_SIZE}
          height={RING_SIZE}
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          className="rotate-[-90deg]"
          aria-hidden
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={startColor} />
              <stop offset="100%" stopColor={endColor} />
            </linearGradient>
          </defs>
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_R}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={RING_STROKE}
          />
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_R}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={RING_STROKE}
            strokeLinecap="round"
            strokeDasharray={dashArray}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
          <span className="text-xl font-bold tabular-nums" style={{ color }}>
            {accuracy}
          </span>
          <span className="text-[10px] text-muted-foreground">/ 100</span>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground mt-2">
        ~{avgTimeSec}s avg
      </p>
    </div>
  );
}

function QuestionPatternPerformance() {
  const data = studentPerformanceDashboard.questionPatternPerformance;

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Question Pattern Performance</CardTitle>
        <p className="text-sm text-muted-foreground mt-0.5">
          Accuracy by CBSE question type (out of 100). Avg time per question below each.
        </p>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 items-stretch">
          {data.map((item) => (
            <QuestionPatternRing
              key={item.type}
              type={item.type}
              accuracy={item.accuracy}
              avgTimeSec={item.avgTimeSec}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 4. Time & Focus ROI ───────────────────────────────────────────────────
const ROI_COLORS = ['#3b82f6', '#eab308', '#22c55e', '#f97316', '#14b8a6'];

function TimeRoi() {
  const { timePerSubject, timeVsAccuracyGain, roiInsight } = studentPerformanceDashboard.timeRoi;

  const pieData = timePerSubject.map((s, i) => ({
    name: s.subject,
    value: s.timePct,
    color: ROI_COLORS[i % ROI_COLORS.length],
  }));

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Time & Focus ROI</CardTitle>
        <p className="text-sm text-muted-foreground mt-0.5">
          Time spent per subject vs score return. Identify inefficient effort.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={64}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}% time`, 'Time']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={timePerSubject} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="subject" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 45]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Bar dataKey="timePct" fill="hsl(var(--muted-foreground))" fillOpacity={0.4} radius={[4, 4, 0, 0]} name="Time %" />
                <Bar dataKey="scoreReturnPct" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Score return %" />
                <Tooltip formatter={(v: number) => [`${v}%`, '']} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        <p className="text-sm text-muted-foreground border-l-2 border-primary/50 pl-3">
          {roiInsight}
        </p>
      </CardContent>
    </Card>
  );
}

// ─── 5. Strengths vs Currently Building ───────────────────────────────────
function StrengthsAndBuilding() {
  const { strengths, currentlyBuilding } = studentPerformanceDashboard;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Strengths
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-0.5">Reliable — use for confidence.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {strengths.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-border bg-muted/30 p-3 text-sm"
            >
              <p className="font-medium text-foreground">{s.topic}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Last accuracy {s.lastAccuracy}% · 14d retention {s.retention14d}%
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Currently Building
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-0.5">What’s missing — data-specified.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentlyBuilding.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-border bg-muted/30 p-3 text-sm"
            >
              <p className="font-medium text-foreground">{c.topic}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.whatsMissing}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────
const StudentPerformance = () => {
  return (
    <StudentDashboardLayout title="Performance">
      <main className="container px-4 py-8 space-y-8">
        {/* 1. Hero — EPI */}
        <EPIGauge />

        {/* 2. Overall Performance */}
        <OverallPerformance />

        {/* 3. Question Pattern Performance */}
        <QuestionPatternPerformance />

        {/* 4. Time & Focus ROI */}
        <TimeRoi />

        {/* 5. Strengths vs Building */}
        <StrengthsAndBuilding />
      </main>
    </StudentDashboardLayout>
  );
};

export default StudentPerformance;
