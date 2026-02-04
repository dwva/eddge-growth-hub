import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FileText,
  Download,
  Search,
  Clock,
  CheckCircle2,
  Eye,
  Sparkles,
  BookOpen,
  TrendingUp,
  BookMarked,
  Calendar,
  Filter,
  ListChecks,
  FileBarChart,
  PenLine,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

type Difficulty = 'easy' | 'medium' | 'hard';
type ExamType = 'Mid' | 'Final' | 'Unit';

type PYQPaper = {
  id: string;
  title: string;
  subject: string;
  year: string;
  examType: ExamType;
  duration: string;
  totalMarks: number;
  questionCount: number;
  solved: boolean;
  difficulty: Difficulty;
  chapters: string[];
  questionTypeMix: { mcq: number; numerical: number; theory: number };
  accuracy?: number;
  timeTaken?: string;
};

// Mock PYQ data – CBSE-focused
const pyqPapers: PYQPaper[] = [
  {
    id: '1',
    title: 'CBSE Mathematics Board 2025',
    subject: 'Mathematics',
    year: '2025',
    examType: 'Final',
    duration: '3 hours',
    totalMarks: 80,
    questionCount: 38,
    solved: true,
    difficulty: 'medium',
    chapters: ['Relations & Functions', 'Calculus', 'Linear Algebra'],
    questionTypeMix: { mcq: 20, numerical: 12, theory: 6 },
    accuracy: 82,
    timeTaken: '2h 45m',
  },
  {
    id: '2',
    title: 'CBSE Physics Board 2025',
    subject: 'Physics',
    year: '2025',
    examType: 'Final',
    duration: '3 hours',
    totalMarks: 70,
    questionCount: 33,
    solved: false,
    difficulty: 'hard',
    chapters: ['Electrostatics', 'Current Electricity', 'Magnetic Effects'],
    questionTypeMix: { mcq: 16, numerical: 10, theory: 7 },
  },
  {
    id: '3',
    title: 'Mathematics Mid-Term 2025',
    subject: 'Mathematics',
    year: '2025',
    examType: 'Mid',
    duration: '2 hours',
    totalMarks: 40,
    questionCount: 20,
    solved: true,
    difficulty: 'easy',
    chapters: ['Relations & Functions', 'Matrices'],
    questionTypeMix: { mcq: 12, numerical: 6, theory: 2 },
    accuracy: 90,
    timeTaken: '1h 30m',
  },
  {
    id: '4',
    title: 'Chemistry Unit Test 2025',
    subject: 'Chemistry',
    year: '2025',
    examType: 'Unit',
    duration: '1 hour',
    totalMarks: 25,
    questionCount: 15,
    solved: false,
    difficulty: 'medium',
    chapters: ['Solutions', 'Electrochemistry', 'Chemical Kinetics'],
    questionTypeMix: { mcq: 8, numerical: 4, theory: 3 },
  },
  {
    id: '5',
    title: 'CBSE Mathematics Board 2024',
    subject: 'Mathematics',
    year: '2024',
    examType: 'Final',
    duration: '3 hours',
    totalMarks: 80,
    questionCount: 38,
    solved: false,
    difficulty: 'hard',
    chapters: ['Calculus', 'Vectors', 'Probability'],
    questionTypeMix: { mcq: 20, numerical: 12, theory: 6 },
  },
  {
    id: '6',
    title: 'Biology Board 2024',
    subject: 'Biology',
    year: '2024',
    examType: 'Final',
    duration: '3 hours',
    totalMarks: 70,
    questionCount: 27,
    solved: true,
    difficulty: 'medium',
    chapters: ['Genetics', 'Biotechnology', 'Ecology'],
    questionTypeMix: { mcq: 14, numerical: 0, theory: 13 },
    accuracy: 78,
    timeTaken: '2h 50m',
  },
  {
    id: '7',
    title: 'English Core 2024',
    subject: 'English',
    year: '2024',
    examType: 'Final',
    duration: '3 hours',
    totalMarks: 80,
    questionCount: 12,
    solved: false,
    difficulty: 'medium',
    chapters: ['Reading', 'Writing', 'Literature'],
    questionTypeMix: { mcq: 8, numerical: 0, theory: 4 },
  },
  {
    id: '8',
    title: 'Physics Mid-Term 2024',
    subject: 'Physics',
    year: '2024',
    examType: 'Mid',
    duration: '2 hours',
    totalMarks: 35,
    questionCount: 18,
    solved: true,
    difficulty: 'easy',
    chapters: ['Electrostatics', 'Capacitance'],
    questionTypeMix: { mcq: 10, numerical: 5, theory: 3 },
    accuracy: 85,
    timeTaken: '1h 40m',
  },
  {
    id: '9',
    title: 'Mathematics Board 2023',
    subject: 'Mathematics',
    year: '2023',
    examType: 'Final',
    duration: '3 hours',
    totalMarks: 80,
    questionCount: 38,
    solved: false,
    difficulty: 'hard',
    chapters: ['Calculus', 'Application of Derivatives', 'Integrals'],
    questionTypeMix: { mcq: 20, numerical: 12, theory: 6 },
  },
];

