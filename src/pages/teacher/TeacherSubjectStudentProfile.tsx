import { useNavigate, useParams } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import { useTeacherMode } from '@/contexts/TeacherModeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, TrendingUp, TrendingDown, Minus, Sparkles, 
  FileText, MessageSquare, CheckCircle, Clock, Calendar,
  BarChart3, Target, Award, AlertCircle
} from 'lucide-react';
import { getSubjectStudentDetail } from '@/data/teacherMockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TeacherSubjectStudentProfileContent = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const { currentMode } = useTeacherMode();

  // Mode restriction
  if (currentMode !== 'subject_teacher') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-sm font-semibold mb-2">Subject Teacher Mode Required</h2>
        <p className="text-muted-foreground mb-4">This page is only accessible in Subject Teacher mode.</p>
        <Button onClick={() => navigate('/teacher')}>Back to Dashboard</Button>
      </div>
    );
  }

  const studentData = getSubjectStudentDetail(studentId || '');

  if (!studentData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-sm font-semibold mb-2">Student Not Found</h2>
        <p className="text-muted-foreground mb-4">The student you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/teacher/my-subject/students')}>Back to Students</Button>
      </div>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Test': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Assignment': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Homework': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-3 md:space-y-4 max-w-[1600px]">
      {/* Header with Back Button */}
      <div className="flex items-center gap-2 md:gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/teacher/my-subject/students')}
          className="gap-1.5 h-7 md:h-8 text-[10px] md:text-xs"
        >
          <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Back to Students</span>
          <span className="sm:hidden">Back</span>
        </Button>
      </div>

      {/* Student Header Card */}
      <Card className="border-0 shadow-sm rounded-lg md:rounded-xl">
        <CardContent className="p-3 md:p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <Avatar className="w-10 h-10 md:w-12 md:h-12">
                <AvatarFallback className="bg-primary/10 text-primary text-xs md:text-sm font-bold">
                  {studentData.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-base md:text-lg font-bold text-gray-900">{studentData.name}</h1>
                <div className="flex items-center gap-2 md:gap-3 mt-0.5">
                  <p className="text-[10px] md:text-xs text-gray-500">{studentData.class}</p>
                  <span className="text-gray-300">•</span>
                  <p className="text-[10px] md:text-xs text-gray-500">{studentData.subject}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <div className="text-right">
                <p className="text-[9px] md:text-xs text-gray-500 mb-0.5 md:mb-1">Overall Score</p>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-gray-900">{studentData.overallScore}%</span>
                  {getTrendIcon(studentData.trend)}
                </div>
                <p className="text-xs text-gray-500 mt-1">Accuracy: {studentData.accuracy}%</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-5 pt-5 border-t border-gray-100">
            <Button 
              size="sm" 
              className="gap-2"
              onClick={() => navigate('/teacher/ai-tools/question-generator')}
            >
              <Sparkles className="w-4 h-4" />
              Generate Practice
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Assign Homework
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Message Student
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Message Parent
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Chart & Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Performance History Chart */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold">Performance Trend</CardTitle>
              <Badge variant="outline" className="text-xs">
                <BarChart3 className="w-3 h-3 mr-1" />
                Last 5 Months
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={studentData.performanceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weak & Strong Topics */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold">Topic Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-red-500" />
                <p className="text-sm font-semibold text-gray-700">Weak Topics</p>
              </div>
              {studentData.weakTopics.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {studentData.weakTopics.map((topic, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs text-red-600 border-red-200">
                      {topic}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No weak topics identified</p>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-green-500" />
                <p className="text-sm font-semibold text-gray-700">Strong Topics</p>
              </div>
              {studentData.strongTopics.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {studentData.strongTopics.map((topic, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs text-green-600 border-green-200">
                      {topic}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No strong topics identified yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chapter-wise Mastery */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold">Chapter-wise Mastery Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentData.chapterMastery.map((chapter) => (
              <div key={chapter.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{chapter.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{chapter.status}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`ml-2 text-xs ${
                      chapter.color === 'green' ? 'bg-green-50 text-green-700 border-green-200' :
                      chapter.color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      chapter.color === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {chapter.mastery}%
                  </Badge>
                </div>
                <Progress value={chapter.mastery} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assigned Assessments */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold">Assigned Assessments</CardTitle>
            <Badge variant="outline" className="text-xs">
              {studentData.assignedAssessments.length} Total
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {studentData.assignedAssessments.map((assessment) => (
              <div 
                key={assessment.id} 
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    assessment.status === 'Completed' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {assessment.status === 'Completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{assessment.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={`text-[10px] h-5 px-2 ${getTypeColor(assessment.type)}`}>
                        {assessment.type}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {assessment.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  {assessment.status === 'Completed' && assessment.score !== null ? (
                    <div>
                      <p className="text-sm font-bold text-gray-900">{assessment.score}/{assessment.maxScore}</p>
                      <p className="text-xs text-gray-500">
                        {Math.round((assessment.score / assessment.maxScore) * 100)}%
                      </p>
                    </div>
                  ) : (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studentData.recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.activity}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.date}</p>
                </div>
                {activity.score && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                    Score: {activity.score}%
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const TeacherSubjectStudentProfile = () => {
  return (
    <TeacherDashboardLayout>
      <TeacherSubjectStudentProfileContent />
    </TeacherDashboardLayout>
  );
};

export default TeacherSubjectStudentProfile;
