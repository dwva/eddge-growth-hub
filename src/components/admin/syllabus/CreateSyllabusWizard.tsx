import { useState, useEffect } from 'react';
import type { Syllabus, Chapter, Topic, SyllabusBoard } from '@/types/admin';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, GripVertical, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

interface CreateSyllabusWizardProps {
  open: boolean;
  onClose: () => void;
  onSave: (syllabus: Syllabus) => void;
  editingSyllabus?: Syllabus | null;
}

const CreateSyllabusWizard = ({
  open,
  onClose,
  onSave,
  editingSyllabus,
}: CreateSyllabusWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [basicInfo, setBasicInfo] = useState({
    board: '' as SyllabusBoard | '',
    academicYear: '',
    class: '',
    subject: '',
  });
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    if (editingSyllabus) {
      setBasicInfo({
        board: editingSyllabus.board,
        academicYear: editingSyllabus.academicYear,
        class: editingSyllabus.class,
        subject: editingSyllabus.subject,
      });
      setChapters(editingSyllabus.chapters || []);
      setCurrentStep(1);
    } else {
      setBasicInfo({
        board: '',
        academicYear: new Date().getFullYear().toString() + '-' + (new Date().getFullYear() + 1).toString().slice(-2),
        class: '',
        subject: '',
      });
      setChapters([]);
      setCurrentStep(1);
    }
  }, [editingSyllabus, open]);

  const validateStep1 = (): boolean => {
    if (!basicInfo.board || !basicInfo.academicYear || !basicInfo.class || !basicInfo.subject) {
      toast.error('Please fill all basic information fields.');
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (chapters.length === 0) {
      toast.error('Please add at least one chapter.');
      return false;
    }
    for (const chapter of chapters) {
      if (!chapter.name.trim()) {
        toast.error('All chapters must have a name.');
        return false;
      }
      if (chapter.topics.length === 0) {
        toast.error(`Chapter "${chapter.name}" must have at least one topic.`);
        return false;
      }
      for (const topic of chapter.topics) {
        if (!topic.name.trim()) {
          toast.error('All topics must have a name.');
          return false;
        }
      }
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddChapter = () => {
    const newChapter: Chapter = {
      id: generateId(),
      name: '',
      order: chapters.length + 1,
      topics: [],
    };
    setChapters([...chapters, newChapter]);
  };

  const handleUpdateChapter = (chapterId: string, updates: Partial<Chapter>) => {
    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId ? { ...ch, ...updates } : ch
      )
    );
  };

  const handleDeleteChapter = (chapterId: string) => {
    const updatedChapters = chapters.filter((ch) => ch.id !== chapterId);
    // Reorder chapters
    updatedChapters.forEach((ch, idx) => {
      ch.order = idx + 1;
    });
    setChapters(updatedChapters);
  };

  const handleAddTopic = (chapterId: string) => {
    const newTopic: Topic = {
      id: generateId(),
      name: '',
    };
    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId ? { ...ch, topics: [...ch.topics, newTopic] } : ch
      )
    );
  };

  const handleUpdateTopic = (chapterId: string, topicId: string, updates: Partial<Topic>) => {
    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId
          ? {
              ...ch,
              topics: ch.topics.map((t) => (t.id === topicId ? { ...t, ...updates } : t)),
            }
          : ch
      )
    );
  };

  const handleDeleteTopic = (chapterId: string, topicId: string) => {
    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId
          ? { ...ch, topics: ch.topics.filter((t) => t.id !== topicId) }
          : ch
      )
    );
  };

  const handleSave = (status: 'draft' | 'published') => {
    if (!validateStep1() || !validateStep2()) return;

    const syllabus: Syllabus = {
      id: editingSyllabus?.id || generateId(),
      board: basicInfo.board as SyllabusBoard,
      academicYear: basicInfo.academicYear,
      class: basicInfo.class,
      subject: basicInfo.subject,
      chapters: chapters.map((ch) => ({
        ...ch,
        name: ch.name.trim(),
        topics: ch.topics.map((t) => ({
          ...t,
          name: t.name.trim(),
        })),
      })),
      status,
      createdAt: editingSyllabus?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(status === 'published' && !editingSyllabus?.publishedAt
        ? { publishedAt: new Date().toISOString() }
        : {}),
    };

    onSave(syllabus);
  };

  const totalTopics = chapters.reduce((sum, ch) => sum + ch.topics.length, 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full max-sm:p-4 max-sm:max-h-[85vh]">
        <DialogHeader className="max-sm:space-y-1">
          <DialogTitle className="text-lg sm:text-2xl">
            {editingSyllabus ? 'Edit Syllabus' : 'Create New Syllabus'}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {currentStep === 1 && 'Step 1: Enter basic information'}
            {currentStep === 2 && 'Step 2: Add chapters and topics'}
            {currentStep === 3 && 'Step 3: Review and save'}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${
                    currentStep >= step
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > step ? <Check className="w-3.5 h-3.5 sm:w-5 sm:h-5" /> : step}
                </div>
                <div className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-center">
                  {step === 1 && 'Basic Info'}
                  {step === 2 && 'Chapters'}
                  {step === 3 && 'Review'}
                </div>
              </div>
              {step < 3 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    currentStep > step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-3 sm:space-y-4 py-2 sm:py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="board" className="text-xs sm:text-sm">Board *</Label>
                <Select
                  value={basicInfo.board}
                  onValueChange={(value) =>
                    setBasicInfo({ ...basicInfo, board: value as SyllabusBoard })
                  }
                >
                  <SelectTrigger id="board" className="h-9 sm:h-10 text-sm">
                    <SelectValue placeholder="Select board" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CBSE">CBSE</SelectItem>
                    <SelectItem value="ICSE">ICSE</SelectItem>
                    <SelectItem value="STATE">STATE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="academicYear" className="text-xs sm:text-sm">Academic Year *</Label>
                <Input
                  id="academicYear"
                  placeholder="e.g., 2024-25"
                  value={basicInfo.academicYear}
                  onChange={(e) =>
                    setBasicInfo({ ...basicInfo, academicYear: e.target.value })
                  }
                  className="h-9 sm:h-10 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="class" className="text-xs sm:text-sm">Class *</Label>
                <Input
                  id="class"
                  placeholder="e.g., 9, 10"
                  value={basicInfo.class}
                  onChange={(e) => setBasicInfo({ ...basicInfo, class: e.target.value })}
                  className="h-9 sm:h-10 text-sm"
                />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="subject" className="text-xs sm:text-sm">Subject *</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Mathematics"
                  value={basicInfo.subject}
                  onChange={(e) => setBasicInfo({ ...basicInfo, subject: e.target.value })}
                  className="h-9 sm:h-10 text-sm min-w-0"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Chapters & Topics */}
        {currentStep === 2 && (
          <div className="space-y-3 sm:space-y-4 py-2 sm:py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-semibold">Chapters & Topics</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {chapters.length} chapter{chapters.length !== 1 ? 's' : ''} • {totalTopics} topic{totalTopics !== 1 ? 's' : ''}
                </p>
              </div>
              <Button onClick={handleAddChapter} size="sm" className="gap-1.5 sm:gap-2 h-8 text-xs sm:text-sm">
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Add Chapter
              </Button>
            </div>

            <div className="space-y-3 sm:space-y-4 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
              {chapters.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No chapters added yet. Click "Add Chapter" to get started.</p>
                </div>
              ) : (
                chapters
                  .sort((a, b) => a.order - b.order)
                  .map((chapter) => (
                    <Card key={chapter.id}>
                      <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <GripVertical className="w-5 h-5 text-muted-foreground" />
                          <Input
                            placeholder="Chapter name"
                            value={chapter.name}
                            onChange={(e) =>
                              handleUpdateChapter(chapter.id, { name: e.target.value })
                            }
                            className="flex-1 min-w-0 h-9 text-sm"
                          />
                          <Badge variant="outline" className="text-[10px] sm:text-xs shrink-0">Ch {chapter.order}</Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteChapter(chapter.id)}
                            className="text-destructive h-8 w-8 sm:h-10 sm:w-10 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6 pt-0">
                        <div className="flex items-center justify-between gap-2">
                          <Label className="text-xs sm:text-sm font-medium">Topics</Label>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddTopic(chapter.id)}
                            className="gap-1.5 h-8 text-xs"
                          >
                            <Plus className="w-3 h-3" />
                            Add Topic
                          </Button>
                        </div>
                        {chapter.topics.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No topics added yet.</p>
                        ) : (
                          <div className="space-y-2">
                            {chapter.topics.map((topic) => (
                              <div key={topic.id} className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
                                <Input
                                  placeholder="Topic name"
                                  value={topic.name}
                                  onChange={(e) =>
                                    handleUpdateTopic(chapter.id, topic.id, {
                                      name: e.target.value,
                                    })
                                  }
                                  className="flex-1 min-w-0 h-9 text-sm"
                                />
                                <Input
                                  type="number"
                                  placeholder="%"
                                  value={topic.weightage || ''}
                                  onChange={(e) =>
                                    handleUpdateTopic(chapter.id, topic.id, {
                                      weightage: e.target.value
                                        ? parseFloat(e.target.value)
                                        : undefined,
                                    })
                                  }
                                  className="w-14 sm:w-24 h-9 text-sm shrink-0"
                                  min="0"
                                  max="100"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteTopic(chapter.id, topic.id)}
                                  className="text-destructive h-8 w-8 shrink-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <div className="space-y-3 sm:space-y-4 py-2 sm:py-4">
            <Card>
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-sm sm:text-base">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-3 sm:p-6 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-muted-foreground">Board</Label>
                    <p className="font-medium">{basicInfo.board}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Academic Year</Label>
                    <p className="font-medium">{basicInfo.academicYear}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Class</Label>
                    <p className="font-medium">Class {basicInfo.class}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Subject</Label>
                    <p className="font-medium">{basicInfo.subject}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-sm sm:text-base">Chapters & Topics</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="space-y-4">
                  {chapters
                    .sort((a, b) => a.order - b.order)
                    .map((chapter) => (
                      <div key={chapter.id} className="border-l-2 border-primary/20 pl-4">
                        <h4 className="font-semibold mb-2">
                          Chapter {chapter.order}: {chapter.name}
                        </h4>
                        <ul className="space-y-1 ml-4">
                          {chapter.topics.map((topic) => (
                            <li key={topic.id} className="text-sm text-muted-foreground">
                              • {topic.name}
                              {topic.weightage && (
                                <Badge variant="outline" className="ml-2">
                                  {topic.weightage}%
                                </Badge>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 pt-4">
          <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-start">
            {currentStep > 1 && (
              <Button variant="outline" size="sm" onClick={handleBack} className="h-9 text-sm flex-1 sm:flex-initial">
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap justify-center sm:justify-end">
            <Button variant="outline" size="sm" onClick={onClose} className="h-9 text-sm flex-1 sm:flex-initial">
              Cancel
            </Button>
            {currentStep < 3 ? (
              <Button size="sm" onClick={handleNext} className="h-9 text-sm flex-1 sm:flex-initial">
                Next
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSave('draft')}
                  className="h-9 text-sm border-amber-200 text-amber-700 hover:bg-amber-50 flex-1 sm:flex-initial"
                >
                  Save as Draft
                </Button>
                <Button size="sm" onClick={() => handleSave('published')} className="h-9 text-sm bg-primary flex-1 sm:flex-initial">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Publish
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSyllabusWizard;

