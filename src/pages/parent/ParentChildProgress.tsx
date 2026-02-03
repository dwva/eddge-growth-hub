import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ParentDashboardLayout from '@/components/layout/ParentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useChild } from '@/contexts/ChildContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { recentTests, weeklyProgressData, monthlyProgressData } from '@/data/parentMockData';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Award,
  BookOpen,
  Minus
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

const ParentChildProgress = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const { children, selectedChild } = useChild();
  const { t } = useLanguage();
  const [trendView, setTrendView] = useState<'weekly' | 'monthly'>('weekly');

  const child = children.find(c => c.id === childId) || selectedChild;

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'text-green-600';
    if (progress >= 75) return 'text-blue-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getProgressBadge = (progress: number) => {
    if (progress >= 90) return { label: 'Excellent', className: 'bg-green-100 text-green-700' };
    if (progress >= 75) return { label: 'Good', className: 'bg-blue-100 text-blue-700' };
    if (progress >= 60) return { label: 'Needs Attention', className: 'bg-yellow-100 text-yellow-700' };
    return { label: 'Needs Attention', className: 'bg-orange-100 text-orange-700' };
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  if (!child) {
    return (
      <ParentDashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Child not found</p>
        </div>
      </ParentDashboardLayout>
    );
  }

  const progressBadge = getProgressBadge(child.progress || 0);
  const subjectChartData = child.subjects?.map(s => ({
    name: s.name,
    score: s.score,
    fill: s.color,
  })) || [];

  // Calculate stats
  const averageScore = recentTests.reduce((acc, t) => acc + t.score, 0) / recentTests.length;
  const highestScore = Math.max(...recentTests.map(t => t.score));

  return (
    <ParentDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/parent')}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{child.name}'s Overall Progress</h1>
            <p className="text-muted-foreground">{child.class}</p>
          </div>
        </div>

        {/* Overall Progress Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="text-center">
                <p className={`text-5xl font-bold ${getProgressColor(child.progress || 0)}`}>
                  {child.progress}%
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+5% from last month</span>
                </div>
                <Badge className={`mt-2 ${progressBadge.className}`}>{progressBadge.label}</Badge>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <Calendar className="w-6 h-6 mx-auto text-green-600" />
                  <p className="text-2xl font-bold mt-1">{child.attendance}%</p>
                  <p className="text-xs text-muted-foreground">Attendance</p>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <Target className="w-6 h-6 mx-auto text-blue-600" />
                  <p className="text-2xl font-bold mt-1">{child.streak}</p>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <Award className="w-6 h-6 mx-auto text-yellow-600" />
                  <p className="text-2xl font-bold mt-1">{Math.round(averageScore)}%</p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="subjects" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="subjects" className="text-xs py-2">{t('progress.subjectPerformance')}</TabsTrigger>
            <TabsTrigger value="tests" className="text-xs py-2">{t('progress.testInsights')}</TabsTrigger>
            <TabsTrigger value="trend" className="text-xs py-2">{t('progress.progressTrend')}</TabsTrigger>
            <TabsTrigger value="attendance" className="text-xs py-2">{t('progress.attendanceDetails')}</TabsTrigger>
          </TabsList>

          {/* Subject Performance Tab */}
          <TabsContent value="subjects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subject Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {child.subjects?.map((subject, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${subject.color}20` }}
                        >
                          <BookOpen className="w-4 h-4" style={{ color: subject.color }} />
                        </div>
                        <span className="font-medium text-sm">{subject.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(subject.trend)}
                        {subject.trend !== 'stable' && (
                          <span className={`text-xs ${subject.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {subject.trendValue}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold">{subject.score}%</span>
                      <Badge className={subject.score >= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                        {subject.grade}
                      </Badge>
                    </div>
                    <Progress value={subject.score} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Test & Exam Insights Tab */}
          <TabsContent value="tests" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">{Math.round(averageScore)}%</p>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">{highestScore}%</p>
                  <p className="text-sm text-muted-foreground">Highest Score</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{recentTests.length}</p>
                  <p className="text-sm text-muted-foreground">Recent Tests</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Tests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentTests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-sm">{test.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">{test.subject}</Badge>
                          <span className="text-xs text-muted-foreground">{test.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold">{test.score}%</span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(test.trend)}
                        {test.trend !== 'stable' && (
                          <span className={`text-xs ${test.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {test.trendValue}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Trend Tab */}
          <TabsContent value="trend" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Progress Trend</CardTitle>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTrendView('weekly')}
                      className={`px-3 py-1 rounded-lg text-sm ${trendView === 'weekly' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                    >
                      Weekly
                    </button>
                    <button
                      onClick={() => setTrendView('monthly')}
                      className={`px-3 py-1 rounded-lg text-sm ${trendView === 'monthly' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendView === 'weekly' ? weeklyProgressData : monthlyProgressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey={trendView === 'weekly' ? 'week' : 'month'} tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="progress"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  {child.name}'s progress has been steadily improving over the past {trendView === 'weekly' ? 'weeks' : 'months'}.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center">
                  {/* Circular Progress */}
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="none"
                        stroke={(child.attendance || 0) >= 90 ? '#10b981' : '#3b82f6'}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${((child.attendance || 0) / 100) * 553} 553`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold">{child.attendance}%</span>
                      <Badge className={(child.attendance || 0) >= 90 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                        {(child.attendance || 0) >= 90 ? 'Excellent' : 'Good'}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-6 text-center max-w-md">
                    Good attendance is crucial for academic success. {child.name} has maintained excellent attendance this semester.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ParentDashboardLayout>
  );
};

export default ParentChildProgress;
