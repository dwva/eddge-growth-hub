import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen,
  Calculator,
  Atom,
  Brain,
  ArrowRight,
  CheckCircle,
  MessageSquare,
  FileText,
  CalendarDays,
  Target,
  Award,
  Trophy
} from 'lucide-react';
import { ContributionHeatmap, type ContributionMap } from '@/components/ContributionHeatmap';

const subjects = [
  { id: 1, name: 'Mathematics', icon: <Calculator className="w-8 h-8" />, color: 'bg-blue-50', iconColor: 'text-blue-500', progress: 65 },
  { id: 2, name: 'Science', icon: <Atom className="w-8 h-8" />, color: 'bg-emerald-50', iconColor: 'text-emerald-500', progress: 48 },
  { id: 3, name: 'Aptitude', icon: <Brain className="w-8 h-8" />, color: 'bg-purple-50', iconColor: 'text-purple-500', progress: 72 },
];

/** Mock contribution counts per day (homework, practice, learning, etc.). More activity = deeper purple; contributes to XP. */
function getMockContributions(): ContributionMap {
  const map: ContributionMap = {};
  const year = new Date().getFullYear();
  const today = new Date();
  for (let d = new Date(year, 0, 1); d <= today; d.setDate(d.getDate() + 1)) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const daysAgo = Math.floor((today.getTime() - d.getTime()) / 86400000);
    if (daysAgo > 60) continue;
    if (isWeekend) map[key] = Math.random() > 0.6 ? 1 : 0;
    else map[key] = Math.floor(Math.random() * 5) + 1;
  }
  return map;
}

