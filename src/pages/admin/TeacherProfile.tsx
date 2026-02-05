import { useParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import AdminDashboardLayout from '@/components/layout/AdminDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Users,
  BookOpen,
  Calendar
} from 'lucide-react';
import { useAdminData } from '@/contexts/AdminDataContext';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';

const TeacherProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useAdminData();

  const teacher = useMemo(() => {
    return state.teachers.find(t => t.id === id);
  }, [state.teachers, id]);

  const classesTaught = useMemo(() => {
    if (!teacher) return [];
    return state.classes.filter(c => c.classTeacherId === teacher.id);
  }, [teacher, state.classes]);

  const totalStudentsTaught = useMemo(() => {
    return classesTaught.reduce((sum, cls) => {
      return sum + state.students.filter(s => s.classId === cls.id).length;
    }, 0);
  }, [classesTaught, state.students]);

  if (!teacher) {
    return (
      <AdminDashboardLayout pageTitle="Teacher Not Found" pageDescription="">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">Teacher not found</p>
          <Button onClick={() => navigate('/admin/teachers')}>Back to Teachers</Button>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout 
      pageTitle={teacher.name}
      pageDescription="Teacher Profile"
    >
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/admin/teachers')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Teachers
        </Button>

        {/* Contact & Subjects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Contact & Subjects</CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="font-medium">{teacher.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {teacher.email}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Phone</Label>
                <p className="font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {teacher.phone}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <Badge 
                  className={teacher.status === 'Active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-amber-100 text-amber-700'
                  }
                >
                  {teacher.status}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Subjects</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {teacher.subjects.map(subject => (
                  <Badge key={subject} variant="secondary">{subject}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Classes Taught */}
        <Card>
          <CardHeader>
            <CardTitle>Classes Taught</CardTitle>
          </CardHeader>
          <CardContent>
            {classesTaught.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No classes assigned
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classesTaught.map(cls => {
                  const studentCount = state.students.filter(s => s.classId === cls.id).length;
                  return (
                    <div 
                      key={cls.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/admin/classes/${cls.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Class {cls.grade}-{cls.section}</p>
                          <p className="text-sm text-muted-foreground">{studentCount} students</p>
                        </div>
                        <BookOpen className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Workload Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{classesTaught.length}</p>
                  <p className="text-sm text-muted-foreground">Classes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalStudentsTaught}</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{teacher.subjects.length}</p>
                  <p className="text-sm text-muted-foreground">Subjects</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Status Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div>
                  <p className="font-medium">Joined School</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(teacher.joinDate), 'MMMM dd, yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${teacher.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}`} />
                <div>
                  <p className="font-medium">Current Status: {teacher.status}</p>
                  <p className="text-sm text-muted-foreground">As of today</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
};

export default TeacherProfile;

