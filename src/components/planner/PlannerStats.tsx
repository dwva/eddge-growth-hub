import { useState } from 'react';
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

  const [mood, setMood] = useState<'low' | 'ok' | 'high' | null>(null);

  const moodTip =
    mood === 'low'
      ? 'Do 1 small 15‑min block only. Keep it light and celebrate finishing it.'
      : mood === 'high'
        ? 'You’re in the zone – try an extra challenge block or tackle a harder topic.'
        : mood === 'ok'
          ? 'Aim to complete the blocks already planned for today.'
          : 'Tell us how you feel so we can gently shape today’s plan.';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* 1. Today’s focus blocks */}
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

      {/* 2. How are you feeling today? */}
      <Card className="border border-purple-100 bg-purple-50/60 rounded-2xl overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Brain className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-purple-900">How are you feeling today?</p>
                <p className="text-xs text-purple-800/80">
                  We’ll nudge your plan based on your energy level.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            <Button
              type="button"
              variant={mood === 'low' ? 'default' : 'outline'}
              size="sm"
              className={`rounded-full px-3 py-1 text-xs ${
                mood === 'low'
                  ? 'bg-purple-700 text-white hover:bg-purple-800'
                  : 'border-purple-200 text-purple-800 hover:bg-purple-50'
              }`}
              onClick={() => setMood('low')}
            >
              Low energy
            </Button>
            <Button
              type="button"
              variant={mood === 'ok' ? 'default' : 'outline'}
              size="sm"
              className={`rounded-full px-3 py-1 text-xs ${
                mood === 'ok'
                  ? 'bg-purple-700 text-white hover:bg-purple-800'
                  : 'border-purple-200 text-purple-800 hover:bg-purple-50'
              }`}
              onClick={() => setMood('ok')}
            >
              Okay
            </Button>
            <Button
              type="button"
              variant={mood === 'high' ? 'default' : 'outline'}
              size="sm"
              className={`rounded-full px-3 py-1 text-xs ${
                mood === 'high'
                  ? 'bg-purple-700 text-white hover:bg-purple-800'
                  : 'border-purple-200 text-purple-800 hover:bg-purple-50'
              }`}
              onClick={() => setMood('high')}
            >
              Super focused
            </Button>
          </div>
          <p className="text-[11px] text-purple-900/90">{moodTip}</p>
        </CardContent>
      </Card>

      {/* 3. Today’s AI plan */}
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

    </div>
  );
};
