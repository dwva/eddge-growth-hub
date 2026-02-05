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
  Filter, 
  MoreHorizontal,
  Mail,
  Phone,
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

const AdminTeachers = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAdminData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subjects: [] as string[],
    status: 'Active' as 'Active' | 'OnLeave',
  });

  // Get unique subjects from all teachers
  const allSubjects = useMemo(() => {
    const subjects = new Set<string>();
    state.teachers.forEach(t => t.subjects.forEach(s => subjects.add(s)));
    return Array.from(subjects).sort();
  }, [state.teachers]);

  // Compute stats
  const stats = useMemo(() => {
    const total = state.teachers.length;
    const active = state.teachers.filter(t => t.status === 'Active').length;
    const onLeave = state.teachers.filter(t => t.status === 'OnLeave').length;
    const thisMonth = new Date();
    const newThisMonth = state.teachers.filter(t => {
      const joinDate = new Date(t.joinDate);
      return joinDate.getMonth() === thisMonth.getMonth() && 
             joinDate.getFullYear() === thisMonth.getFullYear();
    }).length;
    return { total, active, onLeave, newThisMonth };
  }, [state.teachers]);

  const filteredTeachers = useMemo(() => {
    return state.teachers.filter(teacher => {
      const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           teacher.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'all' || 
                            teacher.subjects.some(s => s === selectedSubject);
      return matchesSearch && matchesSubject;
    });
  }, [state.teachers, searchQuery, selectedSubject]);

  // Get classes taught by a teacher (derived from classes where they are class teacher)
  const getTeacherClasses = (teacherId: number) => {
    return state.classes
      .filter(c => c.classTeacherId === teacherId)
      .map(c => `${c.grade}-${c.section}`);
  };

  const handleAddTeacher = () => {
    if (!formData.name || !formData.email || formData.subjects.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newTeacher = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subjects: formData.subjects,
      status: formData.status,
      joinDate: new Date().toISOString().split('T')[0],
    };

    dispatch({ type: 'ADD_TEACHER', payload: newTeacher });
    toast({
      title: 'Success',
      description: 'Teacher added successfully.',
    });
    setIsAddDialogOpen(false);
    setFormData({ name: '', email: '', phone: '', subjects: [], status: 'Active' });
  };

  const handleEditTeacher = (teacherId: number) => {
    const teacher = state.teachers.find(t => t.id === teacherId);
    if (!teacher) return;
    setEditingTeacher(teacherId);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      subjects: teacher.subjects,
      status: teacher.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateTeacher = () => {
    if (!editingTeacher || !formData.name || !formData.email || formData.subjects.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const updatedTeacher = {
      ...state.teachers.find(t => t.id === editingTeacher)!,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subjects: formData.subjects,
      status: formData.status,
    };

    dispatch({ type: 'UPDATE_TEACHER', payload: updatedTeacher });
    toast({
      title: 'Success',
      description: 'Teacher updated successfully.',
    });
    setIsEditDialogOpen(false);
    setEditingTeacher(null);
    setFormData({ name: '', email: '', phone: '', subjects: [], status: 'Active' });
  };

  const handleDeleteTeacher = (teacherId: number) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      dispatch({ type: 'DELETE_TEACHER', payload: { id: teacherId } });
      toast({
        title: 'Success',
        description: 'Teacher deleted successfully.',
      });
    }
  };

  const toggleSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  return (
    <AdminDashboardLayout 
      pageTitle="Teachers" 
      pageDescription="Manage all teaching staff"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Teachers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-amber-600">{stats.onLeave}</div>
              <div className="text-sm text-muted-foreground">On Leave</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.newThisMonth}</div>
              <div className="text-sm text-muted-foreground">New This Month</div>
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
                  placeholder="Search teachers by name or email..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {allSubjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  More Filters
                </Button>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4" />
                      Add Teacher
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Teacher</DialogTitle>
                      <DialogDescription>
                        Fill in the details to add a new teacher to the system.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input 
                          placeholder="Enter teacher's name" 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input 
                            placeholder="email@school.edu" 
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input 
                            placeholder="+91 98765 43210" 
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Subjects</Label>
                        <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[60px]">
                          {formData.subjects.length === 0 ? (
                            <span className="text-sm text-muted-foreground">No subjects selected</span>
                          ) : (
                            formData.subjects.map(subject => (
                              <Badge key={subject} variant="secondary" className="cursor-pointer" onClick={() => toggleSubject(subject)}>
                                {subject} ×
                              </Badge>
                            ))
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {['Mathematics', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology'].map(subject => (
                            <Button
                              key={subject}
                              type="button"
                              variant={formData.subjects.includes(subject) ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => toggleSubject(subject)}
                            >
                              {subject}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={formData.status} onValueChange={(value: 'Active' | 'OnLeave') => setFormData({ ...formData, status: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="OnLeave">On Leave</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {
                        setIsAddDialogOpen(false);
                        setFormData({ name: '', email: '', phone: '', subjects: [], status: 'Active' });
                      }}>Cancel</Button>
                      <Button className="bg-primary hover:bg-primary/90" onClick={handleAddTeacher}>Add Teacher</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Teacher</DialogTitle>
                      <DialogDescription>
                        Update the teacher's details.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input 
                          placeholder="Enter teacher's name" 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input 
                            placeholder="email@school.edu" 
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input 
                            placeholder="+91 98765 43210" 
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Subjects</Label>
                        <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[60px]">
                          {formData.subjects.length === 0 ? (
                            <span className="text-sm text-muted-foreground">No subjects selected</span>
                          ) : (
                            formData.subjects.map(subject => (
                              <Badge key={subject} variant="secondary" className="cursor-pointer" onClick={() => toggleSubject(subject)}>
                                {subject} ×
                              </Badge>
                            ))
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {['Mathematics', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology'].map(subject => (
                            <Button
                              key={subject}
                              type="button"
                              variant={formData.subjects.includes(subject) ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => toggleSubject(subject)}
                            >
                              {subject}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={formData.status} onValueChange={(value: 'Active' | 'OnLeave') => setFormData({ ...formData, status: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="OnLeave">On Leave</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {
                        setIsEditDialogOpen(false);
                        setEditingTeacher(null);
                        setFormData({ name: '', email: '', phone: '', subjects: [], status: 'Active' });
                      }}>Cancel</Button>
                      <Button className="bg-primary hover:bg-primary/90" onClick={handleUpdateTeacher}>Update Teacher</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teachers Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Teacher</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Classes</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                            {teacher.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-medium">{teacher.name}</div>
                            <div className="text-sm text-muted-foreground">Joined {new Date(teacher.joinDate).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            {teacher.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {teacher.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {teacher.subjects.map((subject) => (
                            <Badge key={subject} variant="secondary" className="text-xs">{subject}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {getTeacherClasses(teacher.id).map((cls) => (
                            <Badge key={cls} variant="outline" className="text-xs">{cls}</Badge>
                          ))}
                          {getTeacherClasses(teacher.id).length === 0 && (
                            <span className="text-sm text-muted-foreground">No classes assigned</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          className={teacher.status === 'Active' 
                            ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                          }
                        >
                          {teacher.status === 'Active' ? 'Active' : 'On Leave'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2" onClick={() => navigate(`/admin/teachers/${teacher.id}`)}>
                              <Eye className="w-4 h-4" /> View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={() => handleEditTeacher(teacher.id)}>
                              <Edit className="w-4 h-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDeleteTeacher(teacher.id)}>
                              <Trash2 className="w-4 h-4" /> Delete
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

export default AdminTeachers;
