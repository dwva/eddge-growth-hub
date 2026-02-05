import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, Calendar, Users, CheckCircle, Clock, AlertCircle, Send, 
  Eye, Edit, Trash2, Filter, Search, Award, TrendingUp, Target, Plus
} from 'lucide-react';
import { assignedWork, getAssignedWorkStats, classStudents } from '@/data/teacherMockData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const TeacherAssignedWorkContent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedWork, setSelectedWork] = useState<any>(null);
  const [isEvaluationDialogOpen, setIsEvaluationDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [evaluationData, setEvaluationData] = useState<{ [key: string]: number }>({});

  const stats = getAssignedWorkStats();

  const filteredWork = assignedWork.filter(work => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'active' && work.status === 'Active') ||
      (activeTab === 'draft' && work.status === 'Draft') ||
      (activeTab === 'completed' && work.status === 'Completed');
    
    const matchesSearch = work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          work.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Test': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Assessment': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Assignment': return 'bg-green-100 text-green-700 border-green-200';
      case 'Homework': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Evaluated': return 'text-green-600';
      case 'Submitted': return 'text-blue-600';
      case 'Not Started': return 'text-gray-500';
      default: return 'text-gray-600';
    }
  };

  const handleEvaluate = (work: any) => {
    setSelectedWork(work);
    // Initialize evaluation data with auto-scores
    const initialData: { [key: string]: number } = {};
    work.submissions.forEach((sub: any) => {
      if (sub.status === 'Submitted' && sub.autoScore !== null) {
        initialData[sub.studentId] = sub.autoScore;
      }
    });
    setEvaluationData(initialData);
    setIsEvaluationDialogOpen(true);
  };

  const handleSaveEvaluation = () => {
    toast.success('Evaluation saved successfully');
    setIsEvaluationDialogOpen(false);
  };

  const handlePublishResults = (work: any) => {
    toast.success(`Results published for "${work.title}"`);
  };

  const handleSendReminder = () => {
    toast.success('Reminder sent to pending students');
    setIsReminderDialogOpen(false);
  };

  const getSubmissionStats = (work: any) => {
    const total = work.submissions.length;
    const evaluated = work.submissions.filter((s: any) => s.status === 'Evaluated').length;
    const submitted = work.submissions.filter((s: any) => s.status === 'Submitted').length;
    const notStarted = work.submissions.filter((s: any) => s.status === 'Not Started').length;
    
    return { total, evaluated, submitted, notStarted };
  };

  return (
    <div className="space-y-4 max-w-[1600px]">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900">Assigned Work Tracker</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">Track and evaluate all assigned assessments, assignments, and homework</p>
        </div>
        <Button onClick={() => navigate('/teacher/ai-tools/question-generator')} className="gap-2">
          <Plus className="w-4 h-4" />
          Create New
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Active</p>
                <p className="text-base font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Edit className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Draft</p>
                <p className="text-base font-bold text-gray-900">{stats.draft}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Completed</p>
                <p className="text-base font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Submissions</p>
                <p className="text-base font-bold text-gray-900">{stats.totalSubmissions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Evaluated</p>
                <p className="text-base font-bold text-gray-900">{stats.evaluatedSubmissions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-base font-bold text-gray-900">{stats.pendingEvaluation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by title or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4 space-y-4">
          {filteredWork.map((work) => {
            const submissionStats = getSubmissionStats(work);
            const pendingStudents = work.submissions.filter((s: any) => s.status === 'Not Started');

            return (
              <Card key={work.id} className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm font-bold text-gray-900">{work.title}</h3>
                        <Badge variant="outline" className={`text-xs ${getTypeColor(work.type)}`}>
                          {work.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {work.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Due: {work.dueDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {work.totalQuestions} questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {work.totalMarks} marks
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {work.classes.join(', ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEvaluate(work)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Evaluate
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handlePublishResults(work)}>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Publish Results
                      </Button>
                      {pendingStudents.length > 0 && (
                        <Button variant="outline" size="sm" onClick={() => {
                          setSelectedWork(work);
                          setIsReminderDialogOpen(true);
                        }}>
                          <Send className="w-4 h-4 mr-1" />
                          Send Reminder
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Submission Stats */}
                  <div className="grid grid-cols-4 gap-4 p-4 rounded-lg bg-gray-50 mb-4">
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-900">{submissionStats.total}</p>
                      <p className="text-xs text-gray-500">Total Students</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-green-600">{submissionStats.evaluated}</p>
                      <p className="text-xs text-gray-500">Evaluated</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-blue-600">{submissionStats.submitted}</p>
                      <p className="text-xs text-gray-500">Submitted</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-500">{submissionStats.notStarted}</p>
                      <p className="text-xs text-gray-500">Not Started</p>
                    </div>
                  </div>

                  {/* Student Submissions */}
                  <div className="space-y-2">
                    {work.submissions.slice(0, 3).map((submission: any) => (
                      <div 
                        key={submission.studentId} 
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {submission.studentName.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{submission.studentName}</p>
                            <p className="text-xs text-gray-500">{submission.class}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className={`text-xs ${getStatusColor(submission.status)}`}>
                            {submission.status}
                          </Badge>
                          {submission.score !== null && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              Score: {submission.score}/{work.totalMarks}
                            </Badge>
                          )}
                          {submission.submittedAt && (
                            <span className="text-xs text-gray-500">{submission.submittedAt}</span>
                          )}
                        </div>
                      </div>
                    ))}
                    {work.submissions.length > 3 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-primary hover:bg-primary/5"
                        onClick={() => handleEvaluate(work)}
                      >
                        View All {work.submissions.length} Submissions
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredWork.length === 0 && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-sm font-semibold mb-2">No assigned work found</h3>
                <p className="text-gray-500 mb-4">Create your first assignment using AI Tools</p>
                <Button onClick={() => navigate('/teacher/ai-tools/question-generator')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Assignment
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Evaluation Dialog */}
      <Dialog open={isEvaluationDialogOpen} onOpenChange={setIsEvaluationDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Evaluate Submissions - {selectedWork?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {selectedWork?.submissions.map((submission: any) => (
              <Card key={submission.studentId} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {submission.studentName.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{submission.studentName}</p>
                        <p className="text-xs text-gray-500">{submission.class}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={getStatusColor(submission.status)}>
                      {submission.status}
                    </Badge>
                  </div>

                  {submission.status !== 'Not Started' && (
                    <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-gray-50">
                      <div>
                        <Label className="text-xs text-gray-500">Auto-scored (MCQs)</Label>
                        <p className="text-sm font-bold text-gray-900">{submission.autoScore || 0}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500 mb-2 block">Manual Score (Subjective)</Label>
                        {submission.status === 'Submitted' ? (
                          <Input
                            type="number"
                            placeholder="Enter score"
                            value={evaluationData[submission.studentId] || ''}
                            onChange={(e) => setEvaluationData({
                              ...evaluationData,
                              [submission.studentId]: parseFloat(e.target.value)
                            })}
                            className="h-8"
                          />
                        ) : (
                          <p className="text-sm font-bold text-gray-900">{submission.manualScore || 0}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {submission.submittedAt && (
                    <p className="text-xs text-gray-500 mt-2">Submitted: {submission.submittedAt}</p>
                  )}
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEvaluationDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveEvaluation}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Evaluation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reminder Dialog */}
      <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Reminder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-sm text-gray-600">
              Send a reminder to students who haven't started the assignment yet.
            </p>
            <div>
              <Label>Pending Students</Label>
              <div className="mt-2 space-y-2">
                {selectedWork?.submissions
                  .filter((s: any) => s.status === 'Not Started')
                  .map((s: any) => (
                    <div key={s.studentId} className="flex items-center gap-2 p-2 rounded border">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {s.studentName.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{s.studentName}</span>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                placeholder="Reminder: Please complete your assignment..."
                rows={4}
                defaultValue={`Reminder: Please complete "${selectedWork?.title}" by ${selectedWork?.dueDate}.`}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsReminderDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSendReminder}>
                <Send className="w-4 h-4 mr-2" />
                Send Reminder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const TeacherAssignedWork = () => {
  return (
    <TeacherDashboardLayout>
      <TeacherAssignedWorkContent />
    </TeacherDashboardLayout>
  );
};

export default TeacherAssignedWork;
