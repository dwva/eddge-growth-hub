import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type HomeworkStatus = 'pending' | 'submitted' | 'graded' | 'overdue';

export interface HomeworkCardProps {
  id: string;
  title: string;
  subject: string;
  status: HomeworkStatus;
  dueDate: string;
  /** Precomputed relative due label, e.g. "Due tomorrow", "Overdue by 2 days" */
  dueLabel: string;
  /** Optional: used to visually emphasize urgency on overdue cards */
  isOverdue?: boolean;
  onOpenDetails: () => void;
}

// Map subjects to EDDGE brand colors for the left strip
const getSubjectColor = (subject: string) => {
  switch (subject) {
    case 'Mathematics':
      return 'bg-blue-500';
    case 'Science':
      return 'bg-purple-500';
    case 'English':
      return 'bg-pink-500';
    case 'History':
      return 'bg-amber-500';
    case 'Geography':
      return 'bg-teal-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusChipStyles = (status: HomeworkStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-amber-100 text-amber-700';
    case 'submitted':
      return 'bg-blue-100 text-blue-700';
    case 'graded':
      return 'bg-green-100 text-green-700';
    case 'overdue':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// Lightweight, single-responsibility card focused on "what this homework is" and "when it's due"
export const HomeworkCard = ({
  id,
  title,
  subject,
  status,
  dueDate,
  dueLabel,
  isOverdue,
  onOpenDetails,
}: HomeworkCardProps) => {
  return (
    <button
      type="button"
      onClick={onOpenDetails}
      className={cn(
        'w-full text-left rounded-xl border bg-background shadow-sm hover:shadow-md hover:-translate-y-[1px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        isOverdue && 'border-red-300 ring-1 ring-red-200 bg-red-50/40'
      )}
      aria-label={`Open details for ${title}`}
    >
      <div className="flex">
        {/* Subject color strip on the left, matching Google Classroom mental model */}
        <div
          className={cn(
            'w-1.5 rounded-l-xl',
            getSubjectColor(subject),
            isOverdue && 'animate-pulse'
          )}
        />

        <div className="flex-1 p-4 flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-sm md:text-base truncate">{title}</h3>
            <Badge
              className={cn(
                'text-[11px] font-medium capitalize',
                getStatusChipStyles(status)
              )}
            >
              {status}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="font-medium">{subject}</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{dueLabel}</span>
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default HomeworkCard;

