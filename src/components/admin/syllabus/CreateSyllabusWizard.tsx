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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {editingSyllabus ? 'Edit Syllabus' : 'Create New Syllabus'}
          </DialogTitle>
          <DialogDescription>
            {currentStep === 1 && 'Step 1: Enter basic information'}
            {currentStep === 2 && 'Step 2: Add chapters and topics'}
            {currentStep === 3 && 'Step 3: Review and save'}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > step ? <Check className="w-5 h-5" /> : step}
                </div>
                <div className="mt-2 text-xs text-center">
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
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="board">Board *</Label>
                <Select
                  value={basicInfo.board}
                  onValueChange={(value) =>
                    setBasicInfo({ ...basicInfo, board: value as SyllabusBoard })
                  }
                >
                  <SelectTrigger id="board">
                    <SelectValue placeholder="Select board" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CBSE">CBSE</SelectItem>
                    <SelectItem value="ICSE">ICSE</SelectItem>
                    <SelectItem value="STATE">STATE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="academicYear">Academic Year *</Label>
                <Input
                  id="academicYear"
                  placeholder="e.g., 2024-25"
                  value={basicInfo.academicYear}
                  onChange={(e) =>
                    setBasicInfo({ ...basicInfo, academicYear: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class">Class *</Label>
                <Input
                  id="class"
                  placeholder="e.g., 9, 10, 11, 12"
                  value={basicInfo.class}
                  onChange={(e) => setBasicInfo({ ...basicInfo, class: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Mathematics, Science"
                  value={basicInfo.subject}
                  onChange={(e) => setBasicInfo({ ...basicInfo, subject: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Chapters & Topics */}
        {currentStep === 2 && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Chapters & Topics</h3>
                <p className="text-sm text-muted-foreground">
                  {chapters.length} chapter{chapters.length !== 1 ? 's' : ''} • {totalTopics} topic{totalTopics !== 1 ? 's' : ''}
                </p>
              </div>
              <Button onClick={handleAddChapter} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Chapter
              </Button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {chapters.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No chapters added yet. Click "Add Chapter" to get started.</p>
                </div>
              ) : (
                chapters
                  .sort((a, b) => a.order - b.order)
                  .map((chapter) => (
                    <Card key={chapter.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-5 h-5 text-muted-foreground" />
                          <Input
                            placeholder="Chapter name"
                            value={chapter.name}
                            onChange={(e) =>
                              handleUpdateChapter(chapter.id, { name: e.target.value })
                            }
                            className="flex-1"
                          />
                          <Badge variant="outline">Chapter {chapter.order}</Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteChapter(chapter.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Topics</Label>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddTopic(chapter.id)}
                            className="gap-2"
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
                              <div key={topic.id} className="flex items-center gap-2">
                                <Input
                                  placeholder="Topic name"
                                  value={topic.name}
                                  onChange={(e) =>
                                    handleUpdateTopic(chapter.id, topic.id, {
                                      name: e.target.value,
                                    })
                                  }
                                  className="flex-1"
                                />
                                <Input
                                  type="number"
                                  placeholder="Weightage %"
                                  value={topic.weightage || ''}
                                  onChange={(e) =>
                                    handleUpdateTopic(chapter.id, topic.id, {
                                      weightage: e.target.value
                                        ? parseFloat(e.target.value)
                                        : undefined,
                                    })
                                  }
                                  className="w-24"
                                  min="0"
                                  max="100"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteTopic(chapter.id, topic.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
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
          <div className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
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
              <CardHeader>
                <CardTitle>Chapters & Topics</CardTitle>
              </CardHeader>
              <CardContent>
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

        <DialogFooter className="flex items-center justify-between">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {currentStep < 3 ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleSave('draft')}
                  className="border-amber-200 text-amber-700 hover:bg-amber-50"
                >
                  Save as Draft
                </Button>
                <Button onClick={() => handleSave('published')} className="bg-primary">
                  <Check className="w-4 h-4 mr-2" />
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

