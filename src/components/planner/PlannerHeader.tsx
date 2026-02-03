import { Sparkles } from 'lucide-react';

export const PlannerHeader = () => (
  <div className="flex items-center gap-3">
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
      <Sparkles className="w-6 h-6 text-white" />
    </div>
    <div>
      <h1 className="text-2xl font-bold text-gray-900">AI Study Planner</h1>
      <p className="text-sm text-gray-500">Your personalized path to success</p>
    </div>
  </div>
);
