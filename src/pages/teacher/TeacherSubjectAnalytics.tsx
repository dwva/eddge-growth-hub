import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import { useTeacherMode } from '@/contexts/TeacherModeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, BookOpen, TrendingUp, TrendingDown, Minus, AlertCircle, AlertTriangle, Sparkles, Brain, Users } from 'lucide-react';
import { chapters, topics, commonMistakes } from '@/data/teacherMockData';

const TeacherSubjectAnalyticsContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentMode } = useTeacherMode();
  
  const getTabFromPath = () => {
    if (location.pathname.includes('/topics')) return 'topics';
    if (location.pathname.includes('/mistakes')) return 'mistakes';
    return 'chapters';
  };
  
  const [activeTab, setActiveTab] = useState(getTabFromPath());
  const [subjectFilter, setSubjectFilter] = useState('Mathematics');
  const [masteryFilter, setMasteryFilter] = useState('all');
  
  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);
  
  useEffect(() => {
    if (location.pathname === '/teacher/subject-analytics') {
      navigate('/teacher/subject-analytics/chapters', { replace: true });
    }
  }, [location.pathname, navigate]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/teacher/subject-analytics/${value}`);
  };

  // Mode restriction
  if (currentMode !== 'subject_teacher') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-sm font-semibold mb-2">Subject Teacher Mode Required</h2>
        <p className="text-muted-foreground mb-4">This page is only accessible in Subject Teacher mode.</p>
        <Button onClick={() => navigate('/teacher')}>Back to Dashboard</Button>
      </div>
    );
  }

  const filteredChapters = chapters.filter(ch => {
    const matchesSubject = ch.subject === subjectFilter;
    const matchesMastery = masteryFilter === 'all' || ch.mastery === masteryFilter;
    return matchesSubject && matchesMastery;
  }).sort((a, b) => a.masteryPercent - b.masteryPercent);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getMasteryColor = (mastery: string) => {
    switch (mastery) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const highRiskChapters = filteredChapters.filter(ch => ch.mastery === 'low').length;
  const avgMastery = Math.round(filteredChapters.reduce((acc, ch) => acc + ch.masteryPercent, 0) / filteredChapters.length);
  const weakestChapter = filteredChapters[0]?.name || 'N/A';

  return (
    <div className="space-y-3 md:space-y-4 max-w-[1600px]">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-2 md:gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900">Subject Analytics</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">Analyze chapter and topic-level performance</p>
        </div>
        <Button variant="ghost" size="sm" className="h-7 md:h-8 text-xs rounded-lg gap-1" onClick={() => navigate('/teacher')}>
          <ArrowLeft className="w-3 h-3" />
          Back
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid h-7 md:h-8 p-0.5 md:p-1 rounded-lg bg-gray-100">
          <TabsTrigger value="chapters" className="text-[9px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 h-6 md:h-7 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">Chapters</TabsTrigger>
          <TabsTrigger value="topics" className="text-[9px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 h-6 md:h-7 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">Topics</TabsTrigger>
          <TabsTrigger value="mistakes" className="text-[9px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 h-6 md:h-7 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">Mistakes</TabsTrigger>
        </TabsList>

        {/* Chapters Tab */}
        <TabsContent value="chapters" className="space-y-3 mt-3">
          {/* Filters */}
          <Card className="shadow-sm border-0 rounded-xl">
            <CardContent className="p-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="w-full sm:w-40 h-8 text-xs rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={masteryFilter} onValueChange={setMasteryFilter}>
                  <SelectTrigger className="w-full sm:w-40 h-8 text-xs rounded-lg">
                    <SelectValue placeholder="Filter by mastery" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="high">High Mastery</SelectItem>
                    <SelectItem value="medium">Medium Mastery</SelectItem>
                    <SelectItem value="low">Low Mastery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card className="shadow-sm border-0 rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Chapters</p>
                    <p className="text-base font-bold">{filteredChapters.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-0 rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">High-Risk</p>
                    <p className="text-base font-bold text-red-500">{highRiskChapters}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-0 rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Mastery</p>
                    <p className="text-base font-bold">{avgMastery}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-0 rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Weakest</p>
                    <p className="text-base font-bold truncate">{weakestChapter}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chapters Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filteredChapters.map((chapter) => (
              <Card key={chapter.id} className="shadow-sm border-0 rounded-2xl hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{chapter.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Users className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{chapter.attempts} attempts</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`capitalize ${chapter.mastery === 'high' ? 'text-green-600 border-green-200' : chapter.mastery === 'medium' ? 'text-yellow-600 border-yellow-200' : 'text-red-600 border-red-200'}`}
                      >
                        {chapter.mastery}
                      </Badge>
                      {getTrendIcon(chapter.trend)}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Mastery</span>
                      <span className="font-medium">{chapter.masteryPercent}%</span>
                    </div>
                    <Progress value={chapter.masteryPercent} className={getMasteryColor(chapter.mastery)} />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm font-bold">{chapter.avgScore}%</p>
                      <p className="text-xs text-muted-foreground">Avg Score</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{chapter.accuracy}%</p>
                      <p className="text-xs text-muted-foreground">Accuracy</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{chapter.completion}%</p>
                      <p className="text-xs text-muted-foreground">Completion</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Topics Tab */}
        <TabsContent value="topics" className="space-y-4 mt-4">
          <Card className="shadow-sm border-0 rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <BookOpen className="w-5 h-5" />
                Topic Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topics.map((topic) => (
                  <div key={topic.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{topic.name}</h4>
                      <Badge variant={topic.avgAccuracy >= 60 ? 'secondary' : 'destructive'}>
                        {topic.avgAccuracy}% accuracy
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Error Rate</span>
                        <span className="text-red-500">{topic.errorRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Attempts</span>
                        <span>{topic.attempts}</span>
                      </div>
                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground mb-1">Common Mistakes:</p>
                        <div className="flex flex-wrap gap-1">
                          {topic.commonMistakes.map((mistake, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{mistake}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Common Mistakes Tab */}
        <TabsContent value="mistakes" className="space-y-4 mt-4">
          <Card className="shadow-sm border-0 rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Brain className="w-5 h-5" />
                Common Mistake Patterns
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {commonMistakes.map((mistake) => (
                <div key={mistake.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <p className="font-medium">{mistake.description}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <span>{mistake.chapter}</span>
                        <span>•</span>
                        <span>{mistake.topic}</span>
                      </div>
                    </div>
                    <Badge variant="destructive">{mistake.frequency}% of students</Badge>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg mb-3">
                    <p className="text-sm">
                      <span className="font-medium">Suggested Intervention:</span> {mistake.intervention}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/teacher/ai-tools/question-generator')}>
                    <Sparkles className="w-4 h-4" />
                    Generate Practice Questions
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const TeacherSubjectAnalytics = () => {
  return (
    <TeacherDashboardLayout>
      <TeacherSubjectAnalyticsContent />
    </TeacherDashboardLayout>
  );
};

export default TeacherSubjectAnalytics;
