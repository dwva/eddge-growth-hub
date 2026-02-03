import { useState } from 'react';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  Brain,
  Target,
  Award,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { subjects, chapters } from '@/data/mockData';

// Learning Engine Types
type EnginePhase = 'foundation' | 'concept' | 'ace' | 'exit';

interface LearningSession {
  id: string;
  topic: string;
  subject: string;
  chapter: string;
  currentPhase: EnginePhase;
  progress: number;
  estimatedTime: string;
}

// Mock current session
const currentSession: LearningSession = {
  id: '1',
  topic: 'Quadratic Equations',
  subject: 'Mathematics',
  chapter: 'Chapter 3',
  currentPhase: 'concept',
  progress: 65,
  estimatedTime: '12 mins left'
};

const phaseInfo = {
  foundation: {
    title: 'Foundation',
    description: 'Understanding why this matters',
    icon: <Lightbulb className="w-3.5 h-3.5" />,
    color: 'text-amber-600 bg-amber-50 border-amber-200'
  },
  concept: {
    title: 'Concept',
    description: 'Deep understanding of the topic',
    icon: <Brain className="w-3.5 h-3.5" />,
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  ace: {
    title: 'A.C.E',
    description: 'Assess • Correct • Elevate',
    icon: <Target className="w-3.5 h-3.5" />,
    color: 'text-primary bg-primary/5 border-primary/20'
  },
  exit: {
    title: 'Exit',
    description: 'Summary and key takeaways',
    icon: <Award className="w-3.5 h-3.5" />,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  }
};

const phases: EnginePhase[] = ['foundation', 'concept', 'ace', 'exit'];

const StudentLearning = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const getPhaseStatus = (phase: EnginePhase, currentPhase: EnginePhase) => {
    const currentIndex = phases.indexOf(currentPhase);
    const phaseIndex = phases.indexOf(phase);
    if (phaseIndex < currentIndex) return 'completed';
    if (phaseIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <StudentDashboardLayout title="Learn">
      <div className="space-y-4 max-w-6xl">
        {/* Top Section: Continue Learning + Engine Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Continue Learning Card */}
          <Card className="lg:col-span-2 border border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">Continue Learning</span>
                </div>
                <Badge variant="outline" className="text-[10px] border-border">
                  <Clock className="w-3 h-3 mr-1" />
                  {currentSession.estimatedTime}
                </Badge>
              </div>
              
              <h2 className="text-lg font-semibold mb-1">{currentSession.topic}</h2>
              <p className="text-xs text-muted-foreground mb-3">
                {currentSession.subject} • {currentSession.chapter}
              </p>
              
              <div className="flex items-center gap-2 mb-4">
                <Progress value={currentSession.progress} className="h-1.5 flex-1" />
                <span className="text-xs text-muted-foreground">{currentSession.progress}%</span>
              </div>

              {/* Learning Path - Compact */}
              <div className="flex flex-wrap items-center gap-1.5 mb-4">
                {phases.map((phase, index) => {
                  const status = getPhaseStatus(phase, currentSession.currentPhase);
                  const info = phaseInfo[phase];
                  return (
                    <div key={phase} className="flex items-center">
                      <div className={`
                        flex items-center gap-1.5 px-2 py-1 rounded-md border transition-all text-[10px]
                        ${status === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : ''}
                        ${status === 'current' ? info.color : ''}
                        ${status === 'upcoming' ? 'bg-muted border-border text-muted-foreground' : ''}
                      `}>
                        {status === 'completed' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          info.icon
                        )}
                        <span className="font-medium hidden sm:inline">{info.title}</span>
                      </div>
                      {index < phases.length - 1 && (
                        <ChevronRight className="w-3 h-3 text-muted-foreground mx-0.5" />
                      )}
                    </div>
                  );
                })}
              </div>
              
              <Button className="h-9 px-5 text-sm rounded-lg gradient-primary hover:opacity-90 transition-opacity">
                <Play className="w-4 h-4 mr-2" />
                Resume Learning
              </Button>
            </CardContent>
          </Card>

          {/* Learning Engine Info - Compact */}
          <Card className="border border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-medium">Learn Engine</h3>
              </div>
              <div className="space-y-2">
                {phases.map((phase) => {
                  const info = phaseInfo[phase];
                  return (
                    <div key={phase} className={`p-2 rounded-md border ${info.color}`}>
                      <div className="flex items-center gap-1.5">
                        {info.icon}
                        <span className="text-[10px] font-medium">{info.title}</span>
                      </div>
                      <p className="text-[9px] opacity-70 mt-0.5">{info.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Subjects */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium">All Subjects</h2>
            <button className="text-xs text-primary hover:underline flex items-center gap-1">
              View Progress <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subjects.map((subject) => (
              <Card 
                key={subject.id} 
                className={`border border-border bg-card hover:border-primary/30 transition-all cursor-pointer ${selectedSubject === subject.id ? 'border-primary/50' : ''}`}
                onClick={() => setSelectedSubject(selectedSubject === subject.id ? null : subject.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-lg ${subject.color} flex items-center justify-center text-white text-sm`}>
                        {subject.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{subject.name}</h3>
                        <p className="text-[10px] text-muted-foreground">
                          {subject.completedChapters}/{subject.chapters} chapters
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-xs font-medium">{subject.progress}%</p>
                        <Progress value={subject.progress} className="h-1 w-12" />
                      </div>
                      <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${selectedSubject === subject.id ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                  
                  {/* Chapters */}
                  {selectedSubject === subject.id && chapters[subject.id as keyof typeof chapters] && (
                    <div className="mt-3 pt-3 border-t border-border space-y-1.5">
                      {chapters[subject.id as keyof typeof chapters].map((chapter) => (
                        <div 
                          key={chapter.id}
                          className="flex items-center justify-between p-2 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {chapter.completed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border-2 border-muted-foreground" />
                            )}
                            <span className={`text-xs ${chapter.completed ? 'text-muted-foreground' : 'font-medium'}`}>
                              {chapter.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[9px] border-border py-0">
                              {chapter.concepts} concepts
                            </Badge>
                            <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2">
                              <BookOpen className="w-3 h-3 mr-1" />
                              Learn
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentLearning;