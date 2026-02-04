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

const MS_PER_DAY = 86400000;

/** Sunday of the week that contains Jan 1 (so calendar starts correctly; Jan 1 = Thursday → first circle is there). */
function getFirstSundayOfYear(year: number): Date {
  const jan1 = new Date(year, 0, 1);
  return new Date(year, 0, 1 - jan1.getDay());
}

/** Date at (column, row): column = week index, row = day of week (0=Sun .. 6=Sat). */
function dateAtCell(firstSunday: Date, col: number, row: number): Date {
  return new Date(firstSunday.getTime() + (col * 7 + row) * MS_PER_DAY);
}

function getDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateLong(date: Date): string {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
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
    const firstSunday = getFirstSundayOfYear(year);
    const jan1 = new Date(year, 0, 1);
    const dec31 = new Date(year, 11, 31);

    // 53 columns = weeks (Sun–Sat). First column contains Jan 1, last column contains Dec 31. Row = day of week (0=Sun .. 6=Sat).
    const weeks: CellData[][] = Array.from({ length: 53 }, () => Array(7).fill(null));
    let totalContributions = 0;

    for (let col = 0; col < 53; col++) {
      for (let row = 0; row < 7; row++) {
        const date = dateAtCell(firstSunday, col, row);
        if (date < jan1 || date > dec31) {
          weeks[col][row] = null; // before Jan 1 or after Dec 31 → empty, no circle
          continue;
        }
        const dateKey = getDayKey(date);
        const count = contributions[dateKey] ?? 0;
        totalContributions += count;
        const level = count === 0 ? 0 : Math.min(4, Math.ceil(count / 2));
        weeks[col][row] = { dateKey, date, count, level };
      }
    }

    // Column where each month's first day falls (for month labels)
    const monthColStart: number[] = [];
    for (let m = 0; m < 12; m++) {
      const firstDay = new Date(year, m, 1);
      const daysFromStart = Math.round((firstDay.getTime() - firstSunday.getTime()) / MS_PER_DAY);
      monthColStart.push(Math.max(0, Math.min(52, Math.floor(daysFromStart / 7))));
    }

    return { grid: weeks, total: totalContributions, monthColStart };
  }, [year, contributions]);

  const daysInYear = useMemo(() => (new Date(year, 1, 29).getDate() === 29 ? 366 : 365), [year]);

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
          All {daysInYear} days of the year · each task, practice or learning adds a contribution and helps boost your XP.
        </p>
      </div>

      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="w-full flex flex-col min-w-0">
          {/* Month labels - same structure as grid row (spacer + 53 equal-width slots) for alignment */}
          <div className="mb-2 flex w-full gap-[2px] min-w-0">
            <div className="w-8 flex-shrink-0" aria-hidden />
            <div className="flex flex-1 gap-[2px] min-w-0">
              {grid.map((_, weekIdx) => {
                const monthIdx = monthColStart.findIndex((w) => w === weekIdx);
                return (
                  <div
                    key={weekIdx}
                    className={`flex-1 min-w-0 text-[10px] leading-none flex items-center justify-center overflow-hidden ${labelClass}`}
                  >
                    {monthIdx >= 0 ? MONTH_LABELS[monthIdx] : ''}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex w-full gap-[2px] min-w-0">
            {/* Day labels - Mon, Wed, Fri to match GitHub style */}
            <div className="flex w-8 flex-shrink-0 flex-col gap-[2px] pt-[2px]">
              {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                <div key={d} className={`min-h-[10px] flex-1 text-[10px] leading-none flex items-center ${labelClass}`}>
                  {[1, 3, 5].includes(d) ? DAY_LABELS[d] : ''}
                </div>
              ))}
            </div>

            {/* Grid - fills remaining width; 53 columns share space equally */}
            <TooltipProvider delayDuration={0}>
              <div className="flex flex-1 gap-[2px] min-w-0">
                {grid.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-1 flex-col gap-[2px] min-w-0">
                    {week.map((cell, dayIdx) => {
                      if (!cell) {
                        return (
                          <div
                            key={dayIdx}
                            className="w-full aspect-square min-w-[8px] min-h-[8px] flex-shrink-0"
                            aria-hidden
                          />
                        );
                      }
                      const level = cell.level;
                      const bg = PURPLE_LEVELS[level];
                      return (
                        <Tooltip key={dayIdx}>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className={`w-full aspect-square min-w-[8px] min-h-[8px] rounded-sm ${bg} hover:ring-2 hover:ring-purple-400 hover:ring-offset-1 ${ringOffsetClass} transition-all focus:outline-none flex-shrink-0`}
                              aria-label={`${cell.dateKey}: ${cell.count} contributions`}
                            />
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className={tooltipContentClass}
                          >
                            <p className="font-medium">
                              {formatDateLong(cell.date)}
                            </p>
                            <p className={`text-xs mt-0.5 ${tooltipMutedClass}`}>
                              {cell.count === 0
                                ? 'No contributions'
                                : `${cell.count} contribution${cell.count !== 1 ? 's' : ''} · tasks, practice & learning`}
                            </p>
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
