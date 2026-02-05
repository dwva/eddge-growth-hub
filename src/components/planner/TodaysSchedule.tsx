import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Trash2, Plus, CheckCircle2, Circle } from 'lucide-react';
import { intentConfig, priorityBarColors, type Task } from '@/pages/student/StudentPlanner';

type TodaysScheduleProps = {
  tasks: Task[];
  onViewCalendar: () => void;
  onAddTask: () => void;
  onStart: (taskId: string) => void;
  onComplete?: (taskId: string) => void;
  onRemove?: (taskId: string) => void;
};

export const TodaysSchedule = ({ tasks, onViewCalendar, onAddTask, onStart, onComplete, onRemove }: TodaysScheduleProps) => (
  <Card className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden flex flex-col min-h-0 h-full sticky top-4">
    <CardContent className="p-6 flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-gray-700" />
          <h3 className="text-base font-semibold text-gray-900">Today&apos;s Schedule</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-lg" onClick={onViewCalendar}>
            View Full Calendar
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg shrink-0" onClick={onAddTask} aria-label="Add task">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto -mx-1 px-1">
        {tasks.length === 0 ? (
          <div className="py-10 text-center">
            <p className="font-medium text-gray-700">No tasks scheduled for today.</p>
            <button type="button" className="text-sm text-primary hover:underline mt-1" onClick={onAddTask}>
              Add a task
            </button>
          </div>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => {
              const config = intentConfig[task.intent];
              const isDone = task.status === 'completed';
              return (
                <li
                  key={task.id}
                  className={`flex items-center gap-3 py-3 px-2 group rounded-lg transition-colors ${isDone ? 'bg-green-50/80 border border-green-100' : 'hover:bg-gray-50'}`}
                >
                  {/* Checkbox to mark complete */}
                  <button
                    type="button"
                    className="flex-shrink-0 focus:outline-none"
                    onClick={() => !isDone && onComplete?.(task.id)}
                    disabled={isDone}
                    aria-label={isDone ? 'Task completed' : 'Mark as complete'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300 hover:text-green-500 transition-colors" />
                    )}
                  </button>
                  {/* Priority bar */}
                  <div className={`w-1 h-10 rounded-full flex-shrink-0 ${priorityBarColors[task.priority]} ${isDone ? 'opacity-50' : ''}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${config.pillClass} ${isDone ? 'opacity-70' : ''}`}>
                        {config.icon}
                        {config.label}
                      </span>
                    </div>
                    <p className={`text-sm font-medium ${isDone ? 'line-through text-gray-500' : 'text-gray-900'}`}>{task.name}</p>
                    <p className={`text-xs mt-0.5 ${isDone ? 'line-through text-gray-400' : 'text-muted-foreground'}`}>Why: {task.reason}</p>
                    <p className={`text-xs ${isDone ? 'line-through text-gray-400' : 'text-gray-500'}`}>{task.subject} · {task.duration}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {isDone ? (
                      <Badge className="bg-green-100 text-green-700 border border-green-200">Completed</Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                        onClick={() => onStart(task.id)}
                      >
                        {task.status === 'in_progress' ? 'Continue' : 'Start'}
                      </Button>
                    )}
                    {onRemove && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => onRemove(task.id)}
                        aria-label="Delete task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </CardContent>
  </Card>
);
