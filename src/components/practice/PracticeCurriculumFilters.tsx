import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { subjects, chapters, learningTopics, type LearningTopic } from '@/data/mockData';

export type PracticeCurriculumSelection = {
  subjectId: string;
  chapterId: string;
  topicId: string;
};

type Subject = (typeof subjects)[number];

type PracticeCurriculumFiltersProps = {
  selection: PracticeCurriculumSelection;
  onSelectionChange: (next: Partial<PracticeCurriculumSelection>) => void;
  subjectSubtitle?: (subject: Subject) => string;
  onTopicSelected?: (topicId: string) => void;
};

function getChaptersForSubject(subjectId: string) {
  return chapters[subjectId] ?? [];
}

function getTopicsForChapter(subjectId: string, chapterId: string): LearningTopic[] {
  return learningTopics[`${subjectId}-${chapterId}`] ?? [];
}

export function PracticeCurriculumFilters({
  selection,
  onSelectionChange,
  subjectSubtitle,
  onTopicSelected,
}: PracticeCurriculumFiltersProps) {
  const { subjectId, chapterId, topicId } = selection;
  const chapterList = subjectId ? getChaptersForSubject(subjectId) : [];
  const topicList = subjectId && chapterId ? getTopicsForChapter(subjectId, chapterId) : [];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full min-h-[50vh]">
        {/* Subject card */}
        <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col overflow-hidden">
          <CardContent className="p-5 flex flex-col flex-1 min-h-0">
            <div className="flex items-center gap-3 mb-4 shrink-0">
              <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Subject</p>
                <p className="text-sm font-semibold text-gray-900">Filter by subject</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto min-h-[200px] rounded-lg border border-gray-100 bg-white">
              <div className="p-2 space-y-0.5">
                {subjects.map((s) => {
                  const fallbackCount = chapters[s.id]?.length ?? 0;
                  const subtitle =
                    subjectSubtitle?.(s) ?? `${fallbackCount} chapter${fallbackCount !== 1 ? 's' : ''}`;
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
                        'w-full px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer',
                        isSelected ? 'bg-purple-100 border border-purple-200 text-purple-900' : 'hover:bg-gray-50 border border-transparent'
                      )}
                    >
                      <p className="font-medium text-gray-900 text-sm">
                        {s.name} <span className="text-gray-500 font-normal">({subtitle})</span>
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chapter card */}
        <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col overflow-hidden">
          <CardContent className="p-5 flex flex-col flex-1 min-h-0">
            <div className="flex items-center gap-3 mb-4 shrink-0">
              <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Chapter</p>
                <p className="text-sm font-semibold text-gray-900">Filter by chapter</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto min-h-[200px] rounded-lg border border-gray-100 bg-white">
              {!subjectId ? (
                <div className="h-full min-h-[200px] flex items-center justify-center">
                  <p className="text-sm text-gray-400 text-center px-4">Select a subject first</p>
                </div>
              ) : chapterList.length === 0 ? (
                <div className="h-full min-h-[200px] flex items-center justify-center">
                  <p className="text-sm text-gray-400 text-center px-4">No chapters available</p>
                </div>
              ) : (
                <div className="w-full p-2 space-y-0.5">
                  {chapterList.map((c) => {
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
                          'w-full px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer',
                          isSelected ? 'bg-purple-100 border border-purple-200 text-purple-900' : 'hover:bg-gray-50 border border-transparent'
                        )}
                      >
                        <p className="font-medium text-gray-900 text-sm">
                          {c.name}{' '}
                          <span className="text-gray-500 font-normal">
                            ({topicCount} topic{topicCount !== 1 ? 's' : ''})
                          </span>
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Topic card */}
        <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col overflow-hidden">
          <CardContent className="p-5 flex flex-col flex-1 min-h-0">
            <div className="flex items-center gap-3 mb-4 shrink-0">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Topic</p>
                <p className="text-sm font-semibold text-gray-900">Filter by topic</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto min-h-[200px] rounded-lg border border-gray-100 bg-white">
              {!subjectId || !chapterId ? (
                <div className="h-full min-h-[200px] flex items-center justify-center">
                  <p className="text-sm text-gray-400 text-center px-4">Select a chapter first</p>
                </div>
              ) : topicList.length === 0 ? (
                <div className="h-full min-h-[200px] flex items-center justify-center">
                  <p className="text-sm text-gray-400 text-center px-4">No topics in this chapter</p>
                </div>
              ) : (
                <div className="w-full p-2 space-y-0.5">
                  {topicList.map((t) => {
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
                          'w-full px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer',
                          isSelected ? 'bg-green-100 border border-green-200 text-green-900' : 'hover:bg-gray-50 border border-transparent'
                        )}
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-gray-900 text-sm">{t.name}</p>
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
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{t.description}</p>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
