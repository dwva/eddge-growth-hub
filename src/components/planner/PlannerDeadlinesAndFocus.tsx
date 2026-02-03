import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Target } from 'lucide-react';
import { priorityColors, type Priority } from '@/pages/student/StudentPlanner';

type DeadlineStub = { date: string; month: string; day: string; name: string; subject: string; priority: Priority };

type PlannerDeadlinesAndFocusProps = {
  deadlines: readonly DeadlineStub[];
  weakAreas: readonly string[];
  onGeneratePracticeSet: () => void;
};

export const PlannerDeadlinesAndFocus = ({
  deadlines,
  weakAreas,
  onGeneratePracticeSet,
}: PlannerDeadlinesAndFocusProps) => (
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
    <Card className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-red-700" />
          <h3 className="text-base font-semibold text-red-700">Focus Areas</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">Based on your recent performance, we recommend focusing on these topics.</p>
        {weakAreas.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-2 mb-3">
              {weakAreas.map((area, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">{area}</span>
              ))}
            </div>
            <Button variant="outline" size="sm" className="text-red-700 border-red-200 hover:bg-red-50" onClick={onGeneratePracticeSet}>
              Generate Practice Set
            </Button>
          </>
        ) : (
          <p className="text-sm text-gray-500">No weak areas identified yet.</p>
        )}
      </CardContent>
    </Card>
  </div>
);
