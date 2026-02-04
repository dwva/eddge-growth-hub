import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Upload, ArrowLeft, MessageCircle, Sparkles } from 'lucide-react';
import type { HomeworkStatus } from './HomeworkCard';

export interface AssignmentAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'other';
}

export interface SubmittedFile {
  id: string;
  name: string;
  submittedAt: string;
}

export interface AssignmentDetailProps {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  dueDate: string;
  status: HomeworkStatus;
  description: string;
  attachments?: AssignmentAttachment[];
  submittedFiles?: SubmittedFile[];
  grade?: string;
  feedback?: string;
  onBackToList: () => void;
  onSubmit?: (payload: { isLate: boolean }) => void;
}

const getStatusBadgeClasses = (status: HomeworkStatus) => {
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

const getPrimaryCtaLabel = (status: HomeworkStatus, isLate: boolean) => {
  if (status === 'submitted' || status === 'graded') {
    return isLate ? 'Resubmit (Late)' : 'Resubmit';
  }
  if (isLate || status === 'overdue') {
    return 'Late Submit';
  }
  return 'Submit';
};

const getTimelineProgress = (status: HomeworkStatus) => {
  switch (status) {
    case 'pending':
    case 'overdue':
      return 25;
    case 'submitted':
      return 66;
    case 'graded':
      return 100;
    default:
      return 0;
  }
};

// Level 2 view: single-assignment focus with clear hierarchy and AI-powered scaffolding.
export const AssignmentDetail = ({
  title,
  subject,
  teacher,
  dueDate,
  status,
  description,
  attachments = [],
  submittedFiles = [],
  grade,
  feedback,
  onBackToList,
  onSubmit,
}: AssignmentDetailProps) => {
  const [localSubmittedFiles, setLocalSubmittedFiles] =
    useState<SubmittedFile[]>(submittedFiles);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAiSteps, setShowAiSteps] = useState(false);

  const isLate = useMemo(() => {
    const now = new Date();
    const due = new Date(dueDate);
    return now.getTime() > due.getTime();
  }, [dueDate]);

  const primaryCtaLabel = getPrimaryCtaLabel(status, isLate);

  const handleFakeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const now = new Date().toISOString();
    const newFiles: SubmittedFile[] = Array.from(files).map((file, idx) => ({
      id: `${now}-${idx}`,
      name: file.name,
      submittedAt: now,
    }));

    setLocalSubmittedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // In a real implementation this would call an API and update global state.
    // Here we simply simulate the action to keep routing unchanged.
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit?.({ isLate });
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <button
            type="button"
            onClick={onBackToList}
            className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-3 h-3 mr-1" />
            Back to homework
          </button>
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-semibold">{title}</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              <span className="font-medium">{subject}</span>
              <span className="mx-1">•</span>
              <span>{teacher}</span>
              <span className="mx-1">•</span>
              <span>Due {new Date(dueDate).toLocaleString()}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge className={getStatusBadgeClasses(status)}>{status}</Badge>
          {grade && (
            <Badge className="bg-green-100 text-green-700 font-semibold">
              Grade: {grade}
            </Badge>
          )}
        </div>
      </div>

      {/* AI tip at top – EDDGE differentiator */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-3 p-4">
          <div className="mt-0.5 rounded-full bg-primary/10 p-2">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wide">
              AI Suggestion
            </p>
            <p className="text-sm text-muted-foreground">
              Complete this after revising <span className="font-medium">Quadratic Equations</span> so the practice problems feel easier.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Main two-column layout on desktop, single column on mobile */}
      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
        {/* Left column: instructions, attachments, timeline, feedback */}
        <div className="space-y-4">
          {/* Instructions */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              {/* Clean typography – no visual noise here */}
              <p>{description}</p>
            </CardContent>
          </Card>

          {/* Attachments */}
          {attachments.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Attachments from teacher
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-xs md:text-sm">
                        {file.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground capitalize">
                        {file.type}
                      </span>
                    </div>
                    <Button size="icon" variant="outline">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Status timeline */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {/* Simple, linear Assigned → Submitted → Graded timeline */}
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-medium">Assigned</span>
                <span>Submitted</span>
                <span>Graded</span>
              </div>
              <Progress value={getTimelineProgress(status)} className="h-2" />
              <p className="text-[11px] text-muted-foreground">
                {status === 'pending' && 'Not submitted yet.'}
                {status === 'overdue' && 'This assignment is overdue. Submitting now will be marked as late.'}
                {status === 'submitted' && 'Submitted. Waiting for teacher to grade.'}
                {status === 'graded' && 'Graded by your teacher.'}
              </p>
            </CardContent>
          </Card>

          {/* Feedback – only when graded */}
          {status === 'graded' && (feedback || grade) && (
            <Card className="border-green-200 bg-green-50/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Teacher feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {feedback && (
                  <p className="text-green-900">{feedback}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column: Your Work + AI helpers */}
        <div className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Your work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload controls – simple multi-attachment pattern */}
              <div className="space-y-2">
                <label
                  htmlFor="homework-upload"
                  className="block text-xs font-medium text-muted-foreground"
                >
                  Upload files
                </label>
                <input
                  id="homework-upload"
                  type="file"
                  multiple
                  className="block w-full text-xs text-muted-foreground file:mr-3 file:rounded-md file:border file:border-input file:bg-background file:px-3 file:py-1.5 file:text-xs file:font-medium hover:file:bg-muted"
                  onChange={handleFakeUpload}
                />
              </div>

              {/* Submitted files list */}
              {localSubmittedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Submitted files
                  </p>
                  <div className="space-y-1 max-h-40 overflow-auto rounded-md border bg-muted/40 px-3 py-2">
                    {localSubmittedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between text-[11px]"
                      >
                        <span className="truncate max-w-[60%]">{file.name}</span>
                        <span className="text-muted-foreground">
                          {new Date(file.submittedAt).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Primary CTA – one clear action at the bottom of "Your work" */}
              <Button
                className="w-full"
                disabled={isSubmitting}
                onClick={handleSubmit}
                variant={status === 'overdue' || isLate ? 'destructive' : 'default'}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Submitting…' : primaryCtaLabel}
              </Button>

              {/* Submission timestamp helper */}
              {localSubmittedFiles.length > 0 && (
                <p className="text-[11px] text-muted-foreground text-center">
                  Last submitted at{' '}
                  {new Date(
                    localSubmittedFiles[localSubmittedFiles.length - 1]
                      .submittedAt
                  ).toLocaleString()}
                  {isLate && ' (late)'}
                </p>
              )}
            </CardContent>
          </Card>

          {/* AI helpers: Need help + Break into steps */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Smart help (AI)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  // In a full implementation this would open the central AI Doubt Solver with context
                >
                  <MessageCircle className="w-4 h-4" />
                  Need help? Ask AI Doubt Solver
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start gap-2 text-xs"
                  onClick={() => setShowAiSteps((prev) => !prev)}
                >
                  <Sparkles className="w-3 h-3" />
                  Break into steps
                </Button>
              </div>

              {showAiSteps && (
                <div className="rounded-md border bg-muted/40 px-3 py-2 text-xs space-y-1">
                  {/* Static sample steps – in production this would be AI-generated */}
                  <p className="font-medium mb-1">Suggested steps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Revisit your class notes on the main concept.</li>
                    <li>Solve 2–3 sample problems similar to this assignment.</li>
                    <li>Attempt each question and mark the ones you&apos;re unsure about.</li>
                    <li>Use AI Doubt Solver or ask your teacher for the tricky ones.</li>
                    <li>Review your final answers before submitting.</li>
                  </ol>
                  <p className="pt-1 text-[11px] text-muted-foreground">
                    Estimated completion time: ~35 minutes
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetail;

