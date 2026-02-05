/**
 * Compact single-row context selection: Subject → Chapter → Topic.
 * Used by Practice and Revision screens.
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { subjects, chapters, learningTopics, type LearningTopic } from '@/data/mockData';

export type ContextSelection = {
  subjectId: string;
  chapterId: string;
  topicId: string;
};

type ContextSelectionBarProps = {
  selection: ContextSelection;
  onSelectionChange: (next: Partial<ContextSelection>) => void;
  className?: string;
};

function getChaptersForSubject(subjectId: string) {
  return chapters[subjectId] ?? [];
}

function getTopicsForChapter(subjectId: string, chapterId: string): LearningTopic[] {
  return learningTopics[`${subjectId}-${chapterId}`] ?? [];
}

function getSubjectName(subjectId: string) {
  return subjects.find((s) => s.id === subjectId)?.name ?? '';
}

function getChapterName(subjectId: string, chapterId: string) {
  return chapters[subjectId]?.find((c) => c.id === chapterId)?.name ?? '';
}

function getTopicName(subjectId: string, chapterId: string, topicId: string) {
  return learningTopics[`${subjectId}-${chapterId}`]?.find((t) => t.id === topicId)?.name ?? '';
}

export function ContextSelectionBar({
  selection,
  onSelectionChange,
  className,
}: ContextSelectionBarProps) {
  const { subjectId, chapterId, topicId } = selection;
  const chapterList = subjectId ? getChaptersForSubject(subjectId) : [];
  const topicList = subjectId && chapterId ? getTopicsForChapter(subjectId, chapterId) : [];
  const hasTopicSelected = Boolean(subjectId && chapterId && topicId);

  const subjectName = getSubjectName(subjectId);
  const chapterName = getChapterName(subjectId, chapterId);
  const topicName = getTopicName(subjectId, chapterId, topicId);
  const selectedTopicMeta = topicList.find((t) => t.id === topicId);

  return (
    <div className={cn('flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3', className)}>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-medium text-gray-500 shrink-0">Subject</span>
          <Select
            value={subjectId || '__none__'}
            onValueChange={(v) => v !== '__none__' && onSelectionChange({ subjectId: v, chapterId: '', topicId: '' })}
          >
            <SelectTrigger className="w-[180px] h-9 rounded-lg border-gray-200 bg-white text-sm">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Select subject</SelectItem>
              {subjects.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-medium text-gray-500 shrink-0">Chapter</span>
          <Select
            value={chapterId || '__none__'}
            onValueChange={(v) => v !== '__none__' && onSelectionChange({ chapterId: v, topicId: '' })}
            disabled={!subjectId}
          >
            <SelectTrigger className="w-[180px] h-9 rounded-lg border-gray-200 bg-white text-sm disabled:opacity-60">
              <SelectValue placeholder="Select chapter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Select chapter</SelectItem>
              {chapterList.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-medium text-gray-500 shrink-0">Topic</span>
          <Select
            value={topicId || '__none__'}
            onValueChange={(v) => v !== '__none__' && onSelectionChange({ topicId: v })}
            disabled={!chapterId}
          >
            <SelectTrigger className="w-[200px] h-9 rounded-lg border-gray-200 bg-white text-sm disabled:opacity-60">
              <SelectValue placeholder="Select topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Select topic</SelectItem>
              {topicList.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  <span className="flex items-center gap-2">
                    {t.name}
                    {t.difficulty && (
                      <span
                        className={cn(
                          'text-[10px] px-1.5 py-0.5 rounded font-medium',
                          t.difficulty === 'easy' && 'bg-green-100 text-green-700',
                          t.difficulty === 'medium' && 'bg-amber-100 text-amber-700',
                          t.difficulty === 'hard' && 'bg-red-100 text-red-700'
                        )}
                      >
                        {t.difficulty}
                      </span>
                    )}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {hasTopicSelected && (
        <p className="text-xs text-gray-400">
          {topicName} · {chapterName} · {subjectName}
          {selectedTopicMeta?.difficulty && (
            <span className="ml-1.5 text-gray-500">({selectedTopicMeta.difficulty})</span>
          )}
        </p>
      )}
    </div>
  );
}
