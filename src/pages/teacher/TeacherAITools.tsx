import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import { useTeacherMode } from '@/contexts/TeacherModeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Sparkles, Brain, FileText, Loader2, CheckCircle, Save, Users, AlertCircle, Download } from 'lucide-react';
import { chapters } from '@/data/teacherMockData';
import { toast } from 'sonner';

interface GeneratedQuestion {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  marks: number;
  difficulty: string;
}

const TeacherAIToolsContent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentMode } = useTeacherMode();
  const defaultTab = searchParams.get('tab') === 'worksheet' ? 'worksheet' : 'questions';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

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

  const [saveData, setSaveData] = useState({
    title: '',
    description: '',
    duration: '60',
    dueDate: '',
  });

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
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockQuestions: GeneratedQuestion[] = Array.from({ length: parseInt(formData.numberOfQuestions) }, (_, i) => ({
      id: `q${i + 1}`,
      type: formData.questionType.toUpperCase(),
      question: formData.questionType === 'mcq' 
        ? `What is the result of solving the equation ${2 + i}x + ${3 + i} = ${10 + i}?`
        : `Explain the concept of ${['linear equations', 'quadratic functions', 'polynomials', 'geometry basics', 'trigonometry'][i % 5]} with an example.`,
      options: formData.questionType === 'mcq' ? [`x = ${1 + i}`, `x = ${2 + i}`, `x = ${3 + i}`, `x = ${4 + i}`] : undefined,
      correctAnswer: formData.questionType === 'mcq' ? `x = ${2 + i}` : 'A detailed explanation covering the key concepts...',
      explanation: 'This question tests the student\'s understanding of basic algebraic manipulation and equation solving.',
      marks: formData.questionType === 'mcq' ? 1 : formData.questionType === 'short' ? 2 : 5,
      difficulty: formData.difficulty,
    }));

    setGeneratedQuestions(mockQuestions);
    setIsGenerating(false);
    toast.success(`Generated ${formData.numberOfQuestions} questions!`);
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

  const selectedChapter = chapters.find(ch => ch.id === formData.chapter);

  return (
    <div className="space-y-10 max-w-[1600px]">
      {/* Page Header - Clean */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Tools</h1>
          <p className="text-sm text-gray-500 mt-2">Generate CBSE-aligned questions and worksheets using AI</p>
        </div>
        <Button variant="ghost" size="sm" className="h-10 rounded-xl" onClick={() => navigate('/teacher')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-8 p-1 rounded-lg bg-gray-100">
          <TabsTrigger value="questions" className="gap-2 text-xs px-3 py-1.5 h-7 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
            <Sparkles className="w-3.5 h-3.5" />
            Question Generator
          </TabsTrigger>
          <TabsTrigger value="worksheet" className="gap-2 text-xs px-3 py-1.5 h-7 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
            <FileText className="w-3.5 h-3.5" />
            Worksheet Generator
          </TabsTrigger>
        </TabsList>

        {/* Question Generator Tab */}
        <TabsContent value="questions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <CardTitle>Question Parameters</CardTitle>
                  <CardDescription>Configure the type of questions to generate</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                        <Button size="sm" onClick={() => setIsAssignDialogOpen(true)}>
                          <Users className="w-4 h-4 mr-1" />
                          Assign
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                    {generatedQuestions.map((q, index) => (
                      <div key={q.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Q{index + 1}</Badge>
                            <Badge>{q.type}</Badge>
                            <Badge variant="secondary" className="capitalize">{q.difficulty}</Badge>
                          </div>
                          <span className="text-sm font-medium">{q.marks} mark{q.marks > 1 ? 's' : ''}</span>
                        </div>
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
                        <div className="text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                          <strong>Explanation:</strong> {q.explanation}
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
        </TabsContent>

        {/* Worksheet Generator Tab */}
        <TabsContent value="worksheet" className="space-y-6">
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
