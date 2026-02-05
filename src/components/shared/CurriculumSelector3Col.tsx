import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { subjects, chapters, learningTopics, type LearningTopic } from '@/data/mockData';

export type CurriculumSelection = {
  subjectId: string;
  chapterId: string;
  topicId: string;
};

type Subject = (typeof subjects)[number];

type CurriculumSelector3ColProps = {
  selection: CurriculumSelection;
  onSelectionChange: (next: Partial<CurriculumSelection>) => void;
  subjectSubtitle?: (subject: Subject) => string;
  onTopicSelected?: (topicId: string) => void;
};

function getChaptersForSubject(subjectId: string) {
  return chapters[subjectId] ?? [];
}

function getTopicsForChapter(subjectId: string, chapterId: string): LearningTopic[] {
  return learningTopics[`${subjectId}-${chapterId}`] ?? [];
}

export function CurriculumSelector3Col({
  selection,
  onSelectionChange,
  subjectSubtitle,
  onTopicSelected,
}: CurriculumSelector3ColProps) {
  const { subjectId, chapterId, topicId } = selection;
  const chapterList = subjectId ? getChaptersForSubject(subjectId) : [];
  const topicList = subjectId && chapterId ? getTopicsForChapter(subjectId, chapterId) : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full flex-1 min-h-[55vh]">
      {/* Subjects */}
      <Card className="rounded-2xl border border-gray-200 shadow-sm flex flex-col min-h-full">
        <CardContent className="p-6 flex flex-col flex-1 min-h-0">
          <div className="flex items-center gap-2 mb-4 shrink-0">
            <BookOpen className="w-4 h-4 text-primary" />
            <h3 className="text-lg font-semibold text-gray-900">Subjects</h3>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto min-h-0">
            {subjects.map((s) => {
              const fallbackCount = chapters[s.id]?.length ?? 0;
              const subtitle =
                subjectSubtitle?.(s) ??
                `${fallbackCount} chapter${fallbackCount !== 1 ? 's' : ''}`;
              const isSelected = subjectId === s.id;

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() =>
                    onSelectionChange({
                      subjectId: s.id,
                      chapterId: '',
                      topicId: '',
                    })
                  }
                  className={cn(
                    'w-full p-4 rounded-lg border text-left transition-all',
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  )}
                >
                  <p className="font-medium text-gray-900">{s.name}</p>
                  <p className="text-sm text-gray-500">{subtitle}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chapters */}
      <Card className="rounded-2xl border border-gray-200 shadow-sm flex flex-col min-h-full">
        <CardContent className="p-6 flex flex-col flex-1 min-h-0">
          <div className="flex items-center gap-2 mb-4 shrink-0">
            <FileText className="w-4 h-4 text-primary" />
            <h3 className="text-lg font-semibold text-gray-900">Chapters</h3>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto min-h-0 flex flex-col">
            {!subjectId ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-gray-400 text-center">Select a subject first</p>
              </div>
            ) : chapterList.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-gray-400 text-center">No chapters available</p>
              </div>
            ) : (
              chapterList.map((c) => {
                const topicCount = getTopicsForChapter(subjectId, c.id).length;
                const isSelected = chapterId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() =>
                      onSelectionChange({
                        chapterId: c.id,
                        topicId: '',
                      })
                    }
                    className={cn(
                      'w-full p-4 rounded-lg border text-left transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    )}
                  >
                    <p className="font-medium text-gray-900">{c.name}</p>
                    <p className="text-sm text-gray-500">
                      {topicCount} topic{topicCount !== 1 ? 's' : ''}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Topics */}
      <Card className="rounded-2xl border border-gray-200 shadow-sm flex flex-col min-h-full">
        <CardContent className="p-6 flex flex-col flex-1 min-h-0">
          <div className="flex items-center gap-2 mb-4 shrink-0">
            <Target className="w-4 h-4 text-primary" />
            <h3 className="text-lg font-semibold text-gray-900">Topics</h3>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto min-h-0">
            {!subjectId || !chapterId ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-400 text-center">Select a chapter first</p>
              </div>
            ) : topicList.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-400 text-center">No topics in this chapter</p>
              </div>
            ) : (
              topicList.map((t) => {
                const isSelected = topicId === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      onSelectionChange({ topicId: t.id });
                      onTopicSelected?.(t.id);
                    }}
                    className={cn(
                      'w-full p-4 rounded-lg border text-left transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    )}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-gray-900">{t.name}</p>
                      {t.difficulty && (
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-xs px-2 py-0.5',
                            t.difficulty === 'easy' && 'bg-green-100 text-green-700',
                            t.difficulty === 'medium' && 'bg-amber-100 text-amber-700',
                            t.difficulty === 'hard' && 'bg-red-100 text-red-700'
                          )}
                        >
                          {t.difficulty}
                        </Badge>
                      )}
                    </div>
                    {t.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{t.description}</p>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

