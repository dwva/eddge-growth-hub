import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import { useTeacherMode } from '@/contexts/TeacherModeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Check, X, AlertCircle, Eye, MessageSquare, MoreHorizontal } from 'lucide-react';
import { classStudents } from '@/data/teacherMockData';
import { toast } from 'sonner';

type AttendanceStatus = 'present' | 'absent';

const TeacherAttendanceContent = () => {
  const navigate = useNavigate();
  const { currentMode } = useTeacherMode();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(() =>
    classStudents.reduce((acc, s) => ({ ...acc, [s.id]: 'present' }), {} as Record<string, AttendanceStatus>)
  );

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

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = () => {
    const present = Object.values(attendance).filter(s => s === 'present').length;
    const absent = Object.values(attendance).filter(s => s === 'absent').length;
    toast.success(`Attendance submitted! ${present} present, ${absent} absent for ${selectedDate}`);
  };

  const handleMarkAllPresent = () => {
    setAttendance(
      classStudents.reduce((acc, s) => ({ ...acc, [s.id]: 'present' }), {} as Record<string, AttendanceStatus>)
    );
    toast.success('All students marked present');
  };

  const presentCount = Object.values(attendance).filter(s => s === 'present').length;
  const absentCount = Object.values(attendance).filter(s => s === 'absent').length;

  const getBehaviourStyle = (behaviour: string) => {
    switch (behaviour) {
      case 'Excellent': return 'bg-emerald-50 text-emerald-700';
      case 'Good': return 'bg-blue-50 text-blue-700';
      case 'Needs Attention': return 'bg-amber-50 text-amber-700';
      case 'Concern': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusDotColor = (behaviour: string) => {
    switch (behaviour) {
      case 'Excellent': return 'bg-emerald-500';
      case 'Good': return 'bg-emerald-500';
      case 'Needs Attention': return 'bg-amber-500';
      case 'Concern': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getAttendancePercent = (student: typeof classStudents[0]) => Math.min(100, student.overallScore + 8);

  return (
    <div className="space-y-5 max-w-[1600px]">
      {/* Page Header - Clean */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900">Mark Attendance</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">Class 10-A • Record daily attendance</p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-44 h-10 rounded-xl border-gray-200"
          />
          <Button variant="outline" size="sm" className="h-10 rounded-xl border-gray-200" onClick={handleMarkAllPresent}>
            Mark All Present
          </Button>
          <Button size="sm" className="h-10 rounded-xl" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100">
          <Check className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold text-emerald-700">{presentCount}</span>
          <span className="text-sm text-emerald-600">Present</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-100">
          <X className="w-5 h-5 text-red-600" />
          <span className="font-semibold text-red-700">{absentCount}</span>
          <span className="text-sm text-red-600">Absent</span>
        </div>
      </div>

      {/* Student List - Horizontal row format matching reference image */}
      <Card className="rounded-2xl shadow-sm border-gray-100 overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Class Students</CardTitle>
          <p className="text-sm text-gray-500">Use ✓ Present and ✗ Absent, then Submit</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 rounded-xl text-xs font-semibold text-gray-500 uppercase">
              <div className="col-span-3">Student</div>
              <div className="col-span-2">Performance</div>
              <div className="col-span-2">Attendance</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Actions</div>
              <div className="col-span-1 text-right">Mark</div>
            </div>
            {classStudents.map((student) => (
              <div
                key={student.id}
                className={`flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl border transition-all hover:bg-gray-50/50 ${
                  attendance[student.id] === 'present'
                    ? 'border-emerald-200/50 bg-emerald-50/10'
                    : 'border-red-200/50 bg-red-50/10'
                }`}
              >
                {/* Avatar + Name + Rank + Weak */}
                <div className="flex items-center gap-4 md:col-span-3 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {student.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusDotColor(student.behaviour)}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{student.name}</p>
                    <p className="text-xs text-gray-500">Rank #{student.rank}</p>
                    {student.weakAreas.length > 0 && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-600">
                        Weak: {student.weakAreas.join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Performance % + Trend */}
                <div className="flex items-center gap-2 md:col-span-2">
                  <span className="text-lg font-bold text-gray-900">{student.overallScore}%</span>
                  {student.trendValue > 0 && (
                    <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                      ↑ +{student.trendValue}% this month
                    </span>
                  )}
                  {student.trendValue < 0 && (
                    <span className="flex items-center gap-0.5 text-xs font-medium text-red-600">
                      ↓ {student.trendValue}% this month
                    </span>
                  )}
                  {student.trendValue === 0 && (
                    <span className="flex items-center gap-0.5 text-xs text-gray-400">—</span>
                  )}
                </div>

                {/* Attendance + Progress bar */}
                <div className="flex flex-col gap-1 md:col-span-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Attendance</span>
                    <span className="font-medium">{getAttendancePercent(student)}%</span>
                  </div>
                  <Progress value={getAttendancePercent(student)} className="h-2 w-24 md:w-28" />
                </div>

                {/* Behaviour tag */}
                <div className="md:col-span-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getBehaviourStyle(student.behaviour)}`}>
                    {student.behaviour}
                  </span>
                </div>

                {/* Action icons */}
                <div className="flex items-center gap-1 md:col-span-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-500 hover:text-gray-700">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-500 hover:text-gray-700">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-500 hover:text-gray-700">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                {/* Present / Absent */}
                <div className="flex items-center gap-2 md:col-span-1 md:justify-end">
                  <button
                    onClick={() => handleStatusChange(student.id, 'present')}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                      attendance[student.id] === 'present'
                        ? 'bg-emerald-500 text-white ring-2 ring-emerald-300'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                    title="Present"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleStatusChange(student.id, 'absent')}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                      attendance[student.id] === 'absent'
                        ? 'bg-red-500 text-white ring-2 ring-red-300'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                    title="Absent"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const TeacherAttendance = () => {
  return (
    <TeacherDashboardLayout>
      <TeacherAttendanceContent />
    </TeacherDashboardLayout>
  );
};

export default TeacherAttendance;
