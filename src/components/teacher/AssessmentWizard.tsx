import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Sparkles, Library, Upload, Edit3, ArrowRight, ArrowLeft, 
  Check, X, Save, Send, AlertCircle, Loader2, Plus,
  FileUp, Search, Star, Shield, Brain, GripVertical,
  Pencil, Trash2
} from 'lucide-react';
import { questionLibrary, chapters } from '@/data/teacherMockData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface Question {
  id: string;
  question: string;
  type: 'mcq' | 'short' | 'long';
  difficulty: 'easy' | 'medium' | 'hard';
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  marks: number;
  chapter?: string;
  topic?: string;
  bloomsLevel?: string;
  cbseAligned?: boolean;
}

interface AssessmentWizardProps {
  open: boolean;
  onClose: () => void;
  onSave: (assessment: any) => void;
  initialData?: {
    questions?: Question[];
    subject?: string;
    chapter?: string;
    fromAITools?: boolean;
  };
}

export const AssessmentWizard = ({ open, onClose, onSave, initialData }: AssessmentWizardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [questionSource, setQuestionSource] = useState<'ai' | 'library' | 'pdf' | 'manual' | ''>('');
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editedQuestion, setEditedQuestion] = useState<Partial<Question>>({});
  
  // AI Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiFormData, setAiFormData] = useState({
    class: '',
    subject: 'Mathematics',
    chapter: '',
    topic: '',
    questionType: 'mcq',
    difficulty: 'medium',
    numberOfQuestions: '5',
  });
  
  // Library selection state
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryFilters, setLibraryFilters] = useState({ 
    difficulty: 'all', 
    type: 'all', 
    chapter: 'all',
    topic: 'all' 
  });
  const [selectedLibraryQuestions, setSelectedLibraryQuestions] = useState<Set<string>>(new Set());
  
  // PDF upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  
  // Manual entry state
  const [manualQuestion, setManualQuestion] = useState<Partial<Question>>({
    type: 'mcq',
    difficulty: 'medium',
    marks: 1,
    question: '',
    correctAnswer: '',
    options: ['', '', '', ''],
  });
  
  // Assessment config state
  const [assessmentConfig, setAssessmentConfig] = useState({
    title: '',
    type: 'Test',
    class: '',
    duration: '',
    dueDate: '',
    allowFileUpload: false,
    requireMarks: true,
    extendedDeadline: false,
  });

  // Initialize from AI Tools if coming from there
  useEffect(() => {
    if (initialData?.fromAITools && initialData.questions) {
      setSelectedQuestions(initialData.questions);
      setAiFormData(prev => ({
        ...prev,
        subject: initialData.subject || 'Mathematics',
        chapter: initialData.chapter || '',
      }));
      setCurrentStep(2);
    }
  }, [initialData]);

  const filteredLibraryQuestions = questionLibrary.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(librarySearch.toLowerCase());
    const matchesDifficulty = libraryFilters.difficulty === 'all' || q.difficulty === libraryFilters.difficulty;
    const matchesType = libraryFilters.type === 'all' || q.type === libraryFilters.type;
    const matchesChapter = libraryFilters.chapter === 'all' || q.chapter === libraryFilters.chapter;
    return matchesSearch && matchesDifficulty && matchesType && matchesChapter;
  });

  // AI Generation
  const handleGenerateAI = async () => {
    if (!aiFormData.class || !aiFormData.chapter) {
      toast.error('Please select class and chapter');
      return;
    }

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const numQuestions = parseInt(aiFormData.numberOfQuestions);
    const mockQuestions: Question[] = Array.from({ length: numQuestions }, (_, i) => ({
      id: `ai-${Date.now()}-${i}`,
      question: `Sample ${aiFormData.questionType} question ${i + 1} for ${aiFormData.chapter}`,
      type: aiFormData.questionType as any,
      difficulty: aiFormData.difficulty as any,
      options: aiFormData.questionType === 'mcq' ? ['Option A', 'Option B', 'Option C', 'Option D'] : undefined,
      correctAnswer: aiFormData.questionType === 'mcq' ? 'Option A' : 'Sample answer',
      explanation: 'AI-generated explanation',
      marks: aiFormData.questionType === 'mcq' ? 1 : aiFormData.questionType === 'short' ? 3 : 5,
      chapter: aiFormData.chapter,
      topic: aiFormData.topic,
      bloomsLevel: 'Apply',
      cbseAligned: true,
    }));

    setSelectedQuestions(prev => [...prev, ...mockQuestions]);
    setIsGenerating(false);
    toast.success(`${mockQuestions.length} questions generated`);
    setCurrentStep(2);
  };

  // Library selection
  const handleToggleLibraryQuestion = (questionId: string) => {
    setSelectedLibraryQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleAddFromLibrary = () => {
    const questionsToAdd = questionLibrary
      .filter(q => selectedLibraryQuestions.has(q.id))
      .map(q => ({
        id: q.id,
        question: q.question,
        type: q.type as 'mcq' | 'short' | 'long',
        difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: '',
        marks: q.marks,
        chapter: q.chapter,
        topic: q.topic,
        bloomsLevel: q.bloomsLevel,
        cbseAligned: q.cbseAligned,
      }));
    setSelectedQuestions(prev => [...prev, ...questionsToAdd]);
    setSelectedLibraryQuestions(new Set());
    toast.success(`${questionsToAdd.length} questions added`);
    setCurrentStep(2);
  };

  // PDF Upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      toast.success(`File "${file.name}" uploaded`);
    } else {
      toast.error('Please upload a PDF file');
    }
  };

  const handleExtractFromPDF = async () => {
    if (!uploadedFile) return;
    
    setIsExtracting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockExtracted: Question[] = [
      {
        id: `pdf-${Date.now()}-1`,
        question: 'What is the Pythagorean theorem?',
        type: 'short',
        difficulty: 'easy',
        correctAnswer: 'a² + b² = c²',
        marks: 2,
        cbseAligned: true,
        bloomsLevel: 'Remember',
      },
      {
        id: `pdf-${Date.now()}-2`,
        question: 'Calculate the area of a circle with radius 7 cm.',
        type: 'mcq',
        difficulty: 'medium',
        options: ['154 cm²', '44 cm²', '49 cm²', '308 cm²'],
        correctAnswer: '154 cm²',
        marks: 1,
        cbseAligned: true,
        bloomsLevel: 'Apply',
      },
    ];

    setSelectedQuestions(prev => [...prev, ...mockExtracted]);
    setIsExtracting(false);
    toast.success(`${mockExtracted.length} questions extracted`);
    setCurrentStep(2);
  };

  // Manual entry
  const handleAddManualQuestion = () => {
    if (!manualQuestion.question || !manualQuestion.correctAnswer) {
      toast.error('Please fill in question and correct answer');
      return;
    }

    const newQuestion: Question = {
      id: `manual-${Date.now()}`,
      question: manualQuestion.question!,
      type: manualQuestion.type!,
      difficulty: manualQuestion.difficulty!,
      correctAnswer: manualQuestion.correctAnswer!,
      marks: manualQuestion.marks || 1,
      options: manualQuestion.type === 'mcq' ? manualQuestion.options : undefined,
      explanation: manualQuestion.explanation,
    };

    setSelectedQuestions(prev => [...prev, newQuestion]);
    setManualQuestion({
      type: 'mcq',
      difficulty: 'medium',
      marks: 1,
      question: '',
      correctAnswer: '',
      options: ['', '', '', ''],
    });
    toast.success('Question added');
  };

  // Question paper management
  const handleRemoveQuestion = (questionId: string) => {
    setSelectedQuestions(prev => prev.filter(q => q.id !== questionId));
    toast.success('Question removed');
  };

  const handleEditQuestion = (questionId: string) => {
    const question = selectedQuestions.find(q => q.id === questionId);
    if (question) {
      setEditingQuestionId(questionId);
      setEditedQuestion(question);
    }
  };

  const handleSaveEdit = () => {
    if (!editingQuestionId) return;
    setSelectedQuestions(prev =>
      prev.map(q => q.id === editingQuestionId ? { ...q, ...editedQuestion } as Question : q)
    );
    setEditingQuestionId(null);
    setEditedQuestion({});
    toast.success('Question updated');
  };

  const handleReorder = (index: number, direction: 'up' | 'down') => {
    const newQuestions = [...selectedQuestions];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newQuestions.length) return;
    [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
    setSelectedQuestions(newQuestions);
  };

  // Type-based configuration
  const handleTypeChange = (type: string) => {
    setAssessmentConfig(prev => ({
      ...prev,
      type,
      allowFileUpload: type === 'Homework' || type === 'Assignment',
      requireMarks: type !== 'Homework',
      extendedDeadline: type === 'Assignment',
    }));
  };

  // Final submission
  const handleSaveDraft = () => {
    if (!assessmentConfig.title || selectedQuestions.length === 0) {
      toast.error('Please add a title and at least one question');
      return;
    }

    const totalMarks = selectedQuestions.reduce((sum, q) => sum + q.marks, 0);
    const newAssessment = {
      id: `a${Date.now()}`,
      title: assessmentConfig.title,
      subject: aiFormData.subject,
      class: assessmentConfig.class,
      type: assessmentConfig.type,
      marks: totalMarks,
      scheduledDate: assessmentConfig.dueDate || new Date().toISOString().split('T')[0],
      duration: assessmentConfig.duration,
      status: 'draft' as const,
      questions: selectedQuestions,
      questionCount: selectedQuestions.length,
      allowFileUpload: assessmentConfig.allowFileUpload,
      requireMarks: assessmentConfig.requireMarks,
    };

    onSave(newAssessment);
    resetWizard();
    toast.success('Assessment saved as draft');
  };

  const handleAssignNow = () => {
    if (!assessmentConfig.title || !assessmentConfig.class || selectedQuestions.length === 0) {
      toast.error('Please fill in all required fields and add questions');
      return;
    }

    const totalMarks = selectedQuestions.reduce((sum, q) => sum + q.marks, 0);
    const newAssessment = {
      id: `a${Date.now()}`,
      title: assessmentConfig.title,
      subject: aiFormData.subject,
      class: assessmentConfig.class,
      type: assessmentConfig.type,
      marks: totalMarks,
      scheduledDate: assessmentConfig.dueDate || new Date().toISOString().split('T')[0],
      duration: assessmentConfig.duration,
      status: 'published' as const,
      questions: selectedQuestions,
      questionCount: selectedQuestions.length,
      allowFileUpload: assessmentConfig.allowFileUpload,
      requireMarks: assessmentConfig.requireMarks,
    };

    onSave(newAssessment);
    resetWizard();
    toast.success('Assessment assigned to students');
  };

  const resetWizard = () => {
    onClose();
    setCurrentStep(1);
    setQuestionSource('');
    setSelectedQuestions([]);
    setAiFormData({
      class: '',
      subject: 'Mathematics',
      chapter: '',
      topic: '',
      questionType: 'mcq',
      difficulty: 'medium',
      numberOfQuestions: '5',
    });
    setAssessmentConfig({
      title: '',
      type: 'Test',
      class: '',
      duration: '',
      dueDate: '',
      allowFileUpload: false,
      requireMarks: true,
      extendedDeadline: false,
    });
  };

  const totalMarks = selectedQuestions.reduce((sum, q) => sum + q.marks, 0);
  const questionTypes = {
    mcq: selectedQuestions.filter(q => q.type === 'mcq').length,
    short: selectedQuestions.filter(q => q.type === 'short').length,
    long: selectedQuestions.filter(q => q.type === 'long').length,
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Create New Assessment
            <Badge variant="secondary" className="text-xs">
              Step {currentStep} of 4
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {[
            { step: 1, label: 'Source' },
            { step: 2, label: 'Questions' },
            { step: 3, label: 'Configure' },
            { step: 4, label: 'Review' },
          ].map((s, idx) => (
            <div key={s.step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  currentStep >= s.step 
                    ? "bg-primary text-white" 
                    : "bg-gray-200 text-gray-500"
                )}>
                  {currentStep > s.step ? <Check className="w-4 h-4" /> : s.step}
                </div>
                <span className="text-xs mt-1 text-gray-600">{s.label}</span>
              </div>
              {idx < 3 && (
                <div className={cn(
                  "h-0.5 flex-1 -mt-6",
                  currentStep > s.step ? "bg-primary" : "bg-gray-200"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Choose Question Source */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">Choose how to add questions:</h3>
              <RadioGroup value={questionSource} onValueChange={(v: any) => setQuestionSource(v)}>
                <div className="grid grid-cols-2 gap-4">
                  <Card className={cn(
                    "cursor-pointer transition-all hover:border-primary",
                    questionSource === 'ai' && "border-primary bg-primary/5"
                  )} onClick={() => setQuestionSource('ai')}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <RadioGroupItem value="ai" id="ai" />
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-purple-600" />
                        </div>
                        <Label htmlFor="ai" className="font-medium cursor-pointer">
                          AI Generation
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground ml-8">
                        Generate CBSE-aligned questions using AI based on chapter and topic
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={cn(
                    "cursor-pointer transition-all hover:border-primary",
                    questionSource === 'library' && "border-primary bg-primary/5"
                  )} onClick={() => setQuestionSource('library')}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <RadioGroupItem value="library" id="library" />
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Library className="w-5 h-5 text-blue-600" />
                        </div>
                        <Label htmlFor="library" className="font-medium cursor-pointer">
                          Question Library
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground ml-8">
                        Select from your saved high-quality questions
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={cn(
                    "cursor-pointer transition-all hover:border-primary",
                    questionSource === 'pdf' && "border-primary bg-primary/5"
                  )} onClick={() => setQuestionSource('pdf')}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <RadioGroupItem value="pdf" id="pdf" />
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                          <Upload className="w-5 h-5 text-orange-600" />
                        </div>
                        <Label htmlFor="pdf" className="font-medium cursor-pointer">
                          Upload PDF
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground ml-8">
                        Extract questions from existing question papers or materials
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={cn(
                    "cursor-pointer transition-all hover:border-primary",
                    questionSource === 'manual' && "border-primary bg-primary/5"
                  )} onClick={() => setQuestionSource('manual')}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <RadioGroupItem value="manual" id="manual" />
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <Edit3 className="w-5 h-5 text-green-600" />
                        </div>
                        <Label htmlFor="manual" className="font-medium cursor-pointer">
                          Manual Entry
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground ml-8">
                        Type questions manually with full customization
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </RadioGroup>
            </div>

            {/* Source-specific forms */}
            {questionSource === 'ai' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AI Question Generator</CardTitle>
                  <CardDescription>Configure parameters for AI generation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Class *</Label>
                      <Select value={aiFormData.class} onValueChange={(v) => setAiFormData(prev => ({ ...prev, class: v }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8">Class 8</SelectItem>
                          <SelectItem value="9">Class 9</SelectItem>
                          <SelectItem value="10">Class 10</SelectItem>
                          <SelectItem value="11">Class 11</SelectItem>
                          <SelectItem value="12">Class 12</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Subject *</Label>
                      <Select value={aiFormData.subject} onValueChange={(v) => setAiFormData(prev => ({ ...prev, subject: v }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mathematics">Mathematics</SelectItem>
                          <SelectItem value="Science">Science</SelectItem>
                          <SelectItem value="English">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Chapter *</Label>
                      <Select value={aiFormData.chapter} onValueChange={(v) => setAiFormData(prev => ({ ...prev, chapter: v }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select chapter" />
                        </SelectTrigger>
                        <SelectContent>
                          {chapters.map(ch => (
                            <SelectItem key={ch.id} value={ch.id}>{ch.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Topic</Label>
                      <Input
                        placeholder="e.g., Solving equations"
                        value={aiFormData.topic}
                        onChange={(e) => setAiFormData(prev => ({ ...prev, topic: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Question Type</Label>
                      <Select value={aiFormData.questionType} onValueChange={(v) => setAiFormData(prev => ({ ...prev, questionType: v }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mcq">MCQ</SelectItem>
                          <SelectItem value="short">Short Answer</SelectItem>
                          <SelectItem value="long">Long Answer</SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Difficulty</Label>
                      <Select value={aiFormData.difficulty} onValueChange={(v) => setAiFormData(prev => ({ ...prev, difficulty: v }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Number of Questions</Label>
                      <Input
                        type="number"
                        value={aiFormData.numberOfQuestions}
                        onChange={(e) => setAiFormData(prev => ({ ...prev, numberOfQuestions: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button onClick={handleGenerateAI} disabled={isGenerating} className="w-full">
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Questions
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {questionSource === 'library' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Select from Question Library</CardTitle>
                  <CardDescription>{questionLibrary.length} questions available</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search questions..."
                        value={librarySearch}
                        onChange={(e) => setLibrarySearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={libraryFilters.difficulty} onValueChange={(v) => setLibraryFilters(prev => ({ ...prev, difficulty: v }))}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={libraryFilters.type} onValueChange={(v) => setLibraryFilters(prev => ({ ...prev, type: v }))}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="mcq">MCQ</SelectItem>
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="long">Long</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="border rounded-lg max-h-96 overflow-y-auto">
                    <div className="divide-y">
                      {filteredLibraryQuestions.map((q) => (
                        <div key={q.id} className="p-4 hover:bg-muted/50 cursor-pointer" onClick={() => handleToggleLibraryQuestion(q.id)}>
                          <div className="flex items-start gap-3">
                            <div className="flex items-center h-5 mt-0.5">
                              <input
                                type="checkbox"
                                checked={selectedLibraryQuestions.has(q.id)}
                                onChange={() => handleToggleLibraryQuestion(q.id)}
                                className="w-4 h-4 rounded border-gray-300"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">{q.type.toUpperCase()}</Badge>
                                <Badge className={cn(
                                  "text-xs",
                                  q.difficulty === 'easy' && "bg-green-500",
                                  q.difficulty === 'medium' && "bg-yellow-500",
                                  q.difficulty === 'hard' && "bg-red-500"
                                )}>
                                  {q.difficulty}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{q.marks} marks</span>
                                {q.markedHighQuality && <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />}
                              </div>
                              <p className="text-sm font-medium truncate">{q.question}</p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <span>{q.chapter}</span>
                                {q.cbseAligned && (
                                  <Badge variant="outline" className="text-xs">
                                    <Shield className="w-2.5 h-2.5 mr-1" />
                                    CBSE
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {selectedLibraryQuestions.size} selected
                    </span>
                    <Button onClick={handleAddFromLibrary} disabled={selectedLibraryQuestions.size === 0}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Selected ({selectedLibraryQuestions.size})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {questionSource === 'pdf' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Upload PDF Document</CardTitle>
                  <CardDescription>Extract questions from existing materials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-medium mb-2">
                      {uploadedFile ? uploadedFile.name : 'Upload PDF'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {uploadedFile 
                        ? `Size: ${(uploadedFile.size / 1024).toFixed(2)} KB`
                        : 'Click to browse or drag and drop'
                      }
                    </p>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="pdf-upload-assessment"
                    />
                    <div className="flex gap-2 justify-center">
                      <label htmlFor="pdf-upload-assessment">
                        <Button variant="outline" asChild>
                          <span>{uploadedFile ? 'Change File' : 'Choose File'}</span>
                        </Button>
                      </label>
                      {uploadedFile && (
                        <Button onClick={handleExtractFromPDF} disabled={isExtracting}>
                          {isExtracting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Extracting...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Extract Questions
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {questionSource === 'manual' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Manual Question Entry</CardTitle>
                  <CardDescription>Create custom questions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Question Type</Label>
                      <Select value={manualQuestion.type} onValueChange={(v: any) => setManualQuestion(prev => ({ ...prev, type: v }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mcq">MCQ</SelectItem>
                          <SelectItem value="short">Short Answer</SelectItem>
                          <SelectItem value="long">Long Answer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Difficulty</Label>
                      <Select value={manualQuestion.difficulty} onValueChange={(v: any) => setManualQuestion(prev => ({ ...prev, difficulty: v }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Marks</Label>
                      <Input
                        type="number"
                        value={manualQuestion.marks}
                        onChange={(e) => setManualQuestion(prev => ({ ...prev, marks: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Question *</Label>
                    <Textarea
                      placeholder="Enter your question..."
                      value={manualQuestion.question}
                      onChange={(e) => setManualQuestion(prev => ({ ...prev, question: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  {manualQuestion.type === 'mcq' && (
                    <div className="space-y-2">
                      <Label>Options (for MCQ)</Label>
                      {[0, 1, 2, 3].map((i) => (
                        <Input
                          key={i}
                          placeholder={`Option ${i + 1}`}
                          value={manualQuestion.options?.[i] || ''}
                          onChange={(e) => {
                            const newOptions = [...(manualQuestion.options || ['', '', '', ''])];
                            newOptions[i] = e.target.value;
                            setManualQuestion(prev => ({ ...prev, options: newOptions }));
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Correct Answer *</Label>
                    <Input
                      placeholder="Enter correct answer"
                      value={manualQuestion.correctAnswer}
                      onChange={(e) => setManualQuestion(prev => ({ ...prev, correctAnswer: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Explanation (Optional)</Label>
                    <Textarea
                      placeholder="Add explanation or marking scheme..."
                      value={manualQuestion.explanation || ''}
                      onChange={(e) => setManualQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddManualQuestion} className="flex-1">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Question
                    </Button>
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      Continue to Next Step
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 2: Build Question Paper */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Question Paper Builder</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedQuestions.length} questions • Total: {totalMarks} marks
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentStep(1)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add More
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/teacher/ai-tools', { 
                    state: { returnTo: 'assessments', existingQuestions: selectedQuestions } 
                  })}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Open AI Tools
                </Button>
              </div>
            </div>

            {selectedQuestions.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {/* Left: Question List */}
                <div className="col-span-2 space-y-3 max-h-[500px] overflow-y-auto">
                  {selectedQuestions.map((q, index) => (
                    <Card key={q.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        {editingQuestionId === q.id ? (
                          // Edit Mode
                          <div className="space-y-3">
                            <Textarea
                              value={editedQuestion.question || q.question}
                              onChange={(e) => setEditedQuestion(prev => ({ ...prev, question: e.target.value }))}
                              rows={2}
                            />
                            <div className="grid grid-cols-3 gap-3">
                              <Input
                                type="number"
                                placeholder="Marks"
                                value={editedQuestion.marks || q.marks}
                                onChange={(e) => setEditedQuestion(prev => ({ ...prev, marks: parseInt(e.target.value) }))}
                              />
                              <Select value={editedQuestion.difficulty || q.difficulty} onValueChange={(v: any) => setEditedQuestion(prev => ({ ...prev, difficulty: v }))}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="easy">Easy</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="hard">Hard</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                placeholder="Correct Answer"
                                value={editedQuestion.correctAnswer || q.correctAnswer}
                                onChange={(e) => setEditedQuestion(prev => ({ ...prev, correctAnswer: e.target.value }))}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleSaveEdit}>
                                <Save className="w-4 h-4 mr-2" />
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingQuestionId(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <div className="flex items-start gap-3">
                            <div className="flex flex-col gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={() => handleReorder(index, 'up')}
                                disabled={index === 0}
                              >
                                <GripVertical className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={() => handleReorder(index, 'down')}
                                disabled={index === selectedQuestions.length - 1}
                              >
                                <GripVertical className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary">Q{index + 1}</Badge>
                                <Badge variant="outline" className="text-xs">{q.type.toUpperCase()}</Badge>
                                <Badge className={cn(
                                  "text-xs",
                                  q.difficulty === 'easy' && "bg-green-500",
                                  q.difficulty === 'medium' && "bg-yellow-500",
                                  q.difficulty === 'hard' && "bg-red-500"
                                )}>
                                  {q.difficulty}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">{q.marks} marks</Badge>
                                {q.cbseAligned && (
                                  <Badge variant="outline" className="text-xs">
                                    <Shield className="w-3 h-3 mr-1" />
                                    CBSE
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm font-medium mb-2">{q.question}</p>
                              {q.options && (
                                <div className="ml-4 space-y-1 text-sm text-muted-foreground">
                                  {q.options.map((opt, i) => (
                                    <div key={i} className={cn(opt === q.correctAnswer && "text-green-600 font-medium")}>
                                      {String.fromCharCode(65 + i)}. {opt}
                                      {opt === q.correctAnswer && " ✓"}
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div className="text-xs text-muted-foreground mt-2">
                                Answer: {q.correctAnswer}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={() => handleEditQuestion(q.id)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleRemoveQuestion(q.id)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Right: Sticky Summary */}
                <div className="col-span-1">
                  <Card className="sticky top-4">
                    <CardHeader>
                      <CardTitle className="text-base">Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Questions:</span>
                        <span className="font-semibold">{selectedQuestions.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Marks:</span>
                        <span className="font-bold text-lg">{totalMarks}</span>
                      </div>
                      <div className="pt-3 border-t space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">MCQs:</span>
                          <span className="font-medium">{questionTypes.mcq}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Short Answer:</span>
                          <span className="font-medium">{questionTypes.short}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Long Answer:</span>
                          <span className="font-medium">{questionTypes.long}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-12 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium mb-2">No questions added yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Go back to add questions from any source
                  </p>
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Questions
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => setCurrentStep(3)} disabled={selectedQuestions.length === 0}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Assessment Configuration */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">Assessment Details</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Assessment Title *</Label>
                  <Input
                    placeholder="e.g., Chapter 5 Linear Equations Test"
                    value={assessmentConfig.title}
                    onChange={(e) => setAssessmentConfig(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type *</Label>
                    <Select value={assessmentConfig.type} onValueChange={handleTypeChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Test">Test (Timed, no file upload)</SelectItem>
                        <SelectItem value="Assignment">Assignment (File upload, extended deadline)</SelectItem>
                        <SelectItem value="Homework">Homework (Flexible timing, optional marks)</SelectItem>
                        <SelectItem value="Quiz">Quiz (Quick assessment)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Class *</Label>
                    <Select value={assessmentConfig.class} onValueChange={(v) => setAssessmentConfig(prev => ({ ...prev, class: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Class 8-A">Class 8-A</SelectItem>
                        <SelectItem value="Class 9-A">Class 9-A</SelectItem>
                        <SelectItem value="Class 9-B">Class 9-B</SelectItem>
                        <SelectItem value="Class 10-A">Class 10-A</SelectItem>
                        <SelectItem value="Class 10-B">Class 10-B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      placeholder="60"
                      value={assessmentConfig.duration}
                      onChange={(e) => setAssessmentConfig(prev => ({ ...prev, duration: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={assessmentConfig.dueDate}
                      onChange={(e) => setAssessmentConfig(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Type-specific options */}
                {assessmentConfig.allowFileUpload && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <input 
                        type="checkbox" 
                        checked={assessmentConfig.allowFileUpload}
                        onChange={(e) => setAssessmentConfig(prev => ({ ...prev, allowFileUpload: e.target.checked }))}
                        className="w-4 h-4"
                      />
                      <Label>Allow students to upload files (assignments, homework)</Label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => setCurrentStep(4)}>
                Review
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">Review Assessment</h3>
              
              {/* Summary Card */}
              <Card className="mb-4">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4">{assessmentConfig.title || 'Untitled Assessment'}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium">{assessmentConfig.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Class:</span>
                          <span className="font-medium">{assessmentConfig.class || 'Not selected'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subject:</span>
                          <span className="font-medium">{aiFormData.subject}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-medium">{assessmentConfig.duration || 'Not set'} mins</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Due Date:</span>
                          <span className="font-medium">{assessmentConfig.dueDate || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">File Upload:</span>
                          <span className="font-medium">{assessmentConfig.allowFileUpload ? 'Allowed' : 'Not allowed'}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-4">Question Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Questions:</span>
                          <span className="font-medium">{selectedQuestions.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Marks:</span>
                          <span className="font-medium">{totalMarks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">MCQs:</span>
                          <span className="font-medium">{questionTypes.mcq}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Short Answer:</span>
                          <span className="font-medium">{questionTypes.short}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Long Answer:</span>
                          <span className="font-medium">{questionTypes.long}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Question Preview */}
              <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                <h4 className="font-medium mb-3">Questions Preview</h4>
                <div className="space-y-3">
                  {selectedQuestions.map((q, i) => (
                    <div key={q.id} className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">Q{i + 1}</Badge>
                        <Badge variant="outline" className="text-xs">{q.type.toUpperCase()}</Badge>
                        <span className="text-xs text-muted-foreground">{q.marks} marks</span>
                      </div>
                      <p className="text-sm">{q.question}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setCurrentStep(3)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSaveDraft}>
                  <Save className="w-4 h-4 mr-2" />
                  Save as Draft
                </Button>
                <Button onClick={handleAssignNow}>
                  <Send className="w-4 h-4 mr-2" />
                  Assign Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
