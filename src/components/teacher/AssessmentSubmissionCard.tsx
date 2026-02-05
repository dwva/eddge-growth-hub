import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, Pencil, Send, CheckCircle2 } from 'lucide-react';

interface AssessmentSubmissionCardProps {
  assessment: any;
  onEvaluate?: (id: string) => void;
  onPublishResults?: (id: string) => void;
}

export const AssessmentSubmissionCard = ({ 
  assessment, 
  onEvaluate,
  onPublishResults 
}: AssessmentSubmissionCardProps) => {
  const navigate = useNavigate();

  // Mock submission data - in real app, fetch from assigned work tracker
  const getSubmissionStats = (assessmentId: string) => {
    // This would come from assignedWork in teacherMockData
    return {
      total: 32,
      submitted: 28,
      evaluated: 20,
      pending: 8,
      notStarted: 4,
    };
  };

  const stats = getSubmissionStats(assessment.id);
  const submissionRate = (stats.submitted / stats.total) * 100;
  const evaluationRate = (stats.evaluated / stats.submitted) * 100;

  const handleViewSubmissions = () => {
    navigate(`/teacher/assigned-work?filter=${assessment.id}`);
  };

  const handleEvaluateNow = () => {
    if (onEvaluate) {
      onEvaluate(assessment.id);
    } else {
      navigate(`/teacher/assigned-work/${assessment.id}`);
    }
  };

  const handlePublish = () => {
    if (onPublishResults) {
      onPublishResults(assessment.id);
    }
  };

  if (assessment.status !== 'published') {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-sm">Submission Tracking</h4>
        <Badge variant="secondary" className="text-xs">
          {stats.submitted}/{stats.total} submitted
        </Badge>
      </div>

      {/* Submission Progress */}
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Submissions</span>
            <span className="font-medium">{submissionRate.toFixed(0)}%</span>
          </div>
          <Progress value={submissionRate} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Evaluated</span>
            <span className="font-medium">{evaluationRate.toFixed(0)}%</span>
          </div>
          <Progress value={evaluationRate} className="h-2 bg-green-100" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="text-center p-2 bg-white rounded-lg">
          <div className="text-lg font-bold text-blue-600">{stats.submitted}</div>
          <div className="text-xs text-muted-foreground">Submitted</div>
        </div>
        <div className="text-center p-2 bg-white rounded-lg">
          <div className="text-lg font-bold text-green-600">{stats.evaluated}</div>
          <div className="text-xs text-muted-foreground">Evaluated</div>
        </div>
        <div className="text-center p-2 bg-white rounded-lg">
          <div className="text-lg font-bold text-orange-600">{stats.pending}</div>
          <div className="text-xs text-muted-foreground">Pending</div>
        </div>
        <div className="text-center p-2 bg-white rounded-lg">
          <div className="text-lg font-bold text-gray-600">{stats.notStarted}</div>
          <div className="text-xs text-muted-foreground">Not Started</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={handleViewSubmissions} className="flex-1">
          <Eye className="w-4 h-4 mr-2" />
          View All
        </Button>
        {stats.pending > 0 && (
          <Button size="sm" onClick={handleEvaluateNow} className="flex-1">
            <Pencil className="w-4 h-4 mr-2" />
            Evaluate ({stats.pending})
          </Button>
        )}
        {stats.evaluated === stats.submitted && stats.submitted > 0 && (
          <Button size="sm" onClick={handlePublish} className="flex-1 bg-green-600 hover:bg-green-700">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Publish Results
          </Button>
        )}
      </div>
    </div>
  );
};
