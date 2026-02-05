import { useState } from 'react';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import {
  RevisionSelectionView,
  type RevisionSelection,
} from '@/components/revision/RevisionSelectionView';

const StudentRevision = () => {
  const [selection, setSelection] = useState<RevisionSelection>({
    subjectId: '',
    chapterId: '',
    topicId: '',
  });

  const handleSelectionChange = (next: Partial<RevisionSelection>) => {
    setSelection((prev) => ({ ...prev, ...next }));
  };

  const handleStartRevision = () => {
    // TODO: Navigate to revision session with selected topic
    console.log('Starting revision for:', selection);
  };

  return (
    <StudentDashboardLayout title="Revision">
      <RevisionSelectionView
        selection={selection}
        onSelectionChange={handleSelectionChange}
        onStartRevision={handleStartRevision}
      />
    </StudentDashboardLayout>
  );
};

export default StudentRevision;
