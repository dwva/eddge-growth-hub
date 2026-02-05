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

  return (
    <div className="space-y-4 lg:max-w-[320px]">
      {/* AI card – compact, Auto-Generate as hero */}
      <Card className="border border-indigo-200/80 shadow-md rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Brain className="w-4 h-4 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-base font-bold">AI Study Planner</h3>
              <p className="text-[10px] text-white/90">For {userName || 'You'}</p>
            </div>
          </div>

          <Button
            className="w-full mt-2 bg-white text-indigo-600 hover:bg-white/90 font-semibold rounded-xl gap-2 h-10"
            onClick={onAutoGenerate}
          >
            <Sparkles className="w-4 h-4" />
            Auto-Generate Today&apos;s Plan
          </Button>

          {hasSuggestions && suggestions.length > 0 && (
            <div className="mt-3 rounded-lg bg-white/10 backdrop-blur-sm overflow-hidden">
              <button
                type="button"
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-white hover:bg-white/5"
                onClick={() => setSuggestionsExpanded((e) => !e)}
              >
                <span>Suggestions</span>
                <Badge className="bg-white/20 text-white border-0 rounded-full text-[10px]">{suggestions.length}</Badge>
                {suggestionsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {suggestionsExpanded && (
                <ul className="border-t border-white/10 px-2 pb-2 pt-1 space-y-1.5">
                  {suggestions.map((s) => (
                    <li key={s.id} className="p-2 rounded-lg bg-white/5">
                      <p className="text-xs font-medium">{s.name}</p>
                      <div className="flex flex-wrap items-center gap-1 mt-0.5">
                        <span className="text-[10px] text-white/80">{s.subject} · {s.duration}</span>
                      </div>
                      <Button size="sm" className="mt-1.5 h-6 text-indigo-600 bg-white hover:bg-white/90 rounded text-[10px] px-2" onClick={() => onAddSuggestion(s)}>
                        Add to Schedule
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-[10px] font-semibold text-white/90 mb-0.5">Weak areas</p>
            <p className="text-[10px] text-white/80">{weakAreas.join(', ')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
