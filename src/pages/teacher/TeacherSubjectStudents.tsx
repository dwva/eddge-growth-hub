import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import PageHeader from '@/components/teacher/PageHeader';
import { useTeacherMode } from '@/contexts/TeacherModeContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, AlertCircle } from 'lucide-react';
import { subjectStudents } from '@/data/teacherMockData';

const TeacherSubjectStudentsContent = () => {
  const navigate = useNavigate();
  const { currentMode } = useTeacherMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');

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

  const filteredStudents = subjectStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === 'all' || student.class === classFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-3 md:space-y-4 max-w-[1600px]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900">My Students</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">View students across all classes</p>
        </div>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-full sm:w-[160px] h-8 text-xs rounded-lg border-gray-200">
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            <SelectItem value="Class 9-A">Class 9-A</SelectItem>
            <SelectItem value="Class 9-B">Class 9-B</SelectItem>
            <SelectItem value="Class 10-A">Class 10-A</SelectItem>
            <SelectItem value="Class 10-B">Class 10-B</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8 md:h-9 text-xs rounded-lg border-gray-200"
          />
        </div>
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-full sm:w-[140px] h-8 md:h-9 text-xs rounded-lg border-gray-200">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            <SelectItem value="Mathematics">Mathematics</SelectItem>
            <SelectItem value="Science">Science</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Students Table */}
      <Card className="border-0 shadow-sm rounded-xl">
        <CardContent className="p-0">
          {filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-[8%]">Roll</th>
                    <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr 
                      key={student.id} 
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/teacher/my-subject/students/${student.id}`)}
                    >
                      {/* Roll No */}
                      <td className="py-2.5 px-4">
                        <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                      </td>
                      {/* Student Column */}
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-violet-100 text-violet-700 text-[10px] font-medium">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {student.online && (
                              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-900">{student.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-[10px] text-gray-500">Rank #{student.rank}</p>
                              {student.weakTopics.length > 0 && (
                                <p className="text-[9px] text-red-500">Weak: {student.weakTopics[0]}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-gray-900 mb-1">No students found</h3>
              <p className="text-xs text-gray-500">Try adjusting your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const TeacherSubjectStudents = () => {
  return (
    <TeacherDashboardLayout>
      <TeacherSubjectStudentsContent />
    </TeacherDashboardLayout>
  );
};

export default TeacherSubjectStudents;

