import { useState } from 'react';
import ParentDashboardLayout from '@/components/layout/ParentDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { homeworkList } from '@/data/parentMockData';
import { useLanguage } from '@/contexts/LanguageContext';
import { BookOpen } from 'lucide-react';

const ParentHomeworkContent = () => {
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const subjectColors: Record<string, string> = {
    'Mathematics': 'bg-blue-100 text-blue-700',
    'Science': 'bg-purple-100 text-purple-700',
    'English': 'bg-pink-100 text-pink-700',
    'History': 'bg-amber-100 text-amber-700',
    'Geography': 'bg-teal-100 text-teal-700',
  };

  return (
    <div className="space-y-3 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold">{t('nav.homework')}</h1>
        <p className="text-muted-foreground">View your child's homework assignments</p>
      </div>

      {/* Homework list */}
      {homeworkList.length > 0 ? (
        <div className="space-y-3 text-xs">
          {homeworkList.map((homework) => {
            const isExpanded = expandedId === homework.id;
            return (
              <Card
                key={homework.id}
                className="hover:shadow-md transition-shadow text-xs cursor-pointer"
                onClick={() =>
                  setExpandedId((prev) => (prev === homework.id ? null : homework.id))
                }
              >
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2">
                    <div>
                      <h3 className="font-semibold text-sm">{homework.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-[11px]">
                        <Badge className={subjectColors[homework.subject] || 'bg-gray-100 text-gray-700'}>
                          {homework.subject}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{homework.teacher}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {homework.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                      <span>Assigned: {homework.assignedDate}</span>
                      <span>Due: {homework.dueDate}</span>
                    </div>
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t text-[11px] text-muted-foreground space-y-1">
                        <p>
                          <span className="font-medium text-gray-700">What your child needs to do:</span>{' '}
                          {homework.description}.
                        </p>
                        <p>
                          This homework was given on <span className="font-medium">{homework.assignedDate}</span>{' '}
                          and is due on <span className="font-medium">{homework.dueDate}</span>. Current status:{' '}
                          <span className="font-medium">
                            {homework.status === 'pending' ? 'Pending' : 'Completed'}
                          </span>
                          .
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No homework assignments</h3>
            <p className="text-muted-foreground mt-1">
              There are currently no homework assignments available.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const ParentHomework = () => {
  return (
    <ParentDashboardLayout>
      <ParentHomeworkContent />
    </ParentDashboardLayout>
  );
};

export default ParentHomework;
