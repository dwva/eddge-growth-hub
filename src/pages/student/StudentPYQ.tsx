import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText,
  Download,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  Eye,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

// Mock PYQ data
const pyqPapers = [
  {
    id: '1',
    title: 'Mathematics Mid-Term 2025',
    subject: 'Mathematics',
    year: '2025',
    type: 'Mid-Term',
    duration: '2 hours',
    totalMarks: 100,
    questions: 25,
    solved: true,
    difficulty: 'medium',
  },
  {
    id: '2',
    title: 'Science Final Exam 2025',
    subject: 'Science',
    year: '2025',
    type: 'Final',
    duration: '3 hours',
    totalMarks: 100,
    questions: 35,
    solved: false,
    difficulty: 'hard',
  },
  {
    id: '3',
    title: 'English Grammar Test 2025',
    subject: 'English',
    year: '2025',
    type: 'Unit Test',
    duration: '1 hour',
    totalMarks: 50,
    questions: 20,
    solved: true,
    difficulty: 'easy',
  },
  {
    id: '4',
    title: 'Mathematics Final Exam 2024',
    subject: 'Mathematics',
    year: '2024',
    type: 'Final',
    duration: '3 hours',
    totalMarks: 100,
    questions: 30,
    solved: false,
    difficulty: 'hard',
  },
  {
    id: '5',
    title: 'Science Mid-Term 2024',
    subject: 'Science',
    year: '2024',
    type: 'Mid-Term',
    duration: '2 hours',
    totalMarks: 100,
    questions: 25,
    solved: true,
    difficulty: 'medium',
  },
  {
    id: '6',
    title: 'History Annual Exam 2024',
    subject: 'History',
    year: '2024',
    type: 'Annual',
    duration: '2.5 hours',
    totalMarks: 100,
    questions: 30,
    solved: false,
    difficulty: 'medium',
  },
];

const years = ['2025', '2024', '2023'];
const subjects = ['All', 'Mathematics', 'Science', 'English', 'History', 'Geography'];

const StudentPYQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState('All');

  const filteredPapers = pyqPapers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = !selectedYear || paper.year === selectedYear;
    const matchesSubject = selectedSubject === 'All' || paper.subject === selectedSubject;
    return matchesSearch && matchesYear && matchesSubject;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Mathematics': return 'bg-blue-500';
      case 'Science': return 'bg-purple-500';
      case 'English': return 'bg-pink-500';
      case 'History': return 'bg-amber-500';
      case 'Geography': return 'bg-teal-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <StudentDashboardLayout title="Previous Year Papers">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <FileText className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-xl font-semibold">{pyqPapers.length}</p>
              <p className="text-sm text-muted-foreground">Total Papers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <p className="text-xl font-semibold">{pyqPapers.filter(p => p.solved).length}</p>
              <p className="text-sm text-muted-foreground">Solved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-amber-500" />
              <p className="text-xl font-semibold">{years.length}</p>
              <p className="text-sm text-muted-foreground">Years Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-xl font-semibold">12h</p>
              <p className="text-sm text-muted-foreground">Practice Time</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search papers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {years.map((year) => (
              <Button
                key={year}
                variant={selectedYear === year ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedYear(selectedYear === year ? null : year)}
              >
                {year}
              </Button>
            ))}
          </div>
        </div>

        {/* Subject Filter */}
        <div className="flex gap-2 flex-wrap">
          {subjects.map((subject) => (
            <Button
              key={subject}
              variant={selectedSubject === subject ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSubject(subject)}
            >
              {subject}
            </Button>
          ))}
        </div>

        {/* Papers List */}
        <div className="space-y-3">
          {filteredPapers.map((paper) => (
            <Card key={paper.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-1.5 h-14 rounded-full ${getSubjectColor(paper.subject)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium truncate">{paper.title}</h3>
                        {paper.solved && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Solved
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {paper.subject}
                        </Badge>
                        <span>{paper.type}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {paper.duration}
                        </span>
                        <span>{paper.totalMarks} marks</span>
                        <span>{paper.questions} questions</span>
                        <Badge className={`text-xs ${getDifficultyColor(paper.difficulty)}`}>
                          {paper.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button size="sm">
                      Practice
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPapers.length === 0 && (
          <div className="text-center py-10">
            <FileText className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-sm font-medium mb-1">No papers found</h3>
            <p className="text-xs text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentPYQ;
