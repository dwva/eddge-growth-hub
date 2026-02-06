import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import StatCard from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AssessmentWizard } from '@/components/teacher/AssessmentWizard';
import { AssessmentSubmissionCard } from '@/components/teacher/AssessmentSubmissionCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, Plus, ClipboardList, BookOpen, Calendar, Eye, Pencil, 
  Trash2, Download, FileText, Users, BarChart3, Clock, CheckCircle2,
  MoreHorizontal, Play, ChevronRight
} from 'lucide-react';
import { assessments as mockAssessments, assessmentResults } from '@/data/teacherMockData';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const TeacherAssessmentsContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [assessments, setAssessments] = useState(mockAssessments);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const location = useLocation();

  // Open wizard when coming from AI Tools with questions
  useEffect(() => {
    if (location.state?.fromAITools && location.state?.questions) {
      setWizardOpen(true);
    }
  }, [location.state]);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    class: '',
    type: '',
    marks: '',
    duration: '',
    scheduledDate: '',
  });

  const filteredAssessments = assessments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    if (!formData.title || !formData.subject || !formData.class) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newAssessment = {
      id: `a${Date.now()}`,
      title: formData.title,
      subject: formData.subject,
      class: formData.class,
      type: formData.type || 'Assessment',
      marks: parseInt(formData.marks) || 50,
      scheduledDate: formData.scheduledDate || new Date().toISOString().split('T')[0],
      status: 'draft' as const,
    };

    setAssessments(prev => [...prev, newAssessment]);
    setIsCreateOpen(false);
    setFormData({ title: '', subject: '', class: '', type: '', marks: '', duration: '', scheduledDate: '' });
    toast.success('Assessment created as draft');
  };

  const handlePublish = (id: string) => {
    setAssessments(prev => prev.map(a => a.id === id ? { ...a, status: 'published' as const } : a));
    toast.success('Assessment published');
  };

  const handleDelete = (id: string) => {
    setAssessments(prev => prev.filter(a => a.id !== id));
    toast.success('Assessment deleted');
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'published': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const draftCount = assessments.filter(a => a.status === 'draft').length;
  const publishedCount = assessments.filter(a => a.status === 'published').length;
  const avgScore = Math.round(assessmentResults.reduce((acc, r) => acc + r.avgScore, 0) / assessmentResults.length);

  const handlePublishResults = (assessmentId: string) => {
    toast.success('Results published successfully');
  };

  return (
    <div className="h-full">
      {/* Page Header - Clean */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-4 mb-3">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900">Assessments</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">Create and manage assessments</p>
        </div>
        <Button size="sm" className="gap-1 h-7 md:h-8 text-xs rounded-lg" onClick={() => setWizardOpen(true)}>
          <Plus className="w-3 h-3" />
          Create
        </Button>

        {/* Assessment Wizard */}
        <AssessmentWizard
          open={wizardOpen}
          onClose={() => setWizardOpen(false)}
          onSave={(assessment) => {
            setAssessments(prev => [...prev, {
              id: assessment.id || `a${Date.now()}`,
              title: assessment.title,
              subject: assessment.subject || 'Mathematics',
              class: assessment.class,
              type: assessment.type,
              marks: assessment.totalMarks || 50,
              scheduledDate: assessment.dueDate || new Date().toISOString().split('T')[0],
              status: assessment.status || 'draft',
            }]);
            setWizardOpen(false);
            toast.success(assessment.status === 'published' ? 'Assessment assigned!' : 'Assessment saved as draft');
          }}
          initialData={location.state}
        />

        {/* Keep old dialog for quick create */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Assessment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-sm">Title *</Label>
                <Input
                  placeholder="e.g., Mid-Term Mathematics Test"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Subject *</Label>
                  <Select value={formData.subject} onValueChange={(v) => setFormData(prev => ({ ...prev, subject: v }))}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Class *</Label>
                  <Select value={formData.class} onValueChange={(v) => setFormData(prev => ({ ...prev, class: v }))}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Class 9-A">Class 9-A</SelectItem>
                      <SelectItem value="Class 9-B">Class 9-B</SelectItem>
                      <SelectItem value="Class 10-A">Class 10-A</SelectItem>
                      <SelectItem value="Class 10-B">Class 10-B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Type</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData(prev => ({ ...prev, type: v }))}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Quiz">Quiz</SelectItem>
                      <SelectItem value="Unit Test">Unit Test</SelectItem>
                      <SelectItem value="Assessment">Assessment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Marks</Label>
                  <Input
                    type="number"
                    placeholder="50"
                    value={formData.marks}
                    onChange={(e) => setFormData(prev => ({ ...prev, marks: e.target.value }))}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Duration</Label>
                  <Input
                    type="number"
                    placeholder="60 mins"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Scheduled Date</Label>
                <Input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              <Button onClick={handleCreate} className="w-full rounded-xl">
                Create Assessment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Section 1: Overview Metrics */}
      <div>
        <h2 className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 md:mb-4">Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <StatCard 
            title="Total Assessments" 
            value={assessments.length} 
            icon={<ClipboardList className="w-5 h-5" />} 
            iconBg="bg-blue-50 text-blue-600"
          />
          <StatCard 
            title="Published" 
            value={publishedCount} 
            icon={<CheckCircle2 className="w-5 h-5" />} 
            iconBg="bg-emerald-50 text-emerald-600"
          />
          <StatCard 
            title="Drafts" 
            value={draftCount} 
            icon={<FileText className="w-5 h-5" />} 
            iconBg="bg-gray-100 text-gray-600"
          />
          <StatCard 
            title="Avg Score" 
            value={`${avgScore}%`} 
            icon={<BarChart3 className="w-5 h-5" />} 
            iconBg="bg-violet-50 text-violet-600"
          />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="w-full md:w-auto inline-flex h-7 md:h-8 p-0.5 md:p-1 rounded-lg bg-gray-100">
          <TabsTrigger value="all" className="flex-1 md:flex-none px-2.5 md:px-4 py-1 md:py-1.5 text-[10px] md:text-xs rounded-md md:rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            All
          </TabsTrigger>
          <TabsTrigger value="results" className="flex-1 md:flex-none px-2.5 md:px-4 py-1 md:py-1.5 text-[10px] md:text-xs rounded-md md:rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Results
          </TabsTrigger>
        </TabsList>

        {/* All Assessments Tab */}
        <TabsContent value="all" className="space-y-3 md:space-y-6 mt-3 md:mt-6">
          {/* Filters - Clean Bar */}
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
              <Input
                placeholder="Search assessments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 md:pl-10 h-8 md:h-10 text-xs rounded-lg md:rounded-xl border-gray-200"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px] md:w-[180px] h-8 md:h-10 text-xs rounded-lg md:rounded-xl border-gray-200">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Section 2: Assessments */}
          <div>
            <h2 className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 md:mb-4">
              {filteredAssessments.length} Assessments
            </h2>
            {filteredAssessments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
                {filteredAssessments.map((assessment) => (
                  <Card key={assessment.id} className="border-0 shadow-sm rounded-lg md:rounded-2xl hover:shadow-md transition-shadow overflow-hidden">
                  <CardContent className="p-3 md:p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="outline" className={`text-xs font-medium ${getStatusStyle(assessment.status)}`}>
                        {assessment.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          {assessment.status === 'draft' && (
                            <DropdownMenuItem onClick={() => handlePublish(assessment.id)}>
                              <Play className="w-4 h-4 mr-2" /> Publish
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleDelete(assessment.id)} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Title & Subject */}
                    <h3 className="font-semibold text-gray-900 mb-1">{assessment.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <BookOpen className="w-4 h-4" />
                      <span>{assessment.subject}</span>
                      <span>•</span>
                      <span>{assessment.class}</span>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg">
                        <Calendar className="w-3.5 h-3.5" />
                        {assessment.scheduledDate}
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg">
                        <FileText className="w-3.5 h-3.5" />
                        {assessment.marks} marks
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg">
                        <ClipboardList className="w-3.5 h-3.5" />
                        {assessment.type}
                      </div>
                    </div>

                    {/* Submission Tracking for Published */}
                    {assessment.status === 'published' && (
                      <AssessmentSubmissionCard
                        assessment={assessment}
                        onPublishResults={handlePublishResults}
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="rounded-2xl shadow-sm border-gray-100">
              <CardContent className="py-16">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <ClipboardList className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No assessments found</h3>
                  <p className="text-gray-500 text-sm mb-4">Create your first assessment to get started</p>
                  <Button className="rounded-xl" onClick={() => setIsCreateOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6 mt-6">
          {/* Results Cards */}
          {assessmentResults.map((result) => (
            <Card key={result.id} className="rounded-2xl shadow-sm border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Assessment Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <ClipboardList className="w-6 h-6 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{result.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                          <span>{result.subject}</span>
                          <span>•</span>
                          <span>{result.class}</span>
                          <span>•</span>
                          <span>{result.completed}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4 lg:gap-8">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Students</div>
                      <div className="font-semibold">{result.studentsAttempted}/{result.totalStudents}</div>
                      <Progress value={(result.studentsAttempted / result.totalStudents) * 100} className="h-1.5 mt-1" />
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Average</div>
                      <div className={`font-bold text-lg ${result.avgScore >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {result.avgScore}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Highest</div>
                      <div className="font-semibold text-emerald-600">{result.highest}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Lowest</div>
                      <div className="font-semibold text-red-600">{result.lowest}%</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 lg:flex-shrink-0">
                    <Button variant="outline" size="sm" className="h-9 rounded-lg gap-1.5">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 rounded-lg gap-1.5">
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const TeacherAssessments = () => {
  return (
    <TeacherDashboardLayout>
      <TeacherAssessmentsContent />
    </TeacherDashboardLayout>
  );
};

export default TeacherAssessments;
