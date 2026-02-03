import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import { useTeacherMode } from '@/contexts/TeacherModeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Search, Users, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';
import { classStudents } from '@/data/teacherMockData';

const TeacherStudentsContent = () => {
  const navigate = useNavigate();
  const { currentMode } = useTeacherMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [performanceFilter, setPerformanceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mode restriction
  if (currentMode !== 'class_teacher') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Class Teacher Mode Required</h2>
        <p className="text-muted-foreground mb-4">This page is only accessible in Class Teacher mode.</p>
        <Button onClick={() => navigate('/teacher')}>Back to Dashboard</Button>
      </div>
    );
  }

  // Filter students
  const filteredStudents = classStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = performanceFilter === 'all' ||
      (performanceFilter === 'high' && student.overallScore >= 85) ||
      (performanceFilter === 'medium' && student.overallScore >= 70 && student.overallScore < 85) ||
      (performanceFilter === 'low' && student.overallScore < 70);
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/teacher')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">My Class - Students</h1>
          <p className="text-muted-foreground">View and manage students in your assigned class ({classStudents.length} students)</p>
        </div>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by performance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="high">High Performers (≥85%)</SelectItem>
                <SelectItem value="medium">Medium (70-84%)</SelectItem>
                <SelectItem value="low">Low Performers (&lt;70%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedStudents.length > 0 ? (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Overall Score</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">#{student.rank}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9">
                              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                {student.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              {student.weakAreas.length > 0 && (
                                <p className="text-xs text-red-500">Weak: {student.weakAreas.join(', ')}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{student.overallScore}%</span>
                            {getTrendIcon(student.trend)}
                            {student.trendValue !== 0 && (
                              <span className={`text-xs ${student.trendValue > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {student.trendValue > 0 ? '+' : ''}{student.trendValue}%
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(student.subjects).map(([subject, score]) => (
                              <Badge key={subject} variant="outline" className="text-xs">
                                {subject}: {score}%
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge 
                              variant={student.behaviour === 'Excellent' ? 'default' : student.behaviour === 'Good' ? 'secondary' : 'destructive'}
                              className="text-xs"
                            >
                              {student.behaviour}
                            </Badge>
                            {student.strongAreas.length > 0 && (
                              <p className="text-xs text-green-600">Strong: {student.strongAreas.join(', ')}</p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages} ({filteredStudents.length} total students)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No students found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try a different search term' : 'No students match the current filter'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const TeacherStudents = () => {
  return (
    <TeacherDashboardLayout>
      <TeacherStudentsContent />
    </TeacherDashboardLayout>
  );
};

export default TeacherStudents;
