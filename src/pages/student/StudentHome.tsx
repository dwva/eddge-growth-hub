import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Zap,
  BookOpen,
  Calculator,
  Atom,
  Brain,
  ArrowRight,
  Flame,
  CheckCircle,
  MessageSquare,
  FileText,
  Clock,
  CalendarDays,
  Target,
  Award
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { chapters as chaptersData } from '@/data/mockData';

// Subject names for chapter list
const subjectNames: Record<string, string> = {
  '1': 'Mathematics',
  '2': 'Science',
  '3': 'Aptitude',
};

// Build flat list of leftover chapters (not completed) from mockData + placeholder Aptitude
function buildStudiedChapters(): { key: string; subjectId: string; subjectName: string; chapterId: string; chapterName: string; concepts: number; progress: number }[] {
  const list: { key: string; subjectId: string; subjectName: string; chapterId: string; chapterName: string; concepts: number; progress: number }[] = [];
  (Object.keys(chaptersData) as (keyof typeof chaptersData)[]).forEach((subjectId) => {
    const subjectName = subjectNames[subjectId] ?? 'Subject';
    chaptersData[subjectId].forEach((ch) => {
      if (!ch.completed) {
        list.push({
          key: `${subjectId}-${ch.id}`,
          subjectId,
          subjectName,
          chapterId: ch.id,
          chapterName: ch.name,
          concepts: ch.concepts,
          progress: 0,
        });
      }
    });
  });
  // Placeholder leftover chapters for Aptitude (no chapters in mockData)
  list.push({ key: '3-a1', subjectId: '3', subjectName: 'Aptitude', chapterId: 'a1', chapterName: 'Logical Reasoning', concepts: 6, progress: 0 });
  list.push({ key: '3-a2', subjectId: '3', subjectName: 'Aptitude', chapterId: 'a2', chapterName: 'Patterns & Sequences', concepts: 5, progress: 0 });
  return list;
}

const initialStudiedChapters = buildStudiedChapters();

const subjects = [
  { id: 1, name: 'Mathematics', icon: <Calculator className="w-8 h-8" />, color: 'bg-blue-50', iconColor: 'text-blue-500', progress: 65 },
  { id: 2, name: 'Science', icon: <Atom className="w-8 h-8" />, color: 'bg-emerald-50', iconColor: 'text-emerald-500', progress: 48 },
  { id: 3, name: 'Aptitude', icon: <Brain className="w-8 h-8" />, color: 'bg-purple-50', iconColor: 'text-purple-500', progress: 72 },
];

const StudentHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [completedSuggestions, setCompletedSuggestions] = useState<string[]>([]);
  const [studiedChapters, setStudiedChapters] = useState(initialStudiedChapters);
  const [showAllAiSuggestions, setShowAllAiSuggestions] = useState(false);

  const handleStudiedAgain = (key: string) => {
    setStudiedChapters((prev) => {
      const idx = prev.findIndex((c) => c.key === key);
      if (idx <= 0) return prev;
      const item = prev[idx];
      return [item, ...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
    navigate('/student/learning');
  };

  // Calculate overall progress from subjects
  const overallProgress = Math.round(
    subjects.reduce((acc, subject) => acc + subject.progress, 0) / subjects.length
  );
  
  // Get progress status message
  const getProgressMessage = (progress: number) => {
    if (progress >= 80) return "Excellent! Almost there!";
    if (progress >= 60) return "Great progress! Keep going!";
    if (progress >= 40) return "Good start! Stay consistent!";
    return "Let's pick up the pace!";
  };

  return (
    <StudentDashboardLayout>
      <div className="w-full">
        {/* Main Grid - Full Width; bottom padding so content doesn't touch screen edge */}
        <div className="space-y-6 pb-10">
          
          {/* Hero Row: Focus Card + Stats Card */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 items-stretch">
            
            {/* Hero Card - Today's Focus (flexible width) */}
            <Card className="relative overflow-hidden border-0 shadow-sm rounded-3xl bg-gradient-to-br from-primary via-primary to-purple-700 min-w-0">
                {/* Decorative elements - balanced, not distracting */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4" />
                <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full translate-y-1/2 translate-x-1/4" />
                
                <CardContent className="relative p-8 flex flex-col justify-between h-full min-h-[240px]">
                  {/* Top section - Title aligned to same baseline as My Stats */}
                  <div className="pt-2">
                    <h2 className="text-xl font-semibold text-white leading-tight">
                      Today's Focus
                    </h2>
                    <p className="text-white/90 text-sm font-medium mt-1.5">
                      3 tasks · 1 practice · 45 mins
                    </p>
                    <p className="text-white/70 text-xs mt-1 max-w-sm">
                      Focus today: {studiedChapters.length > 0 ? studiedChapters.slice(0, 2).map((c) => c.chapterName).join(' + ') : 'Pick a topic to start'}
                    </p>
                  </div>
                  
                  {/* Bottom section - Buttons */}
                  <div className="flex gap-3 pt-6">
                    <Button 
                      className="bg-white text-primary hover:bg-white/90 font-semibold rounded-xl px-6 h-11 shadow-md"
                      onClick={() => navigate('/student/planner')}
                    >
                      Start Today's Plan
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-white/40 text-white hover:bg-white/10 rounded-xl px-6 h-11 bg-transparent"
                      onClick={() => navigate('/student/performance')}
                    >
                      View Progress
                    </Button>
                  </div>
                </CardContent>
            </Card>

            {/* Stats Card - My Stats (fixed width) */}
            <Card className="relative overflow-hidden border-0 shadow-sm rounded-3xl bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 min-w-0">
              {/* Decorative elements - balanced */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-orange-200/50 rounded-full translate-y-1/3 translate-x-1/4" />
              
              <CardContent className="relative p-8 flex flex-col justify-between h-full min-h-[240px]">
                {/* Top section - Title aligned with Today's Focus */}
                <div className="pt-2">
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">My Stats</h3>
                  
                  {/* Stats row - evenly aligned */}
                  <div className="flex gap-10 mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Today</p>
                      <p className="text-xl font-semibold text-gray-900 mt-1">2.5 hrs</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">This Week</p>
                      <p className="text-xl font-semibold text-gray-900 mt-1">12 hrs</p>
                    </div>
                  </div>
                  
                  {/* Streak - aligned with stats content */}
                  <div className="flex items-center gap-1.5 mt-3">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-medium text-gray-700">7 day streak</span>
                  </div>
                </div>
                
                {/* Bottom section - CTA aligned with buttons baseline */}
                <button 
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors group pt-6"
                  onClick={() => navigate('/student/performance')}
                >
                  Go to my progress
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </CardContent>
            </Card>
          </div>

          {/* Overall Progress Tracker Bar */}
          <div 
            className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex items-center justify-between cursor-pointer"
            onClick={() => navigate('/student/performance')}
          >
            {/* Left section - Icon and text */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Syllabus Completion – {overallProgress}%</p>
                <p className="text-xs text-gray-500 mt-0.5">{getProgressMessage(overallProgress)}</p>
              </div>
            </div>
            
            {/* Center section - Progress bar */}
            <div className="flex items-center gap-4 flex-1 max-w-lg mx-8">
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700">{overallProgress}%</span>
            </div>
            
            {/* Right section - Arrow */}
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>

          {/* Main Content Grid - Left (Quick actions + Continue Learn) + Right (AI Study Suggestions) */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-stretch">
            
            {/* Left Column - flex so Continue Learn fills space; max-h keeps section from touching bottom */}
            <div className="flex flex-col gap-6 min-h-0 max-h-[460px]">
              {/* Quick actions - 3 buttons */}
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 flex-shrink-0">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Quick actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="h-auto py-4 px-4 flex flex-col items-center gap-1.5 rounded-xl border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 hover:shadow-sm group"
                    onClick={() => navigate('/student/homework')}
                  >
                    <FileText className="w-6 h-6 text-primary transition-transform duration-200 group-hover:scale-110" />
                    <span className="text-sm font-medium">Homework</span>
                    <span className="text-xs text-gray-500">2 pending</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 px-4 flex flex-col items-center gap-1.5 rounded-xl border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 hover:shadow-sm group"
                    onClick={() => navigate('/student/doubt-solver')}
                  >
                    <MessageSquare className="w-6 h-6 text-amber-600 transition-transform duration-200 group-hover:scale-110" />
                    <span className="text-sm font-medium">Ask Doubt</span>
                    <span className="text-xs text-gray-500">Ready</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 px-4 flex flex-col items-center gap-1.5 rounded-xl border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 hover:shadow-sm group"
                    onClick={() => navigate('/student/achievements')}
                  >
                    <Award className="w-6 h-6 text-emerald-600 transition-transform duration-200 group-hover:scale-110" />
                    <span className="text-sm font-medium">Achievements</span>
                    <span className="text-xs text-gray-500">3 earned</span>
                  </Button>
                </div>
              </div>

              {/* Continue Learn - fills remaining height, bottom aligns with AI Suggestions */}
              <div className="flex-1 flex flex-col min-h-0">
                <div 
                  className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden h-full flex flex-col min-h-0"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-50 flex-shrink-0">
                    <h3 className="text-base font-semibold text-gray-900">Continue Learn</h3>
                    <button 
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors"
                      onClick={() => navigate('/student/learning')}
                    >
                      View All <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scroll-smooth py-1 pr-1 [scrollbar-gutter:stable]">
                    {studiedChapters.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                        onClick={() => handleStudiedAgain(item.key)}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.subjectName} · {item.chapterName}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex-1 min-w-0 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full min-w-[2px] transition-[width] duration-300"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {item.progress}% complete · {item.concepts} concepts
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - AI Study Suggestions (same row height as left); reduced height */}
            <div className="lg:pl-2 flex flex-col min-h-0 max-h-[460px]">
              <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white flex-1 flex flex-col min-h-0">
                <CardContent className="p-6 flex flex-col flex-1 min-h-0">
                  <div className="mb-4 flex-shrink-0">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Brain className="w-3.5 h-3.5 text-primary" />
                      AI Study Suggestions
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Based on your recent learning
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-hidden">
                  {(() => {
                    const allSuggestions = [
                    {
                      id: 'learn',
                      label: 'Continue learning: Quadratic Equations',
                      icon: <BookOpen className="w-4 h-4 text-primary" />,
                      path: '/student/learning',
                      priority: 'High',
                    },
                    {
                      id: 'revise',
                      label: 'Revise: Algebra basics from last week',
                      icon: <Target className="w-4 h-4 text-purple-500" />,
                      path: '/student/revision',
                      priority: 'Medium',
                    },
                    {
                      id: 'practice',
                      label: 'Practice: 10 quick math questions',
                      icon: <Calculator className="w-4 h-4 text-emerald-500" />,
                      path: '/student/practice',
                      priority: 'High',
                    },
                    {
                      id: 'planner',
                      label: 'Update today’s plan in your Planner',
                      icon: <CalendarDays className="w-4 h-4 text-blue-500" />,
                      path: '/student/planner',
                      priority: 'Medium',
                    },
                    {
                      id: 'doubt',
                      label: 'Ask a doubt you still feel unsure about',
                      icon: <MessageSquare className="w-4 h-4 text-amber-500" />,
                      path: '/student/doubt-solver',
                      priority: 'Low',
                    },
                  ];
                    const [topSuggestion, ...restSuggestions] = allSuggestions;
                    const renderSuggestion = (suggestion: typeof allSuggestions[0]) => {
                      const isCompleted = completedSuggestions.includes(suggestion.id);
                      const handleClick = () => {
                        if (!isCompleted) setCompletedSuggestions((prev) => prev.includes(suggestion.id) ? prev : [...prev, suggestion.id]);
                        navigate(suggestion.path);
                      };
                      return (
                        <button
                          key={suggestion.id}
                          type="button"
                          className={`w-full flex items-center justify-between gap-4 px-4 py-3 rounded-xl text-left min-h-[52px] transition-colors ${isCompleted ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                          onClick={handleClick}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                              {suggestion.icon}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 leading-snug text-left truncate">{suggestion.label}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{suggestion.priority}{isCompleted && ' • Completed'}</p>
                            </div>
                          </div>
                          {isCompleted ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                        </button>
                      );
                    };
                    return (
                      <>
                        <div className="flex-shrink-0">
                          <p className="text-xs font-medium text-primary mb-2">Top suggestion</p>
                          {renderSuggestion(topSuggestion)}
                        </div>
                        <div className="flex-1 min-h-0 flex flex-col">
                          <button
                            type="button"
                            className="text-xs font-medium text-gray-500 hover:text-primary transition-colors mb-2 flex-shrink-0 text-left"
                            onClick={() => setShowAllAiSuggestions((v) => !v)}
                          >
                            {showAllAiSuggestions ? 'Show less' : `View all (${restSuggestions.length})`}
                          </button>
                          {showAllAiSuggestions && (
                            <div className="space-y-1 overflow-y-auto flex-1 min-h-0">
                              {restSuggestions.map((s) => renderSuggestion(s))}
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentHome;
