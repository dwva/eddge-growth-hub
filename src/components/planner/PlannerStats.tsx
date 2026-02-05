import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, ListTodo, Brain, Sparkles } from 'lucide-react';

type PlannerStatsProps = {
  completedToday: number;
  tasksTodayCount: number;
  pendingCount: number;
  cognitiveLoad: string;
  onAutoGeneratePlan: () => void;
};

export const PlannerStats = ({
  completedToday,
  tasksTodayCount,
  pendingCount,
  cognitiveLoad,
  onAutoGeneratePlan,
}: PlannerStatsProps) => {
  const completionPercent = tasksTodayCount ? Math.round((completedToday / tasksTodayCount) * 100) : 0;
  const activeTasks = pendingCount;

  const loadLabel =
    cognitiveLoad === 'high' ? 'Overloaded' : cognitiveLoad === 'low' ? 'Too light' : 'On track';

  const loadDescription =
    cognitiveLoad === 'high'
      ? 'Too many blocks today · consider moving a few to tomorrow.'
      : cognitiveLoad === 'low'
        ? 'You can safely add 1–2 more focus blocks.'
        : 'Good balance of work and rest for today.';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Today’s focus blocks */}
      <Card className="border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {completedToday} / {tasksTodayCount || 1}
                </p>
                <p className="text-xs text-gray-500">Focus blocks completed today</p>
              </div>
            </div>
            <Badge className="rounded-full bg-blue-100 text-blue-700 border-0">
              {completionPercent}%
            </Badge>
          </div>
          <Progress
            value={completionPercent}
            className="h-1.5 mt-3 bg-blue-200 [&>div]:bg-blue-500"
          />
        </CardContent>
      </Card>

      {/* AI auto-generate today’s plan */}
      <Card className="border border-transparent bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl overflow-hidden shadow-md">
        <CardContent className="p-5 text-white">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <ListTodo className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold">Today’s AI plan</p>
                <p className="text-[11px] text-white/80">
                  Let AI build a focused schedule for you.
                </p>
              </div>
            </div>
            <Badge className="rounded-full bg-white/15 text-white text-[10px] border-0">
              {activeTasks} active
            </Badge>
          </div>
          <Button
            className="w-full bg-white text-purple-700 hover:bg-white/90 font-semibold rounded-xl gap-2 h-9 text-sm"
            type="button"
            onClick={onAutoGeneratePlan}
          >
            <Sparkles className="w-4 h-4" />
            Auto-Generate Today&apos;s Plan
          </Button>
          <p className="mt-2 text-[11px] text-white/85">
            Currently {activeTasks} active task{activeTasks === 1 ? '' : 's'} scheduled for today.
          </p>
        </CardContent>
      </Card>

      {/* Study health / cognitive load */}
      <Card className="border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Brain className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">Study health: {loadLabel}</p>
              <p className="text-xs text-gray-500">{loadDescription}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
