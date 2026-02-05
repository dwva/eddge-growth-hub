import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, FileText, Target, Play } from 'lucide-react';
import {
  subjects,
  chapters,
  learningTopics,
  recentlyRevisedTopics,
  type LearningTopic,
} from '@/data/mockData';
import { cn } from '@/lib/utils';

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

function getChaptersForSubject(subjectId: string) {
  return chapters[subjectId] ?? [];
}

function getTopicsForChapter(subjectId: string, chapterId: string): LearningTopic[] {
  return learningTopics[`${subjectId}-${chapterId}`] ?? [];
}

export function PracticeSelectionView({
  selection,
  onSelectionChange,
  onStartPractice,
}: PracticeSelectionViewProps) {
  const { subjectId, chapterId, topicId } = selection;
  const chapterList = subjectId ? getChaptersForSubject(subjectId) : [];
  const topicList = subjectId && chapterId ? getTopicsForChapter(subjectId, chapterId) : [];
  const canStart = Boolean(subjectId && chapterId && topicId);

  return (
    <div className="w-full flex flex-col gap-6 min-h-[calc(100vh-8rem)]">
      {/* Three widgets - full width, stretch to fill space above Recently Studied */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full flex-1 min-h-[55vh]">
        {/* Subjects */}
        <Card className="shadow-sm flex flex-col min-h-full">
          <CardContent className="p-5 flex flex-col flex-1 min-h-0">
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-900">Subjects</h3>
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto min-h-0">
              {subjects.map((s) => {
                const count = chapters[s.id]?.length ?? 0;
                const isSelected = subjectId === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() =>
                      onSelectionChange({
                        subjectId: s.id,
                        chapterId: '',
                        topicId: '',
                      })
                    }
                    className={cn(
                      'p-3 rounded-lg border cursor-pointer transition-all shrink-0',
                      isSelected
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    )}
                  >
                    <p className="font-medium text-sm text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-500">
                      {count} chapter{count !== 1 ? 's' : ''}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Chapters */}
        <Card className="shadow-sm flex flex-col min-h-full">
          <CardContent className="p-5 flex flex-col flex-1 min-h-0">
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-900">Chapters</h3>
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto min-h-0 flex flex-col">
              {!subjectId ? (
                <p className="text-sm text-gray-400 py-8 text-center flex-1 flex items-center justify-center">
                  Select a subject first.
                </p>
              ) : chapterList.length === 0 ? (
                <p className="text-sm text-gray-400 py-8 text-center flex-1 flex items-center justify-center">
                  No chapters available.
                </p>
              ) : (
                chapterList.map((c) => {
                  const topicCount = getTopicsForChapter(subjectId, c.id).length;
                  const isSelected = chapterId === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() =>
                        onSelectionChange({
                          chapterId: c.id,
                          topicId: '',
                        })
                      }
                      className={cn(
                        'p-3 rounded-lg border cursor-pointer transition-all shrink-0',
                        isSelected
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      )}
                    >
                      <p className="font-medium text-sm text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-500">
                        {topicCount} topic{topicCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Topics */}
        <Card className="shadow-sm flex flex-col min-h-full">
          <CardContent className="p-5 flex flex-col flex-1 min-h-0">
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-900">Topics</h3>
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto min-h-0">
              {!subjectId || !chapterId ? (
                <p className="text-sm text-gray-400 py-8 text-center">Select a chapter first.</p>
              ) : topicList.length === 0 ? (
                <p className="text-sm text-gray-400 py-8 text-center">No topics in this chapter.</p>
              ) : (
                topicList.map((t) => {
                  const isSelected = topicId === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => onSelectionChange({ topicId: t.id })}
                      className={cn(
                        'p-3 rounded-lg border cursor-pointer transition-all shrink-0',
                        isSelected
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-gray-900">{t.name}</p>
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
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{t.description}</p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Start Practice - full width, only when topic selected */}
      {canStart && (
        <div className="w-full flex justify-center shrink-0">
          <Button
            onClick={onStartPractice}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Practice
          </Button>
        </div>
      )}

      {/* Recently Revised – topic-level with practice type, scrollable */}
      <Card className="w-full shrink-0 shadow-sm">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm text-gray-900">Recently Revised</h3>
          </div>
          <div className="max-h-[200px] overflow-y-auto overflow-x-hidden rounded border border-gray-200 pr-1">
            <div className="space-y-1">
              {recentlyRevisedTopics.map((item, index) => (
                <div
                  key={`${item.chapterId}-${item.topicId}-${index}`}
                  onClick={() =>
                    onSelectionChange({
                      subjectId: item.subjectId,
                      chapterId: item.chapterId,
                      topicId: item.topicId,
                    })
                  }
                  className="py-2 px-3 rounded border border-gray-100 bg-white hover:border-primary/30 hover:bg-primary/5 cursor-pointer transition-colors text-left"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-xs text-gray-900 truncate">{item.chapterName}</p>
                    <span className="text-[10px] text-gray-400 shrink-0">{item.lastRevised}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 truncate">{item.subjectName} · {item.topicName}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                      {item.practiceType}
                    </span>
                    <span className="text-[10px] text-gray-500">{item.topicsCompleted}/{item.topicsTotal} topics</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
