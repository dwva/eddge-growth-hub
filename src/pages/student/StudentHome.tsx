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
  Trophy,
} from 'lucide-react';
import { ContributionHeatmap, type ContributionMap } from '@/components/ContributionHeatmap';
import { MotivationBar } from '@/components/shared/MotivationBar';

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

/** Consecutive days with at least 1 contribution, ending today. */
function getCurrentStreak(contributions: ContributionMap): number {
  const today = new Date();
  let streak = 0;
  for (let offset = 0; ; offset++) {
    const d = new Date(today);
    d.setDate(today.getDate() - offset);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if ((contributions[key] ?? 0) > 0) streak += 1;
    else break;
  }
  return streak;
}

const StudentHome = () => {
  const navigate = useNavigate();
  const [completedSuggestions, setCompletedSuggestions] = useState<string[]>([]);
  const [showAllAiSuggestions, setShowAllAiSuggestions] = useState(false);
  const contributions = useMemo(() => getMockContributions(), []);
  const streakDays = useMemo(() => getCurrentStreak(contributions), [contributions]);

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
        <div className="space-y-3 md:space-y-6 pb-6 md:pb-10">
          
          {/* Hero Row: Focus Card + Empty widget placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:grid-cols-[1fr_360px] gap-3 md:gap-4 items-stretch">
            
            {/* Hero Card - Exam countdown + daily plan (flexible width) */}
            <Card className="relative overflow-hidden border-0 dark:border dark:border-white/10 shadow-sm rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary via-primary to-purple-700 min-w-0">
                {/* Decorative elements - balanced, not distracting */}
                <div className="absolute top-0 right-0 w-32 md:w-48 h-32 md:h-48 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4" />
                <div className="absolute top-1/2 right-1/4 w-24 md:w-32 h-24 md:h-32 bg-white/5 rounded-full" />
                <div className="absolute bottom-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-purple-500/20 rounded-full translate-y-1/2 translate-x-1/4" />
                
                <CardContent className="relative p-4 md:p-8 flex flex-col justify-between h-full min-h-[160px] md:min-h-[200px]">
                  {/* Top section - exam countdown headline */}
                  <div className="pt-1 md:pt-2 space-y-1 md:space-y-2">
                    <h2 className="text-base md:text-xl font-semibold text-white leading-tight">
                      250 days to exams
                    </h2>
                    <p className="text-white/80 text-xs md:text-sm">
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
                  
                  {/* Bottom section - CTA + Rank */}
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 pt-3 md:pt-6">
                    <Button 
                      className="bg-white text-primary hover:bg-white/90 font-semibold rounded-xl px-4 md:px-6 h-9 md:h-11 text-xs md:text-sm shadow-md flex items-center gap-2"
                      onClick={() => navigate('/student/planner')}
                    >
                      <span>⚡</span>
                      <span>Start Today&apos;s Plan</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="inline-flex items-center gap-2 rounded-full border-white/60 text-white bg-white/10 hover:bg-white/20 px-3 md:px-4 h-9 md:h-11 text-[10px] md:text-xs font-semibold shadow-sm"
                      onClick={() => navigate('/student/leaderboard')}
                    >
                      <Trophy className="w-4 h-4 text-amber-300" />
                      <span>Rank #5</span>
                    </Button>
                  </div>
                </CardContent>
            </Card>

            {/* Motivation bar – fills widget, tap to open Streak page */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate('/student/streak')}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/student/streak')}
              className="min-w-0 h-full min-h-[160px] md:min-h-[200px] cursor-pointer rounded-2xl md:rounded-3xl transition-all hover:shadow-lg active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <MotivationBar
                streak={streakDays}
                timelineDays={7}
                todaysDone={(() => {
                  const today = new Date();
                  const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                  return (contributions[key] ?? 0) > 0;
                })()}
              />
            </div>
          </div>

          {/* Overall Progress Tracker Bar */}
          <div 
            className="bg-white dark:bg-card rounded-xl md:rounded-2xl shadow-sm border border-gray-100 dark:border-border px-3 md:px-5 py-3 md:py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 sm:justify-between cursor-pointer"
            onClick={() => navigate('/student/performance')}
          >
            {/* Left section - Icon and text */}
            <div className="flex items-center gap-2 md:gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-900 dark:text-foreground">Syllabus Completion – {overallProgress}%</p>
                <p className="text-[10px] md:text-xs text-gray-500 dark:text-muted-foreground mt-0.5">{getProgressMessage(overallProgress)}</p>
              </div>
            </div>
            
            {/* Center section - Progress bar */}
            <div className="flex items-center gap-2 md:gap-4 flex-1 max-w-lg sm:mx-4 md:mx-8">
              <div className="flex-1 h-2 md:h-2.5 bg-gray-100 dark:bg-muted rounded-full overflow-hidden">
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
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:grid-cols-[1fr_340px] gap-3 md:gap-6 items-stretch">
            
            {/* Left Column - Quick actions then Contribution heatmap (where Continue Learn was) */}
            <div className="flex flex-col gap-3 md:gap-6">
              {/* Quick actions - 3 buttons */}
              <div className="rounded-xl md:rounded-2xl border border-gray-100 dark:border-border bg-white dark:bg-card shadow-sm p-3 md:p-4 flex-shrink-0">
                <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-foreground mb-2 md:mb-4">Quick actions</h3>
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  <Button
                    variant="outline"
                    className="relative h-auto py-2.5 md:py-4 px-2 md:px-4 flex flex-col items-center gap-1 md:gap-1.5 rounded-lg md:rounded-xl border-gray-200 dark:border-border hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-200 hover:shadow-sm group overflow-visible"
                    onClick={() => navigate('/student/homework')}
                  >
                    <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-4 md:h-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] md:text-xs font-semibold shadow-md ring-2 ring-white dark:ring-card">
                      2
                    </span>
                    <FileText className="w-5 h-5 md:w-6 md:h-6 text-primary transition-transform duration-200 group-hover:scale-110" />
                    <span className="text-[11px] md:text-sm font-medium text-gray-900 dark:text-foreground">Homework</span>
                    <span className="text-[10px] md:text-xs text-amber-600 dark:text-amber-400 font-medium">2 pending</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-2.5 md:py-4 px-2 md:px-4 flex flex-col items-center gap-1 md:gap-1.5 rounded-lg md:rounded-xl border-gray-200 dark:border-border hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-200 hover:shadow-sm group"
                    onClick={() => navigate('/student/doubt-solver')}
                  >
                    <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-amber-600 dark:text-amber-400 transition-transform duration-200 group-hover:scale-110" />
                    <span className="text-[11px] md:text-sm font-medium text-gray-900 dark:text-foreground">Ask Doubt</span>
                    <span className="text-[10px] md:text-xs text-gray-500 dark:text-muted-foreground">Ready</span>
                  </Button>
                  <Button
                  variant="outline"
                  className="h-auto py-2.5 md:py-4 px-2 md:px-4 flex flex-col items-center gap-1 md:gap-1.5 rounded-lg md:rounded-xl border-gray-200 dark:border-border hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-200 hover:shadow-sm group"
                  onClick={() => navigate('/student/xp')}
                  >
                    <Award className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400 transition-transform duration-200 group-hover:scale-110" />
                    <span className="text-[11px] md:text-sm font-medium text-gray-900 dark:text-foreground">Achievements</span>
                    <span className="text-[10px] md:text-xs text-gray-500 dark:text-muted-foreground">3 earned</span>
                  </Button>
                </div>
              </div>

              {/* Contribution heatmap – daily activity (tasks, practice, learning) boosts XP */}
              <div className="rounded-xl md:rounded-2xl border border-gray-100 bg-white shadow-sm p-3 md:p-4 flex-1 min-h-0 overflow-x-auto">
                <ContributionHeatmap
                  contributions={contributions}
                  onLearnMore={() => navigate('/student/help')}
                  variant="light"
                />
              </div>
            </div>

            {/* Right Column - AI Study Suggestions (same row height as left); reduced height */}
            <div className="lg:pl-2 flex flex-col min-h-0 max-h-[380px] md:max-h-[460px]">
              <Card className="border border-gray-100 dark:border-border shadow-sm rounded-xl md:rounded-2xl bg-white dark:bg-card flex-1 flex flex-col min-h-0">
                <CardContent className="p-3 md:p-6 flex flex-col flex-1 min-h-0">
                  <div className="mb-2 md:mb-4 flex-shrink-0">
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
