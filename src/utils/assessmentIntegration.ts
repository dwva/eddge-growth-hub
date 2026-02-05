// Integration utilities for Assessments <-> AI Tools <-> Assigned Work Tracker

import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

export interface AssessmentIntegration {
  // Save from AI Tools to Assessments
  saveGeneratedAsAssessment: (questions: any[], metadata: any) => void;
  
  // Open AI Tools from Assessments
  openAIToolsFromAssessment: (assessmentId?: string, existingQuestions?: any[]) => void;
  
  // Link to Assigned Work Tracker
  viewSubmissions: (assessmentId: string) => void;
  evaluateSubmissions: (assessmentId: string) => void;
  
  // Publish results and sync to analytics
  publishResults: (assessmentId: string, results: any[]) => void;
}

export const useAssessmentIntegration = (): AssessmentIntegration => {
  const navigate = useNavigate();
  const location = useLocation();

  const saveGeneratedAsAssessment = (questions: any[], metadata: any) => {
    navigate('/teacher/assessments', {
      state: {
        fromAITools: true,
        questions,
        subject: metadata.subject,
        chapter: metadata.chapter,
        topic: metadata.topic,
      }
    });
    toast.success('Questions ready for assessment creation');
  };

  const openAIToolsFromAssessment = (assessmentId?: string, existingQuestions?: any[]) => {
    navigate('/teacher/ai-tools', {
      state: {
        returnTo: 'assessments',
        assessmentId,
        existingQuestions,
      }
    });
  };

  const viewSubmissions = (assessmentId: string) => {
    navigate(`/teacher/assigned-work?filter=${assessmentId}`);
  };

  const evaluateSubmissions = (assessmentId: string) => {
    navigate(`/teacher/assigned-work/${assessmentId}`, {
      state: { openEvaluation: true }
    });
  };

  const publishResults = (assessmentId: string, results: any[]) => {
    // In real implementation:
    // 1. Update student profiles with marks
    // 2. Update subject analytics
    // 3. Notify parents
    // 4. Update assessment status
    
    console.log('Publishing results for assessment:', assessmentId);
    console.log('Results:', results);
    
    // Mock: Update analytics
    syncToAnalytics(assessmentId, results);
    
    toast.success('Results published and synced to analytics');
  };

  return {
    saveGeneratedAsAssessment,
    openAIToolsFromAssessment,
    viewSubmissions,
    evaluateSubmissions,
    publishResults,
  };
};

// Helper to sync marks to student profiles and analytics
const syncToAnalytics = (assessmentId: string, results: any[]) => {
  // This would update:
  // 1. teacherMockData - student profiles
  // 2. Subject analytics
  // 3. Parent dashboard data
  
  results.forEach(result => {
    console.log(`Syncing ${result.studentId}: ${result.score}/${result.totalMarks}`);
    // Update student.subjects[subject] score
    // Update chapter mastery
    // Update performance trends
  });
};

// Type guards for assessment types
export const isHomework = (type: string) => type === 'Homework';
export const isAssignment = (type: string) => type === 'Assignment';
export const isTest = (type: string) => type === 'Test' || type === 'Assessment';

export const getTypeConfig = (type: string) => {
  switch(type) {
    case 'Homework':
      return {
        allowFileUpload: true,
        requireMarks: false,
        flexibleDeadline: true,
        autoEvaluateMCQ: true,
        allowLateSubmission: true,
      };
    case 'Assignment':
      return {
        allowFileUpload: true,
        requireMarks: true,
        extendedDeadline: true,
        autoEvaluateMCQ: true,
        allowLateSubmission: true,
      };
    case 'Test':
    case 'Assessment':
      return {
        allowFileUpload: false,
        requireMarks: true,
        strictTiming: true,
        autoEvaluateMCQ: true,
        allowLateSubmission: false,
      };
    case 'Quiz':
      return {
        allowFileUpload: false,
        requireMarks: true,
        strictTiming: true,
        autoEvaluateMCQ: true,
        allowLateSubmission: false,
        quickEvaluation: true,
      };
    default:
      return {
        allowFileUpload: false,
        requireMarks: true,
        strictTiming: false,
        autoEvaluateMCQ: true,
        allowLateSubmission: false,
      };
  }
};

// Calculate statistics for assessment
export const calculateAssessmentStats = (assessment: any, submissions: any[]) => {
  const total = submissions.length;
  const submitted = submissions.filter(s => s.status === 'Submitted' || s.status === 'Evaluated').length;
  const evaluated = submissions.filter(s => s.status === 'Evaluated').length;
  const pending = submitted - evaluated;
  const notStarted = total - submitted;

  const scores = submissions
    .filter(s => s.status === 'Evaluated' && s.score !== undefined)
    .map(s => s.score);

  const avgScore = scores.length > 0 
    ? scores.reduce((a, b) => a + b, 0) / scores.length 
    : 0;

  const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

  return {
    total,
    submitted,
    evaluated,
    pending,
    notStarted,
    avgScore: Math.round(avgScore),
    highestScore,
    lowestScore,
    submissionRate: (submitted / total) * 100,
    evaluationRate: total > 0 ? (evaluated / total) * 100 : 0,
  };
};

// Validate assessment before saving
export const validateAssessment = (assessment: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!assessment.title || assessment.title.trim() === '') {
    errors.push('Assessment title is required');
  }

  if (!assessment.class) {
    errors.push('Class selection is required');
  }

  if (!assessment.questions || assessment.questions.length === 0) {
    errors.push('At least one question is required');
  }

  if (assessment.type === 'Test' || assessment.type === 'Assessment') {
    if (!assessment.duration || parseInt(assessment.duration) <= 0) {
      errors.push('Duration is required for tests and assessments');
    }
  }

  if (!assessment.dueDate) {
    errors.push('Due date is required');
  }

  const typeConfig = getTypeConfig(assessment.type);
  if (typeConfig.requireMarks) {
    const totalMarks = assessment.questions.reduce((sum: number, q: any) => sum + (q.marks || 0), 0);
    if (totalMarks === 0) {
      errors.push('Total marks must be greater than 0');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Format assessment for display
export const formatAssessmentDisplay = (assessment: any) => {
  const typeConfig = getTypeConfig(assessment.type);
  const totalMarks = assessment.questions?.reduce((sum: number, q: any) => sum + (q.marks || 0), 0) || 0;
  const questionCount = assessment.questions?.length || 0;

  return {
    ...assessment,
    displayType: assessment.type,
    displayMarks: typeConfig.requireMarks ? `${totalMarks} marks` : 'No marks',
    displayDuration: assessment.duration ? `${assessment.duration} mins` : 'No time limit',
    displayQuestions: `${questionCount} question${questionCount !== 1 ? 's' : ''}`,
    displayFeatures: [
      typeConfig.allowFileUpload && 'File upload allowed',
      typeConfig.allowLateSubmission && 'Late submission allowed',
      typeConfig.autoEvaluateMCQ && 'Auto-evaluate MCQs',
    ].filter(Boolean),
  };
};
