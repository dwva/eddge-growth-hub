import { useCallback, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, GripVertical, Trash2 } from 'lucide-react';
import { format, isSameDay, addMonths, subMonths } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import type { DayContentProps } from 'react-day-picker';
import { type Task, type Priority } from '@/pages/student/StudentPlanner';

const durationShort = (d: string) => (d.replace(/\s*min\s*/i, 'm').replace(/\s*minute(s)?\s*/i, 'm') || d);

const DRAG_TASK_KEY = 'planner-task-id';

const PRIORITY_EVENT_COLORS: Record<Priority, string> = {
  high: '#ef4444',
  medium: '#eab308',
  low: '#22c55e',
};
const DEFAULT_EVENT_COLOR = '#3b82f6';

type PlannerCalendarProps = {
  calendarDate: Date;
  onCalendarDateChange: (date: Date) => void;
  getEventsForDay: (date: Date) => Task[];
  onTaskClick: (task: Task) => void;
  onTaskMove?: (taskId: string, newDate: Date) => void;
  onRemove?: (taskId: string) => void;
  hasEvents: boolean;
};

export const PlannerCalendar = ({
  calendarDate,
  onCalendarDateChange,
  getEventsForDay,
  onTaskClick,
  onTaskMove,
  onRemove,
  hasEvents,
}: PlannerCalendarProps) => {
  const [dragOverDate, setDragOverDate] = useState<Date | null>(null);

  const goToPrevMonth = useCallback(() => onCalendarDateChange(subMonths(calendarDate, 1)), [calendarDate, onCalendarDateChange]);
  const goToNextMonth = useCallback(() => onCalendarDateChange(addMonths(calendarDate, 1)), [calendarDate, onCalendarDateChange]);
  const goToToday = useCallback(() => onCalendarDateChange(new Date()), [onCalendarDateChange]);

  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData(DRAG_TASK_KEY, taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
    const el = e.currentTarget as HTMLElement;
    el.classList.add('opacity-50');
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).classList.remove('opacity-50');
    setDragOverDate(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, date: Date) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDate(date);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOverDate(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, date: Date) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOverDate(null);
      const taskId = e.dataTransfer.getData(DRAG_TASK_KEY) || e.dataTransfer.getData('text/plain');
      if (taskId && onTaskMove) onTaskMove(taskId, date);
    },
    [onTaskMove]
  );

  const eventColor = useCallback((task: Task) => PRIORITY_EVENT_COLORS[task.priority] ?? DEFAULT_EVENT_COLOR, []);

  const CalendarDayContent = useCallback(
    (props: DayContentProps) => {
      const { date, activeModifiers } = props;
      const dayTasks = getEventsForDay(date).slice(0, 3);
      const isToday = isSameDay(date, new Date());
      const isSelected = activeModifiers?.selected;
      const isDropTarget = dragOverDate ? isSameDay(date, dragOverDate) : false;

      return (
        <div
          role="presentation"
          className={`flex h-full min-h-[5rem] w-full flex-col rounded-lg p-1.5 text-left transition-colors ${
            isDropTarget ? 'ring-2 ring-purple-300 ring-offset-2 bg-purple-50' : ''
          }`}
          onDragOver={(e) => handleDragOver(e, date)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, date)}
        >
          <div className="mb-1 flex items-center justify-between">
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
              const isCompleted = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  role="button"
                  tabIndex={0}
                  draggable={!!onTaskMove && !isCompleted}
                  onDragStart={(e) => {
                    if (onTaskMove && !isCompleted) handleDragStart(e, task.id);
                  }}
                  onDragEnd={handleDragEnd}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onTaskClick(task);
                    }
                  }}
                  title={onTaskMove && !isCompleted ? 'Drag to move to another day' : undefined}
                  className={`group flex h-9 min-h-9 w-full items-center gap-1 rounded-md border px-1 py-0.5 text-left text-xs font-medium shadow-sm transition-all hover:shadow ${
                    isCompleted
                      ? 'cursor-default border-green-200 bg-green-50/90'
                      : 'cursor-grab active:cursor-grabbing border-gray-200/80 bg-white hover:opacity-90'
                  }`}
                  style={{ borderLeftWidth: '3px', borderLeftColor: isCompleted ? '#22c55e' : eventColor(task) }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTaskClick(task);
                  }}
                >
                  {onTaskMove && !isCompleted && (
                    <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                  )}
                  <span className={`min-w-0 flex-1 truncate ${isCompleted ? 'line-through text-gray-500' : 'text-foreground'}`}>
                    {task.name}
                  </span>
                  <span className={`shrink-0 text-[10px] font-medium ${isCompleted ? 'line-through text-gray-400' : 'text-muted-foreground'}`}>
                    {durationShort(task.duration)}
                  </span>
                  {onRemove && (
                    <button
                      type="button"
                      className="shrink-0 rounded p-0.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onRemove(task.id);
                      }}
                      aria-label="Delete task"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    },
    [getEventsForDay, onTaskClick, onTaskMove, onRemove, handleDragStart, handleDragEnd, handleDragOver, handleDragLeave, handleDrop, dragOverDate, eventColor]
  );

  return (
    <div className="flex flex-col gap-2 w-full min-h-0">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-0.5 bg-muted/50 p-1 rounded-lg">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md" onClick={goToPrevMonth} aria-label="Previous month">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-3 font-medium rounded-md" onClick={goToToday}>
              Today
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md" onClick={goToNextMonth} aria-label="Next month">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-xl font-bold text-foreground">{format(calendarDate, 'MMMM yyyy')}</h2>
        </div>
      </div>

      {/* Calendar card */}
      <Card className="flex-1 min-h-[320px] p-3 overflow-hidden border shadow-md bg-card relative">
        {!hasEvents && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-background/60 backdrop-blur-sm rounded-xl">
            <CalendarIcon className="h-16 w-16 text-muted-foreground opacity-50" aria-hidden />
            <p className="text-lg font-semibold text-foreground">No tasks scheduled</p>
            <p className="text-sm text-muted-foreground">No tasks found for the visible date range.</p>
            <p className="text-xs text-muted-foreground">Create a task to get started with your study plan.</p>
          </div>
        )}

        <div className="relative h-full min-h-[320px] p-1">
          <CalendarComponent
            mode="single"
            month={calendarDate}
            onMonthChange={(date) => date && onCalendarDateChange(date)}
            selected={calendarDate}
            onSelect={(date) => date && onCalendarDateChange(date)}
            showOutsideDays={false}
            fixedWeeks={false}
            className="w-full h-full rounded-xl [&_.rdp-month]:w-full [&_.rdp-month_grid]:flex-1"
            classNames={{
              caption: 'hidden',
              nav: 'hidden',
              months: 'w-full h-full flex flex-col',
              month: 'w-full flex-1 flex flex-col',
              table: 'w-full flex-1 flex flex-col',
              head_row: 'flex w-full',
              head_cell: 'flex-1 min-w-0 py-2 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground',
              row: 'flex w-full flex-1 border-b border-gray-100 last:border-b-0',
              cell: 'flex-1 min-w-0 min-h-[5rem] border-r border-gray-100 last:border-r-0 p-1 align-top [&:has([aria-selected])]:bg-purple-50/80 focus-within:relative focus-within:z-10',
              day: 'h-full min-h-[5rem] w-full flex flex-col overflow-hidden p-0 font-normal rounded-lg text-left',
              day_today: 'bg-purple-50/80 text-foreground',
              day_selected: 'bg-purple-50 text-foreground ring-1 ring-purple-200 hover:bg-purple-100 focus:bg-purple-100 [&_.text-foreground]:!text-foreground [&_.text-muted-foreground]:!text-muted-foreground',
              day_outside: 'hidden',
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
