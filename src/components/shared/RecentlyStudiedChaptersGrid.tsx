import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen } from 'lucide-react';
import { recentlyStudiedChapters, subjects } from '@/data/mockData';

type RecentlyStudiedChaptersGridProps = {
  onPickChapter?: (subjectId: string, chapterId: string) => void;
};

export function RecentlyStudiedChaptersGrid({ onPickChapter }: RecentlyStudiedChaptersGridProps) {
  return (
    <Card className="w-full shrink-0 rounded-2xl border border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Recently Studied Chapters</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {recentlyStudiedChapters.map((item, index) => {
            const subject = subjects.find((s) => s.name === item.subjectName);
            return (
              <button
                key={`${item.chapterId}-${index}`}
                type="button"
                onClick={() => {
                  if (subject) onPickChapter?.(subject.id, item.chapterId);
                }}
                className="p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-left"
              >
                <p className="text-base font-medium text-gray-900">{item.chapterName}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.subjectName}</p>

                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Progress</p>
                  <Progress value={item.progress} className="h-2" />
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  {item.topicsCompleted}/{item.topicsTotal} topics · Last studied {item.lastStudied}
                </p>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

