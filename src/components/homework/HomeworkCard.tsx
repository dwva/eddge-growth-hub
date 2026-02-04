import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type HomeworkStatus = 'pending' | 'submitted' | 'graded' | 'overdue';

export interface HomeworkCardProps {
  title: string;
  subject: string;
  classSection?: string;
  teacher?: string;
  status: HomeworkStatus;
  dueDate: string;
  /** Precomputed relative due label, e.g. "Due tomorrow", "Overdue by 2 days" */
  dueLabel: string;
  /** Optional: used to visually emphasize urgency on overdue cards */
  isOverdue?: boolean;
  onOpenDetails: () => void;
}

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

// Simple, clean outlined homework row
export const HomeworkCard = ({
  title,
  subject,
  classSection,
  teacher,
  status,
  dueLabel,
  isOverdue,
  onOpenDetails,
}: HomeworkCardProps) => {
  const teacherName = teacher || 'Teacher';
  const teacherInitials =
    teacherName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2) || 'T';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpenDetails}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenDetails();
        }
      }}
      className={cn(
        'w-full cursor-pointer rounded-xl border border-slate-200 bg-background px-4 py-3 md:px-5 md:py-4 shadow-sm transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
      )}
      aria-label={`Open details for ${title}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="font-semibold text-sm md:text-base truncate">{title}</h3>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span className="font-medium">
              {subject}
              {classSection && ` • ${classSection}`}
            </span>
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium',
                dueLabel.toLowerCase().includes('overdue')
                  ? 'bg-red-50 text-red-700'
                  : dueLabel.toLowerCase().includes('today') ||
                    dueLabel.toLowerCase().includes('tomorrow')
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-slate-50 text-slate-700'
              )}
            >
              <Calendar className="w-3 h-3" />
              <span>{dueLabel}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground">
              {teacherInitials}
            </div>
            <span className="truncate max-w-[140px] md:max-w-[200px]">
              {teacherName}
            </span>
          </div>
        </div>
        <Badge
          className={cn(
            'text-[11px] font-medium capitalize',
            getStatusChipStyles(status)
          )}
        >
          {status}
        </Badge>
      </div>
    </div>
  );
};

export default HomeworkCard;

