import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import PageHeader from '@/components/teacher/PageHeader';
import { useTeacherMode } from '@/contexts/TeacherModeContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Users, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';
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
        <h2 className="text-xl font-semibold mb-2">Subject Teacher Mode Required</h2>
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-5 max-w-[1600px]">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
          <p className="text-sm text-gray-500 mt-1">View students across all classes for your subject</p>
        </div>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-full sm:w-[200px] h-9 rounded-xl border-gray-200">
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
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl border-gray-200"
          />
        </div>
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-full sm:w-[180px] h-12 rounded-xl border-gray-200">
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
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-5">
          {filteredStudents.length} Students
        </h2>
        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            {filteredStudents.length > 0 ? (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead>Weak Topics</TableHead>
                      <TableHead>Strong Topics</TableHead>
                      <TableHead>Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9">
                              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-xs text-muted-foreground">{student.class}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={student.score >= 80 ? 'default' : student.score >= 60 ? 'secondary' : 'destructive'}>
                            {student.score}%
                          </Badge>
                        </TableCell>
                        <TableCell>{student.accuracy}%</TableCell>
                        <TableCell>
                          {student.weakTopics.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {student.weakTopics.map(topic => (
                                <Badge key={topic} variant="outline" className="text-xs text-red-600 border-red-200">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {student.strongTopics.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {student.strongTopics.map(topic => (
                                <Badge key={topic} variant="outline" className="text-xs text-green-600 border-green-200">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </TableCell>
                        <TableCell>{getTrendIcon(student.trend)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No students found</h3>
                <p className="text-muted-foreground">Try adjusting your filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
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

