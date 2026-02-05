import { useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isSameDay, addMonths, subMonths } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import type { DayContentProps } from 'react-day-picker';
import { calendarEventColors, subjectAccent, type Task } from '@/pages/student/StudentPlanner';

const durationShort = (d: string) => (d.replace(/\s*min\s*/i, 'm').replace(/\s*minute(s)?\s*/i, 'm') || d);

const DRAG_TASK_KEY = 'planner-task-id';

type PlannerCalendarProps = {
  calendarDate: Date;
  onCalendarDateChange: (date: Date) => void;
  getEventsForDay: (date: Date) => Task[];
  onTaskClick: (task: Task) => void;
  onTaskMove?: (taskId: string, newDate: Date) => void;
  hasEvents: boolean;
};

export const PlannerCalendar = ({
  calendarDate,
  onCalendarDateChange,
  getEventsForDay,
  onTaskClick,
  onTaskMove,
  hasEvents,
}: PlannerCalendarProps) => {
  const [dragOverDate, setDragOverDate] = useState<Date | null>(null);

  const goToPrevMonth = useCallback(() => onCalendarDateChange(subMonths(calendarDate, 1)), [calendarDate, onCalendarDateChange]);
  const goToNextMonth = useCallback(() => onCalendarDateChange(addMonths(calendarDate, 1)), [calendarDate, onCalendarDateChange]);
  const goToToday = useCallback(() => onCalendarDateChange(new Date()), [onCalendarDateChange]);

  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData(DRAG_TASK_KEY, taskId);
    e.dataTransfer.effectAllowed = 'move';
    (e.target as HTMLElement).classList.add('opacity-50');
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    (e.target as HTMLElement).classList.remove('opacity-50');
    setDragOverDate(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, date: Date) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDate(date);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverDate(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, date: Date) => {
      e.preventDefault();
      setDragOverDate(null);
      const taskId = e.dataTransfer.getData(DRAG_TASK_KEY);
      if (taskId && onTaskMove) onTaskMove(taskId, date);
    },
    [onTaskMove]
  );

  const CalendarDayContent = useCallback(
    (props: DayContentProps) => {
      const { date, activeModifiers } = props;
      const dayTasks = getEventsForDay(date).slice(0, 4);
      const isToday = isSameDay(date, new Date());
      const isSelected = activeModifiers?.selected;
      const isDropTarget = dragOverDate ? isSameDay(date, dragOverDate) : false;

      return (
        <div
          className={`flex h-full min-h-[6.5rem] w-full flex-col rounded-lg p-2 text-left transition-colors ${
            isDropTarget ? 'ring-2 ring-purple-300 ring-offset-2 bg-purple-50' : ''
          }`}
          onDragOver={(e) => handleDragOver(e, date)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, date)}
        >
          <div className="mb-2 flex items-center justify-between">
            <span
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold tabular-nums transition-colors ${
                isSelected ? 'bg-purple-100 text-purple-700 shadow-sm ring-1 ring-purple-200' : isToday ? 'bg-purple-100 text-purple-700' : 'text-foreground hover:bg-gray-100'
              }`}
            >
              {date.getDate()}
            </span>
            {isToday && !isSelected && (
              <span className="rounded-full bg-purple-100 px-1.5 py-0.5 text-[10px] font-medium text-purple-700" title="Today">
                Today
              </span>
            )}
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto">
            {dayTasks.map((task) => {
              const dur = durationShort(task.duration);
              const accent = subjectAccent[task.subject] ?? calendarEventColors[task.priority];
              return (
                <button
                  key={task.id}
                  type="button"
                  draggable={!!onTaskMove}
                  onDragStart={(e) => onTaskMove && handleDragStart(e, task.id)}
                  onDragEnd={handleDragEnd}
                  title={onTaskMove ? 'Drag to move to another day' : undefined}
                  className={`group flex h-9 min-h-9 w-full cursor-grab active:cursor-grabbing items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-xs transition-all hover:shadow-md ${
                    isSelected
                      ? 'border-purple-200 bg-purple-50 text-foreground hover:bg-purple-100'
                      : 'border-gray-200/80 bg-white shadow-sm hover:border-purple-200 hover:shadow'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTaskClick(task);
                  }}
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                  <span className="min-w-0 flex-1 truncate font-medium text-foreground">{task.name}</span>
                  <span className="shrink-0 text-[10px] font-medium text-muted-foreground">{dur}</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    },
    [getEventsForDay, onTaskClick, onTaskMove, handleDragStart, handleDragEnd, handleDragOver, handleDragLeave, handleDrop, dragOverDate]
  );

  return (
    <div className="flex flex-1 flex-col gap-5 w-full min-h-0">
      <div className="flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-xl bg-gray-100 p-1 shadow-sm">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={goToPrevMonth} aria-label="Previous month">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-9 rounded-lg px-4 text-sm font-medium" onClick={goToToday}>
              Today
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={goToNextMonth} aria-label="Next month">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="ml-3 text-2xl font-semibold tracking-tight text-foreground">
            {format(calendarDate, 'MMMM yyyy')}
          </h2>
        </div>
        <span className="text-sm font-medium text-muted-foreground bg-gray-100 px-3 py-1.5 rounded-lg">Monthly view</span>
      </div>

      <Card className="relative flex-1 overflow-auto rounded-2xl border-2 border-gray-200/90 bg-white shadow-md min-h-0">
        {!hasEvents && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-2xl bg-gray-50/98 p-12">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gray-100 shadow-inner">
              <CalendarIcon className="h-12 w-12 text-gray-400" />
            </div>
            <div className="space-y-2 text-center">
              <p className="text-xl font-semibold text-foreground">No tasks scheduled</p>
              <p className="max-w-sm text-sm text-muted-foreground">Add a task from the Dashboard to see it here. Drag tasks to move them between days.</p>
            </div>
          </div>
        )}
        <div className="relative p-4 sm:p-5 h-full min-h-[480px]">
          <CalendarComponent
            mode="single"
            month={calendarDate}
            onMonthChange={(date) => date && onCalendarDateChange(date)}
            selected={calendarDate}
            onSelect={(date) => date && onCalendarDateChange(date)}
            className="w-full h-full rounded-xl [&_.rdp-month]:w-full [&_.rdp-month_grid]:flex-1"
            classNames={{
              caption: 'hidden',
              nav: 'hidden',
              months: 'w-full h-full',
              month: 'w-full h-full',
              table: 'w-full h-full',
              head_row: 'flex w-full',
              head_cell: 'flex-1 min-w-0 py-4 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground',
              row: 'flex w-full flex-1 min-h-0 border-b border-gray-100 last:border-b-0',
              cell: 'flex-1 min-w-0 min-h-[6.5rem] border-r border-gray-100 last:border-r-0 p-1 align-top [&:has([aria-selected])]:bg-purple-50/80 focus-within:relative focus-within:z-10',
              day: 'h-full min-h-[6.5rem] w-full flex flex-col overflow-hidden p-0 font-normal rounded-lg text-left',
              day_today: 'bg-purple-50/80 text-foreground',
              day_selected: 'bg-purple-50 text-foreground ring-1 ring-purple-200 hover:bg-purple-100 focus:bg-purple-100 [&_.text-foreground]:!text-foreground [&_.text-muted-foreground]:!text-muted-foreground',
              day_outside: 'text-muted-foreground/50',
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
