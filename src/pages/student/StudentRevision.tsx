import { useState } from 'react';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen,
  CheckCircle2,
  Clock,
  Brain,
  Lightbulb,
  RotateCcw,
  ChevronRight
} from 'lucide-react';

// Mock revision data
const revisionTopics = [
  {
    id: '1',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    lastRevised: '2026-01-28',
    conceptCount: 8,
    formulaCount: 5,
    status: 'pending',
    priority: 'high',
  },
  {
    id: '2',
    subject: 'Science',
    topic: 'Newton\'s Laws of Motion',
    lastRevised: '2026-01-30',
    conceptCount: 6,
    formulaCount: 3,
    status: 'revised',
    priority: 'medium',
  },
  {
    id: '3',
    subject: 'Mathematics',
    topic: 'Polynomials',
    lastRevised: '2026-01-25',
    conceptCount: 10,
    formulaCount: 7,
    status: 'pending',
    priority: 'high',
  },
  {
    id: '4',
    subject: 'English',
    topic: 'Grammar Rules',
    lastRevised: '2026-02-01',
    conceptCount: 12,
    formulaCount: 0,
    status: 'revised',
    priority: 'low',
  },
  {
    id: '5',
    subject: 'Science',
    topic: 'Chemical Reactions',
    lastRevised: '2026-01-20',
    conceptCount: 9,
    formulaCount: 4,
    status: 'pending',
    priority: 'medium',
  },
];

const weakTopics = [
  { id: 'w1', subject: 'Mathematics', topic: 'Geometry - Circles', accuracy: 45, attempts: 12 },
  { id: 'w2', subject: 'Science', topic: 'Electricity', accuracy: 52, attempts: 8 },
  { id: 'w3', subject: 'Mathematics', topic: 'Trigonometry', accuracy: 58, attempts: 15 },
];

const revisionStats = {
  totalTopics: 24,
  revisedToday: 3,
  pendingRevision: 8,
  weeklyGoal: 15,
  weeklyCompleted: 9,
};

const StudentRevision = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [markedTopics, setMarkedTopics] = useState<string[]>(['2', '4']);

  const filteredTopics = selectedSubject === 'all' 
    ? revisionTopics 
    : revisionTopics.filter(t => t.subject === selectedSubject);

  const subjects = ['all', ...new Set(revisionTopics.map(t => t.subject))];

  const handleMarkRevised = (topicId: string) => {
    setMarkedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'low': return 'bg-primary/10 text-primary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Mathematics': return 'bg-blue-500';
      case 'Science': return 'bg-purple-500';
      case 'English': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <StudentDashboardLayout title="Revision">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{revisionStats.revisedToday}</p>
                  <p className="text-xs text-muted-foreground">Revised Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{revisionStats.pendingRevision}</p>
                  <p className="text-xs text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{revisionStats.totalTopics}</p>
                  <p className="text-xs text-muted-foreground">Total Topics</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Weekly Goal</p>
                  <p className="text-xs font-medium">{revisionStats.weeklyCompleted}/{revisionStats.weeklyGoal}</p>
                </div>
                <Progress value={(revisionStats.weeklyCompleted / revisionStats.weeklyGoal) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Revision Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <RotateCcw className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Quick Revision</h3>
                  <p className="text-sm text-muted-foreground">15-min session of key concepts</p>
                </div>
                <Button size="sm">
                  Start <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-200 flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-amber-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900">Revise Weak Areas</h3>
                  <p className="text-sm text-amber-700">{weakTopics.length} topics need attention</p>
                </div>
                <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-200">
                  Review <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revision Content */}
        <Tabs defaultValue="topics" className="space-y-4">
          <TabsList>
            <TabsTrigger value="topics">All Topics</TabsTrigger>
            <TabsTrigger value="weak">Weak Areas</TabsTrigger>
            <TabsTrigger value="formulas">Formulas & Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="topics" className="space-y-4">
            {/* Subject Filter */}
            <div className="flex gap-2 flex-wrap">
              {subjects.map((subject) => (
                <Button
                  key={subject}
                  variant={selectedSubject === subject ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubject(subject)}
                  className="capitalize"
                >
                  {subject === 'all' ? 'All Subjects' : subject}
                </Button>
              ))}
            </div>

            {/* Topics List */}
            <div className="space-y-3">
              {filteredTopics.map((topic) => (
                <Card key={topic.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-1.5 h-12 rounded-full ${getSubjectColor(topic.subject)}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{topic.topic}</h4>
                            <Badge className={getPriorityColor(topic.priority)} variant="secondary">
                              {topic.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-muted-foreground">{topic.subject}</span>
                            <span className="text-xs text-muted-foreground">
                              {topic.conceptCount} concepts • {topic.formulaCount} formulas
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Last revised: {new Date(topic.lastRevised).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={markedTopics.includes(topic.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleMarkRevised(topic.id)}
                        >
                          {markedTopics.includes(topic.id) ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Revised
                            </>
                          ) : (
                            'Mark as Revised'
                          )}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="weak" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  Topics Needing Attention
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {weakTopics.map((topic) => (
                  <div 
                    key={topic.id}
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{topic.topic}</h4>
                      <p className="text-sm text-muted-foreground">{topic.subject}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-destructive">{topic.accuracy}% accuracy</p>
                        <p className="text-xs text-muted-foreground">{topic.attempts} attempts</p>
                      </div>
                      <Button size="sm">Revise Now</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Formulas & Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900">Quadratic Formula</h4>
                    <p className="text-lg font-mono mt-2 text-blue-800">x = (-b ± √(b² - 4ac)) / 2a</p>
                    <p className="text-xs text-blue-600 mt-2">Mathematics • Quadratic Equations</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-900">Newton's Second Law</h4>
                    <p className="text-lg font-mono mt-2 text-purple-800">F = ma</p>
                    <p className="text-xs text-purple-600 mt-2">Science • Force and Motion</p>
                  </div>
                  <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                    <h4 className="font-medium text-pink-900">Area of Circle</h4>
                    <p className="text-lg font-mono mt-2 text-pink-800">A = πr²</p>
                    <p className="text-xs text-pink-600 mt-2">Mathematics • Geometry</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentRevision;
