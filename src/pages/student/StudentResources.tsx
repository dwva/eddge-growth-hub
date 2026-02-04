import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FileText,
  Search,
  Download,
  Star,
  CalendarPlus,
  Bookmark,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// Mock types
type Purpose = 'learn' | 'practice' | 'revision';
type ExamWeight = 'high' | 'medium' | 'optional';

type Resource = {
  id: string;
  title: string;
  source: string;
  subject: string;
  chapter: string;
  rating: number;
  purpose: Purpose;
  examWeight: ExamWeight;
  size?: string;
  cover: string; // image URL for book/resource cover
};

// Mock resources – books only, with name and cover photo (Arihant covers in public/resources/)
const resources: Resource[] = [
  {
    id: '1',
    title: 'All in One Mathematics Class 12',
    source: 'Arihant',
    subject: 'Mathematics',
    chapter: 'Class 12',
    rating: 4.8,
    purpose: 'learn',
    examWeight: 'high',
    size: '2.4 MB',
    cover: '/resources/arihant-mathematics.png',
  },
  {
    id: '2',
    title: 'All in One English Core CBSE Class 12',
    source: 'Arihant',
    subject: 'English',
    chapter: 'Class 12',
    rating: 4.9,
    purpose: 'learn',
    examWeight: 'high',
    size: '3.1 MB',
    cover: '/resources/arihant-english.png',
  },
  {
    id: '3',
    title: 'All in One Chemistry Class 12',
    source: 'Arihant',
    subject: 'Chemistry',
    chapter: 'Class 12',
    rating: 4.7,
    purpose: 'learn',
    examWeight: 'high',
    size: '2.8 MB',
    cover: '/resources/arihant-chemistry.png',
  },
  {
    id: '4',
    title: 'NCERT Solutions Mathematics',
    source: 'Oswaal',
    subject: 'Mathematics',
    chapter: 'Chapter 3–6',
    rating: 4.6,
    purpose: 'practice',
    examWeight: 'high',
    size: '1.9 MB',
    cover: '/resources/arihant-mathematics.png',
  },
  {
    id: '5',
    title: 'Physics Concepts & Numericals',
    source: 'HC Verma',
    subject: 'Physics',
    chapter: 'Chapter 2–5',
    rating: 4.5,
    purpose: 'practice',
    examWeight: 'medium',
    size: '4.2 MB',
    cover: '/resources/arihant-chemistry.png',
  },
  {
    id: '6',
    title: 'Grammar & Writing Handbook',
    source: 'RD Sharma',
    subject: 'English',
    chapter: 'All Chapters',
    rating: 4.6,
    purpose: 'revision',
    examWeight: 'medium',
    size: '5.1 MB',
    cover: '/resources/arihant-english.png',
  },
  {
    id: '7',
    title: 'Biology NCERT Solutions Class 12',
    source: 'Oswaal',
    subject: 'Biology',
    chapter: 'Class 12',
    rating: 4.6,
    purpose: 'learn',
    examWeight: 'high',
    size: '3.2 MB',
    cover: '/resources/arihant-chemistry.png',
  },
];

// Subject cards with usage (mock) – order: Mathematics, Physics, Chemistry, Biology, English
const subjectFolders = [
  { name: 'Mathematics', used: 12, remaining: 33, icon: '📐', color: 'bg-blue-100 text-blue-700' },
  { name: 'Physics', used: 10, remaining: 28, icon: '⚛️', color: 'bg-indigo-100 text-indigo-700' },
  { name: 'Chemistry', used: 8, remaining: 30, icon: '🧪', color: 'bg-red-100 text-red-700' },
  { name: 'Biology', used: 7, remaining: 25, icon: '🧬', color: 'bg-green-100 text-green-700' },
  { name: 'English', used: 5, remaining: 20, icon: '📚', color: 'bg-pink-100 text-pink-700' },
];

const PURPOSE_LABELS: Record<Purpose, string> = {
  learn: 'Learn',
  practice: 'Practice',
  revision: 'Revise',
};

const PURPOSE_STYLES: Record<Purpose, string> = {
  learn: 'bg-blue-100 text-blue-700 border-blue-200',
  practice: 'bg-amber-100 text-amber-700 border-amber-200',
  revision: 'bg-green-100 text-green-700 border-green-200',
};

const EXAM_WEIGHT_LABELS: Record<ExamWeight, string> = {
  high: 'High',
  medium: 'Medium',
  optional: 'Optional',
};

const EXAM_WEIGHT_STYLES: Record<ExamWeight, string> = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  optional: 'bg-gray-100 text-gray-600 border-gray-200',
};

const StudentResources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      !searchQuery ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = !selectedSubject || resource.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <StudentDashboardLayout title="Study Resources">
      <div className="space-y-6">
        {/* Header: Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by topic, chapter, or exam keyword"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl border-gray-200 bg-white"
          />
        </div>

        {/* Subject cards with usage */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Browse by Subject</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {subjectFolders.map((folder) => (
              <button
                key={folder.name}
                type="button"
                onClick={() => setSelectedSubject(selectedSubject === folder.name ? null : folder.name)}
                className={cn(
                  'p-4 rounded-xl border text-left transition-all',
                  selectedSubject === folder.name
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 bg-white hover:border-primary/30'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-2',
                    folder.color
                  )}
                >
                  {folder.icon}
                </div>
                <p className="text-sm font-medium text-gray-900 truncate">{folder.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {folder.used} used · {folder.remaining} remaining
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Resource list */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Resources</h2>
          <div className="space-y-3">
            {filteredResources.map((resource) => (
              <Card
                key={resource.id}
                className="border-gray-100 bg-white hover:shadow-sm transition-shadow overflow-hidden"
              >
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Left: cover photo */}
                    <div className="flex-shrink-0 w-full sm:w-32">
                      <img
                        src={resource.cover}
                        alt={resource.title}
                        className="w-full sm:w-32 h-40 sm:h-44 object-cover rounded-xl border border-gray-100"
                      />
                    </div>
                    {/* Right: name + details + actions */}
                    <div className="flex-1 min-w-0 flex flex-col gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{resource.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {resource.source} · {resource.subject} · {resource.chapter}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {resource.rating}
                        </span>
                        {resource.size && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <FileText className="w-3.5 h-3.5" />
                            {resource.size}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <span
                          className={cn(
                            'rounded border px-2 py-0.5 text-xs font-medium',
                            PURPOSE_STYLES[resource.purpose]
                          )}
                        >
                          {PURPOSE_LABELS[resource.purpose]}
                        </span>
                        <span
                          className={cn(
                            'rounded border px-2 py-0.5 text-xs font-medium',
                            EXAM_WEIGHT_STYLES[resource.examWeight]
                          )}
                        >
                          {EXAM_WEIGHT_LABELS[resource.examWeight]} exam
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-auto pt-1">
                        <Button size="sm" className="rounded-lg" onClick={() => {}}>
                          <Download className="w-4 h-4 mr-1.5" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-lg" onClick={() => {}}>
                          <CalendarPlus className="w-4 h-4 mr-1.5" />
                          Add to Planner
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-lg" onClick={() => {}}>
                          <Bookmark className="w-4 h-4 mr-1.5" />
                          Save for Revision
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {filteredResources.length === 0 && (
          <div className="rounded-2xl border border-gray-100 bg-gray-50/50 py-12 text-center">
            <p className="text-sm text-muted-foreground">No resources match your filters.</p>
            <button
              type="button"
              className="mt-2 text-sm font-medium text-primary hover:underline"
              onClick={() => {
                setSearchQuery('');
                setSelectedSubject(null);
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentResources;
