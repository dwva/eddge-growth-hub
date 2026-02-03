import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Play } from 'lucide-react';
import type { Task } from '@/pages/student/StudentPlanner';

type NextBestActionCardProps = {
  task: Task;
  onStart: (taskId: string) => void;
};

export const NextBestActionCard = ({ task, onStart }: NextBestActionCardProps) => (
  <Card className="border border-purple-200 bg-gradient-to-br from-purple-50/80 to-indigo-50/80 rounded-2xl overflow-hidden shadow-sm">
    <CardContent className="p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
        <Brain className="w-4 h-4 text-purple-600" />
        Next Best Action (AI Suggested)
      </h3>
      <p className="text-base font-medium text-gray-900 mt-2">{task.name} ({task.duration})</p>
      <p className="text-xs text-muted-foreground mt-1">Why: {task.reason}</p>
      <Button
        className="mt-4 gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg"
        onClick={() => onStart(task.id)}
        disabled={task.status === 'completed'}
      >
        <Play className="w-4 h-4" />
        {task.status === 'in_progress' ? 'Continue' : 'Start Now'}
      </Button>
    </CardContent>
  </Card>
);
