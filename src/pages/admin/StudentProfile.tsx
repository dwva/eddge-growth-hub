import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import AdminDashboardLayout from '@/components/layout/AdminDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  TrendingUp,
  User,
  FileText,
  Plus
} from 'lucide-react';
import { useAdminData } from '@/contexts/AdminDataContext';
import { 
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { format, subDays } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const StudentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useAdminData();
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState('');

  const student = useMemo(() => {
    return state.students.find(s => s.id === id);
  }, [state.students, id]);

  const studentClass = useMemo(() => {
    if (!student?.classId) return null;
    return state.classes.find(c => c.id === student.classId);
  }, [student, state.classes]);

  const classTeacher = useMemo(() => {
    if (!studentClass?.classTeacherId) return null;
    return state.teachers.find(t => t.id === studentClass.classTeacherId);
  }, [studentClass, state.teachers]);

  // Get attendance history for this student's class
  const attendanceHistory = useMemo(() => {
    if (!studentClass) return [];
    const classRecords = state.attendanceRecords
      .filter(r => r.classId === studentClass.id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30); // Last 30 days
    
    return classRecords.map(record => ({
      date: format(new Date(record.date), 'MMM dd'),
      attendance: record.total > 0 
        ? Math.round((record.presentCount / (record.presentCount + record.absentCount + record.lateCount)) * 100)
        : 0,
    }));
  }, [studentClass, state.attendanceRecords]);

  // Generate performance trend (synthetic for now)
  const performanceTrend = useMemo(() => {
    if (!student) return [];
    const baseScore = student.performanceScore;
    return Array.from({ length: 7 }, (_, i) => ({
      month: format(subDays(new Date(), (6 - i) * 30), 'MMM'),
      score: Math.max(60, Math.min(100, baseScore + (Math.random() * 10 - 5))),
    }));
  }, [student]);

  // Get student notes (stored in a simple array for now - can be enhanced)
  const studentNotes = useMemo(() => {
    // For now, return empty array - can be enhanced to store notes in state
    return [];
  }, []);

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a note.',
        variant: 'destructive',
      });
      return;
    }
    // For now, just show a toast - can be enhanced to store notes
    toast({
      title: 'Note Added',
      description: 'Note functionality will be enhanced in future updates.',
    });
    setNewNote('');
    setIsNoteDialogOpen(false);
  };

  if (!student) {
    return (
      <AdminDashboardLayout pageTitle="Student Not Found" pageDescription="">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">Student not found</p>
          <Button onClick={() => navigate('/admin/students')}>Back to Students</Button>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout 
      pageTitle={`${student.name}`}
      pageDescription={`Student Profile - ${studentClass ? `Class ${studentClass.grade}-${studentClass.section}` : 'No Class Assigned'}`}
    >
      <div className="space-y-3 md:space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/admin/students')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Students
        </Button>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Basic Information</CardTitle>
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
                <p className="font-medium">{student.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {student.email}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Roll Number</Label>
                <p className="font-medium">{student.rollNumber}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Class</Label>
                <p className="font-medium">
                  {studentClass ? `Class ${studentClass.grade}-${studentClass.section}` : 'Not Assigned'}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <Badge 
                  className={student.status === 'Active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                  }
                >
                  {student.status}
                </Badge>
              </div>
              <div>
                <Label className="text-muted-foreground">Class Teacher</Label>
                <p className="font-medium">{classTeacher?.name || 'Not Assigned'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{student.attendancePercentage}%</p>
                  <p className="text-sm text-muted-foreground">Attendance</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{student.performanceScore}%</p>
                  <p className="text-sm text-muted-foreground">Performance</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{studentClass ? state.students.filter(s => s.classId === studentClass.id).length : 0}</p>
                  <p className="text-sm text-muted-foreground">Class Size</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance History */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
            </CardHeader>
            <CardContent>
              {attendanceHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No attendance data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={attendanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="attendance" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[60, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Guardian Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Guardian Information</CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Parent/Guardian Contact</Label>
              <p className="font-medium">{student.parentContact}</p>
            </div>
          </CardContent>
        </Card>

        {/* Admin Notes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Admin Notes & Flags</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => setIsNoteDialogOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Add Note
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {studentNotes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No notes yet. Add a note to track important information about this student.
              </div>
            ) : (
              <div className="space-y-3">
                {studentNotes.map((note, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <p className="text-sm">{note}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Note Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Admin Note</DialogTitle>
            <DialogDescription>
              Add a note about this student for administrative purposes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Note</Label>
              <Textarea 
                placeholder="Enter your note here..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsNoteDialogOpen(false);
              setNewNote('');
            }}>Cancel</Button>
            <Button onClick={handleAddNote}>Add Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminDashboardLayout>
  );
};

export default StudentProfile;

