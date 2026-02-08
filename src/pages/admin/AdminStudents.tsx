import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from '@/contexts/AdminDataContext';
import type { Student } from '@/types/admin';
import AdminDashboardLayout from '@/components/layout/AdminDashboardLayout';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Mail,
  Phone,
  Edit,
  Trash2,
  Eye,
  GraduationCap,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const AdminStudents = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAdminData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [newStudent, setNewStudent] = useState<{
    name: string;
    email: string;
    rollNumber: string;
    classId: string;
    parentContact: string;
  }>({
    name: '',
    email: '',
    rollNumber: '',
    classId: '',
    parentContact: '',
  });

  const totalStudents = state.students.length;
  const avgAttendance =
    totalStudents === 0
      ? 0
      : Math.round(
          state.students.reduce((sum, s) => sum + (s.attendancePercentage || 0), 0) /
            totalStudents,
        );
  const totalClasses = new Set(state.students.map((s) => s.classId).filter(Boolean)).size;
  const atRiskCount = state.students.filter((s) => s.status === 'AtRisk').length;

  const filteredStudents = state.students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.classId === selectedClass;
    return matchesSearch && matchesClass;
  });

  const handleCreate = () => {
    if (!newStudent.name.trim() || !newStudent.email.trim()) {
      return;
    }

    const student: Student = {
      id: generateId(),
      name: newStudent.name.trim(),
      email: newStudent.email.trim(),
      rollNumber: Number(newStudent.rollNumber) || 0,
      classId: newStudent.classId || null,
      parentContact: newStudent.parentContact.trim(),
      attendancePercentage: 90,
      performanceScore: 80,
      status: 'Active',
    };

    dispatch({ type: 'ADD_STUDENT', payload: student });
    setIsAddDialogOpen(false);
    setNewStudent({
      name: '',
      email: '',
      rollNumber: '',
      classId: '',
      parentContact: '',
    });
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_STUDENT', payload: { id } });
  };

  const handleToggleSelection = (id: string) => {
    setSelectedStudents(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filteredStudents.map(s => s.id)));
    }
  };

  const handleBulkUpdateStatus = (status: 'Active' | 'AtRisk') => {
    selectedStudents.forEach(id => {
      const student = state.students.find(s => s.id === id);
      if (student) {
        dispatch({ type: 'UPDATE_STUDENT', payload: { ...student, status } });
      }
    });
    toast({
      title: 'Status Updated',
      description: `Updated ${selectedStudents.size} student(s) to ${status}.`,
    });
    setSelectedStudents(new Set());
  };

  const handleExportCSV = () => {
    const selected = filteredStudents.filter(s => selectedStudents.has(s.id));
    if (selected.length === 0) {
      toast({
        title: 'No Selection',
        description: 'Please select students to export.',
        variant: 'destructive',
      });
      return;
    }

    const headers = ['Name', 'Email', 'Roll Number', 'Class', 'Attendance %', 'Performance %', 'Status'];
    const rows = selected.map(s => {
      const cls = state.classes.find(c => c.id === s.classId);
      return [
        s.name,
        s.email,
        s.rollNumber.toString(),
        cls ? `${cls.grade}-${cls.section}` : 'N/A',
        s.attendancePercentage.toString(),
        s.performanceScore.toString(),
        s.status,
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Complete',
      description: `Exported ${selected.length} student(s) to CSV.`,
    });
  };

  return (
    <AdminDashboardLayout 
      pageTitle="Students" 
      pageDescription="Manage all enrolled students"
    >
      <div className="space-y-2 sm:space-y-4 md:space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-4">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-bold">{totalStudents}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Total Students</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-4">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-bold">{avgAttendance}%</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Avg. Attendance</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-4">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-bold">{totalClasses}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Total Classes</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-4">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-amber-600" />
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-bold">{atRiskCount}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">At Risk</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search students by name or email..."
                  className="pl-8 sm:pl-10 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="h-9 w-full sm:w-32 min-w-0 text-sm">
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="9-A">Class 9-A</SelectItem>
                    <SelectItem value="9-B">Class 9-B</SelectItem>
                    <SelectItem value="10-A">Class 10-A</SelectItem>
                    <SelectItem value="10-B">Class 10-B</SelectItem>
                    <SelectItem value="11-A">Class 11-A</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-9">
                  <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Filters
                </Button>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-9 bg-primary hover:bg-primary/90 flex-1 sm:flex-initial">
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Enroll Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Enroll New Student</DialogTitle>
                      <DialogDescription>
                        Fill in the details to enroll a new student.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Student Name</Label>
                        <Input placeholder="Enter student's name" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Class</Label>
                          <Select
                            value={newStudent.classId}
                            onValueChange={(value) =>
                              setNewStudent((prev) => ({ ...prev, classId: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="9-A">Class 9-A</SelectItem>
                              <SelectItem value="9-B">Class 9-B</SelectItem>
                              <SelectItem value="10-A">Class 10-A</SelectItem>
                              <SelectItem value="10-B">Class 10-B</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Roll Number</Label>
                          <Input
                            placeholder="Roll No."
                            value={newStudent.rollNumber}
                            onChange={(e) =>
                              setNewStudent((prev) => ({
                                ...prev,
                                rollNumber: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Parent/Guardian Name</Label>
                        <Input
                          placeholder="Enter parent's name"
                          value={newStudent.parentContact}
                          onChange={(e) =>
                            setNewStudent((prev) => ({
                              ...prev,
                              parentContact: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            placeholder="email@school.edu"
                            value={newStudent.email}
                            onChange={(e) =>
                              setNewStudent((prev) => ({ ...prev, email: e.target.value }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Student Name</Label>
                          <Input
                            placeholder="Enter student's name"
                            value={newStudent.name}
                            onChange={(e) =>
                              setNewStudent((prev) => ({ ...prev, name: e.target.value }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                      <Button className="bg-primary hover:bg-primary/90" onClick={handleCreate}>Enroll Student</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions Toolbar */}
        {selectedStudents.size > 0 && (
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                <p className="text-xs sm:text-sm font-medium">
                  {selectedStudents.size} student(s) selected
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleBulkUpdateStatus('Active')}
                  >
                    Mark Active
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleBulkUpdateStatus('AtRisk')}
                  >
                    Mark At Risk
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleExportCSV}
                  >
                    Export CSV
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedStudents(new Set())}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Students Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto -mx-1 sm:mx-0">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="px-2 py-2 sm:px-6 sm:py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedStudents.size === filteredStudents.length && filteredStudents.length > 0}
                        onChange={handleSelectAll}
                        className="rounded w-3.5 h-3.5 sm:w-4 sm:h-4"
                      />
                    </th>
                    <th className="px-3 py-2 sm:px-6 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student</th>
                    <th className="px-3 py-2 sm:px-6 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Class</th>
                    <th className="px-3 py-2 sm:px-6 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Attendance</th>
                    <th className="px-3 py-2 sm:px-6 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Performance</th>
                    <th className="px-3 py-2 sm:px-6 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Parent</th>
                    <th className="px-3 py-2 sm:px-6 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-2 py-2 sm:px-6 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider w-10">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-2 py-2 sm:px-6 sm:py-4">
                        <input
                          type="checkbox"
                          checked={selectedStudents.has(student.id)}
                          onChange={() => handleToggleSelection(student.id)}
                          className="rounded w-3.5 h-3.5 sm:w-4 sm:h-4"
                        />
                      </td>
                      <td className="px-3 py-2 sm:px-6 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs sm:text-sm flex-shrink-0">
                            {student.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-sm sm:text-base truncate">{student.name}</div>
                            <div className="text-xs sm:text-sm text-muted-foreground truncate">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 sm:px-6 sm:py-4 hidden sm:table-cell">
                        <div>
                          <div className="font-medium">{student.classId || '-'}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">Roll #{student.rollNumber}</div>
                        </div>
                      </td>
                      <td className="px-3 py-2 sm:px-6 sm:py-4 hidden md:table-cell">
                        <div className="w-24 sm:w-32">
                          <div className="flex justify-between text-xs sm:text-sm mb-1">
                            <span>{student.attendancePercentage}%</span>
                          </div>
                          <Progress 
                            value={student.attendancePercentage} 
                            className={`h-2 ${student.attendancePercentage < 75 ? '[&>div]:bg-red-500' : ''}`}
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2 sm:px-6 sm:py-4 hidden md:table-cell">
                        <div className="w-24 sm:w-32">
                          <div className="flex justify-between text-xs sm:text-sm mb-1">
                            <span>{student.performanceScore}%</span>
                          </div>
                          <Progress value={student.performanceScore} className="h-2" />
                        </div>
                      </td>
                      <td className="px-3 py-2 sm:px-6 sm:py-4 hidden lg:table-cell">
                        <div className="text-xs sm:text-sm truncate">{student.parentContact}</div>
                      </td>
                      <td className="px-3 py-2 sm:px-6 sm:py-4">
                        <Badge 
                          className={`text-[10px] sm:text-xs ${student.status === 'Active' 
                            ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                            : 'bg-red-100 text-red-700 hover:bg-red-100'
                          }`}
                        >
                          {student.status === 'Active' ? 'Active' : 'At Risk'}
                        </Badge>
                      </td>
                      <td className="px-2 py-2 sm:px-6 sm:py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                              <MoreHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2" onClick={() => navigate(`/admin/students/${student.id}`)}>
                              <Eye className="w-4 h-4" /> View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Edit className="w-4 h-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 text-destructive"
                              onClick={() => handleDelete(student.id)}
                            >
                              <Trash2 className="w-4 h-4" /> Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminStudents;
