import { useMemo, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Flame } from 'lucide-react';
import type { ContributionMap } from '@/components/ContributionHeatmap';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export type StreakTimelineDays = 7 | 14 | 30;

export interface StreakTimelineProps {
  /** Map of date string (YYYY-MM-DD) to contribution count */
  contributions: ContributionMap;
  /** Number of days to show (default 7) */
  daysToShow?: StreakTimelineDays;
  /** Optional: show toggle for 7 / 14 / 30 */
  showDaysToggle?: boolean;
  /** Optional: className for the root */
  className?: string;
}

type DayState = 'completed' | 'today-done' | 'today-pending' | 'missed';

type DayItem = {
  dateKey: string;
  label: string;
  isToday: boolean;
  count: number;
  isCompleted: boolean;
  state: DayState;
  index1Based: number;
};

function getDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function buildTimelineDays(contributions: ContributionMap, daysToShow: number): DayItem[] {
  const today = new Date();
  const items: DayItem[] = [];

  for (let i = daysToShow - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateKey = getDateKey(d);
    const count = contributions[dateKey] ?? 0;
    const isToday = i === 0;
    const isCompleted = count > 0;
    const index1Based = daysToShow - i;

    let state: DayState;
    if (isToday && isCompleted) state = 'today-done';
    else if (isToday && !isCompleted) state = 'today-pending';
    else if (isCompleted) state = 'completed';
    else state = 'missed';

    const label = `${DAY_NAMES[d.getDay()]} ${d.getDate()}`;
    items.push({ dateKey, label, isToday, count, isCompleted, state, index1Based });
  }

  return items;
}

const MILESTONE_DAYS = [7, 14, 30];

function isMilestone(index1Based: number, daysToShow: number): boolean {
  return index1Based <= daysToShow && MILESTONE_DAYS.includes(index1Based);
}

export function StreakTimeline({
  contributions,
  daysToShow = 7,
  showDaysToggle = true,
  className,
}: StreakTimelineProps) {
  const [activeDays, setActiveDays] = useState<StreakTimelineDays>(daysToShow);
  const days = useMemo(
    () => buildTimelineDays(contributions, activeDays),
    [contributions, activeDays],
  );

  const todayItem = days.find((d) => d.isToday);
  const todayPending = todayItem?.state === 'today-pending';

  return (
    <TooltipProvider delayDuration={200}>
      <div className={className}>
        {showDaysToggle && (
          <div className="flex items-center gap-1 mb-4">
            {([7, 14, 30] as const).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setActiveDays(n)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeDays === n
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                }`}
              >
                {n} days
              </button>
            ))}
          </div>
        )}

        {/* Timeline row: connector + day blocks */}
        <div className="flex items-center gap-0 w-full overflow-x-auto pb-2">
          {days.map((day, idx) => (
            <div key={day.dateKey} className="flex items-center flex-shrink-0">
              {/* Connector line (before first: none) */}
              {idx > 0 && (
                <div
                  className={`w-1 sm:w-2 h-0.5 rounded-full flex-shrink-0 ${
                    day.state !== 'missed' && days[idx - 1].state !== 'missed'
                      ? 'bg-purple-300 dark:bg-purple-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  aria-hidden
                />
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`
                      relative flex items-center justify-center rounded-xl min-w-[2rem] w-8 h-8 sm:min-w-[2.75rem] sm:w-11 sm:h-11
                      transition-colors
                      ${getDayBlockClasses(day.state)}
                      ${isMilestone(day.index1Based, activeDays) && day.isCompleted ? 'ring-2 ring-amber-400/60 ring-offset-2 dark:ring-offset-background' : ''}
                    `}
                    aria-label={`${day.label}: ${day.state === 'missed' || day.state === 'today-pending' ? 'No' : day.count} contribution${day.count !== 1 ? 's' : ''}`}
                  >
                    {day.state === 'today-done' ? (
                      <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 dark:text-amber-400" aria-hidden />
                    ) : (
                      <span className="text-[10px] sm:text-xs font-semibold tabular-nums">
                        {day.isToday ? '…' : day.count > 0 ? day.count : '·'}
                      </span>
                    )}
                    {day.state === 'today-pending' && (
                      <span className="absolute inset-0 rounded-xl border-2 border-amber-400/80 animate-pulse pointer-events-none" aria-hidden />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px]">
                  <p className="font-medium">{day.label}</p>
                  {day.isCompleted ? (
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {day.count} contribution{day.count !== 1 ? 's' : ''} · practice, revision, lessons
                    </p>
                  ) : day.isToday ? (
                    <p className="text-amber-600 dark:text-amber-400 text-xs mt-0.5">Complete today to keep your streak</p>
                  ) : (
                    <p className="text-muted-foreground text-xs mt-0.5">No activity</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </div>

        {todayPending && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-3 text-center font-medium">
            Complete today to keep your streak alive
          </p>
        )}
      </div>
    </TooltipProvider>
  );
}

function getDayBlockClasses(state: DayState): string {
  switch (state) {
    case 'completed':
      return 'bg-purple-500 text-white dark:bg-purple-600 dark:text-white shadow-sm shadow-purple-500/30';
    case 'today-done':
      return 'bg-amber-500/90 text-white dark:bg-amber-500 dark:text-white shadow-md shadow-amber-500/40';
    case 'today-pending':
      return 'bg-transparent border-2 border-dashed border-amber-400 text-amber-600 dark:text-amber-400';
    case 'missed':
      return 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500';
    default:
      return '';
  }
}
