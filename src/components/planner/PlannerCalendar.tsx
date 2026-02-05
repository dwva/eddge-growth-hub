import { useCallback, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { format, isSameDay, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, startOfWeek, endOfWeek } from 'date-fns';
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

type CalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';

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
  const [view, setView] = useState<CalendarView>('dayGridMonth');

  const goToPrev = useCallback(() => {
    if (view === 'dayGridMonth') onCalendarDateChange(subMonths(calendarDate, 1));
    else if (view === 'timeGridWeek') onCalendarDateChange(subWeeks(calendarDate, 1));
    else onCalendarDateChange(subDays(calendarDate, 1));
  }, [view, calendarDate, onCalendarDateChange]);

  const goToNext = useCallback(() => {
    if (view === 'dayGridMonth') onCalendarDateChange(addMonths(calendarDate, 1));
    else if (view === 'timeGridWeek') onCalendarDateChange(addWeeks(calendarDate, 1));
    else onCalendarDateChange(addDays(calendarDate, 1));
  }, [view, calendarDate, onCalendarDateChange]);

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

  const handleDragLeave = useCallback(() => setDragOverDate(null), []);

  const handleDrop = useCallback(
    (e: React.DragEvent, date: Date) => {
      e.preventDefault();
      setDragOverDate(null);
      const taskId = e.dataTransfer.getData(DRAG_TASK_KEY);
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
            {dayTasks.map((task) => (
              <button
                key={task.id}
                type="button"
                draggable={!!onTaskMove}
                onDragStart={(e) => onTaskMove && handleDragStart(e, task.id)}
                onDragEnd={handleDragEnd}
                title={onTaskMove ? 'Drag to move to another day' : undefined}
                className="group flex h-9 min-h-9 w-full cursor-grab active:cursor-grabbing items-center gap-2 rounded-md border border-transparent px-1 py-0.5 text-left text-xs font-medium transition-all hover:opacity-90 border-gray-200/80 bg-white shadow-sm hover:shadow"
                style={{ borderLeftColor: eventColor(task), borderLeftWidth: '3px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onTaskClick(task);
                }}
              >
                <span className="min-w-0 flex-1 truncate text-foreground">{task.name}</span>
                <span className="shrink-0 text-[10px] font-medium text-muted-foreground">{durationShort(task.duration)}</span>
              </button>
            ))}
          </div>
        </div>
      );
    },
    [getEventsForDay, onTaskClick, onTaskMove, handleDragStart, handleDragEnd, handleDragOver, handleDragLeave, handleDrop, dragOverDate, eventColor]
  );

  const weekStart = startOfWeek(calendarDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(calendarDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="flex flex-col gap-4 w-full min-h-[600px]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-0.5 bg-muted/50 p-1 rounded-lg">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md" onClick={goToPrev} aria-label="Previous">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-3 font-medium rounded-md" onClick={goToToday}>
              Today
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md" onClick={goToNext} aria-label="Next">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {view === 'dayGridMonth' && format(calendarDate, 'MMMM yyyy')}
            {view === 'timeGridWeek' && `Week of ${format(weekStart, 'MMM d')} – ${format(weekEnd, 'MMM d, yyyy')}`}
            {view === 'timeGridDay' && format(calendarDate, 'EEEE, MMMM d, yyyy')}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Select value={view} onValueChange={(v) => setView(v as CalendarView)}>
            <SelectTrigger className="w-[140px] h-9 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dayGridMonth">Monthly</SelectItem>
              <SelectItem value="timeGridWeek">Weekly</SelectItem>
              <SelectItem value="timeGridDay">Daily</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-0.5 bg-muted/50 p-1 rounded-lg border">
            <Button
              variant={view === 'dayGridMonth' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8 rounded-md"
              onClick={() => setView('dayGridMonth')}
              aria-label="Monthly view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'timeGridWeek' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8 rounded-md"
              onClick={() => setView('timeGridWeek')}
              aria-label="Weekly view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar card */}
      <Card className="flex-1 p-4 overflow-hidden border shadow-md bg-card relative min-h-[500px]">
        {!hasEvents && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-background/60 backdrop-blur-sm rounded-xl">
            <CalendarIcon className="h-16 w-16 text-muted-foreground opacity-50" aria-hidden />
            <p className="text-lg font-semibold text-foreground">No tasks scheduled</p>
            <p className="text-sm text-muted-foreground">No tasks found for the visible date range.</p>
            <p className="text-xs text-muted-foreground">Create a task to get started with your study plan.</p>
          </div>
        )}

        {view === 'dayGridMonth' && (
          <div className="relative h-full min-h-[480px] p-2">
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
        )}

        {view === 'timeGridWeek' && (
          <div className="h-full min-h-[400px] overflow-auto">
            <div className="grid grid-cols-7 gap-px border rounded-lg bg-gray-100 overflow-hidden">
              {weekDays.map((day) => (
                <div key={day.toISOString()} className="bg-card flex flex-col min-h-[320px]">
                  <div className="p-2 border-b bg-muted/30 text-center text-xs font-semibold uppercase text-muted-foreground">
                    {format(day, 'EEE')}
                  </div>
                  <div className="p-1.5 text-center text-sm font-bold text-foreground">
                    {format(day, 'd')}
                  </div>
                  <div className="flex-1 p-1 space-y-1">
                    {getEventsForDay(day).slice(0, 5).map((task) => (
                      <button
                        key={task.id}
                        type="button"
                        draggable={!!onTaskMove}
                        onDragStart={(e) => onTaskMove && handleDragStart(e, task.id)}
                        onDragEnd={handleDragEnd}
                        className="w-full rounded-md px-1 py-0.5 text-xs font-medium text-left truncate cursor-pointer hover:opacity-90 border-l-2"
                        style={{ borderLeftColor: eventColor(task), backgroundColor: `${eventColor(task)}20` }}
                        onClick={() => onTaskClick(task)}
                      >
                        {task.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'timeGridDay' && (
          <div className="h-full min-h-[400px] overflow-auto">
            <div className="grid grid-cols-1 gap-2 max-w-2xl mx-auto">
              <div className="text-center py-2 text-sm text-muted-foreground">
                {format(calendarDate, 'EEEE, MMMM d')}
              </div>
              {getEventsForDay(calendarDate).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No tasks this day</p>
              ) : (
                <ul className="space-y-2">
                  {getEventsForDay(calendarDate).map((task) => (
                    <li key={task.id}>
                      <button
                        type="button"
                        className="w-full rounded-md px-3 py-2 text-xs font-medium text-left cursor-pointer hover:opacity-90 border-l-4 flex items-center justify-between gap-2"
                        style={{ borderLeftColor: eventColor(task), backgroundColor: `${eventColor(task)}15` }}
                        onClick={() => onTaskClick(task)}
                      >
                        <span className="truncate">{task.name}</span>
                        <span className="text-muted-foreground shrink-0">{task.duration}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
