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
import { 
  Search, Plus, FileText, Pencil, Trash2, AlertCircle, CheckCircle, 
  AlertTriangle, Calendar, Filter, ThumbsUp, ThumbsDown, Eye
} from 'lucide-react';
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
        <h2 className="text-sm font-semibold mb-2">Class Teacher Mode Required</h2>
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

  // Group notes by date
  const groupedNotes = filteredNotes.reduce((acc, note) => {
    const date = note.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(note);
    return acc;
  }, {} as Record<string, typeof behaviourNotes>);

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'positive': return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: CheckCircle, iconColor: 'text-emerald-500' };
      case 'attention': return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: AlertTriangle, iconColor: 'text-amber-500' };
      case 'concern': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: AlertCircle, iconColor: 'text-red-500' };
      default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: Eye, iconColor: 'text-gray-500' };
    }
  };

  const countByType = {
    positive: notes.filter(n => n.type === 'positive').length,
    attention: notes.filter(n => n.type === 'attention').length,
    concern: notes.filter(n => n.type === 'concern').length,
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
    <div className="space-y-6 max-w-[1600px]">
      {/* Page Header - Clean */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900">Behaviour & Notes</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">Track and record student behavior observations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingNote(null);
            setFormData({ studentId: '', type: 'positive', description: '', date: new Date().toISOString().split('T')[0] });
          }
        }}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 h-10 rounded-xl">
              <Plus className="w-4 h-4" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingNote ? 'Edit Note' : 'Add New Note'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-sm">Student</Label>
                <Select value={formData.studentId} onValueChange={(v) => setFormData(prev => ({ ...prev, studentId: v }))}>
                  <SelectTrigger className="rounded-xl">
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
                <Label className="text-sm">Note Type</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'positive', label: 'Positive', icon: ThumbsUp, color: 'emerald' },
                    { value: 'attention', label: 'Attention', icon: AlertTriangle, color: 'amber' },
                    { value: 'concern', label: 'Concern', icon: ThumbsDown, color: 'red' },
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.type === type.value 
                          ? `border-${type.color}-500 bg-${type.color}-50` 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <type.icon className={`w-5 h-5 mx-auto mb-1 ${formData.type === type.value ? `text-${type.color}-600` : 'text-gray-400'}`} />
                      <span className={`text-xs font-medium ${formData.type === type.value ? `text-${type.color}-700` : 'text-gray-600'}`}>
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Description</Label>
                <Textarea
                  placeholder="Describe the observation..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="rounded-xl resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              <Button onClick={handleSubmit} className="w-full rounded-xl">
                {editingNote ? 'Update Note' : 'Save Note'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <ThumbsUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-700">{countByType.positive}</p>
              <p className="text-xs text-emerald-600">Positive</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-700">{countByType.attention}</p>
              <p className="text-xs text-amber-600">Attention</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-red-700">{countByType.concern}</p>
              <p className="text-xs text-red-600">Concerns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl shadow-sm border-gray-100">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by student or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-44 h-10 rounded-xl border-gray-200">
                <Filter className="w-4 h-4 mr-2 text-gray-400" />
                <SelectValue placeholder="All Types" />
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

      {/* Timeline Notes */}
      {Object.keys(groupedNotes).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedNotes).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()).map(([date, dateNotes]) => (
            <div key={date}>
              {/* Date Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Notes for this date */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dateNotes.map((note) => {
                  const style = getTypeStyle(note.type);
                  const Icon = style.icon;
                  
                  return (
                    <Card 
                      key={note.id} 
                      className={`rounded-2xl overflow-hidden border-2 ${style.border} ${style.bg} hover:shadow-md transition-shadow`}
                    >
                      <CardContent className="p-4">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                              <AvatarFallback className="bg-white text-gray-700 font-semibold text-sm">
                                {note.studentName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-900">{note.studentName}</p>
                              <p className="text-xs text-gray-500">{note.time}</p>
                            </div>
                          </div>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${style.bg}`}>
                            <Icon className={`w-4 h-4 ${style.iconColor}`} />
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-700 leading-relaxed mb-3">
                          {note.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200/50">
                          <Badge variant="outline" className={`text-xs font-medium ${style.text} border-current/30 capitalize`}>
                            {note.type === 'attention' ? 'Needs Attention' : note.type}
                          </Badge>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 rounded-lg hover:bg-white/50"
                              onClick={() => handleEdit(note)}
                            >
                              <Pencil className="w-3.5 h-3.5 text-gray-500" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 rounded-lg hover:bg-white/50"
                              onClick={() => handleDelete(note.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="rounded-2xl shadow-sm border-gray-100">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">No notes found</h3>
              <p className="text-gray-500 text-sm mb-4">
                {searchQuery || typeFilter !== 'all' ? 'Try adjusting your filters' : 'Start by adding a behavior note'}
              </p>
              <Button variant="outline" className="rounded-xl" onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Note
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
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
