import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { recentlyRevisedTopics } from '@/data/mockData';

type RecentlyRevisedListProps = {
  onPickTopic?: (subjectId: string, chapterId: string, topicId: string) => void;
  className?: string;
};

export function RecentlyRevisedList({ onPickTopic, className }: RecentlyRevisedListProps) {
  return (
    <Card className={cn('w-full shrink-0 rounded-2xl border border-gray-200 shadow-sm', className)}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Recently Revised</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {recentlyRevisedTopics.map((item, index) => (
            <button
              key={`${item.chapterId}-${item.topicId}-${index}`}
              type="button"
              onClick={() => onPickTopic?.(item.subjectId, item.chapterId, item.topicId)}
              className="p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <p className="text-base font-medium text-gray-900 truncate">{item.chapterName}</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-primary/10 text-primary shrink-0">
                  {item.practiceType}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                {item.subjectName} · {item.topicName}
              </p>

              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Progress</p>
                <Progress value={item.progress} className="h-2" />
              </div>

              <p className="text-xs text-gray-400 mt-2">
                {item.topicsCompleted}/{item.topicsTotal} topics · Last revised {item.lastRevised}
              </p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

