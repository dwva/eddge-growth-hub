import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import { useTeacherMode } from '@/contexts/TeacherModeContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Search, Users, TrendingUp, TrendingDown, AlertCircle, 
  Filter, ChevronLeft, ChevronRight, MoreHorizontal, Eye, MessageSquare, FileText,
  Check, X
} from 'lucide-react';
import { classStudents } from '@/data/teacherMockData';

const TeacherStudentsContent = () => {
  const navigate = useNavigate();
  const { currentMode } = useTeacherMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [performanceFilter, setPerformanceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const itemsPerPage = 8;

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
      case 'up': return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <span className="text-gray-400">—</span>;
    }
  };

  const getAttendanceColor = (score: number) => {
    if (score >= 95) return 'bg-emerald-500';
    if (score >= 85) return 'bg-violet-500';
    return 'bg-amber-500';
  };

  const getBehaviourStyle = (behaviour: string) => {
    switch (behaviour) {
      case 'Excellent': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Good': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Needs Attention': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Concern': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-5 max-w-[1600px]">
      {/* Page Header - Clean */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-500 mt-1">Class 10-A • {classStudents.length} students enrolled</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 h-10 rounded-xl border-gray-200">
            <FileText className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters Bar - Clean, No Card */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search students by name..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-10 h-12 rounded-xl border-gray-200"
          />
        </div>
        <Select value={performanceFilter} onValueChange={(v) => { setPerformanceFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-full sm:w-[200px] h-12 rounded-xl border-gray-200">
            <Filter className="w-4 h-4 mr-2 text-gray-400" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Students</SelectItem>
            <SelectItem value="high">High (≥85%)</SelectItem>
            <SelectItem value="medium">Medium (70-84%)</SelectItem>
            <SelectItem value="low">Low (&lt;70%)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Students List */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-5">
          {filteredStudents.length} Students
        </h2>
        {paginatedStudents.length > 0 ? (
          <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
          {/* Table Header - Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[22%]">Student</th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[18%]">Performance</th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">Attendance</th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[12%]">Status</th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[18%]">Actions</th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">Mark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Student Column */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-violet-100 text-violet-700 text-sm font-medium">
                              {student.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${student.trend === 'up' ? 'bg-emerald-500' : student.trend === 'down' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">Rank #{student.rank}</p>
                          {student.weakAreas.length > 0 && (
                            <p className="text-xs text-red-500 mt-0.5">Weak: {student.weakAreas[0]}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Performance Column */}
                    <td className="py-4 px-4">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xl font-bold text-gray-900">{student.overallScore}%</span>
                          {getTrendIcon(student.trend)}
                        </div>
                        {student.trendValue !== 0 && (
                          <p className={`text-sm ${student.trendValue > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {student.trendValue > 0 ? '↑' : '↓'} {student.trendValue > 0 ? '+' : ''}{student.trendValue}% this month
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Attendance Column */}
                    <td className="py-4 px-4">
                      <div className="w-28">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-gray-600">Attendance</span>
                          <span className="text-sm font-semibold text-gray-900">{Math.min(100, student.overallScore + 8)}%</span>
                        </div>
                        <Progress value={Math.min(100, student.overallScore + 8)} className={`h-2 ${getAttendanceColor(Math.min(100, student.overallScore + 8))}`} />
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="py-4 px-4">
                      <Badge variant="outline" className={`text-xs font-medium ${getBehaviourStyle(student.behaviour)}`}>
                        {student.behaviour}
                      </Badge>
                    </td>

                    {/* Actions Column */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg hover:bg-gray-100"
                          onClick={() => navigate(`/teacher/student-profile/${student.id}`)}
                        >
                          <Eye className="w-4 h-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-gray-100">
                          <MessageSquare className="w-4 h-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-gray-100">
                          <MoreHorizontal className="w-4 h-4 text-gray-500" />
                        </Button>
                      </div>
                    </td>

                    {/* Mark Column */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button size="icon" className="h-9 w-9 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-100">
            {paginatedStudents.map((student) => (
              <div key={student.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                {/* Student Info */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-violet-100 text-violet-700 text-sm font-medium">
                        {student.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${student.trend === 'up' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">Rank #{student.rank}</p>
                      </div>
                      <Badge variant="outline" className={`text-xs font-medium ${getBehaviourStyle(student.behaviour)}`}>
                        {student.behaviour}
                      </Badge>
                    </div>
                    {student.weakAreas.length > 0 && (
                      <p className="text-xs text-red-500 mt-1">Weak: {student.weakAreas.join(', ')}</p>
                    )}
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-4 mb-3">
                  {/* Score */}
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg font-bold text-gray-900">{student.overallScore}%</span>
                      {getTrendIcon(student.trend)}
                    </div>
                    {student.trendValue !== 0 && (
                      <p className={`text-xs ${student.trendValue > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {student.trendValue > 0 ? '+' : ''}{student.trendValue}% this month
                      </p>
                    )}
                  </div>
                  {/* Attendance */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500">Attendance</span>
                      <span className="font-medium">{Math.min(100, student.overallScore + 8)}%</span>
                    </div>
                    <Progress value={Math.min(100, student.overallScore + 8)} className="h-1.5" />
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 gap-1.5 text-xs"
                      onClick={() => navigate(`/teacher/student-profile/${student.id}`)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Message
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="h-8 w-8 p-0 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full text-gray-400 hover:bg-gray-100">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-8 p-0 rounded-lg"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          </Card>
        ) : (
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="py-16">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
                <p className="text-gray-500 text-sm">
                  {searchQuery ? 'Try a different search term' : 'No students match the current filter'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
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
