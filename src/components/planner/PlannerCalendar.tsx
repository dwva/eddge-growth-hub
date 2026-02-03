import { useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isSameDay, addMonths, subMonths } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import type { DayContentProps } from 'react-day-picker';
import { calendarEventColors, subjectAccent, type Task } from '@/pages/student/StudentPlanner';

const durationShort = (d: string) => (d.replace(/\s*min\s*/i, 'm').replace(/\s*minute(s)?\s*/i, 'm') || d);

type PlannerCalendarProps = {
  calendarDate: Date;
  onCalendarDateChange: (date: Date) => void;
  getEventsForDay: (date: Date) => Task[];
  onTaskClick: (task: Task) => void;
  hasEvents: boolean;
};

export const PlannerCalendar = ({
  calendarDate,
  onCalendarDateChange,
  getEventsForDay,
  onTaskClick,
  hasEvents,
}: PlannerCalendarProps) => {
  const goToPrevMonth = useCallback(() => onCalendarDateChange(subMonths(calendarDate, 1)), [calendarDate, onCalendarDateChange]);
  const goToNextMonth = useCallback(() => onCalendarDateChange(addMonths(calendarDate, 1)), [calendarDate, onCalendarDateChange]);

  const goToToday = useCallback(() => onCalendarDateChange(new Date()), [onCalendarDateChange]);

  const CalendarDayContent = useCallback(
    (props: DayContentProps) => {
      const { date, activeModifiers } = props;
      const dayTasks = getEventsForDay(date).slice(0, 3);
      const isToday = isSameDay(date, new Date());
      const isSelected = activeModifiers?.selected;
      return (
        <div className="flex h-full min-h-[5rem] w-full flex-col p-2 text-left">
          <div className="mb-1.5 flex items-center justify-between">
            <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold tabular-nums ${isSelected ? 'bg-white/20 text-white' : 'text-foreground'}`}>
              {date.getDate()}
            </span>
            {isToday && !isSelected && (
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500" title="Today" />
            )}
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-hidden">
            {dayTasks.map((task) => {
              const dur = durationShort(task.duration);
              const accent = subjectAccent[task.subject] ?? calendarEventColors[task.priority];
              return (
                <button
                  key={task.id}
                  type="button"
                  className={`group flex h-8 min-h-8 w-full cursor-pointer items-center gap-2 rounded-lg border-0 px-2.5 py-1.5 text-left text-xs transition-all hover:shadow-sm ${
                    isSelected ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-50/90 hover:bg-gray-100'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTaskClick(task);
                  }}
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.9)' : accent }} />
                  <span className={`min-w-0 flex-1 truncate font-medium ${isSelected ? 'text-white' : 'text-foreground'}`}>{task.name}</span>
                  <span className={`shrink-0 text-[10px] font-medium ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>{dur}</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    },
    [getEventsForDay, onTaskClick]
  );

  return (
    <div className="flex flex-col gap-5 w-full min-h-[620px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-full bg-gray-100 p-0.5">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={goToPrevMonth} aria-label="Previous month">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 rounded-full px-3 text-sm font-medium" onClick={goToToday}>
              Today
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={goToNextMonth} aria-label="Next month">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="ml-2 text-xl font-semibold tracking-tight text-foreground">
            {format(calendarDate, 'MMMM yyyy')}
          </h2>
        </div>
        <span className="text-sm text-muted-foreground">Monthly view</span>
      </div>

      <Card className="relative flex-1 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm min-h-[540px]">
        {!hasEvents && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-2xl bg-white/95 p-12 backdrop-blur-[2px]">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
              <CalendarIcon className="h-10 w-10 text-gray-400" />
            </div>
            <div className="space-y-1 text-center">
              <p className="text-lg font-semibold text-foreground">No tasks scheduled</p>
              <p className="max-w-sm text-sm text-muted-foreground">No tasks in this date range. Add a task from the Tasks tab to see it here.</p>
            </div>
          </div>
        )}
        <div className="relative p-4 sm:p-5">
          <CalendarComponent
            mode="single"
            month={calendarDate}
            onMonthChange={(date) => date && onCalendarDateChange(date)}
            selected={calendarDate}
            onSelect={(date) => date && onCalendarDateChange(date)}
            className="w-full rounded-xl [&_.rdp-month]:w-full"
            classNames={{
              caption: 'hidden',
              nav: 'hidden',
              months: 'w-full',
              month: 'w-full',
              table: 'w-full',
              head_row: 'flex w-full',
              head_cell: 'flex-1 min-w-0 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground',
              row: 'flex w-full border-b border-gray-100 last:border-b-0',
              cell: 'flex-1 min-w-0 min-h-[5rem] border-r border-gray-100 last:border-r-0 p-0 align-top [&:has([aria-selected])]:bg-violet-50/50 focus-within:relative focus-within:z-10',
              day: 'h-full min-h-[5rem] w-full flex flex-col overflow-hidden p-0 font-normal rounded-none text-left',
              day_today: 'bg-violet-50/70 text-foreground',
              day_selected: 'bg-violet-500 text-white hover:bg-violet-600 focus:bg-violet-600 [&_.text-foreground]:!text-white [&_.text-muted-foreground]:!text-white/80',
              day_outside: 'text-muted-foreground/60',
            }}
            components={{
              Caption: () => null,
              DayContent: CalendarDayContent,
            }}
          />
        </div>
      </Card>
    </div>
  );
};
