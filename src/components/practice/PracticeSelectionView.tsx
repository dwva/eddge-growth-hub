import { CurriculumSelector3Col } from '@/components/shared/CurriculumSelector3Col';
import { RecentlyStudiedChaptersGrid } from '@/components/shared/RecentlyStudiedChaptersGrid';

export type PracticeSelection = {
  subjectId: string;
  chapterId: string;
  topicId: string;
};

type PracticeSelectionViewProps = {
  selection: PracticeSelection;
  onSelectionChange: (next: Partial<PracticeSelection>) => void;
  onStartPractice: () => void;
};

export function PracticeSelectionView({
  selection,
  onSelectionChange,
  onStartPractice,
}: PracticeSelectionViewProps) {
  return (
    <div className="w-full flex flex-col gap-6 min-h-[calc(100vh-8rem)]">
      <CurriculumSelector3Col
        selection={selection}
        onSelectionChange={onSelectionChange}
        subjectSubtitle={(s) => `${s.chapters ?? 0} chapter${(s.chapters ?? 0) !== 1 ? 's' : ''}`}
        onTopicSelected={() => onStartPractice()}
      />

      <RecentlyStudiedChaptersGrid
        onPickChapter={(subjectId, chapterId) =>
          onSelectionChange({ subjectId, chapterId, topicId: '' })
        }
      />
    </div>
  );
}
