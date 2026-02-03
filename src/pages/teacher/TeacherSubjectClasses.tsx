import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import { useTeacherMode } from '@/contexts/TeacherModeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, BookOpen, Users, BarChart3, Calendar, AlertCircle } from 'lucide-react';
import { subjectClasses } from '@/data/teacherMockData';

const TeacherSubjectClassesContent = () => {
  const navigate = useNavigate();
  const { currentMode } = useTeacherMode();
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');

  // Mode restriction
  if (currentMode !== 'subject_teacher') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Subject Teacher Mode Required</h2>
        <p className="text-muted-foreground mb-4">This page is only accessible in Subject Teacher mode.</p>
        <Button onClick={() => navigate('/teacher')}>Back to Dashboard</Button>
      </div>
    );
  }

  const filteredClasses = subjectClasses.filter(c => c.subject === selectedSubject);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/teacher')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">My Subject - Classes</h1>
            <p className="text-muted-foreground">View all classes where you teach your subject</p>
          </div>
        </div>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mathematics">Mathematics</SelectItem>
            <SelectItem value="Science">Science</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClasses.map((cls) => (
          <Card key={cls.id} className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{cls.name}</h3>
                  <Badge variant="outline" className="mt-1">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {cls.subject}
                  </Badge>
                </div>
                <Badge variant={cls.avgScore >= 75 ? 'default' : cls.avgScore >= 60 ? 'secondary' : 'destructive'}>
                  {cls.avgScore}%
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{cls.students} students</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-medium">{cls.completion}%</span>
                  </div>
                  <Progress value={cls.completion} />
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Last assessment: {cls.lastAssessment}</span>
                </div>

                <Button variant="outline" className="w-full" onClick={() => navigate(`/teacher/my-subject/students?class=${cls.id}`)}>
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const TeacherSubjectClasses = () => {
  return (
    <TeacherDashboardLayout>
      <TeacherSubjectClassesContent />
    </TeacherDashboardLayout>
  );
};

export default TeacherSubjectClasses;
