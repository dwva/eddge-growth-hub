import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Brain } from 'lucide-react';
import { priorityColors, type Priority } from '@/pages/student/StudentPlanner';

type DeadlineStub = { date: string; month: string; day: string; name: string; subject: string; priority: Priority };

type PlannerDeadlinesAndFocusProps = {
  deadlines: readonly DeadlineStub[];
  cognitiveLoad: string;
};

export const PlannerDeadlinesAndFocus = ({
  deadlines,
  cognitiveLoad,
}: PlannerDeadlinesAndFocusProps) => {
  const loadLabel =
    cognitiveLoad === 'high' ? 'Overloaded' : cognitiveLoad === 'low' ? 'Too light' : 'On track';

  const loadDescription =
    cognitiveLoad === 'high'
      ? 'Too many blocks today · consider moving a few to tomorrow.'
      : cognitiveLoad === 'low'
        ? 'You can safely add 1–2 more focus blocks.'
        : 'Good balance of work and rest for today.';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-orange-700" />
            <h3 className="text-base font-semibold text-orange-700">Upcoming Deadlines</h3>
          </div>
          <ul className="space-y-3">
            {deadlines.map((d, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-12 h-10 rounded-lg bg-orange-50 flex flex-col items-center justify-center text-orange-700 text-xs font-medium flex-shrink-0">
                  <span>{d.month}</span>
                  <span className="font-bold">{d.day}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{d.name}</p>
                  <p className="text-xs text-gray-500">{d.subject}</p>
                </div>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityColors[d.priority]}`} />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Study health / cognitive load */}
      <Card className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-green-700" />
            <h3 className="text-base font-semibold text-green-700">Study health: {loadLabel}</h3>
          </div>
          <p className="text-sm text-gray-600">{loadDescription}</p>
        </CardContent>
      </Card>
    </div>
  );
};
