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
  Flame,
  CheckCircle,
  MessageSquare,
  FileText,
  CalendarDays,
  Target,
  Award
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
                      Focus today: Pick a topic to start
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

          {/* Main Content Grid - Left (Quick actions + Contributions) + Right (AI Study Suggestions) */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-stretch">
            
            {/* Left Column - Quick actions then Contribution heatmap (where Continue Learn was) */}
            <div className="flex flex-col gap-6">
              {/* Quick actions - 3 buttons */}
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 flex-shrink-0">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Quick actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="relative h-auto py-4 px-4 flex flex-col items-center gap-1.5 rounded-xl border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 hover:shadow-sm group overflow-visible"
                    onClick={() => navigate('/student/homework')}
                  >
                    <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold shadow-md ring-2 ring-white">
                      2
                    </span>
                    <FileText className="w-6 h-6 text-primary transition-transform duration-200 group-hover:scale-110" />
                    <span className="text-sm font-medium">Homework</span>
                    <span className="text-xs text-amber-600 font-medium">2 pending</span>
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