const StudentHome = () => {
  const navigate = useNavigate();
  const [completedSuggestions, setCompletedSuggestions] = useState<string[]>([]);
  const [showAllAiSuggestions, setShowAllAiSuggestions] = useState(false);
  const contributions = useMemo(() => getMockContributions(), []);

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
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:grid-cols-[1fr_360px] gap-4 items-stretch">
            
            {/* Hero Card - Exam countdown + daily plan (flexible width) */}
            <Card className="relative overflow-hidden border-0 dark:border dark:border-white/10 shadow-sm rounded-3xl bg-gradient-to-br from-primary via-primary to-purple-700 min-w-0">
                {/* Decorative elements - balanced, not distracting */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4" />
                <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full translate-y-1/2 translate-x-1/4" />
                
                <CardContent className="relative p-8 flex flex-col justify-between h-full min-h-[200px]">
                  {/* Top section - exam countdown headline */}
                  <div className="pt-2 space-y-2">
                    <h2 className="text-xl font-semibold text-white leading-tight">
                      250 days to exams
                    </h2>
                    <p className="text-white/80 text-sm">
                      Board Exam · 12 March · 2027
                    </p>
                  </div>

                  {/* Middle section - today's mission preview */}
                  <div className="mt-2 rounded-xl border border-white/30 bg-white/5 px-3 py-2 max-w-sm">
                    <p className="text-[10px] font-semibold tracking-wide text-white/80 uppercase flex items-center gap-1">
                      <span role="img" aria-hidden="true">📌</span>
                      Today&apos;s mission
                    </p>
                    <p className="text-xs text-white/90 mt-1 font-medium">
                      3 tasks · 1 practice set · ~45 mins
                    </p>
                    <p className="text-[11px] text-white/70 mt-0.5">
                      Finish 1 chapter + 10 MCQs to stay on track for your target.
                    </p>
                  </div>
                  
                  {/* Bottom section - Rank + CTA */}
                  <div className="flex flex-wrap items-center gap-3 pt-6">
                    <Button
                      variant="outline"
                      className="inline-flex items-center gap-2 rounded-full border-white/60 text-white bg-white/10 hover:bg-white/20 px-4 h-11 text-xs font-semibold shadow-sm"
                      onClick={() => navigate('/student/leaderboard')}
                    >
                      <Trophy className="w-4 h-4 text-amber-300" />
                      <span>Rank #5</span>
                    </Button>
                    <Button 
                      className="bg-white text-primary hover:bg-white/90 font-semibold rounded-xl px-6 h-11 shadow-md flex items-center gap-2"
                      onClick={() => navigate('/student/planner')}
                    >
                      <span>⚡</span>
                      <span>Start Today&apos;s Plan</span>
                    </Button>
                  </div>
                </CardContent>
            </Card>

            {/* Stats Card - Learning momentum (compact) */}
            <Card className="relative overflow-hidden border-0 shadow-sm rounded-3xl bg-white dark:bg-card dark:border dark:border-border min-w-0">
              <CardContent className="relative p-8 h-full min-h-[200px] flex flex-col">
                <div className="flex h-full gap-6">
                  {/* Left block – streak, XP, level */}
                  <div className="flex-1 flex flex-col justify-between">
                    {/* Primary metric – streak */}
                    <div className="mt-2">
                      <p className="text-3xl font-semibold text-gray-900 dark:text-foreground">
                        7-day streak
                      </p>
                      <p className="text-xs text-gray-500 dark:text-muted-foreground mt-1 flex items-center gap-1">
                        <span aria-hidden="true">🔥</span>
                        <span>Consistency streak</span>
                      </p>
                    </div>

                    {/* XP progress */}
                    <div className="mt-6 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-gray-600 dark:text-muted-foreground">
                        <span>XP toward next level</span>
                        <span>68%</span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          style={{ width: '68%' }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-muted-foreground">
                        Based on quality-weighted practice & revision
                      </p>
                    </div>
                  </div>

                  {/* Right block – momentum + avatar */}
                  <div className="w-24 sm:w-28 md:w-32 flex flex-col items-end justify-between">
                    {/* Avatar assistant – disciplined self */}
                    <div className="relative flex-1 flex items-end justify-end">
                      <img
                        src="/assets/image-1fc051e8-dfd5-4bec-b348-4ac4acebeee4.png"
                        alt=""
                        className="pointer-events-none select-none translate-y-2"
                        style={{
                          opacity: 0.12,          // Strong momentum, subtle
                          mixBlendMode: 'soft-light',
                          objectFit: 'contain',
                          maxHeight: '100%',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Overall Progress Tracker Bar */}
          <div 
            className="bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-100 dark:border-border px-5 py-4 flex items-center justify-between cursor-pointer"
            onClick={() => navigate('/student/performance')}
          >
            {/* Left section - Icon and text */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-foreground">Syllabus Completion – {overallProgress}%</p>
                <p className="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">{getProgressMessage(overallProgress)}</p>
              </div>
            </div>
            
            {/* Center section - Progress bar */}
            <div className="flex items-center gap-4 flex-1 max-w-lg mx-8">
              <div className="flex-1 h-2.5 bg-gray-100 dark:bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-foreground">{overallProgress}%</span>
            </div>
            
            {/* Right section - Arrow */}
            <ArrowRight className="w-4 h-4 text-gray-400 dark:text-muted-foreground" />
          </div>

          {/* Main Content Grid - Left (Quick actions + Contributions) + Right (AI Study Suggestions) */}
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:grid-cols-[1fr_340px] gap-6 items-stretch">
            
            {/* Left Column - Quick actions then Contribution heatmap (where Continue Learn was) */}
            <div className="flex flex-col gap-6">
              {/* Quick actions - 3 buttons */}
              <div className="rounded-2xl border border-gray-100 dark:border-border bg-white dark:bg-card shadow-sm p-4 flex-shrink-0">
                <h3 className="text-base font-semibold text-gray-900 dark:text-foreground mb-4">Quick actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="relative h-auto py-4 px-4 flex flex-col items-center gap-1.5 rounded-xl border-gray-200 dark:border-border hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-200 hover:shadow-sm group overflow-visible"
                    onClick={() => navigate('/student/homework')}
                  >
                    <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold shadow-md ring-2 ring-white dark:ring-card">
                      2
                    </span>
                    <FileText className="w-6 h-6 text-primary transition-transform duration-200 group-hover:scale-110" />
                    <span className="text-sm font-medium text-gray-900 dark:text-foreground">Homework</span>
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">2 pending</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 px-4 flex flex-col items-center gap-1.5 rounded-xl border-gray-200 dark:border-border hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-200 hover:shadow-sm group"
                    onClick={() => navigate('/student/doubt-solver')}
                  >
                    <MessageSquare className="w-6 h-6 text-amber-600 dark:text-amber-400 transition-transform duration-200 group-hover:scale-110" />
                    <span className="text-sm font-medium text-gray-900 dark:text-foreground">Ask Doubt</span>
                    <span className="text-xs text-gray-500 dark:text-muted-foreground">Ready</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 px-4 flex flex-col items-center gap-1.5 rounded-xl border-gray-200 dark:border-border hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-200 hover:shadow-sm group"
                    onClick={() => navigate('/student/achievements')}
                  >
                    <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400 transition-transform duration-200 group-hover:scale-110" />
                    <span className="text-sm font-medium text-gray-900 dark:text-foreground">Achievements</span>
                    <span className="text-xs text-gray-500 dark:text-muted-foreground">3 earned</span>
                  </Button>
                </div>
              </div>

              {/* Contribution heatmap – daily activity (tasks, practice, learning) boosts XP */}
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 flex-1 min-h-0">
                <ContributionHeatmap
                  contributions={contributions}
                  onLearnMore={() => navigate('/student/help')}
                  variant="light"
                />
              </div>
            </div>

            {/* Right Column - AI Study Suggestions (same row height as left); reduced height */}
            <div className="lg:pl-2 flex flex-col min-h-0 max-h-[460px]">
              <Card className="border border-gray-100 dark:border-border shadow-sm rounded-2xl bg-white dark:bg-card flex-1 flex flex-col min-h-0">
                <CardContent className="p-6 flex flex-col flex-1 min-h-0">
                  <div className="mb-4 flex-shrink-0">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-foreground flex items-center gap-2">
                      <Brain className="w-3.5 h-3.5 text-primary" />
                      AI Study Suggestions
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">
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
                          className={`w-full flex items-center justify-between gap-4 px-4 py-3 rounded-xl text-left min-h-[52px] transition-colors ${isCompleted ? 'bg-gray-50 dark:bg-muted' : 'hover:bg-gray-50 dark:hover:bg-muted'}`}
                          onClick={handleClick}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-muted flex items-center justify-center flex-shrink-0">
                              {suggestion.icon}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-foreground leading-snug text-left truncate">{suggestion.label}</p>
                              <p className="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">{suggestion.priority}{isCompleted && ' • Completed'}</p>
                            </div>
                          </div>
                          {isCompleted ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : <ArrowRight className="w-4 h-4 text-gray-400 dark:text-muted-foreground flex-shrink-0" />}
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
                            className="text-xs font-medium text-gray-500 dark:text-muted-foreground hover:text-primary transition-colors mb-2 flex-shrink-0 text-left"
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
