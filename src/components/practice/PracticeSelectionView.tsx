import { PracticeCurriculumFilters } from '@/components/practice/PracticeCurriculumFilters';
import {
  PracticeTypeSelectionView,
  type PracticeType,
} from '@/components/practice/PracticeTypeSelectionView';
import { subjects, chapters, learningTopics } from '@/data/mockData';

export type PracticeSelection = {
  subjectId: string;
  chapterId: string;
  topicId: string;
};

type PracticeSelectionViewProps = {
  selection: PracticeSelection;
  onSelectionChange: (next: Partial<PracticeSelection>) => void;
  onPracticeTypeSelect: (type: PracticeType) => void;
};

function getSubjectName(subjectId: string) {
  return subjects.find((s) => s.id === subjectId)?.name ?? '';
}

function getChapterName(subjectId: string, chapterId: string) {
  return chapters[subjectId]?.find((c) => c.id === chapterId)?.name ?? '';
}

function getTopicName(subjectId: string, chapterId: string, topicId: string) {
  return learningTopics[`${subjectId}-${chapterId}`]?.find((t) => t.id === topicId)?.name ?? '';
}

export function PracticeSelectionView({
  selection,
  onSelectionChange,
  onPracticeTypeSelect,
}: PracticeSelectionViewProps) {
  const { subjectId, chapterId, topicId } = selection;
  const hasTopicSelected = Boolean(subjectId && chapterId && topicId);
  const subjectName = getSubjectName(subjectId);
  const chapterName = getChapterName(subjectId, chapterId);
  const topicName = getTopicName(subjectId, chapterId, topicId);

  return (
    <div className="w-full flex flex-col gap-8 min-h-[calc(100vh-8rem)] bg-gray-100/60 rounded-2xl p-6">
      <PracticeCurriculumFilters
        selection={selection}
        onSelectionChange={onSelectionChange}
        subjectSubtitle={(s) => `${s.chapters ?? 0} chapter${(s.chapters ?? 0) !== 1 ? 's' : ''}`}
        onTopicSelected={undefined}
      />

      {hasTopicSelected && (
        <div className="w-full">
          <PracticeTypeSelectionView
            subjectName={subjectName}
            chapterName={chapterName}
            topicName={topicName}
            onSelectType={onPracticeTypeSelect}
          />
        </div>
      )}
    </div>
  );
}
