import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FileText,
  Video,
  Search,
  Download,
  Play,
  Clock,
  Star,
  CalendarPlus,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// Mock types
type Purpose = 'learn' | 'practice' | 'revision';
type ExamWeight = 'high' | 'medium' | 'optional';

type Resource = {
  id: string;
  title: string;
  type: 'pdf' | 'video';
  subject: string;
  chapter: string;
  rating: number;
  purpose: Purpose;
  examWeight: ExamWeight;
  duration?: string; // e.g. "15:30" or "8 min"
  size?: string;
  aiRecommended?: string; // reason text when present
};

// Mock resources with purpose, exam weight, optional AI tag
const resources: Resource[] = [
  {
    id: '1',
    title: 'Quadratic Equations - Complete Notes',
    type: 'pdf',
    subject: 'Mathematics',
    chapter: 'Chapter 3',
    rating: 4.8,
    purpose: 'learn',
    examWeight: 'high',
    size: '2.4 MB',
    aiRecommended: 'Matches your weak area from last test',
  },
  {
    id: '2',
    title: "Newton's Laws Explained",
    type: 'video',
    subject: 'Science',
    chapter: 'Chapter 2',
    rating: 4.9,
    purpose: 'learn',
    examWeight: 'high',
    duration: '15:30',
    aiRecommended: 'High exam weight this term',
  },
  {
    id: '3',
    title: 'Grammar Rules Handbook',
    type: 'pdf',
    subject: 'English',
    chapter: 'All Chapters',
    rating: 4.6,
    purpose: 'revision',
    examWeight: 'medium',
    size: '5.1 MB',
  },
  {
    id: '4',
    title: 'Polynomial Division Tutorial',
    type: 'video',
    subject: 'Mathematics',
    chapter: 'Chapter 4',
    rating: 4.7,
    purpose: 'practice',
    examWeight: 'high',
    duration: '22:45',
  },
  {
    id: '5',
    title: 'Chemical Reactions Cheat Sheet',
    type: 'pdf',
    subject: 'Science',
    chapter: 'Chapter 5',
    rating: 4.5,
    purpose: 'revision',
    examWeight: 'medium',
    size: '1.2 MB',
  },
  {
    id: '6',
    title: 'Quick Trig Identities Recap',
    type: 'video',
    subject: 'Mathematics',
    chapter: 'Chapter 6',
    rating: 4.7,
    purpose: 'revision',
    examWeight: 'optional',
    duration: '8 min',
    aiRecommended: 'Quick recap before exam',
  },
];

// Subject cards with usage (mock)
const subjectFolders = [
  { name: 'Mathematics', used: 12, remaining: 33, icon: '📐', color: 'bg-blue-100 text-blue-700' },
  { name: 'Science', used: 8, remaining: 30, icon: '🔬', color: 'bg-violet-100 text-violet-700' },
  { name: 'English', used: 5, remaining: 20, icon: '📚', color: 'bg-pink-100 text-pink-700' },
  { name: 'History', used: 3, remaining: 17, icon: '🏛️', color: 'bg-amber-100 text-amber-700' },
  { name: 'Geography', used: 2, remaining: 16, icon: '🌍', color: 'bg-teal-100 text-teal-700' },
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

const FILTER_CHIPS = [
  { id: 'learn', label: 'Learn' },
  { id: 'practice', label: 'Practice' },
  { id: 'revision', label: 'Revision' },
  { id: 'exam', label: 'Exam-Important' },
  { id: 'quick', label: 'Quick (≤10 min)' },
] as const;

type FilterId = (typeof FILTER_CHIPS)[number]['id'];

const StudentResources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [activeChips, setActiveChips] = useState<FilterId[]>([]);

  const toggleChip = (id: FilterId) => {
    setActiveChips((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      !searchQuery ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.chapter.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = !selectedSubject || resource.subject === selectedSubject;

    const matchesLearn = !activeChips.includes('learn') || resource.purpose === 'learn';
    const matchesPractice = !activeChips.includes('practice') || resource.purpose === 'practice';
    const matchesRevision = !activeChips.includes('revision') || resource.purpose === 'revision';
    const matchesExam = !activeChips.includes('exam') || resource.examWeight === 'high';
    const isQuick = (() => {
      if (!resource.duration) return false;
      if (resource.duration.includes('min')) {
        const n = parseInt(resource.duration, 10);
        return !Number.isNaN(n) && n <= 10;
      }
      const parts = resource.duration.split(':').map(Number);
      const mins = parts.length === 2 ? parts[0] + parts[1] / 60 : parts[0];
      return mins <= 10;
    })();
    const matchesQuick = !activeChips.includes('quick') || isQuick;

    return (
      matchesSearch &&
      matchesSubject &&
      matchesLearn &&
      matchesPractice &&
      matchesRevision &&
      matchesExam &&
      matchesQuick
    );
  });

  return (
    <StudentDashboardLayout title="Study Resources">
      <div className="space-y-6">
        {/* Header: Search + Filter chips */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by topic, chapter, or exam keyword"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-gray-200 bg-white"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTER_CHIPS.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => toggleChip(chip.id)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                  activeChips.includes(chip.id)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-primary/50 hover:text-primary'
                )}
              >
                {chip.label}
              </button>
            ))}
          </div>
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
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Left: icon + content */}
                    <div className="flex gap-4 flex-1 min-w-0">
                      <div
                        className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                          resource.type === 'pdf' ? 'bg-red-50' : 'bg-primary/10'
                        )}
                      >
                        {resource.type === 'pdf' ? (
                          <FileText className="w-6 h-6 text-red-500" />
                        ) : (
                          <Video className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{resource.title}</span>
                          {resource.aiRecommended && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              <Sparkles className="w-3 h-3" />
                              AI Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {resource.subject} · {resource.chapter}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {resource.rating}
                          </span>
                          {resource.duration && (
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3.5 h-3.5" />
                              {resource.duration}
                            </span>
                          )}
                          {resource.size && (
                            <span className="text-xs text-muted-foreground">{resource.size}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
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
                        {resource.aiRecommended && (
                          <p className="text-xs text-muted-foreground italic">{resource.aiRecommended}</p>
                        )}
                      </div>
                    </div>

                    {/* Right: actions */}
                    <div className="flex flex-wrap items-center gap-2 sm:flex-shrink-0 border-t pt-4 sm:border-t-0 sm:pt-0 sm:pl-4">
                      <Button
                        size="sm"
                        className="rounded-lg"
                        onClick={() => {}}
                      >
                        {resource.type === 'pdf' ? (
                          <>
                            <Download className="w-4 h-4 mr-1.5" />
                            Download
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-1.5" />
                            Watch
                          </>
                        )}
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
                setActiveChips([]);
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
