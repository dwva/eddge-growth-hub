import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Zap, Brain } from 'lucide-react';

type PlannerStatsProps = {
  completedToday: number;
  tasksTodayCount: number;
  streakDays: number;
  cognitiveLoad: string;
};

export const PlannerStats = ({
  completedToday,
  tasksTodayCount,
  streakDays,
  cognitiveLoad,
}: PlannerStatsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <Card className="border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{completedToday} / {tasksTodayCount || 1}</p>
              <p className="text-xs text-gray-500">Learning blocks completed today</p>
            </div>
          </div>
          <Badge className="rounded-full bg-blue-100 text-blue-700 border-0">
            {tasksTodayCount ? Math.round((completedToday / tasksTodayCount) * 100) : 0}%
          </Badge>
        </div>
        <Progress value={tasksTodayCount ? (completedToday / tasksTodayCount) * 100 : 0} className="h-1.5 mt-3 bg-blue-200 [&>div]:bg-blue-500" />
      </CardContent>
    </Card>
    <Card className="border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Zap className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{streakDays}</p>
            <p className="text-xs text-gray-500">Days studied without breaking flow</p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card className="border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <Brain className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 capitalize">{cognitiveLoad}</p>
            <p className="text-xs text-gray-500">Cognitive load indicator</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
