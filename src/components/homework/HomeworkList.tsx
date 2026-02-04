import { useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { HomeworkCard, HomeworkStatus } from './HomeworkCard';

export interface HomeworkListItem {
  id: string;
  title: string;
  subject: string;
  status: HomeworkStatus;
  dueDate: string;
}

export interface HomeworkListProps {
  items: HomeworkListItem[];
  onOpenAssignment: (id: string) => void;
}

const getRelativeDueLabel = (dueDate: string, status: HomeworkStatus) => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffDays = Math.ceil(
    (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  // For graded assignments we still show when it was due, but in a calmer way
  if (status === 'graded') {
    if (diffDays < 0) {
      return 'Was due ' + Math.abs(diffDays) + ' day' + (Math.abs(diffDays) === 1 ? '' : 's') + ' ago';
    }
    if (diffDays === 0) return 'Was due today';
    if (diffDays === 1) return 'Was due tomorrow';
    return `Was due in ${diffDays} days`;
  }

  if (diffDays < 0) {
    const daysOverdue = Math.abs(diffDays);
    return `Overdue by ${daysOverdue} day${daysOverdue === 1 ? '' : 's'}`;
  }

  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  return `Due in ${diffDays} days`;
};

// Level 1 view: focused list of homework cards, no submission or feedback to keep cognitive load low.
export const HomeworkList = ({ items, onOpenAssignment }: HomeworkListProps) => {
  const [activeTab, setActiveTab] = useState<HomeworkStatus>('pending');

  const counts = useMemo(
    () =>
      items.reduce(
        (acc, item) => {
          acc[item.status] += 1;
          return acc;
        },
        { pending: 0, submitted: 0, graded: 0, overdue: 0 } as Record<HomeworkStatus, number>
      ),
    [items]
  );

  const filteredItems = useMemo(() => {
    if (!activeTab) return items;
    return items.filter((item) => item.status === activeTab);
  }, [items, activeTab]);

  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as HomeworkStatus)
        }
        className="space-y-4"
      >
        <TabsList className="w-full justify-start overflow-x-auto rounded-full px-1 py-0.5">
          {/* Default tab = Pending, mirroring Google Classroom "To-do" mental model */}
          <TabsTrigger value="pending" className="gap-1 rounded-full px-3 py-1 text-xs md:text-sm">
            Pending
            <Badge variant="secondary" className="ml-1 h-5 rounded-full px-1.5 text-[10px]">
              {counts.pending}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="submitted" className="gap-1 rounded-full px-3 py-1 text-xs md:text-sm">
            Submitted
            <Badge variant="secondary" className="ml-1 h-5 rounded-full px-1.5 text-[10px]">
              {counts.submitted}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="graded" className="gap-1 rounded-full px-3 py-1 text-xs md:text-sm">
            Graded
            <Badge variant="secondary" className="ml-1 h-5 rounded-full px-1.5 text-[10px]">
              {counts.graded}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="overdue" className="gap-1 rounded-full px-3 py-1 text-xs md:text-sm">
            Overdue
            <Badge variant="secondary" className="ml-1 h-5 rounded-full px-1.5 text-[10px]">
              {counts.overdue}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-sm font-medium mb-1">No homework here</h3>
              <p className="text-xs text-muted-foreground">
                You don&apos;t have any {activeTab} homework right now.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <HomeworkCard
                key={item.id}
                id={item.id}
                title={item.title}
                subject={item.subject}
                status={item.status}
                dueDate={item.dueDate}
                dueLabel={getRelativeDueLabel(item.dueDate, item.status)}
                isOverdue={item.status === 'overdue'}
                onOpenDetails={() => onOpenAssignment(item.id)}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomeworkList;

