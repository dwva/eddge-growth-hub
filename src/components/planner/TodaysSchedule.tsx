import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays } from 'lucide-react';
import { intentConfig, priorityBarColors, type Task } from '@/pages/student/StudentPlanner';

type TodaysScheduleProps = {
  tasks: Task[];
  onViewCalendar: () => void;
  onAddTask: () => void;
  onStart: (taskId: string) => void;
};

export const TodaysSchedule = ({ tasks, onViewCalendar, onAddTask, onStart }: TodaysScheduleProps) => (
  <Card className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-gray-700" />
          <h3 className="text-base font-semibold text-gray-900">Today&apos;s Schedule</h3>
        </div>
        <Button variant="outline" size="sm" className="rounded-lg" onClick={onViewCalendar}>
          View Full Calendar
        </Button>
      </div>
      {tasks.length === 0 ? (
        <div className="py-10 text-center">
          <p className="font-medium text-gray-700">No tasks scheduled for today.</p>
          <button type="button" className="text-sm text-primary hover:underline mt-1" onClick={onAddTask}>
            Add a task
          </button>
        </div>
      ) : (
        <ul className="space-y-0 divide-y divide-gray-100">
          {tasks.map((task) => {
            const config = intentConfig[task.intent];
            const isDone = task.status === 'completed';
            return (
              <li key={task.id} className="flex items-center gap-4 py-3 group">
                <div className={`w-1.5 h-12 rounded-full flex-shrink-0 ${priorityBarColors[task.priority]}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${config.pillClass}`}>
                      {config.icon}
                      {config.label}
                    </span>
                  </div>
                  <p className={`text-sm font-medium ${isDone ? 'line-through text-gray-500' : 'text-gray-900'}`}>{task.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Why: {task.reason}</p>
                  <p className="text-xs text-gray-500">{task.subject} · {task.duration}</p>
                </div>
                <div className="flex items-center gap-2">
                  {isDone ? (
                    <Badge className="bg-green-100 text-green-700 border-0">Completed</Badge>
                  ) : (
                    <>
                      <span className="text-xs text-gray-500">{task.duration}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onStart(task.id)}
                      >
                        {task.status === 'in_progress' ? 'Continue' : 'Start'}
                      </Button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </CardContent>
  </Card>
);
