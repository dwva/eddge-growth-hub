import { CurriculumSelector3Col } from '@/components/shared/CurriculumSelector3Col';
import { RecentlyRevisedList } from '@/components/shared/RecentlyRevisedList';
import {
  chapters,
} from '@/data/mockData';

export type RevisionSelection = {
  subjectId: string;
  chapterId: string;
  topicId: string;
};

type RevisionSelectionViewProps = {
  selection: RevisionSelection;
  onSelectionChange: (next: Partial<RevisionSelection>) => void;
  onStartRevision?: () => void;
};

export function RevisionSelectionView({
  selection,
  onSelectionChange,
  onStartRevision: _onStartRevision,
}: RevisionSelectionViewProps) {
  return (
    <div className="w-full flex flex-col gap-6 min-h-[calc(100vh-8rem)]">
      <CurriculumSelector3Col
        selection={selection}
        onSelectionChange={onSelectionChange}
        subjectSubtitle={(s) => {
          const count = chapters[s.id]?.length ?? 0;
          return `${count} chapter${count !== 1 ? 's' : ''}`;
        }}
      />

      <RecentlyRevisedList
        onPickTopic={(subjectId, chapterId, topicId) =>
          onSelectionChange({ subjectId, chapterId, topicId })
        }
      />
    </div>
  );
}
