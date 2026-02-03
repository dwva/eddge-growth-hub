import { useState } from 'react';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Calendar,
  ChevronRight,
  FileText
} from 'lucide-react';

// Mock homework data
const homeworkList = [
  {
    id: '1',
    title: 'Chapter 5 - Quadratic Equations Problems',
    subject: 'Mathematics',
    teacher: 'Mr. Sharma',
    assignedDate: '2026-02-01',
    dueDate: '2026-02-05',
    status: 'pending',
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
    status: 'submitted',
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
    status: 'graded',
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
    status: 'pending',
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
    status: 'overdue',
    description: 'Mark and label all major rivers of India on the outline map.',
    attachments: 1,
  },
];

const homeworkStats = {
  pending: homeworkList.filter(h => h.status === 'pending').length,
  submitted: homeworkList.filter(h => h.status === 'submitted').length,
  graded: homeworkList.filter(h => h.status === 'graded').length,
  overdue: homeworkList.filter(h => h.status === 'overdue').length,
};

const StudentHomework = () => {
  const [selectedTab, setSelectedTab] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'submitted': return 'bg-blue-100 text-blue-700';
      case 'graded': return 'bg-green-100 text-green-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'submitted': return <Upload className="w-4 h-4 text-blue-500" />;
      case 'graded': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'overdue': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Mathematics': return 'bg-blue-500';
      case 'Science': return 'bg-purple-500';
      case 'English': return 'bg-pink-500';
      case 'History': return 'bg-amber-500';
      case 'Geography': return 'bg-teal-500';
      default: return 'bg-gray-500';
    }
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const filteredHomework = selectedTab === 'all' 
    ? homeworkList 
    : homeworkList.filter(h => h.status === selectedTab);

  return (
    <StudentDashboardLayout title="Homework">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xl font-semibold">{homeworkStats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xl font-semibold">{homeworkStats.submitted}</p>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xl font-semibold">{homeworkStats.graded}</p>
                  <p className="text-xs text-muted-foreground">Graded</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xl font-semibold">{homeworkStats.overdue}</p>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Homework List */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="submitted">Submitted</TabsTrigger>
            <TabsTrigger value="graded">Graded</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-3">
            {filteredHomework.map((homework) => (
              <Card key={homework.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-1.5 h-16 rounded-full ${getSubjectColor(homework.subject)}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-sm font-medium">{homework.title}</h3>
                          <Badge className={`text-xs capitalize ${getStatusColor(homework.status)}`}>
                            {getStatusIcon(homework.status)}
                            <span className="ml-1">{homework.status}</span>
                          </Badge>
                          {homework.grade && (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              Grade: {homework.grade}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{homework.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {homework.subject}
                          </Badge>
                          <span>By {homework.teacher}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Due: {new Date(homework.dueDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                          {homework.status === 'pending' && getDaysRemaining(homework.dueDate) > 0 && (
                            <span className={`${getDaysRemaining(homework.dueDate) <= 2 ? 'text-red-500 font-medium' : ''}`}>
                              {getDaysRemaining(homework.dueDate)} days left
                            </span>
                          )}
                          {homework.attachments > 0 && (
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {homework.attachments} attachment(s)
                            </span>
                          )}
                        </div>
                        {homework.feedback && (
                          <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-100">
                            <p className="text-xs text-green-700">
                              <span className="font-medium">Feedback: </span>
                              {homework.feedback}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {homework.status === 'pending' && (
                        <Button size="sm">
                          <Upload className="w-4 h-4 mr-1" />
                          Submit
                        </Button>
                      )}
                      {homework.status === 'overdue' && (
                        <Button size="sm" variant="destructive">
                          <Upload className="w-4 h-4 mr-1" />
                          Late Submit
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {filteredHomework.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-sm font-medium mb-1">No homework found</h3>
            <p className="text-xs text-muted-foreground">No {selectedTab} homework at the moment</p>
          </div>
        )}
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentHomework;
