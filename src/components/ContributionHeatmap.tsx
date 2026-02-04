import { useMemo } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type ContributionMap = Record<string, number>;

const PURPLE_LEVELS_DARK = [
  'bg-[#21262d]',       // 0 - no contribution (dark empty)
  'bg-purple-900',      // 1
  'bg-purple-700',      // 2
  'bg-purple-600',      // 3
  'bg-purple-500',      // 4+
] as const;

const PURPLE_LEVELS_LIGHT = [
  'bg-gray-100',        // 0 - no contribution (light empty)
  'bg-purple-200',      // 1
  'bg-purple-400',      // 2
  'bg-purple-500',      // 3
  'bg-purple-600',      // 4+
] as const;

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay();
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function getDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

type CellData = { dateKey: string; date: Date; count: number; level: number } | null;

export interface ContributionHeatmapProps {
  /** Map of date string (YYYY-MM-DD) to contribution count for that day */
  contributions: ContributionMap;
  /** Year to display (default: current year) */
  year?: number;
  /** Called when "Learn how we count contributions" is clicked */
  onLearnMore?: () => void;
  /** 'dark' = GitHub-style dark bg; 'light' = white bg for dashboard */
  variant?: 'dark' | 'light';
}

export function ContributionHeatmap({
  contributions,
  year = new Date().getFullYear(),
  onLearnMore,
  variant = 'dark',
}: ContributionHeatmapProps) {
  const isLight = variant === 'light';
  const PURPLE_LEVELS = isLight ? PURPLE_LEVELS_LIGHT : PURPLE_LEVELS_DARK;
  const { grid, total, monthColStart } = useMemo(() => {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1;
    const firstDayOfWeek = start.getDay();

    // Build 53 weeks × 7 days (GitHub layout: columns = weeks, rows = Sun–Sat)
    const weeks: CellData[][] = Array.from({ length: 53 }, () => Array(7).fill(null));

    let totalContributions = 0;
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(year, 0, 1 + i);
      const dayOfWeek = date.getDay();
      const weekNum = Math.min(52, getWeekNumber(date));
      const dateKey = getDayKey(date);
      const count = contributions[dateKey] ?? 0;
      totalContributions += count;
      const level = count === 0 ? 0 : Math.min(4, Math.ceil(count / 2));
      weeks[weekNum][dayOfWeek] = { dateKey, date, count, level };
    }

    // Start week index for each month (first day of month)
    const monthColStart: number[] = [];
    for (let m = 0; m < 12; m++) {
      const d = new Date(year, m, 1);
      monthColStart.push(getWeekNumber(d));
    }

    return { grid: weeks, total: totalContributions, monthColStart };
  }, [year, contributions]);

  const containerClass = isLight
    ? 'rounded-xl border-0 bg-transparent p-0 text-gray-900'
    : 'rounded-2xl border border-[#30363d] bg-[#0d1117] p-6 text-[#e6edf3]';
  const labelClass = isLight ? 'text-gray-500' : 'text-[#8b949e]';
  const titleClass = isLight ? 'text-gray-900' : '';
  const subtitleClass = isLight ? 'text-gray-500' : 'text-[#8b949e]';
  const linkClass = isLight
    ? 'text-gray-500 hover:text-gray-900 hover:underline'
    : 'hover:text-[#e6edf3] hover:underline';
  const ringOffsetClass = isLight ? 'hover:ring-offset-white' : 'hover:ring-offset-[#0d1117]';
  const tooltipContentClass = isLight
    ? 'border-gray-200 bg-white text-gray-900'
    : 'border-[#30363d] bg-[#161b22] text-[#e6edf3]';
  const tooltipMutedClass = isLight ? 'text-gray-500' : 'text-[#8b949e]';

  return (
    <div className={containerClass}>
      <div className={isLight ? 'mb-3' : 'mb-4'}>
        <h3 className={`text-sm font-semibold ${titleClass}`}>
          {total} contribution{total !== 1 ? 's' : ''} in {year}
        </h3>
        <p className={`text-xs mt-0.5 ${subtitleClass}`}>
          Each task, practice or learning you complete adds a contribution and helps boost your XP.
        </p>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="inline-block min-w-0">
          {/* Month labels - one per month at its first week */}
          <div className="mb-2 flex gap-[3px] pl-8">
            {grid.map((_, weekIdx) => {
              const monthIdx = monthColStart.findIndex((w) => w === weekIdx);
              return (
                <div
                  key={weekIdx}
                  className={`h-3 w-3 flex-shrink-0 text-[10px] leading-none flex items-center ${labelClass}`}
                >
                  {monthIdx >= 0 ? MONTH_LABELS[monthIdx] : ''}
                </div>
              );
            })}
          </div>

          <div className="flex gap-[3px]">
            {/* Day labels - Mon, Wed, Fri to match GitHub style */}
            <div className="flex w-8 flex-shrink-0 flex-col gap-[3px] pt-[2px]">
              {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                <div key={d} className={`h-3 text-[10px] leading-none flex items-center ${labelClass}`}>
                  {[1, 3, 5].includes(d) ? DAY_LABELS[d] : ''}
                </div>
              ))}
            </div>

            {/* Grid */}
            <TooltipProvider delayDuration={0}>
              <div className="flex gap-[3px]">
                {grid.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-[3px]">
                    {week.map((cell, dayIdx) => {
                      const level = cell?.level ?? 0;
                      const bg = PURPLE_LEVELS[level];
                      return (
                        <Tooltip key={dayIdx}>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className={`h-3 w-3 rounded-sm ${bg} hover:ring-2 hover:ring-purple-400 hover:ring-offset-1 ${ringOffsetClass} transition-all focus:outline-none`}
                              aria-label={cell ? `${cell.dateKey}: ${cell.count} contributions` : 'No contributions'}
                            />
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className={tooltipContentClass}
                          >
                            {cell ? (
                              <>
                                <p className="font-medium">
                                  {cell.count} contribution{cell.count !== 1 ? 's' : ''} on {cell.dateKey}
                                </p>
                                <p className={`text-xs mt-0.5 ${tooltipMutedClass}`}>
                                  {cell.count === 0
                                    ? 'No activity'
                                    : 'Tasks, practice & learning completed'}
                                </p>
                              </>
                            ) : (
                              <p className={tooltipMutedClass}>No contributions</p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`mt-4 flex items-center justify-between text-xs ${labelClass}`}>
        <button
          type="button"
          className={linkClass}
          onClick={onLearnMore}
        >
          Learn how we count contributions
        </button>
        <div className="flex items-center gap-1">
          <span>Less</span>
          <div className="flex gap-0.5">
            {PURPLE_LEVELS.map((bg, i) => (
              <div
                key={i}
                className={`h-3 w-3 rounded-sm ${bg}`}
                title={`Level ${i}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
