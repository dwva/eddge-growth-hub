import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

type MotivationBarProps = {
  streak: number;
  xpBoost?: number;
  timelineDays?: number; // e.g., 7 or 10
  todaysDone?: boolean;
  className?: string;
};

export function MotivationBar({
  streak,
  xpBoost,
  timelineDays = 7,
  todaysDone = false,
  className,
}: MotivationBarProps) {
  const dots = Array.from({ length: timelineDays });
  const todayIndex = dots.length - 1;

  return (
    <Card
      role="status"
      aria-live="polite"
      className={clsx(
        'relative overflow-hidden border-2 border-purple-200/70 dark:border-purple-800/50',
        'bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100/80 dark:from-purple-950/60 dark:via-violet-950/50 dark:to-purple-900/60',
        'rounded-3xl min-h-[200px] h-full px-6 py-6 shadow-md',
        'flex flex-col justify-center',
        className,
      )}
    >
      <div className="relative flex flex-col gap-4 text-left">
        <div className="flex items-center gap-3">
          <span
            className="text-2xl font-bold tabular-nums text-purple-800 dark:text-purple-100"
            aria-label={`${streak} day learning streak`}
          >
            🔥 {streak}-day streak
          </span>
          {xpBoost && (
            <span className="text-sm font-medium text-purple-600 dark:text-purple-300/90">
              XP boost ×{xpBoost.toFixed(1)}
            </span>
          )}
        </div>

        <p className="text-base text-slate-700 dark:text-slate-200 leading-snug">
          {todaysDone ? 'Great work—keep the chain unbroken.' : 'Complete 1 task today to keep it alive.'}
        </p>

        <div className="flex items-center gap-4 mt-1">
          <div className="flex items-center gap-2">
            {dots.map((_, i) => (
              <span
                key={i}
                className={clsx(
                  'h-2.5 w-2.5 rounded-full transition-colors',
                  i === todayIndex
                    ? todaysDone
                      ? 'bg-amber-500 shadow-sm'
                      : 'bg-transparent border-2 border-amber-500'
                    : 'bg-purple-500/80 dark:bg-purple-400/70',
                )}
              />
            ))}
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 dark:text-purple-200">
            View streak <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Card>
  );
}
