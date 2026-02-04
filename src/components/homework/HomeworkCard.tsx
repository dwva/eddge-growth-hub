import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type HomeworkStatus = 'pending' | 'submitted' | 'graded' | 'overdue';

export interface HomeworkCardProps {
  title: string;
  subject: string;
  classSection?: string;
  teacher?: string;
  postedAt?: string;
  shortInstructions?: string;
  status: HomeworkStatus;
  dueDate: string;
  /** Precomputed relative due label, e.g. "Due tomorrow", "Overdue by 2 days" */
  dueLabel: string;
  /** Optional: used to visually emphasize urgency on overdue cards */
  isOverdue?: boolean;
  /** Whether to render this card in a more conversational stream style */
  variant?: 'list' | 'stream';
  onOpenDetails: () => void;
}

// Neutral subject indicator – keep the strip for structure, but no strong colors.
const getSubjectColor = () => 'bg-slate-200';

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
  title,
  subject,
  classSection,
  teacher,
  postedAt,
  shortInstructions,
  status,
  dueDate,
  dueLabel,
  isOverdue,
  variant = 'list',
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
        'w-full text-left rounded-xl border bg-background shadow-sm hover:shadow-md hover:-translate-y-[1px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        isOverdue && 'border-red-300 ring-1 ring-red-200 bg-red-50/40'
      )}
      aria-label={`Open details for ${title}`}
    >
      <div className="flex">
        {/* Neutral subject strip on the left to keep structure without strong color */}
        <div
          className={cn(
            'w-1.5 rounded-l-xl',
            getSubjectColor(),
            isOverdue && 'animate-pulse'
          )}
        />

        <div className="flex-1 p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-1">
              <h3 className="font-semibold text-sm md:text-base truncate">
                {title}
              </h3>
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

          <div className="flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground">
                {teacherInitials}
              </div>
              <span className="truncate max-w-[140px] md:max-w-[200px]">
                {teacherName}
              </span>
            </div>
            {postedAt && (
              <span className="text-[10px] text-muted-foreground">
                Posted {postedAt}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeworkCard;

