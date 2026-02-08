import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from '@/contexts/AdminDataContext';
import type { Syllabus, SyllabusBoard, SyllabusStatus } from '@/types/admin';
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
  Edit,
  Trash2,
  Eye,
  BookOpen,
  FileText,
  CheckCircle,
  XCircle,
  ArrowRight,
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
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import CreateSyllabusWizard from '@/components/admin/syllabus/CreateSyllabusWizard';

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const AdminSyllabus = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAdminData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBoard, setSelectedBoard] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false);
  const [editingSyllabus, setEditingSyllabus] = useState<Syllabus | null>(null);
  const [viewingSyllabus, setViewingSyllabus] = useState<Syllabus | null>(null);

  // Safely get syllabi array, defaulting to empty array if undefined
  const syllabi = Array.isArray(state.syllabi) ? state.syllabi : [];
  const totalSyllabi = syllabi.length;
  const publishedCount = syllabi.filter((s) => s.status === 'published').length;
  const draftCount = syllabi.filter((s) => s.status === 'draft').length;
  const boards = Array.from(new Set(syllabi.map((s) => s.board)));

  const filteredSyllabi = syllabi.filter((syllabus) => {
    const matchesSearch =
      syllabus.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      syllabus.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
      syllabus.academicYear.includes(searchQuery);
    const matchesBoard = selectedBoard === 'all' || syllabus.board === selectedBoard;
    const matchesStatus = selectedStatus === 'all' || syllabus.status === selectedStatus;
    return matchesSearch && matchesBoard && matchesStatus;
  });

  const handleDelete = (id: string) => {
    const syllabus = (state.syllabi || []).find((s) => s.id === id);
    if (syllabus?.status === 'published') {
      toast.error('Cannot delete published syllabus. Unpublish it first.');
      return;
    }
    dispatch({ type: 'DELETE_SYLLABUS', payload: { id } });
    toast.success('Syllabus deleted successfully!');
  };

  const handlePublish = (id: string) => {
    dispatch({ type: 'PUBLISH_SYLLABUS', payload: { id } });
    toast.success('Syllabus published successfully!');
  };

  const handleEdit = (syllabus: Syllabus) => {
    if (syllabus.status === 'published') {
      toast.error('Published syllabus cannot be edited. Create a new draft version.');
      return;
    }
    setEditingSyllabus(syllabus);
    setIsCreateWizardOpen(true);
  };

  const handleView = (syllabus: Syllabus) => {
    setViewingSyllabus(syllabus);
  };

  const handleCloseWizard = () => {
    setIsCreateWizardOpen(false);
    setEditingSyllabus(null);
  };

  const handleSaveSyllabus = (syllabus: Syllabus) => {
    if (editingSyllabus) {
      dispatch({ type: 'UPDATE_SYLLABUS', payload: { ...syllabus, updatedAt: new Date().toISOString() } });
      toast.success('Syllabus updated successfully!');
    } else {
      dispatch({ type: 'ADD_SYLLABUS', payload: syllabus });
      toast.success('Syllabus created successfully!');
    }
    handleCloseWizard();
  };

  return (
    <AdminDashboardLayout
      pageTitle="Syllabus Management"
      pageDescription="Manage curriculum and syllabus for all classes"
    >
      <div className="space-y-2 sm:space-y-4 md:space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-2.5 sm:p-4 flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-2xl font-bold">{totalSyllabi}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Total Syllabi</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2.5 sm:p-4 flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-2xl font-bold">{publishedCount}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Published</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2.5 sm:p-4 flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-amber-600" />
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-2xl font-bold">{draftCount}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Drafts</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2.5 sm:p-4 flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-2xl font-bold">{boards.length}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Boards</div>
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
                  placeholder="Search by subject, class, or year..."
                  className="pl-8 sm:pl-10 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                  <SelectTrigger className="h-9 w-full sm:w-28 min-w-0 text-sm">
                    <SelectValue placeholder="Board" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Boards</SelectItem>
                    <SelectItem value="CBSE">CBSE</SelectItem>
                    <SelectItem value="ICSE">ICSE</SelectItem>
                    <SelectItem value="STATE">STATE</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="h-9 w-full sm:w-28 min-w-0 text-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-9">
                  <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  More Filters
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-9 bg-primary hover:bg-primary/90 flex-1 sm:flex-initial"
                  onClick={() => {
                    setEditingSyllabus(null);
                    setIsCreateWizardOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add New Syllabus
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Syllabus Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto -mx-1 sm:mx-0">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="px-2 py-2 sm:px-6 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                      Board
                    </th>
                    <th className="px-2 py-2 sm:px-6 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                      Year
                    </th>
                    <th className="px-2 py-2 sm:px-6 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                      Class
                    </th>
                    <th className="px-2 py-2 sm:px-6 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                      Subject
                    </th>
                    <th className="px-2 py-2 sm:px-6 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
                      Ch.
                    </th>
                    <th className="px-2 py-2 sm:px-6 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-2 py-2 sm:px-6 sm:py-4 text-left w-10">
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredSyllabi.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-3 sm:px-6 py-6 sm:py-12 text-center text-muted-foreground">
                        <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-4 opacity-50" />
                        <p className="text-sm sm:text-base font-medium">No syllabus found</p>
                        <p className="text-xs sm:text-sm mt-1 sm:mt-2">Create your first syllabus to get started</p>
                        <Button
                          size="sm"
                          className="mt-3 sm:mt-4 gap-1.5 h-8 text-xs sm:text-sm"
                          onClick={() => setIsCreateWizardOpen(true)}
                        >
                          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          Add New Syllabus
                        </Button>
                      </td>
                    </tr>
                  ) : (
                    filteredSyllabi.map((syllabus) => (
                      <tr key={syllabus.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-2 py-2 sm:px-6 sm:py-4">
                          <Badge variant="outline">{syllabus.board}</Badge>
                        </td>
                        <td className="px-2 py-2 sm:px-6 sm:py-4 hidden md:table-cell">
                          <div className="font-medium text-sm">{syllabus.academicYear}</div>
                        </td>
                        <td className="px-2 py-2 sm:px-6 sm:py-4">
                          <div className="font-medium text-xs sm:text-sm">Class {syllabus.class}</div>
                        </td>
                        <td className="px-2 py-2 sm:px-6 sm:py-4">
                          <div className="font-medium text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">{syllabus.subject}</div>
                        </td>
                        <td className="px-2 py-2 sm:px-6 sm:py-4 hidden sm:table-cell">
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            {syllabus.chapters.length} chapter{syllabus.chapters.length !== 1 ? 's' : ''}
                          </div>
                        </td>
                        <td className="px-2 py-2 sm:px-6 sm:py-4">
                          <Badge
                            className={`text-[10px] sm:text-xs ${syllabus.status === 'published'
                              ? 'bg-green-100 text-green-700 hover:bg-green-100'
                              : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                            }`}
                          >
                            {syllabus.status === 'published' ? 'Published' : 'Draft'}
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
                              <DropdownMenuItem className="gap-2" onClick={() => handleView(syllabus)}>
                                <Eye className="w-4 h-4" /> View Details
                              </DropdownMenuItem>
                              {syllabus.status === 'draft' && (
                                <>
                                  <DropdownMenuItem className="gap-2" onClick={() => handleEdit(syllabus)}>
                                    <Edit className="w-4 h-4" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="gap-2 text-green-600"
                                    onClick={() => handlePublish(syllabus.id)}
                                  >
                                    <CheckCircle className="w-4 h-4" /> Publish
                                  </DropdownMenuItem>
                                </>
                              )}
                              {syllabus.status === 'draft' && (
                                <DropdownMenuItem
                                  className="gap-2 text-destructive"
                                  onClick={() => handleDelete(syllabus.id)}
                                >
                                  <Trash2 className="w-4 h-4" /> Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Wizard */}
      <CreateSyllabusWizard
        open={isCreateWizardOpen}
        onClose={handleCloseWizard}
        onSave={handleSaveSyllabus}
        editingSyllabus={editingSyllabus}
      />

      {/* View Syllabus Dialog */}
      <Dialog open={!!viewingSyllabus} onOpenChange={() => setViewingSyllabus(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {viewingSyllabus?.board} - Class {viewingSyllabus?.class} - {viewingSyllabus?.subject}
            </DialogTitle>
            <DialogDescription>
              Academic Year: {viewingSyllabus?.academicYear}
            </DialogDescription>
          </DialogHeader>
          {viewingSyllabus && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4">
                <Badge
                  className={
                    viewingSyllabus.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }
                >
                  {viewingSyllabus.status === 'published' ? 'Published' : 'Draft'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Created: {new Date(viewingSyllabus.createdAt).toLocaleDateString()}
                </span>
                {viewingSyllabus.publishedAt && (
                  <span className="text-sm text-muted-foreground">
                    Published: {new Date(viewingSyllabus.publishedAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Chapters & Topics</h3>
                {viewingSyllabus.chapters.length === 0 ? (
                  <p className="text-muted-foreground">No chapters added yet.</p>
                ) : (
                  <div className="space-y-4">
                    {viewingSyllabus.chapters
                      .sort((a, b) => a.order - b.order)
                      .map((chapter, idx) => (
                        <Card key={chapter.id}>
                          <CardHeader>
                            <CardTitle className="text-base">
                              Chapter {chapter.order}: {chapter.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {chapter.topics.length === 0 ? (
                              <p className="text-sm text-muted-foreground">No topics added.</p>
                            ) : (
                              <ul className="space-y-2">
                                {chapter.topics.map((topic) => (
                                  <li key={topic.id} className="flex items-center gap-2 text-sm">
                                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                    <span>{topic.name}</span>
                                    {topic.weightage && (
                                      <Badge variant="outline" className="ml-auto">
                                        {topic.weightage}%
                                      </Badge>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingSyllabus(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminDashboardLayout>
  );
};

export default AdminSyllabus;

