import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { plannerStubs } from '@/data/planner.stubs';
import type { SuggestionStub } from '@/pages/student/StudentPlanner';

type PlannerSidebarProps = {
  userName?: string;
  onAutoGenerate: () => void;
  onAddSuggestion: (s: SuggestionStub) => void;
  hasSuggestions: boolean;
};

export const PlannerSidebar = ({
  userName,
  onAutoGenerate,
  onAddSuggestion,
  hasSuggestions,
}: PlannerSidebarProps) => {
  const [suggestionsExpanded, setSuggestionsExpanded] = useState(false);
  const { weakAreas, suggestions } = plannerStubs;

  const totalSuggestedMinutes = suggestions.reduce((sum, s) => {
    const match = s.duration.match(/(\d+)/);
    return sum + (match ? Number(match[1]) : 0);
  }, 0);

  return (
    <div className="space-y-4 lg:max-w-[320px]">
      {/* AI Study Planner widget */}
      <Card className="border border-gray-200/80 bg-white rounded-2xl shadow-sm min-h-[180px]">
        <CardContent className="p-4 h-full flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Brain className="w-4 h-4 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">AI Study Planner</h3>
              <p className="text-[11px] text-gray-500">For {userName || 'you'}</p>
            </div>
          </div>

          <Button
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700 font-semibold rounded-xl gap-2 h-10"
            onClick={onAutoGenerate}
          >
            <Sparkles className="w-4 h-4" />
            Auto-Generate Today&apos;s Plan
          </Button>

          {hasSuggestions && suggestions.length > 0 && (
            <div className="mt-1 rounded-lg bg-indigo-50/70 overflow-hidden">
              <button
                type="button"
                className="flex w-full items-center justify-between px-3 py-2 text-left text-xs font-medium text-indigo-900 hover:bg-indigo-100/70"
                onClick={() => setSuggestionsExpanded((e) => !e)}
              >
                <span>Suggestions</span>
                <Badge className="bg-indigo-100 text-indigo-700 border-0 rounded-full text-[10px]">
                  {suggestions.length}
                </Badge>
                {suggestionsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {suggestionsExpanded && (
                <ul className="border-t border-indigo-100 px-2 pb-2 pt-1 space-y-1.5">
                  {suggestions.map((s) => (
                    <li key={s.id} className="p-2 rounded-lg bg-white">
                      <p className="text-xs font-medium text-gray-900">{s.name}</p>
                      <div className="flex flex-wrap items-center gap-1 mt-0.5">
                        <span className="text-[10px] text-gray-600">
                          {s.subject} · {s.duration}
                        </span>
                        {s.why && (
                          <span className="text-[10px] text-gray-500">
                            · Because {s.why.toLowerCase()}
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="mt-1.5 h-6 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded text-[10px] px-2"
                        onClick={() => onAddSuggestion(s)}
                      >
                        Add to Today
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
};
