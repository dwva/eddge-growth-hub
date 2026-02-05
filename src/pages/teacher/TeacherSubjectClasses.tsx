import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import PageHeader from '@/components/teacher/PageHeader';
import { useTeacherMode } from '@/contexts/TeacherModeContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Users, BarChart3, Calendar, AlertCircle } from 'lucide-react';
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
        <h2 className="text-sm font-semibold mb-2">Subject Teacher Mode Required</h2>
        <p className="text-muted-foreground mb-4">This page is only accessible in Subject Teacher mode.</p>
        <Button onClick={() => navigate('/teacher')}>Back to Dashboard</Button>
      </div>
    );
  }

  const filteredClasses = subjectClasses.filter(c => c.subject === selectedSubject);

  return (
    <div className="space-y-3 md:space-y-4 max-w-[1600px]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900">My Classes</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">View all classes where you teach</p>
        </div>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-full sm:w-[160px] h-8 text-xs rounded-lg border-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mathematics">Mathematics</SelectItem>
            <SelectItem value="Science">Science</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Section: Classes */}
      <div>
        <h2 className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 md:mb-3">
          {filteredClasses.length} Classes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
          {filteredClasses.map((cls) => (
            <Card key={cls.id} className="rounded-xl">
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-xs mb-1 truncate">{cls.name}</h3>
                    <Badge variant="outline" className="text-[9px] h-5">
                      <BookOpen className="w-2.5 h-2.5 mr-1" />
                      {cls.subject}
                    </Badge>
                  </div>
                  <Badge variant={cls.avgScore >= 75 ? 'default' : cls.avgScore >= 60 ? 'secondary' : 'destructive'} className="ml-2 text-[9px]">
                    {cls.avgScore}%
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-gray-600">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <span>{cls.students} students</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-600">Subject Performance</span>
                      <span className="font-medium text-gray-900">{cls.avgScore}%</span>
                    </div>
                    <Progress value={cls.avgScore} className="h-1.5" />
                  </div>

                  <div className="flex items-center gap-1.5 text-[9px] text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>Last: {cls.lastAssessment}</span>
                  </div>

                  <Button variant="outline" className="w-full h-7 text-xs" onClick={() => navigate(`/teacher/my-subject/students?class=${cls.id}`)}>
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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

