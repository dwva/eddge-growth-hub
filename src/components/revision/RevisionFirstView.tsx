/**
 * EDDGE Revision — 6 revision modules (replace practice widgets).
 * Context bar → Suggested start → 3×2 revision module grid → Recently Studied Chapters.
 */

import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  FileText,
  Calculator,
  AlertTriangle,
  Lightbulb,
  ImageIcon,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContextSelectionBar } from '@/components/shared/ContextSelectionBar';
import { RecentlyRevisedList } from '@/components/shared/RecentlyRevisedList';

export type RevisionSelection = {
  subjectId: string;
  chapterId: string;
  topicId: string;
};

/** Revision module IDs — order matches the 6 modules. */
export type RevisionModuleId =
  | 'snapshot-summary'
  | 'formula-rules'
  | 'common-mistakes'
  | 'quick-recall'
  | 'visual-map'
  | 'exam-focus';

type RevisionFirstViewProps = {
  selection: RevisionSelection;
  onSelectionChange: (next: Partial<RevisionSelection>) => void;
  onStartRevision: () => void;
  onRevisionModuleSelect?: (moduleId: RevisionModuleId) => void;
};

// 6 revision modules — Common Mistakes is highlighted as key
const RECOMMENDED_MODULE_ID: RevisionModuleId = 'common-mistakes';

const REVISION_MODULES: { id: RevisionModuleId; label: string; description: string; icon: React.ReactNode }[] = [
  { id: 'snapshot-summary', label: 'Snapshot Summary', description: '5–7 bullets. Core idea, key rule, when to use what.', icon: <FileText className="w-5 h-5" /> },
  { id: 'formula-rules', label: 'Formula & Rules Sheet', description: 'Exam-ready reference: formulas, definitions, conditions, units.', icon: <Calculator className="w-5 h-5" /> },
  { id: 'common-mistakes', label: 'Common Mistakes & Traps', description: 'Don’t do this → Do this instead. Where students usually mess up.', icon: <AlertTriangle className="w-5 h-5" /> },
  { id: 'quick-recall', label: 'Quick Recall Prompts', description: 'Light recall only. No scoring. Hints always allowed.', icon: <Lightbulb className="w-5 h-5" /> },
  { id: 'visual-map', label: 'Visual Memory Map', description: 'One visual anchor: diagram, flowchart, or graph.', icon: <ImageIcon className="w-5 h-5" /> },
  { id: 'exam-focus', label: 'Exam Focus Notes', description: 'Typical question formats, mark hints. 2–3 bullets.', icon: <Target className="w-5 h-5" /> },
];

export function RevisionFirstView({
  selection,
  onSelectionChange,
  onStartRevision,
  onRevisionModuleSelect,
}: RevisionFirstViewProps) {
  const { subjectId, chapterId, topicId } = selection;
  const hasTopicSelected = Boolean(subjectId && chapterId && topicId);

  const handleModuleClick = (moduleId: RevisionModuleId) => {
    if (!hasTopicSelected) return;
    if (onRevisionModuleSelect) {
      onRevisionModuleSelect(moduleId);
    } else {
      onStartRevision();
    }
  };

  return (
    <TooltipProvider>
      <div className="w-full flex flex-col gap-3 min-h-[calc(100vh-7rem)]">
        <ContextSelectionBar selection={selection} onSelectionChange={onSelectionChange} />

        {hasTopicSelected && (
          <p className="text-xs text-gray-500 -mt-1 shrink-0">Suggested start: Snapshot Summary</p>
        )}

        {/* 3×2 grid: 6 revision modules — fill the box with slight edge gaps, equal-height rows */}
        <div className="flex-1 min-h-0 w-full flex flex-col px-3 sm:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-[1fr_1fr] gap-4 flex-1 min-h-0 w-full max-w-full items-stretch">
            {REVISION_MODULES.map((module) => {
              const disabled = !hasTopicSelected;
              const isRecommended = module.id === RECOMMENDED_MODULE_ID && !disabled;
              const card = (
                <Card
                  role="button"
                  tabIndex={disabled ? -1 : 0}
                  onClick={() => handleModuleClick(module.id)}
                  onKeyDown={(e) => {
                    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleModuleClick(module.id);
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
                      {module.icon}
                    </div>
                    <div className="flex items-center justify-center gap-1.5 flex-wrap min-h-0">
                      <h3 className="text-xs font-semibold text-gray-900 leading-tight line-clamp-1">{module.label}</h3>
                      {isRecommended && (
                        <span className="text-[9px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-md shrink-0">
                          Key
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-snug">{module.description}</p>
                  </CardContent>
                </Card>
              );
              return (
                <div key={module.id} className="min-h-0 h-full flex flex-col">
                  {disabled ? (
                    <Tooltip className="h-full flex flex-col">
                      <TooltipTrigger asChild className="flex-1 min-h-0 flex flex-col h-full">
                        {card}
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[260px]" sideOffset={8}>
                        Select a topic to start revision
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

        {/* Recently Studied Chapters — same as Practice */}
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
