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
    icon: <Lightbulb className="w-4 h-4" />,
    color: 'text-amber-600 bg-amber-50 border-amber-200'
  },
  concept: {
    title: 'Concept',
    description: 'Deep understanding of the topic',
    icon: <Brain className="w-4 h-4" />,
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  ace: {
    title: 'A.C.E',
    description: 'Assess • Correct • Elevate',
    icon: <Target className="w-4 h-4" />,
    color: 'text-primary bg-primary/5 border-primary/20'
  },
  exit: {
    title: 'Exit',
    description: 'Summary and key takeaways',
    icon: <Award className="w-4 h-4" />,
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
      <div className="space-y-6 max-w-5xl">
        {/* Continue Learning Card */}
        <Card className="border border-border bg-card overflow-hidden">
          <CardContent className="p-0">
            <div className="p-5 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">Continue Learning</span>
                </div>
                <Badge variant="outline" className="text-xs border-border">
                  <Clock className="w-3 h-3 mr-1" />
                  {currentSession.estimatedTime}
                </Badge>
              </div>
              
              <h2 className="text-xl font-semibold mb-1">{currentSession.topic}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {currentSession.subject} • {currentSession.chapter}
              </p>
              
              <div className="flex items-center gap-2 mb-2">
                <Progress value={currentSession.progress} className="h-1.5 flex-1" />
                <span className="text-xs text-muted-foreground">{currentSession.progress}%</span>
              </div>
            </div>

            {/* Learning Engine Phases */}
            <div className="p-5 bg-muted/30">
              <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Learning Path</p>
              <div className="flex items-center gap-2">
                {phases.map((phase, index) => {
                  const status = getPhaseStatus(phase, currentSession.currentPhase);
                  const info = phaseInfo[phase];
                  return (
                    <div key={phase} className="flex items-center">
                      <div className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
                        ${status === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : ''}
                        ${status === 'current' ? info.color : ''}
                        ${status === 'upcoming' ? 'bg-muted border-border text-muted-foreground' : ''}
                      `}>
                        {status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          info.icon
                        )}
                        <span className="text-xs font-medium">{info.title}</span>
                      </div>
                      {index < phases.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-muted-foreground mx-1" />
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 p-3 rounded-lg border border-border bg-card">
                <p className="text-xs text-muted-foreground mb-1">Current Phase</p>
                <p className="text-sm font-medium">{phaseInfo[currentSession.currentPhase].title}: {phaseInfo[currentSession.currentPhase].description}</p>
              </div>
              
              <Button className="mt-4 h-10 px-6 rounded-lg gradient-primary hover:opacity-90 transition-opacity">
                <Play className="w-4 h-4 mr-2" />
                Resume Learning
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* All Subjects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-medium">All Subjects</h2>
            <button className="text-xs text-primary hover:underline flex items-center gap-1">
              View Progress <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="space-y-3">
            {subjects.map((subject) => (
              <Card 
                key={subject.id} 
                className={`border border-border bg-card hover:border-primary/30 transition-all cursor-pointer ${selectedSubject === subject.id ? 'border-primary/50' : ''}`}
                onClick={() => setSelectedSubject(selectedSubject === subject.id ? null : subject.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${subject.color} flex items-center justify-center text-white text-lg`}>
                        {subject.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{subject.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {subject.completedChapters}/{subject.chapters} chapters
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">{subject.progress}%</p>
                        <Progress value={subject.progress} className="h-1 w-16" />
                      </div>
                      <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${selectedSubject === subject.id ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                  
                  {/* Chapters */}
                  {selectedSubject === subject.id && chapters[subject.id as keyof typeof chapters] && (
                    <div className="mt-4 pt-4 border-t border-border space-y-2">
                      {chapters[subject.id as keyof typeof chapters].map((chapter) => (
                        <div 
                          key={chapter.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {chapter.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                            )}
                            <span className={`text-sm ${chapter.completed ? 'text-muted-foreground' : 'font-medium'}`}>
                              {chapter.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] border-border">
                              {chapter.concepts} concepts
                            </Badge>
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
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

        {/* Learning Engine Info */}
        <Card className="border border-border bg-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-medium">How EDDGE Learn Engine Works</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {phases.map((phase) => {
                const info = phaseInfo[phase];
                return (
                  <div key={phase} className={`p-3 rounded-lg border ${info.color}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {info.icon}
                      <span className="text-xs font-medium">{info.title}</span>
                    </div>
                    <p className="text-[11px] opacity-80">{info.description}</p>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Each topic follows this structured path to ensure deep understanding and exam readiness.
            </p>
          </CardContent>
        </Card>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentLearning;
