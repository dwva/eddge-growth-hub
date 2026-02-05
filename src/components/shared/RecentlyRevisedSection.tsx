/**
 * Recently Revised — topic-level resume cards.
 * "What you were doing" — no progress bars, no analytics. One click to resume.
 */

import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { recentlyRevisedTopics } from '@/data/mockData';

type RecentlyRevisedSectionProps = {
  onResume: (subjectId: string, chapterId: string, topicId: string) => void;
  className?: string;
};

export function RecentlyRevisedSection({ onResume, className }: RecentlyRevisedSectionProps) {
  if (recentlyRevisedTopics.length === 0) return null;

  return (
    <section className={cn('pt-6 border-t border-gray-100', className)}>
      <div className="mb-3">
        <h3 className="text-base font-semibold text-gray-900">Recently Revised</h3>
        <p className="text-xs text-gray-500 mt-0.5">Jump back into what you practiced recently</p>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
        {recentlyRevisedTopics.map((item, index) => (
          <button
            key={`${item.chapterId}-${item.topicId}-${index}`}
            type="button"
            onClick={() => onResume(item.subjectId, item.chapterId, item.topicId)}
            className="flex-shrink-0 w-[220px] min-w-[220px] p-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors text-left group"
          >
            <p className="text-sm font-semibold text-gray-900 truncate">{item.topicName}</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              {item.chapterName} · {item.subjectName}
            </p>
            <div className="flex items-center justify-between mt-2.5">
              <span className="text-[11px] text-gray-400">{item.practiceType}</span>
              <span className="text-[11px] text-gray-400">{item.lastRevised}</span>
            </div>
            <div className="flex items-center gap-1 mt-1.5 text-primary">
              <span className="text-xs font-medium">Continue</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
