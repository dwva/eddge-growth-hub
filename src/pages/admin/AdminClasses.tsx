import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboardLayout from '@/components/layout/AdminDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Users,
  BookOpen,
  Clock,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye
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
import { useAdminData } from '@/contexts/AdminDataContext';
import { toast } from '@/hooks/use-toast';

const AdminClasses = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAdminData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    grade: '',
    section: '',
    classTeacherId: '',
    schedule: 'Morning Shift',
  });

  // Compute class stats with derived fields
  const classesWithStats = useMemo(() => {
    return state.classes.map(cls => {
      const studentsInClass = state.students.filter(s => s.classId === cls.id);
      const studentCount = studentsInClass.length;
      const avgPerformance = studentCount > 0
        ? studentsInClass.reduce((sum, s) => sum + s.performanceScore, 0) / studentCount
        : 0;
      const teacher = state.teachers.find(t => t.id === cls.classTeacherId);
      return {
        ...cls,
        studentCount,
        averagePerformance: Math.round(avgPerformance),
        teacherName: teacher?.name || 'Unassigned',
      };
    });
  }, [state.classes, state.students, state.teachers]);

  // Compute overall stats
  const stats = useMemo(() => {
    const totalClasses = state.classes.length;
    const totalStudents = state.students.length;
    const avgStudentsPerClass = totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;
    const avgPerformance = classesWithStats.length > 0
      ? Math.round(classesWithStats.reduce((sum, c) => sum + c.averagePerformance, 0) / classesWithStats.length)
      : 0;
    return { totalClasses, totalStudents, avgStudentsPerClass, avgPerformance };
  }, [state.classes.length, state.students.length, classesWithStats]);

  const filteredClasses = useMemo(() => {
    return classesWithStats.filter(cls => {
      const matchesSearch = `${cls.grade}-${cls.section}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           cls.teacherName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGrade = selectedGrade === 'all' || cls.grade === selectedGrade;
      return matchesSearch && matchesGrade;
    });
  }, [classesWithStats, searchQuery, selectedGrade]);

  const handleAddClass = () => {
    if (!formData.grade || !formData.section || !formData.classTeacherId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newClass = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      grade: formData.grade,
      section: formData.section,
      classTeacherId: parseInt(formData.classTeacherId),
    };

    dispatch({ type: 'ADD_CLASS', payload: newClass });
    toast({
      title: 'Success',
      description: 'Class created successfully.',
    });
    setIsAddDialogOpen(false);
    setFormData({ grade: '', section: '', classTeacherId: '', schedule: 'Morning Shift' });
  };

  const handleEditClass = (classId: number) => {
    const cls = state.classes.find(c => c.id === classId);
    if (!cls) return;
    setEditingClass(classId);
    setFormData({
      grade: cls.grade,
      section: cls.section,
      classTeacherId: cls.classTeacherId.toString(),
      schedule: 'Morning Shift',
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateClass = () => {
    if (!editingClass || !formData.grade || !formData.section || !formData.classTeacherId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const updatedClass = {
      ...state.classes.find(c => c.id === editingClass)!,
      grade: formData.grade,
      section: formData.section,
      classTeacherId: parseInt(formData.classTeacherId),
    };

    dispatch({ type: 'UPDATE_CLASS', payload: updatedClass });
    toast({
      title: 'Success',
      description: 'Class updated successfully.',
    });
    setIsEditDialogOpen(false);
    setEditingClass(null);
    setFormData({ grade: '', section: '', classTeacherId: '', schedule: 'Morning Shift' });
  };

  const handleDeleteClass = (classId: number) => {
    if (confirm('Are you sure you want to delete this class? This will also remove all students from this class.')) {
      // Remove students from this class
      state.students
        .filter(s => s.classId === classId)
        .forEach(student => {
          dispatch({ type: 'UPDATE_STUDENT', payload: { ...student, classId: 0 } });
        });
      
      dispatch({ type: 'DELETE_CLASS', payload: { id: classId } });
      toast({
        title: 'Success',
        description: 'Class deleted successfully.',
      });
    }
  };

  return (
    <AdminDashboardLayout 
      pageTitle="Classes" 
      pageDescription="Manage all classes and sections"
    >
      <div className="space-y-3 md:space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalClasses}</div>
                <div className="text-sm text-muted-foreground">Total Classes</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Students</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.avgStudentsPerClass}</div>
                <div className="text-sm text-muted-foreground">Avg. Students/Class</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.avgPerformance}%</div>
                <div className="text-sm text-muted-foreground">Avg. Performance</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search classes or teachers..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    <SelectItem value="9">Grade 9</SelectItem>
                    <SelectItem value="10">Grade 10</SelectItem>
                    <SelectItem value="11">Grade 11</SelectItem>
                    <SelectItem value="12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4" />
                      Add Class
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Class</DialogTitle>
                      <DialogDescription>
                        Create a new class with section details.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Grade</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="9">Grade 9</SelectItem>
                              <SelectItem value="10">Grade 10</SelectItem>
                              <SelectItem value="11">Grade 11</SelectItem>
                              <SelectItem value="12">Grade 12</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Section</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Section" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">Section A</SelectItem>
                              <SelectItem value="B">Section B</SelectItem>
                              <SelectItem value="C">Section C</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                        <div className="space-y-2">
                          <Label>Class Teacher</Label>
                          <Select value={formData.classTeacherId} onValueChange={(value) => setFormData({ ...formData, classTeacherId: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select teacher" />
                            </SelectTrigger>
                            <SelectContent>
                              {state.teachers.filter(t => t.status === 'Active').map(teacher => (
                                <SelectItem key={teacher.id} value={teacher.id.toString()}>{teacher.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {
                        setIsAddDialogOpen(false);
                        setFormData({ grade: '', section: '', classTeacherId: '', schedule: 'Morning Shift' });
                      }}>Cancel</Button>
                      <Button className="bg-primary hover:bg-primary/90" onClick={handleAddClass}>Create Class</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => (
            <Card key={cls.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Class {cls.grade}-{cls.section}</CardTitle>
                      <p className="text-sm text-muted-foreground">Grade {cls.grade}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2" onClick={() => navigate(`/admin/classes/${cls.id}`)}>
                        <Eye className="w-4 h-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2" onClick={() => handleEditClass(cls.id)}>
                        <Edit className="w-4 h-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDeleteClass(cls.id)}>
                        <Trash2 className="w-4 h-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{cls.studentCount} Students</span>
                  <span className="mx-2">•</span>
                  <span>{cls.teacherName}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Performance</span>
                  <Badge 
                    className={cls.averagePerformance >= 80 
                      ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                      : cls.averagePerformance >= 70 
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                        : 'bg-red-100 text-red-700 hover:bg-red-100'
                    }
                  >
                    {cls.averagePerformance}% Avg
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Class</DialogTitle>
              <DialogDescription>
                Update the class details.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Grade</Label>
                  <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9">Grade 9</SelectItem>
                      <SelectItem value="10">Grade 10</SelectItem>
                      <SelectItem value="11">Grade 11</SelectItem>
                      <SelectItem value="12">Grade 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Section</Label>
                  <Select value={formData.section} onValueChange={(value) => setFormData({ ...formData, section: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Section A</SelectItem>
                      <SelectItem value="B">Section B</SelectItem>
                      <SelectItem value="C">Section C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Class Teacher</Label>
                <Select value={formData.classTeacherId} onValueChange={(value) => setFormData({ ...formData, classTeacherId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.teachers.filter(t => t.status === 'Active').map(teacher => (
                      <SelectItem key={teacher.id} value={teacher.id.toString()}>{teacher.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsEditDialogOpen(false);
                setEditingClass(null);
                setFormData({ grade: '', section: '', classTeacherId: '', schedule: 'Morning Shift' });
              }}>Cancel</Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={handleUpdateClass}>Update Class</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminClasses;
