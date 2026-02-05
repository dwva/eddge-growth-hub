/**
 * EDDGE Revision — Context bar + single primary action.
 * No multi-column panels; compact selection then Start revision.
 */

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { ContextSelectionBar } from '@/components/shared/ContextSelectionBar';
import { RecentlyRevisedList } from '@/components/shared/RecentlyRevisedList';

export type RevisionSelection = {
  subjectId: string;
  chapterId: string;
  topicId: string;
};

type RevisionFirstViewProps = {
  selection: RevisionSelection;
  onSelectionChange: (next: Partial<RevisionSelection>) => void;
  onStartRevision: () => void;
};

export function RevisionFirstView({
  selection,
  onSelectionChange,
  onStartRevision,
}: RevisionFirstViewProps) {
  const { subjectId, chapterId, topicId } = selection;
  const hasTopicSelected = Boolean(subjectId && chapterId && topicId);

  return (
    <div className="w-full flex flex-col gap-6 min-h-[calc(100vh-8rem)]">
      <ContextSelectionBar selection={selection} onSelectionChange={onSelectionChange} />

      {/* Primary action — Start revision */}
      <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <CardContent className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Start revision</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {hasTopicSelected
                  ? 'Revise this topic with spaced repetition and practice.'
                  : 'Select a subject, chapter and topic above to begin.'}
              </p>
            </div>
          </div>
          <Button
            size="lg"
            onClick={onStartRevision}
            disabled={!hasTopicSelected}
            className="shrink-0"
          >
            Start revision
          </Button>
        </CardContent>
      </Card>

      <RecentlyRevisedList
        onPickTopic={(sId, cId, tId) => onSelectionChange({ subjectId: sId, chapterId: cId, topicId: tId })}
      />
    </div>
  );
}
