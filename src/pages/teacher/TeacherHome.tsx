import { useNavigate } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import { useTeacherMode } from '@/contexts/TeacherModeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Users, BarChart3, AlertTriangle, Calendar, MessageCircle, BookOpen, 
  TrendingUp, TrendingDown, Award, Activity, Sparkles, ClipboardList,
  ArrowRight, Crown
} from 'lucide-react';
import { 
  upcomingEvents, messagesOverview, behaviourNotes, classAnalyticsData, 
  recentActivities, topPerformers, subjectClasses, chapters 
} from '@/data/teacherMockData';

const ClassTeacherModeView = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      {/* Widgets Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Events & Announcements */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Events & Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.slice(0, 3).map(event => (
              <div key={event.id} className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                </div>
              </div>
            ))}
            <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => navigate('/teacher/announcements/events')}>
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </CardContent>
        </Card>

        {/* My Department */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-white">
          <CardContent className="pt-6">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-1">My Department</h3>
            <p className="text-sm text-white/80">Coming soon</p>
          </CardContent>
        </Card>

        {/* Messages Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <Calendar className="w-3 h-3" /> PTM Reminders
              </span>
              <Badge>{messagesOverview.ptmReminders}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Unread Messages</span>
              <Badge variant="secondary">{messagesOverview.unreadMessages}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Student Questions</span>
              <Badge variant="outline">{messagesOverview.studentQuestions}</Badge>
            </div>
            <Button size="sm" className="w-full mt-2" onClick={() => navigate('/teacher/communication')}>
              Open Messages
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Class Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Class Overview - 10A</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">32 students</Badge>
              <Button variant="outline" size="sm" onClick={() => navigate('/teacher/my-class/students')}>
                View Details
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Behavior Reports */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">Recent Behavior Notes</span>
              </div>
              <div className="space-y-2">
                {behaviourNotes.slice(0, 3).map(note => (
                  <div key={note.id} className="flex items-center gap-2 text-sm">
                    <span className={`w-2 h-2 rounded-full ${note.type === 'positive' ? 'bg-green-500' : note.type === 'attention' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    <span className="truncate">{note.studentName}: {note.description.slice(0, 30)}...</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Average Score */}
            <div className="p-4 border rounded-lg" onClick={() => navigate('/teacher/class-analytics/overall')}>
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-green-500" />
                <span className="font-medium">Class Average</span>
              </div>
              <p className="text-3xl font-bold mb-2">{classAnalyticsData.classAverage}%</p>
              <Progress value={classAnalyticsData.classAverage} className="mb-2" />
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-3 h-3" />
                <span>+3% from last month</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start gap-3">
                <span className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'assessment' ? 'bg-green-500' : activity.type === 'homework' ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                <div>
                  <p className="text-sm"><span className="font-medium">{activity.studentName}</span> {activity.activity}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full">View All</Button>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topPerformers.map((student, index) => (
              <div key={student.id} className="flex items-center gap-3">
                <span className="w-6 text-center font-medium">
                  {index === 0 ? <Crown className="w-5 h-5 text-yellow-500 inline" /> : `#${index + 1}`}
                </span>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">{student.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{student.name}</p>
                  <p className="text-xs text-green-600">+{student.improvement}% improvement</p>
                </div>
                <span className="font-semibold">{student.score}%</span>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full">View Rankings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const SubjectTeacherModeView = () => {
  const navigate = useNavigate();
  const totalStudents = subjectClasses.reduce((acc, c) => acc + c.students, 0);
  const avgScore = Math.round(subjectClasses.reduce((acc, c) => acc + c.avgScore, 0) / subjectClasses.length);
  const avgCompletion = Math.round(subjectClasses.reduce((acc, c) => acc + c.completion, 0) / subjectClasses.length);
  const weakChapters = chapters.filter(ch => ch.mastery === 'low').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">{avgScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{avgCompletion}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Weak Chapters</p>
                <p className="text-2xl font-bold text-red-500">{weakChapters}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button onClick={() => navigate('/teacher/ai-tools/question-generator')} className="h-auto py-4 gap-3">
          <Sparkles className="w-5 h-5" />
          Generate Questions
        </Button>
        <Button variant="outline" onClick={() => navigate('/teacher/subject-analytics/chapters')} className="h-auto py-4 gap-3">
          <BarChart3 className="w-5 h-5" />
          View Chapter Analytics
        </Button>
        <Button variant="outline" onClick={() => navigate('/teacher/assessments')} className="h-auto py-4 gap-3">
          <ClipboardList className="w-5 h-5" />
          Create Assessment
        </Button>
      </div>

      {/* Classes & Weak Chapters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">My Classes - Mathematics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {subjectClasses.slice(0, 4).map(cls => (
              <div key={cls.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">{cls.name}</p>
                  <p className="text-sm text-muted-foreground">{cls.students} students</p>
                </div>
                <Badge variant={cls.avgScore >= 75 ? 'default' : 'secondary'}>{cls.avgScore}%</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Weak Chapters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {chapters.filter(ch => ch.mastery === 'low').map(ch => (
              <div key={ch.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                <div>
                  <p className="font-medium">{ch.name}</p>
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <TrendingDown className="w-3 h-3" />
                    <span>{ch.masteryPercent}% mastery</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate('/teacher/ai-tools/question-generator')}>
                  Generate Practice
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const TeacherHomeContent = () => {
  const { user } = useAuth();
  const { currentMode } = useTeacherMode();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {currentMode === 'class_teacher' 
              ? 'How is my class doing overall?'
              : 'How well are students understanding my subject?'}
          </span>
        </h2>
        <p className="text-muted-foreground text-lg">
          {currentMode === 'class_teacher'
            ? 'Holistic monitoring of your students as individuals, not just academic scores.'
            : 'Measure subject mastery and track progress across all your classes.'}
        </p>
      </div>

      {currentMode === 'class_teacher' ? <ClassTeacherModeView /> : <SubjectTeacherModeView />}
    </div>
  );
};

const TeacherHome = () => {
  return (
    <TeacherDashboardLayout>
      <TeacherHomeContent />
    </TeacherDashboardLayout>
  );
};

export default TeacherHome;
