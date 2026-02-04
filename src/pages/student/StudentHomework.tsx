import { useMemo, useState } from 'react';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle2, AlertCircle, Upload } from 'lucide-react';
import { HomeworkList } from '@/components/homework/HomeworkList';
import { AssignmentDetail } from '@/components/homework/AssignmentDetail';
import type { HomeworkStatus } from '@/components/homework/HomeworkCard';

// Mock homework data – kept local to avoid API coupling while we refine UX.
const initialHomework = [
  {
    id: '1',
    title: 'Chapter 5 - Quadratic Equations Problems',
    subject: 'Mathematics',
    teacher: 'Mr. Sharma',
    assignedDate: '2026-02-01',
    dueDate: '2026-02-05',
    status: 'pending' as HomeworkStatus,
    description: 'Solve all exercises from page 45-48. Show complete working.',
    attachments: 1,
  },
  {
    id: '2',
    title: 'Essay on Climate Change',
    subject: 'English',
    teacher: 'Ms. Johnson',
    assignedDate: '2026-01-30',
    dueDate: '2026-02-04',
    status: 'submitted' as HomeworkStatus,
    description: 'Write a 500-word essay on the effects of climate change.',
    attachments: 0,
    submittedDate: '2026-02-03',
  },
  {
    id: '3',
    title: 'Newton\'s Laws Lab Report',
    subject: 'Science',
    teacher: 'Dr. Patel',
    assignedDate: '2026-01-28',
    dueDate: '2026-02-03',
    status: 'graded' as HomeworkStatus,
    description: 'Submit the lab report with observations and conclusions.',
    attachments: 2,
    submittedDate: '2026-02-02',
    grade: 'A',
    feedback: 'Excellent work! Clear observations and well-structured conclusions.',
  },
  {
    id: '4',
    title: 'History Chapter Summary',
    subject: 'History',
    teacher: 'Mrs. Williams',
    assignedDate: '2026-02-02',
    dueDate: '2026-02-08',
    status: 'pending' as HomeworkStatus,
    description: 'Write a summary of Chapter 4 - Industrial Revolution.',
    attachments: 0,
  },
  {
    id: '5',
    title: 'Geography Map Work',
    subject: 'Geography',
    teacher: 'Mr. Kumar',
    assignedDate: '2026-01-25',
    dueDate: '2026-02-01',
    status: 'overdue' as HomeworkStatus,
    description: 'Mark and label all major rivers of India on the outline map.',
    attachments: 1,
  },
];

const getHomeworkStats = (items: typeof initialHomework) => ({
  pending: items.filter((h) => h.status === 'pending').length,
  submitted: items.filter((h) => h.status === 'submitted').length,
  graded: items.filter((h) => h.status === 'graded').length,
  overdue: items.filter((h) => h.status === 'overdue').length,
});

const StudentHomework = () => {
  const [homework, setHomework] = useState(initialHomework);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

  const homeworkStats = useMemo(() => getHomeworkStats(homework), [homework]);

  const selectedAssignment = useMemo(
    () => homework.find((h) => h.id === selectedAssignmentId) || null,
    [homework, selectedAssignmentId]
  );

  const handleOpenAssignment = (id: string) => {
    setSelectedAssignmentId(id);
  };

  const handleBackToList = () => {
    setSelectedAssignmentId(null);
  };

  const handleSubmitUpdate = (payload: { isLate: boolean }) => {
    // Update local state to reflect a submit/late submit without touching routes or global state.
    setHomework((prev) =>
      prev.map((item) =>
        item.id === selectedAssignmentId
          ? {
              ...item,
              status: payload.isLate ? ('overdue' as HomeworkStatus) : ('submitted' as HomeworkStatus),
              submittedDate: new Date().toISOString(),
            }
          : item
      )
    );
  };

  return (
    <StudentDashboardLayout title="Homework">
      <div className="space-y-6">
        {/* Stats Overview – light orientation only, no interaction */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          <Card className="py-1 md:py-2">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-semibold">{homeworkStats.pending}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="py-1 md:py-2">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Upload className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-semibold">{homeworkStats.submitted}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Submitted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="py-1 md:py-2">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-semibold">{homeworkStats.graded}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Graded</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="py-1 md:py-2">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-semibold">{homeworkStats.overdue}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Overdue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Level 1 vs Level 2 – list or single-assignment detail */}
        {!selectedAssignment && (
          <HomeworkList
            items={homework.map((h) => ({
              id: h.id,
              title: h.title,
              subject: h.subject,
              status: h.status,
              dueDate: h.dueDate,
            }))}
            onOpenAssignment={handleOpenAssignment}
          />
        )}

        {selectedAssignment && (
          <AssignmentDetail
            id={selectedAssignment.id}
            title={selectedAssignment.title}
            subject={selectedAssignment.subject}
            teacher={selectedAssignment.teacher}
            dueDate={selectedAssignment.dueDate}
            status={selectedAssignment.status}
            description={selectedAssignment.description}
            attachments={
              selectedAssignment.attachments
                ? [
                    {
                      id: 'teacher-attachment',
                      name: `${selectedAssignment.title}.pdf`,
                      type: 'pdf',
                    },
                  ]
                : []
            }
            submittedFiles={
              selectedAssignment.submittedDate
                ? [
                    {
                      id: 'submitted-file',
                      name: `${selectedAssignment.title}-solution.pdf`,
                      submittedAt: selectedAssignment.submittedDate,
                    },
                  ]
                : []
            }
            grade={selectedAssignment.grade}
            feedback={selectedAssignment.feedback}
            onBackToList={handleBackToList}
            onSubmit={handleSubmitUpdate}
          />
        )}
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentHomework;
