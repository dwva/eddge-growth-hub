/**
 * EDDGE Practice — Practice-first layout.
 * Context (subject/chapter/topic) is secondary; practice widgets are the hero.
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
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContextSelectionBar } from '@/components/shared/ContextSelectionBar';
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

// Widget order: MCQs, Very Short Answer, Short, Long, Case Study
const PRACTICE_WIDGETS: {
  id: PracticeType;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'mcq',
    label: 'MCQs',
    description: 'Multiple choice. Choose the correct option.',
    icon: <ListChecks className="w-6 h-6" />,
  },
  {
    id: 'very-short',
    label: 'Very short answer (with hint)',
    description: 'One-word or one-line answers. Hints available.',
    icon: <MessageSquareQuote className="w-6 h-6" />,
  },
  {
    id: 'short',
    label: 'Short answers',
    description: 'Brief written answers in a few sentences.',
    icon: <FileText className="w-6 h-6" />,
  },
  {
    id: 'long',
    label: 'Long answers',
    description: 'Extended answers with structure and detail.',
    icon: <FileStack className="w-6 h-6" />,
  },
  {
    id: 'case-study',
    label: 'Case study',
    description: 'Scenario-based questions with context.',
    icon: <CaseSensitive className="w-6 h-6" />,
  },
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
      <div className="w-full flex flex-col gap-6 min-h-[calc(100vh-8rem)]">
        <ContextSelectionBar selection={selection} onSelectionChange={onSelectionChange} />

        {/* Optional smart guidance — one line, calm tone */}
        {hasTopicSelected && (
          <p className="text-sm text-gray-500">
            You can try any practice type in any order.
          </p>
        )}

        {/* Practice widgets — always visible, hero area. 5 cards: 3+2 on lg with 5th centered. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 min-h-0 auto-rows-fr">
          {PRACTICE_WIDGETS.map((widget, index) => {
            const disabled = !hasTopicSelected;
            const isFifth = index === 4;
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
                  'transition-all cursor-pointer h-full flex flex-col',
                  isFifth && 'lg:col-start-2',
                  disabled
                    ? 'opacity-60 cursor-not-allowed bg-gray-50/80 border-gray-200'
                    : 'hover:border-primary hover:bg-primary/5 hover:shadow-md border-gray-200'
                )}
              >
                <CardContent className="p-5 flex flex-col gap-3 flex-1 min-h-0">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      disabled ? 'bg-gray-200 text-gray-500' : 'bg-primary/10 text-primary'
                    )}
                  >
                    {widget.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{widget.label}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{widget.description}</p>
                  </div>
                  {widget.id === 'very-short' && !disabled && (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded w-fit">
                      <Lightbulb className="w-3 h-3" />
                      Hint always available
                    </span>
                  )}
                </CardContent>
              </Card>
            );

            if (disabled) {
              return (
                <Tooltip key={widget.id}>
                  <TooltipTrigger asChild>{card}</TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[220px]">
                    Select a topic to start practice
                  </TooltipContent>
                </Tooltip>
              );
            }
            return <div key={widget.id}>{card}</div>;
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
