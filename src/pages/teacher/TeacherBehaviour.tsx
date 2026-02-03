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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Search, Plus, FileText, Pencil, Trash2, AlertCircle, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { behaviourNotes, classStudents } from '@/data/teacherMockData';
import { toast } from 'sonner';

const TeacherBehaviourContent = () => {
  const navigate = useNavigate();
  const { currentMode } = useTeacherMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [notes, setNotes] = useState(behaviourNotes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<typeof behaviourNotes[0] | null>(null);
  const [formData, setFormData] = useState({
    studentId: '',
    type: 'positive',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

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

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || note.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'positive': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'attention': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'concern': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'positive': return 'default';
      case 'attention': return 'secondary';
      case 'concern': return 'destructive';
      default: return 'outline';
    }
  };

  const handleSubmit = () => {
    const student = classStudents.find(s => s.id === formData.studentId);
    if (!student) {
      toast.error('Please select a student');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    if (editingNote) {
      setNotes(prev => prev.map(n => 
        n.id === editingNote.id 
          ? { ...n, ...formData, studentName: student.name, time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) }
          : n
      ));
      toast.success('Behavior note updated');
    } else {
      const newNote = {
        id: `b${Date.now()}`,
        studentId: formData.studentId,
        studentName: student.name,
        type: formData.type as 'positive' | 'attention' | 'concern',
        description: formData.description,
        date: formData.date,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      };
      setNotes(prev => [newNote, ...prev]);
      toast.success('Behavior note added');
    }

    setIsDialogOpen(false);
    setEditingNote(null);
    setFormData({ studentId: '', type: 'positive', description: '', date: new Date().toISOString().split('T')[0] });
  };

  const handleEdit = (note: typeof behaviourNotes[0]) => {
    setEditingNote(note);
    setFormData({
      studentId: note.studentId,
      type: note.type,
      description: note.description,
      date: note.date,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    toast.success('Behavior note deleted');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/teacher')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Behaviour & Notes</h1>
            <p className="text-muted-foreground">Track and record student behavior observations</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingNote(null);
            setFormData({ studentId: '', type: 'positive', description: '', date: new Date().toISOString().split('T')[0] });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingNote ? 'Edit Behavior Note' : 'Add Behavior Note'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Student</Label>
                <Select value={formData.studentId} onValueChange={(v) => setFormData(prev => ({ ...prev, studentId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {classStudents.map(student => (
                      <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Behavior Type</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData(prev => ({ ...prev, type: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="positive">Positive Recognition</SelectItem>
                    <SelectItem value="attention">Needs Attention</SelectItem>
                    <SelectItem value="concern">Concern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe the behavior observation..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {editingNote ? 'Update Note' : 'Add Note'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by student or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="attention">Needs Attention</SelectItem>
                <SelectItem value="concern">Concern</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notes List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Behavior Notes ({filteredNotes.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredNotes.length > 0 ? (
            filteredNotes.map(note => (
              <div key={note.id} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {note.studentName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{note.studentName}</span>
                    <Badge variant={getTypeBadgeVariant(note.type) as any} className="text-xs capitalize gap-1">
                      {getTypeIcon(note.type)}
                      {note.type === 'attention' ? 'Needs Attention' : note.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{note.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {note.date} at {note.time}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(note)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(note.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No behavior notes found</h3>
              <p className="text-muted-foreground">
                {searchQuery || typeFilter !== 'all' ? 'Try adjusting your filters' : 'Start by adding a behavior note'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const TeacherBehaviour = () => {
  return (
    <TeacherDashboardLayout>
      <TeacherBehaviourContent />
    </TeacherDashboardLayout>
  );
};

export default TeacherBehaviour;
