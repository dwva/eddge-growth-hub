/**
 * EDDGE Practice — Practice-first layout.
 * Context bar → Suggested start → Practice widgets (hero) → Recently Revised → Recently Studied (optional).
 */

import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ListChecks,
  FileText,
  FileStack,
  CaseSensitive,
  MessageSquareQuote,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContextSelectionBar } from '@/components/shared/ContextSelectionBar';
import { RecentlyRevisedList } from '@/components/shared/RecentlyRevisedList';
import type { PracticeType } from '@/components/practice/PracticeTypeSelectionView';

export type PracticeSelection = {
  subjectId: string;
  chapterId: string;
  topicId: string;
};

export type { PracticeType };

type PracticeFirstViewProps = {
  selection: PracticeSelection;
  onSelectionChange: (next: Partial<PracticeSelection>) => void;
  onPracticeTypeSelect: (type: PracticeType) => void;
};

// One widget may be recommended (soft tint + pill only; same footprint as others)
const RECOMMENDED_WIDGET_ID: PracticeType = 'very-short';

// Single 3×2 grid: all 6 widgets, same icon size and structure
const PRACTICE_WIDGETS: { id: PracticeType; label: string; description: string; icon: React.ReactNode }[] = [
  { id: 'mcq', label: 'MCQs', description: 'Multiple choice — pick the correct option.', icon: <ListChecks className="w-5 h-5" /> },
  { id: 'very-short', label: 'Very short answer (with hint)', description: 'One-word or one-line answers; hints available.', icon: <MessageSquareQuote className="w-5 h-5" /> },
  { id: 'short', label: 'Short answers', description: 'Brief answers in a few sentences.', icon: <FileText className="w-5 h-5" /> },
  { id: 'long', label: 'Long answers', description: 'Structured, detailed answers.', icon: <FileStack className="w-5 h-5" /> },
  { id: 'case-study', label: 'Case study', description: 'Scenario-based questions with context.', icon: <CaseSensitive className="w-5 h-5" /> },
  { id: 'full-exam', label: 'Full exam', description: 'Complete topic test — all question types.', icon: <ClipboardList className="w-5 h-5" /> },
];

export function PracticeFirstView({
  selection,
  onSelectionChange,
  onPracticeTypeSelect,
}: PracticeFirstViewProps) {
  const { subjectId, chapterId, topicId } = selection;
  const hasTopicSelected = Boolean(subjectId && chapterId && topicId);

  const handleWidgetClick = (type: PracticeType) => {
    if (!hasTopicSelected) return;
    onPracticeTypeSelect(type);
  };

  return (
    <TooltipProvider>
      <div className="w-full flex flex-col gap-3 min-h-[calc(100vh-7rem)]">
        <ContextSelectionBar selection={selection} onSelectionChange={onSelectionChange} />

        {hasTopicSelected && (
          <p className="text-xs text-gray-500 -mt-1 shrink-0">Suggested start: Very short answers</p>
        )}

        {/* 3×2 grid: fill the box with slight edge gaps, equal-height rows */}
        <div className="flex-1 min-h-0 w-full flex flex-col px-3 sm:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-[1fr_1fr] gap-4 flex-1 min-h-0 w-full max-w-full items-stretch">
            {PRACTICE_WIDGETS.map((widget) => {
              const disabled = !hasTopicSelected;
              const isRecommended = widget.id === RECOMMENDED_WIDGET_ID && !disabled;
              const card = (
                <Card
                  role="button"
                  tabIndex={disabled ? -1 : 0}
                  onClick={() => handleWidgetClick(widget.id)}
                  onKeyDown={(e) => {
                    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleWidgetClick(widget.id);
                    }
                  }}
                  className={cn(
                    'h-full min-h-[62px] rounded-xl transition-all duration-200 cursor-pointer flex flex-col overflow-hidden',
                    'bg-white border border-gray-200/90',
                    'shadow-[0_1px_2px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.02)]',
                    disabled
                      ? 'opacity-60 cursor-not-allowed'
                      : [
                          'hover:shadow-[0_4px_12px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)] hover:border-gray-300/80 hover:bg-gray-50/50',
                          isRecommended && 'bg-primary/[0.04] border-primary/20',
                        ]
                  )}
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center flex-1 min-h-0 h-full">
                    <div
                      className={cn(
                        'w-8 h-8 shrink-0 rounded-lg flex items-center justify-center mb-2',
                        disabled ? 'bg-gray-100 text-gray-400' : 'bg-primary/10 text-primary'
                      )}
                    >
                      {widget.icon}
                    </div>
                    <div className="flex items-center justify-center gap-1.5 flex-wrap min-h-0">
                      <h3 className="text-xs font-semibold text-gray-900 leading-tight line-clamp-1">{widget.label}</h3>
                      {isRecommended && (
                        <span className="text-[9px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-md shrink-0">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-1 leading-snug">{widget.description}</p>
                  </CardContent>
                </Card>
              );
              return (
                <div key={widget.id} className="min-h-0 h-full flex flex-col">
                  {disabled ? (
                    <Tooltip className="h-full flex flex-col">
                      <TooltipTrigger asChild className="flex-1 min-h-0 flex flex-col h-full">
                        {card}
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[220px]" sideOffset={8}>
                        Select a topic to start practice
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <div className="flex-1 min-h-0 flex flex-col">{card}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recently Studied Chapters — chapter-level overview. */}
        <div className="shrink-0">
          <RecentlyRevisedList
            title="Recently Studied Chapters"
            onPickTopic={(sId, cId, tId) => onSelectionChange({ subjectId: sId, chapterId: cId, topicId: tId })}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
