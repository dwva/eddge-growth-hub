import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { NewTaskForm, TaskIntent, Priority } from '@/pages/student/StudentPlanner';

type AddTaskDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: NewTaskForm;
  onFormChange: (updates: Partial<NewTaskForm>) => void;
  onSubmit: () => void;
  onReset: () => void;
};

export const AddTaskDialog = ({
  open,
  onOpenChange,
  form,
  onFormChange,
  onSubmit,
  onReset,
}: AddTaskDialogProps) => {
  const handleClose = (next: boolean) => {
    if (!next) onReset();
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <p className="text-xs text-muted-foreground font-normal">Some fields may be auto-suggested by AI.</p>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="task-name">Task Name</Label>
            <Input
              id="task-name"
              placeholder="e.g. Complete chapter 5"
              value={form.name}
              onChange={(e) => onFormChange({ name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label>Task Intent <span className="text-destructive">*</span></Label>
            <Select value={form.intent} onValueChange={(v) => onFormChange({ intent: v as TaskIntent })}>
              <SelectTrigger><SelectValue placeholder="Select intent" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="learn">Learn (new topic)</SelectItem>
                <SelectItem value="practice">Practice</SelectItem>
                <SelectItem value="revision">Revision</SelectItem>
                <SelectItem value="test">Test / Mock</SelectItem>
                <SelectItem value="fixWeakArea">Fix Weak Area</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Subject</Label>
            <Select value={form.subject} onValueChange={(v) => onFormChange({ subject: v })}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Exam Impact</Label>
            <Select value={form.priority} onValueChange={(v) => onFormChange({ priority: v as Priority })}>
              <SelectTrigger><SelectValue placeholder="Select weight" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="high"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> High exam weight</span></SelectItem>
                <SelectItem value="medium"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Medium exam weight</span></SelectItem>
                <SelectItem value="low"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> Low exam weight</span></SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="duration">Duration (min)</Label>
            <Input
              id="duration"
              type="number"
              placeholder="30"
              value={form.duration}
              onChange={(e) => onFormChange({ duration: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="due">Due Date</Label>
            <Input
              id="due"
              type="date"
              value={form.due}
              onChange={(e) => onFormChange({ due: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
          <Button onClick={onSubmit} disabled={!form.name.trim()}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
