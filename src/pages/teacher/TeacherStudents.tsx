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
        <h2 className="text-sm font-semibold mb-2">Class Teacher Mode Required</h2>
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
    <div className="space-y-3 md:space-y-4 max-w-[1600px]">
      {/* Page Header - Clean */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900">Students</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">Class 10-A • {classStudents.length} students enrolled</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1 h-7 md:h-8 text-xs rounded-lg border-gray-200">
            <FileText className="w-3 h-3" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters Bar - Clean, No Card */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-9 h-8 md:h-9 text-xs rounded-lg border-gray-200"
          />
        </div>
        <Select value={performanceFilter} onValueChange={(v) => { setPerformanceFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-full sm:w-[160px] h-8 md:h-9 text-xs rounded-lg border-gray-200">
            <Filter className="w-3 h-3 mr-1 text-gray-400" />
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
        <h2 className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          {filteredStudents.length} Students
        </h2>
        {paginatedStudents.length > 0 ? (
          <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
          {/* Table Header - Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-[6%]">Roll</th>
                  <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-[20%]">Student</th>
                  <th className="text-left py-2.5 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-[16%]">Performance</th>
                  <th className="text-left py-2.5 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-[14%]">Attendance</th>
                  <th className="text-left py-2.5 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-[12%]">Status</th>
                  <th className="text-left py-2.5 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-[18%]">Actions</th>
                  <th className="text-left py-2.5 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-[14%]">Mark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Roll No Column */}
                    <td className="py-2.5 px-4">
                      <span className="text-xs font-medium text-gray-600">{((currentPage - 1) * itemsPerPage) + index + 1}</span>
                    </td>
                    {/* Student Column */}
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-shrink-0">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-violet-100 text-violet-700 text-[10px] font-medium">
                              {student.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${student.trend === 'up' ? 'bg-emerald-500' : student.trend === 'down' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-900">{student.name}</p>
                          <p className="text-[10px] text-gray-500">Rank #{student.rank}</p>
                          {student.weakAreas.length > 0 && (
                            <p className="text-[9px] text-red-500 mt-0.5 truncate">Weak: {student.weakAreas[0]}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Performance Column */}
                    <td className="py-2.5 px-3">
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-sm font-bold text-gray-900">{student.overallScore}%</span>
                          {getTrendIcon(student.trend)}
                        </div>
                        {student.trendValue !== 0 && (
                          <p className={`text-[9px] ${student.trendValue > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {student.trendValue > 0 ? '↑' : '↓'} {student.trendValue > 0 ? '+' : ''}{student.trendValue}%
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Attendance Column */}
                    <td className="py-2.5 px-3">
                      <div className="w-20">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] text-gray-600">Attend.</span>
                          <span className="text-[10px] font-semibold text-gray-900">{Math.min(100, student.overallScore + 8)}%</span>
                        </div>
                        <Progress value={Math.min(100, student.overallScore + 8)} className={`h-1.5 ${getAttendanceColor(Math.min(100, student.overallScore + 8))}`} />
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="py-2.5 px-3">
                      <Badge variant="outline" className={`text-[9px] font-medium h-5 ${getBehaviourStyle(student.behaviour)}`}>
                        {student.behaviour}
                      </Badge>
                    </td>

                    {/* Actions Column */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 rounded-md hover:bg-gray-100"
                          onClick={() => navigate(`/teacher/student-profile/${student.id}`)}
                        >
                          <Eye className="w-3 h-3 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:bg-gray-100">
                          <MessageSquare className="w-3 h-3 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:bg-gray-100">
                          <MoreHorizontal className="w-3 h-3 text-gray-500" />
                        </Button>
                      </div>
                    </td>

                    {/* Mark Column */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1">
                        <Button size="icon" className="h-6 w-6 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white">
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                          <X className="w-3 h-3" />
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
            {paginatedStudents.map((student, index) => (
              <div key={student.id} className="p-3 hover:bg-gray-50/50 transition-colors">
                {/* Student Info */}
                <div className="flex items-start gap-2.5 mb-2">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] font-medium text-gray-500 w-4">{((currentPage - 1) * itemsPerPage) + index + 1}</span>
                    <div className="relative">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-violet-100 text-violet-700 text-[10px] font-medium">
                          {student.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${student.trend === 'up' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{student.name}</p>
                        <p className="text-[10px] text-gray-500">Rank #{student.rank}</p>
                      </div>
                      <Badge variant="outline" className={`text-[9px] font-medium h-5 ${getBehaviourStyle(student.behaviour)}`}>
                        {student.behaviour}
                      </Badge>
                    </div>
                    {student.weakAreas.length > 0 && (
                      <p className="text-[9px] text-red-500 mt-0.5 truncate">Weak: {student.weakAreas.join(', ')}</p>
                    )}
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-3 mb-2 ml-6">
                  {/* Score */}
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-gray-900">{student.overallScore}%</span>
                      {getTrendIcon(student.trend)}
                    </div>
                    {student.trendValue !== 0 && (
                      <p className={`text-[9px] ${student.trendValue > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {student.trendValue > 0 ? '+' : ''}{student.trendValue}%
                      </p>
                    )}
                  </div>
                  {/* Attendance */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[9px] mb-0.5">
                      <span className="text-gray-500">Attend.</span>
                      <span className="font-medium">{Math.min(100, student.overallScore + 8)}%</span>
                    </div>
                    <Progress value={Math.min(100, student.overallScore + 8)} className="h-1" />
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 ml-6">
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 gap-1 text-[10px] px-2"
                      onClick={() => navigate(`/teacher/student-profile/${student.id}`)}
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 gap-1 text-[10px] px-2">
                      <MessageSquare className="w-3 h-3" />
                      Msg
                    </Button>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" className="h-6 w-6 p-0 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white">
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full text-gray-400 hover:bg-gray-100">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-100">
            <p className="text-[10px] text-gray-500">
              {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-6 w-6 p-0 rounded-md"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-3 h-3" />
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="h-6 w-6 p-0 rounded-md text-[10px]"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                className="h-6 w-6 p-0 rounded-md"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
          </Card>
        ) : (
          <Card className="border-0 shadow-sm rounded-xl">
            <CardContent className="py-10">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">No students found</h3>
                <p className="text-gray-500 text-xs">
                  {searchQuery ? 'Try a different search term' : 'No students match the filter'}
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
