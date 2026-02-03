import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, Plus, Trash2, Bot, Pencil, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { intentConfig, priorityColors, intentToLabel, type Task, type TaskIntent } from '@/pages/student/StudentPlanner';

type PlannerTasksProps = {
  tasks: Task[];
  filter: 'all' | 'pending' | 'completed';
  onFilterChange: (v: 'all' | 'pending' | 'completed') => void;
  onAddTask: () => void;
  onTaskClick: (task: Task) => void;
  onToggleStatus: (taskId: string) => void;
  onRemove: (taskId: string) => void;
};

export const PlannerTasks = ({
  tasks,
  filter,
  onFilterChange,
  onAddTask,
  onTaskClick,
  onToggleStatus,
  onRemove,
}: PlannerTasksProps) => (
  <Card className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
    <CardContent className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <Select value={filter} onValueChange={(v) => onFilterChange(v as 'all' | 'pending' | 'completed')}>
          <SelectTrigger className="w-[150px] gap-2">
            <Filter className="w-4 h-4" />
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onAddTask} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>
      {tasks.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <p className="font-medium text-gray-600">No tasks found matching your filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(['learn', 'practice', 'revision', 'test', 'fixWeakArea'] as TaskIntent[]).map((intent) => {
            const tasksInSection = tasks.filter((t) => t.intent === intent);
            if (tasksInSection.length === 0) return null;
            const config = intentConfig[intent];
            const sectionTitle = config.label + ' Tasks';
            return (
              <Collapsible key={intent} defaultOpen className="group">
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-100">
                  <span className="flex items-center gap-2">
                    {config.icon}
                    {sectionTitle}
                  </span>
                  <ChevronDown className="w-4 h-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ul className="mt-2 space-y-2 pl-1">
                    {tasksInSection.map((task) => {
                      const isDone = task.status === 'completed';
                      return (
                        <li
                          key={task.id}
                          className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 group cursor-pointer"
                          onClick={() => onTaskClick(task)}
                        >
                          <div
                            className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleStatus(task.id);
                            }}
                          >
                            {isDone && <span className="text-green-600 text-xs">✓</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                              <span className="text-[10px] text-muted-foreground">
                                {task.origin === 'ai' ? (
                                  <span className="inline-flex items-center gap-0.5"><Bot className="w-3 h-3" /> AI Suggested</span>
                                ) : (
                                  <span className="inline-flex items-center gap-0.5"><Pencil className="w-3 h-3" /> Added by You</span>
                                )}
                              </span>
                            </div>
                            <p className={`text-sm font-medium ${isDone ? 'line-through text-gray-500' : 'text-gray-900'}`}>{task.name}</p>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              <Badge variant="secondary" className="text-xs rounded-md">{task.subject}</Badge>
                              <Badge variant="outline" className="text-xs rounded-md">{intentToLabel[task.intent]}</Badge>
                              <span className="text-xs text-gray-500">{task.duration}</span>
                            </div>
                          </div>
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityColors[task.priority]}`} />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-destructive opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemove(task.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      )}
    </CardContent>
  </Card>
);
