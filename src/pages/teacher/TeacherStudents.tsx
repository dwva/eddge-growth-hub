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
  Search, Users, TrendingUp, TrendingDown, Minus, AlertCircle, 
  Filter, ChevronLeft, ChevronRight, MoreHorizontal, Eye, MessageSquare, FileText
} from 'lucide-react';
import { classStudents } from '@/data/teacherMockData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-red-500';
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
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <div className="col-span-4">Student</div>
            <div className="col-span-2 text-center">Score</div>
            <div className="col-span-2 text-center">Attendance</div>
            <div className="col-span-2 text-center">Behaviour</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          {/* Student Rows */}
          <div className="divide-y divide-gray-50">
            {paginatedStudents.map((student) => (
              <div 
                key={student.id} 
                className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors items-center"
              >
                {/* Student Info */}
                <div className="col-span-4 flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                        {student.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${getPerformanceColor(student.overallScore)}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{student.name}</p>
                    <p className="text-xs text-gray-500">Rank #{student.rank}</p>
                    {student.weakAreas.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[10px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                          Weak: {student.weakAreas.slice(0, 2).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="col-span-2 flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">{student.overallScore}%</span>
                    {getTrendIcon(student.trend)}
                  </div>
                  {student.trendValue !== 0 && (
                    <span className={`text-xs font-medium ${student.trendValue > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {student.trendValue > 0 ? '+' : ''}{student.trendValue}% this month
                    </span>
                  )}
                </div>

                {/* Attendance - using score as proxy */}
                <div className="col-span-2 flex flex-col items-center">
                  <div className="w-full max-w-[80px]">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500">Attendance</span>
                      <span className="font-medium">{Math.min(100, student.overallScore + 8)}%</span>
                    </div>
                    <Progress value={Math.min(100, student.overallScore + 8)} className="h-1.5" />
                  </div>
                </div>

                {/* Behaviour */}
                <div className="col-span-2 flex justify-center">
                  <Badge variant="outline" className={`text-xs font-medium ${getBehaviourStyle(student.behaviour)}`}>
                    {student.behaviour}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg"
                    onClick={() => navigate(`/teacher/student-profile/${student.id}`)}
                    title="View Profile"
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => navigate(`/teacher/student-profile/${student.id}`)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View 360° Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/teacher/reports/class-summary')}>
                        <FileText className="w-4 h-4 mr-2" />
                        View Class Summary
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/teacher/communication')}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contact Parent
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
