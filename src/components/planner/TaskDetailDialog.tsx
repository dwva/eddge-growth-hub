import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { intentToLabel, type Task, type TaskStatus } from '@/pages/student/StudentPlanner';

type TaskDetailDialogProps = {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allocateDate: string;
  allocateStart: string;
  allocateEnd: string;
  onAllocateDateChange: (v: string) => void;
  onAllocateStartChange: (v: string) => void;
  onAllocateEndChange: (v: string) => void;
  onAllocateTime: () => void;
  onSetStatus: (status: TaskStatus) => void;
};

const statusLabel: Record<TaskStatus, string> = {
  pending: 'Pending',
  in_progress: 'In progress',
  completed: 'Completed',
};

export const TaskDetailDialog = ({
  task,
  open,
  onOpenChange,
  allocateDate,
  allocateStart,
  allocateEnd,
  onAllocateDateChange,
  onAllocateStartChange,
  onAllocateEndChange,
  onAllocateTime,
  onSetStatus,
}: TaskDetailDialogProps) => {
  if (!task) return null;

  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'in_progress';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-6 max-h-[90vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{
                backgroundColor:
                  task.priority === 'high'
                    ? '#ef4444'
                    : task.priority === 'medium'
                      ? '#eab308'
                      : '#22c55e',
              }}
            />
            <DialogTitle className="text-xl">{task.name}</DialogTitle>
          </div>
          <span className="sr-only">Task details for {task.name}, {task.subject}, {task.duration}</span>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
          <div>
            <Label className="text-sm text-muted-foreground">Subject</Label>
            <p className="font-semibold truncate">{task.subject}</p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Type</Label>
            <div className="mt-0.5">
              <Badge variant="secondary" className="capitalize">{intentToLabel[task.intent]}</Badge>
            </div>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Duration</Label>
            <p className="flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 shrink-0" />
              {/\d+\s*min/i.test(task.duration) ? task.duration : `${task.duration} min`}
            </p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Status</Label>
            <div className="mt-0.5">
              <Badge variant={isCompleted ? 'default' : 'outline'} className="capitalize">
                {statusLabel[task.status]}
              </Badge>
            </div>
          </div>
        </div>
        {task.allocatedDate && (task.startTime ?? task.endTime) && (
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
            <div className="flex items-center gap-2 text-blue-600 text-sm font-bold mb-2">
              <CalendarIcon className="w-4 h-4" />
              Current Allocation
            </div>
            <p className="text-sm text-blue-900">
              Date: {format(task.allocatedDate, 'EEE, MMM d')}
            </p>
            <p className="text-sm text-blue-900">
              Time: {task.startTime ?? '—'}
              {task.endTime ? ` – ${task.endTime}` : ''}
            </p>
          </div>
        )}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            Allocate Task Time
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">Date</Label>
              <Input type="date" className="mt-0.5 h-9" value={allocateDate} onChange={(e) => onAllocateDateChange(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Start Time</Label>
              <Input type="time" className="mt-0.5 h-9" value={allocateStart} onChange={(e) => onAllocateStartChange(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">End Time</Label>
              <Input type="time" className="mt-0.5 h-9" value={allocateEnd} onChange={(e) => onAllocateEndChange(e.target.value)} />
            </div>
          </div>
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2" disabled={!allocateDate || !allocateStart} onClick={onAllocateTime}>
            <CalendarIcon className="w-4 h-4" />
            Allocate Time Slot
          </Button>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
            Required Resources & Environment
          </div>
          {task.resources && task.resources.length > 0 ? (
            <ul className="space-y-2">
              {task.resources.map((r, i) => (
                <li
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    r.status === 'required'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex-shrink-0 ${r.status === 'required' ? 'bg-red-500' : 'bg-amber-500'}`} />
                  <span className="text-sm font-medium">{r.label}</span>
                  <Badge variant={r.status === 'required' ? 'destructive' : 'secondary'} className="capitalize ml-auto">
                    {r.status}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50 border-gray-200">
              <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground">No specific requirements for this task</span>
            </div>
          )}
        </div>
        {task.aiInsight && (
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-sm text-indigo-900 mb-4">
            <p className="font-bold text-indigo-700 mb-1">AI Insight:</p>
            <p className="text-indigo-800">{task.aiInsight}</p>
          </div>
        )}
        {task.performanceScore != null && (
          <div className="mb-4">
            <Label className="text-sm text-muted-foreground">Performance Score</Label>
            <p className="font-medium mt-0.5">{task.performanceScore}%</p>
            <div className="h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${task.performanceScore}%`,
                  backgroundColor:
                    task.performanceScore >= 80
                      ? '#22c55e'
                      : task.performanceScore >= 60
                        ? '#eab308'
                        : '#ef4444',
                }}
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {!isCompleted && (
            <Button
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium"
              onClick={() => {
                if (isInProgress) {
                  onSetStatus('completed');
                  onOpenChange(false);
                } else {
                  onSetStatus('in_progress');
                }
              }}
            >
              {isInProgress ? 'Mark complete' : 'Start Task'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