const SUBJECTS = ['All Subjects', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'];
const YEARS = ['All Years', '2025', '2024', '2023'];
const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'solved', label: 'Solved' },
  { value: 'unsolved', label: 'Unsolved' },
];

const subjectColors: Record<string, string> = {
  Mathematics: 'bg-blue-100 text-blue-700 border-blue-200',
  Physics: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Chemistry: 'bg-red-100 text-red-700 border-red-200',
  Biology: 'bg-green-100 text-green-700 border-green-200',
  English: 'bg-pink-100 text-pink-700 border-pink-200',
};

const difficultyStyles: Record<Difficulty, string> = {
  easy: 'bg-green-100 text-green-700 border-green-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  hard: 'bg-red-100 text-red-700 border-red-200',
};

const StudentPYQ = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All Subjects');
  const [selectedYear, setSelectedYear] = useState<string>('All Years');
  const [solvedFilter, setSolvedFilter] = useState<string>('all');
  const [smartPracticePaperId, setSmartPracticePaperId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const filteredPapers = pyqPapers.filter((paper) => {
    const matchesSearch =
      !searchQuery ||
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      selectedSubject === 'All Subjects' || paper.subject === selectedSubject;
    const matchesYear = selectedYear === 'All Years' || paper.year === selectedYear;
    const matchesSolved =
      solvedFilter === 'all' ||
      (solvedFilter === 'solved' && paper.solved) ||
      (solvedFilter === 'unsolved' && !paper.solved);
    return matchesSearch && matchesSubject && matchesYear && matchesSolved;
  });

  const openSmartPractice = (paperId: string) => setSmartPracticePaperId(paperId);
  const closeSmartPractice = () => setSmartPracticePaperId(null);

  const handleSmartPracticeOption = (mode: 'full' | 'mcq' | 'case-study' | 'long-answer') => {
    const paperId = smartPracticePaperId;
    closeSmartPractice();
    navigate('/student/practice', {
      state: { fromPyq: true, paperId, mode },
    });
  };

  const selectedPaper = smartPracticePaperId
    ? pyqPapers.find((p) => p.id === smartPracticePaperId)
    : null;

  return (
    <StudentDashboardLayout title="Previous Year Papers">
      <div className="space-y-6 pb-10">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by paper name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl border-gray-200 bg-white"
          />
        </div>

        {/* 3 Widgets: Subject, Year, Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-gray-100 bg-white shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookMarked className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Subject</p>
                  <p className="text-sm font-semibold text-gray-900">Filter by subject</p>
                </div>
              </div>
              <div className="p-3">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-full rounded-xl border-gray-200 h-11 bg-gray-50/50">
                    <SelectValue placeholder="Choose subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 bg-white shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Year</p>
                  <p className="text-sm font-semibold text-gray-900">Filter by year</p>
                </div>
              </div>
              <div className="p-3">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-full rounded-xl border-gray-200 h-11 bg-gray-50/50">
                    <SelectValue placeholder="Choose year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 bg-white shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Filter className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Status</p>
                  <p className="text-sm font-semibold text-gray-900">Solved / Unsolved</p>
                </div>
              </div>
              <div className="p-3">
                <Select value={solvedFilter} onValueChange={setSolvedFilter}>
                  <SelectTrigger className="w-full rounded-xl border-gray-200 h-11 bg-gray-50/50">
                    <SelectValue placeholder="Choose status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3. PYQ Cards */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">CBSE Previous Year Papers</h2>
          <div className="space-y-4">
            {filteredPapers.map((paper) => (
              <Card
                key={paper.id}
                className="border-gray-100 bg-white shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            'rounded-lg border px-2.5 py-1 text-xs font-semibold',
                            subjectColors[paper.subject] ?? 'bg-gray-100 text-gray-700'
                          )}
                        >
                          {paper.subject}
                        </span>
                        <span className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
                          {paper.examType}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">{paper.year}</span>
                        {paper.solved && (
                          <span className="inline-flex items-center gap-1 rounded-lg border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Solved
                          </span>
                        )}
                        <span
                          className={cn(
                            'rounded-lg border px-2.5 py-1 text-xs font-medium capitalize',
                            difficultyStyles[paper.difficulty]
                          )}
                        >
                          {paper.difficulty}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">{paper.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {paper.duration}
                        </span>
                        <span>{paper.totalMarks} marks</span>
                        <span>{paper.questionCount} questions</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs text-muted-foreground">Chapters:</span>
                        {paper.chapters.slice(0, 3).map((ch) => (
                          <span
                            key={ch}
                            className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                          >
                            {ch}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>Question mix:</span>
                        <span>MCQ {paper.questionTypeMix.mcq}</span>
                        <span>·</span>
                        <span>Numerical {paper.questionTypeMix.numerical}</span>
                        <span>·</span>
                        <span>Theory {paper.questionTypeMix.theory}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 lg:flex-shrink-0">
                      <Button size="sm" variant="outline" className="rounded-lg" onClick={() => {}}>
                        <Eye className="w-4 h-4 mr-1.5" />
                        View Paper
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-lg" onClick={() => {}}>
                        <Download className="w-4 h-4 mr-1.5" />
                        Download PDF
                      </Button>
                      <Button
                        size="sm"
                        className="rounded-lg bg-primary hover:bg-primary/90"
                        onClick={() => openSmartPractice(paper.id)}
                      >
                        <Sparkles className="w-4 h-4 mr-1.5" />
                        Smart Practice
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {filteredPapers.length === 0 && (
          <Card className="border-gray-100 rounded-2xl">
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <h3 className="text-sm font-medium text-gray-900 mb-1">No papers found</h3>
              <p className="text-xs text-muted-foreground mb-4">Try adjusting search or filters</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubject('All Subjects');
                  setSelectedYear('All Years');
                  setSolvedFilter('all');
                }}
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 5. Smart Practice Modal */}
        <Dialog open={!!smartPracticePaperId} onOpenChange={() => closeSmartPractice()}>
          <DialogContent className="sm:max-w-md rounded-2xl border-gray-100">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Smart Practice
              </DialogTitle>
            </DialogHeader>
            {selectedPaper && (
              <p className="text-sm text-muted-foreground -mt-2">
                {selectedPaper.title}
              </p>
            )}
            <div className="grid gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleSmartPracticeOption('full')}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Full Paper (Exam Mode)</p>
                  <p className="text-xs text-muted-foreground">Timed, full-length attempt</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleSmartPracticeOption('mcq')}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <ListChecks className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">MCQs</p>
                  <p className="text-xs text-muted-foreground">Multiple choice questions only</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleSmartPracticeOption('case-study')}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <FileBarChart className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Case Study</p>
                  <p className="text-xs text-muted-foreground">Case-based questions</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleSmartPracticeOption('long-answer')}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <PenLine className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Long Answer</p>
                  <p className="text-xs text-muted-foreground">Descriptive / long-form questions</p>
                </div>
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 6. Post-Practice Feedback (mock – shown after Smart Practice option) */}
        <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
          <DialogContent className="sm:max-w-md rounded-2xl border-gray-100">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Practice Feedback
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                  <p className="text-2xl font-semibold text-gray-900">78%</p>
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                  <p className="text-lg font-semibold text-gray-900">2h 20m</p>
                  <p className="text-xs text-muted-foreground">Time vs 3h exam</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Weak chapters</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-red-50 px-2 py-1 text-xs text-red-700">
                    Calculus
                  </span>
                  <span className="rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-700">
                    Vectors
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Suggested next PYQs</p>
                <p className="text-sm text-gray-700">
                  Mathematics Board 2024 · Physics Mid-Term 2024
                </p>
              </div>
              <Button className="w-full rounded-lg" onClick={() => setShowFeedback(false)}>
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentPYQ;
