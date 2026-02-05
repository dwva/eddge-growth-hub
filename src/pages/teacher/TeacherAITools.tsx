import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import { useTeacherMode } from '@/contexts/TeacherModeContext';
import { useAssessmentIntegration } from '@/utils/assessmentIntegration';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, Sparkles, Brain, FileText, Loader2, CheckCircle, Save, Users, AlertCircle, Download,
  Library, BookmarkPlus, Search, Filter, Star, Check, X, AlertTriangle, Info, Eye, Trash2, Edit,
  ThumbsUp, ThumbsDown, Shield, Target, TrendingUp, Upload, FileUp, Plus, RefreshCw
} from 'lucide-react';
import { chapters, questionLibrary } from '@/data/teacherMockData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface GeneratedQuestion {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  marks: number;
  difficulty: string;
  // Quality Check fields
  cbseAligned: boolean;
  bloomsLevel: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
  aiConfidence: number;
  issues: string[];
  approved?: boolean;
  isRegenerating?: boolean;
}

const TeacherAIToolsContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { currentMode } = useTeacherMode();
  const { saveGeneratedAsAssessment } = useAssessmentIntegration();
  const defaultTab = searchParams.get('tab') === 'worksheet' ? 'worksheet' : searchParams.get('tab') === 'library' ? 'library' : 'questions';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [blueprintMode, setBlueprintMode] = useState(false);
  const [savedQuestions, setSavedQuestions] = useState(questionLibrary);
  const [librarySearch, setLibrarySearch] = useState('');

  // Handle return from Assessments to add more questions
  useEffect(() => {
    if (location.state?.returnTo === 'assessments' && location.state?.existingQuestions) {
      setGeneratedQuestions(location.state.existingQuestions);
      toast.info('Continue adding questions for your assessment');
    }
  }, [location.state]);
  const [libraryFilters, setLibraryFilters] = useState({ difficulty: 'all', chapter: 'all', type: 'all', class: 'all' });

  const [formData, setFormData] = useState({
    class: '',
    subject: 'Mathematics',
    chapter: '',
    topic: '',
    mistakePattern: '',
    questionType: 'mcq',
    difficulty: 'medium',
    numberOfQuestions: '5',
  });

  // Blueprint Mode State
  const [blueprint, setBlueprint] = useState([
    { chapter: 'Linear Equations', questionCount: 3, types: { mcq: 2, short: 1, long: 0 }, difficulty: { easy: 1, medium: 1, hard: 1 } },
    { chapter: 'Quadratic Equations', questionCount: 2, types: { mcq: 1, short: 1, long: 0 }, difficulty: { easy: 0, medium: 1, hard: 1 } },
  ]);

  const [saveData, setSaveData] = useState({
    title: '',
    description: '',
    duration: '60',
    dueDate: '',
  });

  // PDF Upload State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedQuestions, setExtractedQuestions] = useState<GeneratedQuestion[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editedQuestion, setEditedQuestion] = useState<Partial<GeneratedQuestion>>({});

  // Mode restriction
  if (currentMode !== 'subject_teacher') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Subject Teacher Mode Required</h2>
        <p className="text-muted-foreground mb-4">AI Tools are only accessible in Subject Teacher mode.</p>
        <Button onClick={() => navigate('/teacher')}>Back to Dashboard</Button>
      </div>
    );
  }

  const handleGenerate = async () => {
    if (!formData.class || !formData.questionType) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation with quality checks
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const bloomsLevels: ('Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create')[] = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
    const questionTypes = ['linear equations', 'quadratic functions', 'polynomials', 'geometry basics', 'trigonometry'];
    
    const mockQuestions: GeneratedQuestion[] = Array.from({ length: parseInt(formData.numberOfQuestions) }, (_, i) => {
      const hasIssues = Math.random() > 0.7; // 30% chance of issues
      const issues = hasIssues ? [
        Math.random() > 0.5 ? 'Ambiguous wording detected' : null,
        Math.random() > 0.5 ? 'Multiple plausible answers' : null,
      ].filter(Boolean) as string[] : [];
      
      return {
        id: `q${i + 1}`,
        type: formData.questionType.toUpperCase(),
        question: formData.questionType === 'mcq' 
          ? `What is the result of solving the equation ${2 + i}x + ${3 + i} = ${10 + i}?`
          : `Explain the concept of ${questionTypes[i % 5]} with an example.`,
        options: formData.questionType === 'mcq' ? [`x = ${1 + i}`, `x = ${2 + i}`, `x = ${3 + i}`, `x = ${4 + i}`] : undefined,
        correctAnswer: formData.questionType === 'mcq' ? `x = ${2 + i}` : 'A detailed explanation covering the key concepts...',
        explanation: 'This question tests the student\'s understanding of basic algebraic manipulation and equation solving.',
        marks: formData.questionType === 'mcq' ? 1 : formData.questionType === 'short' ? 2 : 5,
        difficulty: formData.difficulty,
        cbseAligned: Math.random() > 0.2, // 80% CBSE aligned
        bloomsLevel: bloomsLevels[Math.floor(Math.random() * (formData.difficulty === 'easy' ? 3 : formData.difficulty === 'medium' ? 4 : 6))],
        aiConfidence: Math.floor(75 + Math.random() * 25), // 75-100%
        issues,
        approved: undefined,
      };
    });

    setGeneratedQuestions(mockQuestions);
    setIsGenerating(false);
    toast.success(`Generated ${formData.numberOfQuestions} questions with quality checks!`);
  };

  const handleReset = () => {
    setGeneratedQuestions([]);
    setFormData({
      class: '',
      subject: 'Mathematics',
      chapter: '',
      topic: '',
      mistakePattern: '',
      questionType: 'mcq',
      difficulty: 'medium',
      numberOfQuestions: '5',
    });
  };

  const handleApproveQuestion = (questionId: string) => {
    setGeneratedQuestions(prev => 
      prev.map(q => q.id === questionId ? { ...q, approved: true } : q)
    );
    toast.success('Question approved');
  };

  const handleFlagQuestion = (questionId: string) => {
    setGeneratedQuestions(prev => 
      prev.map(q => q.id === questionId ? { ...q, approved: false } : q)
    );
    toast.success('Question flagged for review');
  };

  const handleSaveToLibrary = (question: GeneratedQuestion) => {
    const newQuestion = {
      ...question,
      id: `ql${savedQuestions.length + 1}`,
      class: formData.class || 'Not specified',
      chapter: formData.chapter || 'General',
      topic: formData.topic || 'General',
      subject: formData.subject,
      createdAt: new Date().toISOString().split('T')[0],
      timesUsed: 0,
      markedHighQuality: false,
      tags: [],
      qualityScore: question.aiConfidence,
    };
    setSavedQuestions(prev => [newQuestion, ...prev]);
    toast.success('Question saved to library');
  };

  const handleRegenerateQuestion = async (questionId: string) => {
    setGeneratedQuestions(prev => 
      prev.map(q => q.id === questionId ? { ...q, isRegenerating: true } : q)
    );
    
    // Simulate regeneration delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock regenerated question
    const regeneratedQuestion: GeneratedQuestion = {
      id: questionId,
      type: formData.questionType,
      question: 'What is the derivative of f(x) = 3x² + 5x - 2?',
      options: formData.questionType === 'mcq' ? [
        'f\'(x) = 6x + 5',
        'f\'(x) = 6x - 5', 
        'f\'(x) = 3x + 5',
        'f\'(x) = 6x + 2'
      ] : undefined,
      correctAnswer: formData.questionType === 'mcq' ? 'f\'(x) = 6x + 5' : 'f\'(x) = 6x + 5',
      explanation: 'Using the power rule: d/dx(3x²) = 6x, d/dx(5x) = 5, d/dx(-2) = 0',
      marks: parseInt(formData.marks) || 2,
      difficulty: formData.difficulty,
      cbseAligned: true,
      bloomsLevel: 'Apply' as const,
      aiConfidence: Math.floor(Math.random() * 15) + 85,
      issues: [],
      approved: undefined,
      isRegenerating: false
    };
    
    setGeneratedQuestions(prev => 
      prev.map(q => q.id === questionId ? regeneratedQuestion : q)
    );
    
    toast.success('Question regenerated successfully!');
  };

  const handleToggleHighQuality = (questionId: string) => {
    setSavedQuestions(prev =>
      prev.map(q => q.id === questionId ? { ...q, markedHighQuality: !q.markedHighQuality } : q)
    );
  };

  const filteredLibraryQuestions = savedQuestions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(librarySearch.toLowerCase()) ||
      q.chapter.toLowerCase().includes(librarySearch.toLowerCase()) ||
      q.topic.toLowerCase().includes(librarySearch.toLowerCase());
    const matchesDifficulty = libraryFilters.difficulty === 'all' || q.difficulty === libraryFilters.difficulty;
    const matchesChapter = libraryFilters.chapter === 'all' || q.chapter === libraryFilters.chapter;
    const matchesType = libraryFilters.type === 'all' || q.type === libraryFilters.type;
    const matchesClass = libraryFilters.class === 'all' || q.class === libraryFilters.class;
    return matchesSearch && matchesDifficulty && matchesChapter && matchesType && matchesClass;
  });

  const handleSave = () => {
    if (!saveData.title) {
      toast.error('Please enter a title');
      return;
    }
    toast.success('Assessment saved successfully!');
    setIsSaveDialogOpen(false);
  };

  const handleAssign = () => {
    toast.success('Assessment assigned to class!');
    setIsAssignDialogOpen(false);
  };

  // PDF Upload Handlers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      toast.success(`File "${file.name}" uploaded successfully`);
    } else {
      toast.error('Please upload a PDF file');
    }
  };

  const handleExtractQuestions = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a PDF file first');
      return;
    }

    setIsExtracting(true);
    
    // Simulate extraction delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock extracted questions
    const mockExtracted: GeneratedQuestion[] = [
      {
        id: `ext-${Date.now()}-1`,
        type: 'mcq',
        question: 'What is the value of x in the equation 2x + 5 = 15?',
        options: ['x = 5', 'x = 10', 'x = 7.5', 'x = 20'],
        correctAnswer: 'x = 5',
        explanation: 'Solving: 2x = 15 - 5 = 10, therefore x = 5',
        marks: 1,
        difficulty: 'easy',
        cbseAligned: true,
        bloomsLevel: 'Apply',
        aiConfidence: 92,
        issues: [],
        approved: false
      },
      {
        id: `ext-${Date.now()}-2`,
        type: 'short',
        question: 'Solve the quadratic equation: x² - 5x + 6 = 0',
        correctAnswer: 'x = 2 or x = 3',
        explanation: 'Factoring: (x - 2)(x - 3) = 0, so x = 2 or x = 3',
        marks: 3,
        difficulty: 'medium',
        cbseAligned: true,
        bloomsLevel: 'Apply',
        aiConfidence: 88,
        issues: [],
        approved: false
      },
      {
        id: `ext-${Date.now()}-3`,
        type: 'mcq',
        question: 'Which of the following is a rational number?',
        options: ['√2', 'π', '22/7', 'e'],
        correctAnswer: '22/7',
        explanation: '22/7 is a fraction and therefore a rational number',
        marks: 1,
        difficulty: 'easy',
        cbseAligned: true,
        bloomsLevel: 'Remember',
        aiConfidence: 95,
        issues: [],
        approved: false
      },
      {
        id: `ext-${Date.now()}-4`,
        type: 'long',
        question: 'Prove that the sum of angles in a triangle is 180 degrees.',
        correctAnswer: 'Proof using parallel lines and alternate angles',
        explanation: 'Draw a line parallel to one side through the opposite vertex. Use alternate and corresponding angles to show the sum equals 180°.',
        marks: 5,
        difficulty: 'hard',
        cbseAligned: true,
        bloomsLevel: 'Analyze',
        aiConfidence: 85,
        issues: ['Requires geometric diagram'],
        approved: false
      }
    ];

    setExtractedQuestions(mockExtracted);
    setIsExtracting(false);
    toast.success(`${mockExtracted.length} questions extracted from PDF`);
  };

  const handleEditQuestion = (questionId: string) => {
    const question = extractedQuestions.find(q => q.id === questionId);
    if (question) {
      setEditingQuestionId(questionId);
      setEditedQuestion(question);
    }
  };

  const handleSaveEdit = () => {
    if (!editingQuestionId) return;
    
    setExtractedQuestions(prev =>
      prev.map(q => q.id === editingQuestionId ? { ...q, ...editedQuestion } as GeneratedQuestion : q)
    );
    setEditingQuestionId(null);
    setEditedQuestion({});
    toast.success('Question updated successfully');
  };

  const handleDeleteExtracted = (questionId: string) => {
    setExtractedQuestions(prev => prev.filter(q => q.id !== questionId));
    toast.success('Question deleted');
  };

  const handleCombineQuestions = () => {
    if (extractedQuestions.length === 0) {
      toast.error('No extracted questions to combine');
      return;
    }
    
    const combined = [...generatedQuestions, ...extractedQuestions];
    setGeneratedQuestions(combined);
    toast.success(`Combined ${extractedQuestions.length} PDF questions with ${generatedQuestions.length} AI-generated questions`);
    
    // Clear extracted questions after combining
    setExtractedQuestions([]);
    setUploadedFile(null);
    
    // Switch to questions tab to show combined results
    setActiveTab('questions');
  };

  const handleAddExtractedToGenerated = () => {
    if (extractedQuestions.length === 0) {
      toast.error('No extracted questions available');
      return;
    }
    
    setGeneratedQuestions(prev => [...prev, ...extractedQuestions]);
    toast.success(`Added ${extractedQuestions.length} questions to generated list`);
    setExtractedQuestions([]);
    setUploadedFile(null);
    setActiveTab('questions');
  };

  const selectedChapter = chapters.find(ch => ch.id === formData.chapter);

  return (
    <div className="h-full">
      {/* Page Header - Clean */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900">AI Tools</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">Generate CBSE-aligned questions and worksheets</p>
        </div>
        <Button variant="ghost" size="sm" className="h-7 md:h-8 text-xs rounded-lg" onClick={() => navigate('/teacher')}>
          <ArrowLeft className="w-3 h-3 mr-1" />
          Back
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <TabsList className="h-7 md:h-8 p-0.5 md:p-1 rounded-lg bg-gray-100 overflow-x-auto flex-shrink-0 w-full md:w-auto">
          <TabsTrigger value="questions" className="gap-1 md:gap-2 text-[9px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 h-6 md:h-7 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md whitespace-nowrap">
            <Sparkles className="w-3 h-3" />
            <span className="hidden xs:inline">Question</span> Gen
          </TabsTrigger>
          <TabsTrigger value="pdf-upload" className="gap-1 md:gap-2 text-[9px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 h-6 md:h-7 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md whitespace-nowrap">
            <Upload className="w-3 h-3" />
            PDF
          </TabsTrigger>
          <TabsTrigger value="library" className="gap-1 md:gap-2 text-[9px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 h-6 md:h-7 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md whitespace-nowrap">
            <Library className="w-3 h-3" />
            Library
          </TabsTrigger>
          <TabsTrigger value="worksheet" className="gap-1 md:gap-2 text-[9px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 h-6 md:h-7 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md whitespace-nowrap">
            <FileText className="w-3 h-3" />
            Worksheet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="pt-3 md:pt-4">
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
            {/* Left: Parameters */}
            <div className="space-y-6">
              {/* Analytics Context */}
              {formData.chapter && selectedChapter && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Brain className="w-5 h-5 text-primary" />
                      <span className="font-medium">Analytics Context</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Chapter: {selectedChapter.name}</span>
                        <Badge variant="outline">{selectedChapter.masteryPercent}% mastery</Badge>
                      </div>
                      <p className="text-muted-foreground">
                        AI will use this context to generate targeted questions
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Parameters Form */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Question Parameters</CardTitle>
                      <CardDescription>Configure the type of questions to generate</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="blueprint-mode" className="text-xs text-muted-foreground cursor-pointer">
                        Blueprint Mode
                      </Label>
                      <Switch
                        id="blueprint-mode"
                        checked={blueprintMode}
                        onCheckedChange={setBlueprintMode}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {blueprintMode ? (
                    // Blueprint Mode UI
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-blue-900 text-sm">Blueprint Mode Active</h4>
                            <p className="text-xs text-blue-700 mt-1">
                              Define exam structure with chapter-wise weightage and question distribution
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 border-b">
                          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-600">
                            <div className="col-span-4">Chapter</div>
                            <div className="col-span-2 text-center">MCQ</div>
                            <div className="col-span-2 text-center">Short</div>
                            <div className="col-span-2 text-center">Long</div>
                            <div className="col-span-2 text-center">Total</div>
                          </div>
                        </div>
                        <div className="divide-y">
                          {blueprint.map((item, idx) => (
                            <div key={idx} className="px-4 py-3 hover:bg-gray-50">
                              <div className="grid grid-cols-12 gap-2 items-center text-sm">
                                <div className="col-span-4 font-medium">{item.chapter}</div>
                                <div className="col-span-2">
                                  <Input
                                    type="number"
                                    min="0"
                                    value={item.types.mcq}
                                    onChange={(e) => {
                                      const newBlueprint = [...blueprint];
                                      newBlueprint[idx].types.mcq = parseInt(e.target.value) || 0;
                                      setBlueprint(newBlueprint);
                                    }}
                                    className="h-8 text-center"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <Input
                                    type="number"
                                    min="0"
                                    value={item.types.short}
                                    onChange={(e) => {
                                      const newBlueprint = [...blueprint];
                                      newBlueprint[idx].types.short = parseInt(e.target.value) || 0;
                                      setBlueprint(newBlueprint);
                                    }}
                                    className="h-8 text-center"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <Input
                                    type="number"
                                    min="0"
                                    value={item.types.long}
                                    onChange={(e) => {
                                      const newBlueprint = [...blueprint];
                                      newBlueprint[idx].types.long = parseInt(e.target.value) || 0;
                                      setBlueprint(newBlueprint);
                                    }}
                                    className="h-8 text-center"
                                  />
                                </div>
                                <div className="col-span-2 text-center font-semibold">
                                  {item.types.mcq + item.types.short + item.types.long}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="bg-gray-50 px-4 py-2 border-t">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium">Total Questions:</span>
                            <span className="font-bold text-primary">
                              {blueprint.reduce((sum, item) => sum + item.types.mcq + item.types.short + item.types.long, 0)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating from Blueprint...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate from Blueprint
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    // Standard Mode UI
                    <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Class *</Label>
                      <Select value={formData.class} onValueChange={(v) => setFormData(prev => ({ ...prev, class: v }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9">Class 9</SelectItem>
                          <SelectItem value="10">Class 10</SelectItem>
                          <SelectItem value="11">Class 11</SelectItem>
                          <SelectItem value="12">Class 12</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Subject *</Label>
                      <Select value={formData.subject} onValueChange={(v) => setFormData(prev => ({ ...prev, subject: v }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mathematics">Mathematics</SelectItem>
                          <SelectItem value="Science">Science</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Chapter</Label>
                      <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => {
                        const weakest = chapters.reduce((a, b) => a.masteryPercent < b.masteryPercent ? a : b);
                        setFormData(prev => ({ ...prev, chapter: weakest.id }));
                      }}>
                        Use Weakest
                      </Button>
                    </div>
                    <Select value={formData.chapter} onValueChange={(v) => setFormData(prev => ({ ...prev, chapter: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select chapter" />
                      </SelectTrigger>
                      <SelectContent>
                        {chapters.map(ch => (
                          <SelectItem key={ch.id} value={ch.id}>
                            {ch.name} ({ch.masteryPercent}%)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Question Type *</Label>
                      <Select value={formData.questionType} onValueChange={(v) => setFormData(prev => ({ ...prev, questionType: v }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mcq">MCQ</SelectItem>
                          <SelectItem value="short">Short Answer</SelectItem>
                          <SelectItem value="long">Long Answer</SelectItem>
                          <SelectItem value="case">Case Based</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Difficulty *</Label>
                      <Select value={formData.difficulty} onValueChange={(v) => setFormData(prev => ({ ...prev, difficulty: v }))}>
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
                  </div>

                  <div className="space-y-2">
                    <Label>Number of Questions *</Label>
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      value={formData.numberOfQuestions}
                      onChange={(e) => setFormData(prev => ({ ...prev, numberOfQuestions: e.target.value }))}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleGenerate} disabled={isGenerating} className="gap-2 flex-1">
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generate Questions
                        </>
                      )}
                    </Button>
                    {generatedQuestions.length > 0 && (
                      <Button variant="outline" onClick={handleReset}>Reset</Button>
                    )}
                  </div>
                  </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right: Results */}
            <div>
              {isGenerating ? (
                <Card className="h-full flex items-center justify-center min-h-[400px]">
                  <CardContent className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="font-medium">Generating questions...</p>
                    <p className="text-sm text-muted-foreground">This may take a few moments</p>
                  </CardContent>
                </Card>
              ) : generatedQuestions.length > 0 ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Generated Questions</CardTitle>
                        <CardDescription>
                          {generatedQuestions.length} questions for Class {formData.class} {formData.subject}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setIsSaveDialogOpen(true)}>
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => {
                          saveGeneratedAsAssessment(generatedQuestions, {
                            subject: formData.subject,
                            chapter: formData.chapter,
                            topic: formData.topic,
                          });
                        }}>
                          <FileText className="w-4 h-4 mr-1" />
                          Create Assessment
                        </Button>
                        <Button size="sm" onClick={() => setIsAssignDialogOpen(true)}>
                          <Users className="w-4 h-4 mr-1" />
                          Assign
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                    {generatedQuestions.map((q, index) => (
                      <div key={q.id} className={cn(
                        "p-4 border rounded-lg transition-colors",
                        q.approved === true && "border-green-300 bg-green-50/30",
                        q.approved === false && "border-red-300 bg-red-50/30"
                      )}>
                        {/* Question Header with Quality Badges */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">Q{index + 1}</Badge>
                            <Badge>{q.type}</Badge>
                            <Badge variant="secondary" className="capitalize">{q.difficulty}</Badge>
                            <Badge variant={q.cbseAligned ? "default" : "destructive"} className="gap-1">
                              <Shield className="w-3 h-3" />
                              {q.cbseAligned ? "CBSE Aligned" : "Needs Review"}
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                              <Brain className="w-3 h-3" />
                              {q.bloomsLevel}
                            </Badge>
                            <Badge 
                              variant={q.aiConfidence >= 90 ? "default" : q.aiConfidence >= 75 ? "secondary" : "destructive"}
                              className="gap-1"
                            >
                              <TrendingUp className="w-3 h-3" />
                              {q.aiConfidence}% confidence
                            </Badge>
                          </div>
                          <span className="text-sm font-medium whitespace-nowrap ml-2">{q.marks} mark{q.marks > 1 ? 's' : ''}</span>
                        </div>

                        {/* Issue Warnings */}
                        {q.issues && q.issues.length > 0 && (
                          <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-amber-900 mb-1">Quality Issues Detected</p>
                                <ul className="text-xs text-amber-700 space-y-0.5">
                                  {q.issues.map((issue, idx) => (
                                    <li key={idx}>• {issue}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}

                        <p className="font-medium mb-3">{q.question}</p>
                        {q.options && (
                          <div className="space-y-1 mb-3">
                            {q.options.map((opt, i) => (
                              <div 
                                key={i} 
                                className={`text-sm p-2 rounded ${opt === q.correctAnswer ? 'bg-green-100 text-green-700' : 'bg-muted'}`}
                              >
                                {String.fromCharCode(65 + i)}) {opt}
                                {opt === q.correctAnswer && <CheckCircle className="w-4 h-4 inline ml-2" />}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="text-sm text-muted-foreground bg-muted/30 p-2 rounded mb-3">
                          <strong>Explanation:</strong> {q.explanation}
                        </div>

                        {/* Question Actions */}
                        <div className="flex items-center gap-2 pt-3 border-t">
                          <Button
                            size="sm"
                            variant={q.approved === true ? "default" : "outline"}
                            onClick={() => handleApproveQuestion(q.id)}
                            className="gap-1"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            {q.approved === true ? "Approved" : "Approve"}
                          </Button>
                          <Button
                            size="sm"
                            variant={q.approved === false ? "destructive" : "outline"}
                            onClick={() => handleFlagQuestion(q.id)}
                            className="gap-1"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            {q.approved === false ? "Flagged" : "Flag"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSaveToLibrary(q)}
                            className="gap-1"
                          >
                            <BookmarkPlus className="w-3.5 h-3.5" />
                            Save to Library
                          </Button>
                          <div className="flex-1" />
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleRegenerateQuestion(q.id)}
                            disabled={q.isRegenerating}
                            className="gap-1"
                          >
                            {q.isRegenerating ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <RefreshCw className="w-3.5 h-3.5" />
                            )}
                            {q.isRegenerating ? 'Regenerating...' : 'Regenerate'}
                          </Button>
                          <Button size="sm" variant="ghost" className="gap-1">
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" className="gap-1 text-destructive hover:text-destructive">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center min-h-[400px]">
                  <CardContent className="text-center">
                    <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="font-medium">No questions generated yet</p>
                    <p className="text-sm text-muted-foreground">
                      Configure parameters and click "Generate Questions"
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          </div>
        </TabsContent>

        <TabsContent value="pdf-upload" className="p-4 md:p-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileUp className="w-5 h-5" />
                PDF Question Extraction
              </CardTitle>
              <CardDescription>
                Upload existing question papers or study materials to extract questions automatically
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">
                      {uploadedFile ? uploadedFile.name : 'Upload PDF Document'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {uploadedFile 
                        ? `File size: ${(uploadedFile.size / 1024).toFixed(2)} KB`
                        : 'Click to browse or drag and drop your PDF file here'
                      }
                    </p>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload">
                      <Button variant="outline" asChild>
                        <span>
                          <FileUp className="w-4 h-4 mr-2" />
                          {uploadedFile ? 'Change File' : 'Choose File'}
                        </span>
                      </Button>
                    </label>
                    {uploadedFile && (
                      <Button onClick={handleExtractQuestions} disabled={isExtracting}>
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
              </div>

              {/* Extracted Questions */}
              {extractedQuestions.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Extracted Questions</h3>
                      <Badge variant="secondary">{extractedQuestions.length} questions</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddExtractedToGenerated} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add to Generated
                      </Button>
                      <Button onClick={handleCombineQuestions} size="sm" variant="default">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Combine with AI Questions
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {extractedQuestions.map((question, index) => (
                      <Card key={question.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          {editingQuestionId === question.id ? (
                            // Edit Mode
                            <div className="space-y-3">
                              <div className="space-y-2">
                                <Label>Question</Label>
                                <Textarea
                                  value={editedQuestion.question || question.question}
                                  onChange={(e) => setEditedQuestion(prev => ({ ...prev, question: e.target.value }))}
                                  rows={3}
                                />
                              </div>
                              {question.type === 'mcq' && (
                                <div className="space-y-2">
                                  <Label>Options</Label>
                                  {question.options?.map((opt, i) => (
                                    <Input
                                      key={i}
                                      value={editedQuestion.options?.[i] || opt}
                                      onChange={(e) => {
                                        const newOptions = [...(editedQuestion.options || question.options || [])];
                                        newOptions[i] = e.target.value;
                                        setEditedQuestion(prev => ({ ...prev, options: newOptions }));
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  <Label>Correct Answer</Label>
                                  <Input
                                    value={editedQuestion.correctAnswer || question.correctAnswer}
                                    onChange={(e) => setEditedQuestion(prev => ({ ...prev, correctAnswer: e.target.value }))}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Marks</Label>
                                  <Input
                                    type="number"
                                    value={editedQuestion.marks || question.marks}
                                    onChange={(e) => setEditedQuestion(prev => ({ ...prev, marks: parseInt(e.target.value) }))}
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Explanation</Label>
                                <Textarea
                                  value={editedQuestion.explanation || question.explanation}
                                  onChange={(e) => setEditedQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                                  rows={2}
                                />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button size="sm" variant="outline" onClick={() => setEditingQuestionId(null)}>
                                  Cancel
                                </Button>
                                <Button size="sm" onClick={handleSaveEdit}>
                                  <Save className="w-4 h-4 mr-2" />
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // View Mode
                            <div className="space-y-3">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="text-xs">Q{index + 1}</Badge>
                                    <Badge variant="secondary" className="text-xs">{question.type.toUpperCase()}</Badge>
                                    <Badge variant="secondary" className="text-xs">{question.marks} marks</Badge>
                                    <Badge className={cn(
                                      "text-xs",
                                      question.difficulty === 'easy' && "bg-green-500",
                                      question.difficulty === 'medium' && "bg-yellow-500",
                                      question.difficulty === 'hard' && "bg-red-500"
                                    )}>
                                      {question.difficulty}
                                    </Badge>
                                  </div>
                                  <p className="font-medium mb-2">{question.question}</p>
                                  {question.options && (
                                    <div className="space-y-1 ml-4 mb-2">
                                      {question.options.map((opt, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                          <span className={cn(
                                            "text-sm",
                                            opt === question.correctAnswer && "text-green-600 font-medium"
                                          )}>
                                            {String.fromCharCode(65 + i)}. {opt}
                                            {opt === question.correctAnswer && " ✓"}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  <div className="text-sm text-muted-foreground">
                                    <span className="font-medium">Answer:</span> {question.correctAnswer}
                                  </div>
                                  {question.explanation && (
                                    <div className="text-sm text-muted-foreground mt-1">
                                      <span className="font-medium">Explanation:</span> {question.explanation}
                                    </div>
                                  )}
                                  
                                  {/* Quality Indicators */}
                                  <div className="flex gap-2 mt-3">
                                    {question.cbseAligned && (
                                      <Badge variant="outline" className="text-xs gap-1">
                                        <Shield className="w-3 h-3" />
                                        CBSE Aligned
                                      </Badge>
                                    )}
                                    <Badge variant="outline" className="text-xs gap-1">
                                      <Brain className="w-3 h-3" />
                                      {question.bloomsLevel}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs gap-1">
                                      <TrendingUp className="w-3 h-3" />
                                      {question.aiConfidence}% Confidence
                                    </Badge>
                                  </div>

                                  {question.issues.length > 0 && (
                                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                                      <div className="flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        <span className="font-medium">Issues:</span>
                                      </div>
                                      <ul className="ml-4 mt-1">
                                        {question.issues.map((issue, i) => (
                                          <li key={i}>• {issue}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  <Button size="sm" variant="ghost" onClick={() => handleEditQuestion(question.id)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => handleDeleteExtracted(question.id)}>
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Help Text */}
              {extractedQuestions.length === 0 && !uploadedFile && (
                <div className="text-center py-8">
                  <Info className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium mb-2">How PDF Extraction Works</h3>
                  <div className="text-sm text-muted-foreground max-w-2xl mx-auto space-y-2">
                    <p>1. Upload a PDF containing questions (question papers, worksheets, practice sets)</p>
                    <p>2. AI will automatically extract questions, answers, and explanations</p>
                    <p>3. Review and edit extracted questions as needed</p>
                    <p>4. Combine with AI-generated questions or use independently</p>
                    <p>5. Save to library or assign directly to students</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="p-4 md:p-6 pt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Library className="w-5 h-5" />
                    Question Library
                  </CardTitle>
                  <CardDescription>
                    {savedQuestions.length} saved questions • Reuse high-quality questions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search questions..."
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={libraryFilters.class} onValueChange={(v) => setLibraryFilters(prev => ({ ...prev, class: v }))}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="8">Class 8</SelectItem>
                    <SelectItem value="9">Class 9</SelectItem>
                    <SelectItem value="10">Class 10</SelectItem>
                    <SelectItem value="11">Class 11</SelectItem>
                    <SelectItem value="12">Class 12</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={libraryFilters.difficulty} onValueChange={(v) => setLibraryFilters(prev => ({ ...prev, difficulty: v }))}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={libraryFilters.type} onValueChange={(v) => setLibraryFilters(prev => ({ ...prev, type: v }))}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="mcq">MCQ</SelectItem>
                    <SelectItem value="short">Short Answer</SelectItem>
                    <SelectItem value="long">Long Answer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Questions Grid/Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Question</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Chapter</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead className="text-center">Quality</TableHead>
                      <TableHead className="text-center">Times Used</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLibraryQuestions.length > 0 ? (
                      filteredLibraryQuestions.map((q) => (
                        <TableRow key={q.id} className="hover:bg-muted/50">
                          <TableCell>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleToggleHighQuality(q.id)}
                              className={cn(
                                "h-8 w-8 p-0",
                                q.markedHighQuality && "text-yellow-500"
                              )}
                            >
                              <Star className={cn("w-4 h-4", q.markedHighQuality && "fill-yellow-500")} />
                            </Button>
                          </TableCell>
                          <TableCell className="max-w-md">
                            <div className="flex items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{q.question}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  {q.cbseAligned && (
                                    <Badge variant="outline" className="text-xs">
                                      <Shield className="w-2.5 h-2.5 mr-1" />
                                      CBSE
                                    </Badge>
                                  )}
                                  <Badge variant="outline" className="text-xs">
                                    {q.bloomsLevel}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {q.class || 'Not specified'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{q.chapter}</div>
                              <div className="text-xs text-muted-foreground">{q.topic}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="uppercase text-xs">{q.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={q.difficulty === 'easy' ? 'secondary' : q.difficulty === 'hard' ? 'destructive' : 'default'}
                              className="capitalize text-xs"
                            >
                              {q.difficulty}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <div className="text-sm font-semibold">{q.qualityScore}%</div>
                              {q.qualityScore >= 90 && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="text-xs">
                              {q.timesUsed}x
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button size="sm" variant="outline" className="h-8 text-xs">
                                <Eye className="w-3.5 h-3.5 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="default" className="h-8 text-xs">
                                Add to Assessment
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <Library className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                          <p className="font-medium">No questions found</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {librarySearch || libraryFilters.difficulty !== 'all' || libraryFilters.type !== 'all'
                              ? 'Try adjusting your filters'
                              : 'Save questions from the generator to build your library'}
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="worksheet" className="p-4 md:p-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Worksheet Generator
              </CardTitle>
              <CardDescription>
                Generate printable worksheets with mixed question types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Coming Soon!</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Worksheet generator with mixed question types, print-friendly formatting, 
                  PDF export, and optional answer key is under development.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Assessment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Assessment Title *</Label>
              <Input
                placeholder="e.g., Chapter 5 Practice Quiz"
                value={saveData.title}
                onChange={(e) => setSaveData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Optional description..."
                value={saveData.description}
                onChange={(e) => setSaveData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration (mins)</Label>
                <Input
                  type="number"
                  value={saveData.duration}
                  onChange={(e) => setSaveData(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={saveData.dueDate}
                  onChange={(e) => setSaveData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>
            <Button onClick={handleSave} className="w-full">Save Assessment</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign to Class</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Select Class</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9a">Class 9-A</SelectItem>
                  <SelectItem value="9b">Class 9-B</SelectItem>
                  <SelectItem value="10a">Class 10-A</SelectItem>
                  <SelectItem value="10b">Class 10-B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAssign} className="w-full">Assign</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const TeacherAITools = () => {
  return (
    <TeacherDashboardLayout>
      <TeacherAIToolsContent />
    </TeacherDashboardLayout>
  );
};

export default TeacherAITools;
