import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ParentDashboardLayout from '@/components/layout/ParentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useChild } from '@/contexts/ChildContext';
import { recentTests, weeklyProgressData, monthlyProgressData, examReadiness } from '@/data/parentMockData';
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
import { Button } from '@/components/ui/button';
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

const ParentChildProgressContent = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const { children, selectedChild } = useChild();
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

  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case 'high':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-amber-600 bg-amber-50';
      default:
        return 'text-red-600 bg-red-50';
    }
  };

  if (!child) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Child not found</p>
      </div>
    );
  }

  const progressBadge = getProgressBadge(child.progress || 0);
  const subjectChartData = child.subjects?.map(s => ({
    name: s.name,
    score: s.score,
    fill: s.color,
  })) || [];

  const averageScore = recentTests.reduce((acc, t) => acc + t.score, 0) / recentTests.length;
  const highestScore = Math.max(...recentTests.map(t => t.score));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/parent')}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{child.name}'s Progress</h1>
            <p className="text-sm text-muted-foreground">{child.class}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="hidden sm:inline">View detailed performance, tests and exam readiness.</span>
        </div>
      </div>

      {/* Overview section */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Main score */}
            <div className="text-center md:text-left space-y-3">
              <p className={`text-5xl font-bold ${getProgressColor(child.progress || 0)}`}>
                {child.progress}%
              </p>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-700">+5% vs last month</span>
              </div>
              <div>
                <Badge className={`mt-2 ${progressBadge.className}`}>{progressBadge.label}</Badge>
              </div>
            </div>

            {/* Key stats */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg bg-white/70 p-4 flex flex-col items-start">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span>Attendance</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{child.attendance}%</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Consistent presence in class.
                </p>
              </div>
              <div className="rounded-lg bg-white/70 p-4 flex flex-col items-start">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span>Study streak</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{child.streak}</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Days of continuous effort.
                </p>
              </div>
              <div className="rounded-lg bg-white/70 p-4 flex flex-col items-start">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
                  <Award className="w-4 h-4 text-yellow-600" />
                  <span>Average test score</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{Math.round(averageScore)}%</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Based on recent assessments.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tests + Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent tests */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-lg">Recent Tests</CardTitle>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>Avg: {Math.round(averageScore)}%</span>
                <span>Best: {highestScore}%</span>
                <span>{recentTests.length} tests</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentTests.map((test) => (
              <div
                key={test.id}
                className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 bg-white transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0">
                    {test.subject.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{test.name}</p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground flex-wrap">
                      <Badge variant="outline" className="text-[10px] px-2 py-0 h-5">
                        {test.subject}
                      </Badge>
                      <span>{test.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-lg font-bold">{test.score}%</span>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(test.trend)}
                    {test.trend !== 'stable' && (
                      <span
                        className={`text-xs ${
                          test.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {test.trendValue}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Progress trend */}
        <Card className="lg:col-span-1 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-lg">Progress Trend</CardTitle>
              <div className="inline-flex rounded-full bg-muted p-1 text-xs">
                <button
                  onClick={() => setTrendView('weekly')}
                  className={`px-2 py-0.5 rounded-full ${
                    trendView === 'weekly' ? 'bg-white shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTrendView('monthly')}
                  className={`px-2 py-0.5 rounded-full ${
                    trendView === 'monthly' ? 'bg-white shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-40 md:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendView === 'weekly' ? weeklyProgressData : monthlyProgressData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey={trendView === 'weekly' ? 'week' : 'month'}
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="progress"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-muted-foreground mt-3 text-center">
              {child.name}'s progress over recent {trendView === 'weekly' ? 'weeks' : 'months'}.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Readiness + Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exam Readiness Indicator */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Exam Readiness
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1.5">
              {examReadiness.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-800 truncate">{item.subject}</span>
                      <Badge className={`text-[10px] px-1.5 py-0.5 ${getReadinessColor(item.readiness)} border-0 flex-shrink-0`}>
                        {item.readiness === 'high'
                          ? 'High'
                          : item.readiness === 'medium'
                          ? 'Med'
                          : 'Low'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={item.score} className="h-1 flex-1" />
                      <span className="text-[11px] text-gray-500 w-10 text-right flex-shrink-0">{item.score}%</span>
                    </div>
                  </div>
                  {item.readiness === 'low' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-[10px] h-6 px-2 flex-shrink-0"
                      onClick={() => navigate('/parent/communications')}
                    >
                      Contact
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attendance overview */}
        <Card className="lg:col-span-1 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Attendance</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 md:w-48 md:h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" fill="none" stroke="#e5e7eb" strokeWidth="12" />
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
                <span className="text-3xl md:text-4xl font-bold">{child.attendance}%</span>
                <Badge
                  className={
                    (child.attendance || 0) >= 90
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }
                >
                  {(child.attendance || 0) >= 90 ? 'Excellent' : 'Good'}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center max-w-xs">
              Good attendance is crucial for academic success. {child.name} has maintained a strong
              presence in class.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ParentChildProgress = () => {
  return (
    <ParentDashboardLayout>
      <ParentChildProgressContent />
    </ParentDashboardLayout>
  );
};

export default ParentChildProgress;