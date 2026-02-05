import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { recentlyRevisedTopics } from '@/data/mockData';

type RecentlyRevisedListProps = {
  onPickTopic?: (subjectId: string, chapterId: string, topicId: string) => void;
  className?: string;
  /** Section title (e.g. "Recently Studied Chapters") */
  title?: string;
};

export function RecentlyRevisedList({ onPickTopic, className, title = 'Recently Studied Chapters' }: RecentlyRevisedListProps) {
  return (
    <Card className={cn('w-full shrink-0 rounded-2xl border border-gray-200 bg-white shadow-sm', className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5 text-white" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        </div>

        <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:overflow-x-auto sm:gap-2 pb-1">
          {recentlyRevisedTopics.map((item, index) => (
            <button
              key={`${item.chapterId}-${item.topicId}-${index}`}
              type="button"
              onClick={() => onPickTopic?.(item.subjectId, item.chapterId, item.topicId)}
              className="flex-shrink-0 w-full sm:w-[160px] min-w-[140px] p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors text-left"
            >
              <p className="text-sm font-semibold text-gray-900 truncate">{item.chapterName}</p>
              <p className="text-xs text-gray-500 mt-0.5 truncate">{item.subjectName}</p>

              <div className="mt-2">
                <p className="text-[10px] text-gray-500 mb-0.5">Progress</p>
                <Progress value={item.progress} className="h-1.5 [&>div]:bg-primary" />
              </div>

              <p className="text-[10px] text-gray-400 mt-1.5">
                {item.topicsCompleted}/{item.topicsTotal} topics · {item.lastRevised}
              </p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
