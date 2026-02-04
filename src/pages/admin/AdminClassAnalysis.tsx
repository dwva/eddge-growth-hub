import { useState } from 'react';
import AdminDashboardLayout from '@/components/layout/AdminDashboardLayout';
import StatCard from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Target,
  Users,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Download,
  BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts';

interface ClassAnalytics {
  id: string;
  name: string;
  teacher: string;
  classAverage: number;
  totalStudents: number;
  overallAccuracy: number;
  trendValue: number;
  atRiskCount: number;
  performanceTrend: { week: string; score: number }[];
  distribution: { high: number; medium: number; low: number };
  subjectPerformance: { subject: string; avgScore: number; passRate: number; teacher: string }[];
}

const adminClassesData: ClassAnalytics[] = [
  {
    id: '9a',
    name: 'Class 9-A',
    teacher: 'Mr. Rajesh Kumar',
    classAverage: 78,
    totalStudents: 35,
    overallAccuracy: 82,
    trendValue: 2,
    atRiskCount: 3,
    performanceTrend: [
      { week: 'Week 1', score: 74 },
      { week: 'Week 2', score: 76 },
      { week: 'Week 3', score: 77 },
      { week: 'Week 4', score: 78 },
    ],
    distribution: { high: 10, medium: 18, low: 7 },
    subjectPerformance: [
      { subject: 'Math', avgScore: 76, passRate: 85, teacher: 'Mr. Kumar' },
      { subject: 'Science', avgScore: 80, passRate: 88, teacher: 'Ms. Sharma' },
      { subject: 'English', avgScore: 79, passRate: 90, teacher: 'Mrs. Patel' },
      { subject: 'History', avgScore: 77, passRate: 82, teacher: 'Mr. Singh' },
    ],
  },
  {
    id: '9b',
    name: 'Class 9-B',
    teacher: 'Ms. Priya Sharma',
    classAverage: 82,
    totalStudents: 32,
    overallAccuracy: 86,
    trendValue: 4,
    atRiskCount: 2,
    performanceTrend: [
      { week: 'Week 1', score: 78 },
      { week: 'Week 2', score: 80 },
      { week: 'Week 3', score: 81 },
      { week: 'Week 4', score: 82 },
    ],
    distribution: { high: 12, medium: 15, low: 5 },
    subjectPerformance: [
      { subject: 'Math', avgScore: 84, passRate: 90, teacher: 'Ms. Sharma' },
      { subject: 'Science', avgScore: 81, passRate: 88, teacher: 'Mr. Verma' },
      { subject: 'English', avgScore: 83, passRate: 92, teacher: 'Mrs. Gupta' },
      { subject: 'Geography', avgScore: 80, passRate: 84, teacher: 'Ms. Reddy' },
    ],
  },
  {
    id: '10a',
    name: 'Class 10-A',
    teacher: 'Dr. Sarah Johnson',
    classAverage: 85,
    totalStudents: 30,
    overallAccuracy: 90,
    trendValue: 3,
    atRiskCount: 1,
    performanceTrend: [
      { week: 'Week 1', score: 81 },
      { week: 'Week 2', score: 83 },
      { week: 'Week 3', score: 84 },
      { week: 'Week 4', score: 85 },
    ],
    distribution: { high: 14, medium: 12, low: 4 },
    subjectPerformance: [
      { subject: 'Math', avgScore: 86, passRate: 93, teacher: 'Dr. Johnson' },
      { subject: 'Science', avgScore: 84, passRate: 90, teacher: 'Mr. Wilson' },
      { subject: 'English', avgScore: 87, passRate: 95, teacher: 'Mrs. Davis' },
      { subject: 'History', avgScore: 83, passRate: 88, teacher: 'Mr. Brown' },
    ],
  },
  {
    id: '10b',
    name: 'Class 10-B',
    teacher: 'Mr. David Wilson',
    classAverage: 76,
    totalStudents: 28,
    overallAccuracy: 79,
    trendValue: -1,
    atRiskCount: 4,
    performanceTrend: [
      { week: 'Week 1', score: 77 },
      { week: 'Week 2', score: 76 },
      { week: 'Week 3', score: 76 },
      { week: 'Week 4', score: 76 },
    ],
    distribution: { high: 6, medium: 14, low: 8 },
    subjectPerformance: [
      { subject: 'Math', avgScore: 74, passRate: 78, teacher: 'Mr. Wilson' },
      { subject: 'Science', avgScore: 77, passRate: 82, teacher: 'Ms. Lee' },
      { subject: 'English', avgScore: 79, passRate: 85, teacher: 'Mrs. Clark' },
      { subject: 'Geography', avgScore: 75, passRate: 75, teacher: 'Mr. Adams' },
    ],
  },
  {
    id: '11a',
    name: 'Class 11-A',
    teacher: 'Ms. Anita Patel',
    classAverage: 80,
    totalStudents: 25,
    overallAccuracy: 84,
    trendValue: 2,
    atRiskCount: 2,
    performanceTrend: [
      { week: 'Week 1', score: 77 },
      { week: 'Week 2', score: 79 },
      { week: 'Week 3', score: 80 },
      { week: 'Week 4', score: 80 },
    ],
    distribution: { high: 8, medium: 12, low: 5 },
    subjectPerformance: [
      { subject: 'Physics', avgScore: 78, passRate: 82, teacher: 'Ms. Patel' },
      { subject: 'Chemistry', avgScore: 81, passRate: 86, teacher: 'Mr. Joshi' },
      { subject: 'Math', avgScore: 82, passRate: 88, teacher: 'Dr. Rao' },
      { subject: 'English', avgScore: 79, passRate: 80, teacher: 'Mrs. Nair' },
    ],
  },
  {
    id: '11b',
    name: 'Class 11-B',
    teacher: 'Mr. Suresh Verma',
    classAverage: 83,
    totalStudents: 27,
    overallAccuracy: 87,
    trendValue: 5,
    atRiskCount: 1,
    performanceTrend: [
      { week: 'Week 1', score: 78 },
      { week: 'Week 2', score: 81 },
      { week: 'Week 3', score: 82 },
      { week: 'Week 4', score: 83 },
    ],
    distribution: { high: 10, medium: 14, low: 3 },
    subjectPerformance: [
      { subject: 'Biology', avgScore: 85, passRate: 90, teacher: 'Mr. Verma' },
      { subject: 'Chemistry', avgScore: 82, passRate: 88, teacher: 'Ms. Iyer' },
      { subject: 'Math', avgScore: 83, passRate: 89, teacher: 'Dr. Menon' },
      { subject: 'English', avgScore: 82, passRate: 82, teacher: 'Mrs. Kapoor' },
    ],
  },
];

const AdminClassAnalysis = () => {
  const [selectedClassId, setSelectedClassId] = useState<string>(adminClassesData[0].id);

  const selectedClass = adminClassesData.find((c) => c.id === selectedClassId) ?? adminClassesData[0];

  const pieData = [
    { name: 'High', value: selectedClass.distribution.high, color: '#10b981' },
    { name: 'Medium', value: selectedClass.distribution.medium, color: '#f59e0b' },
    { name: 'Low', value: selectedClass.distribution.low, color: '#ef4444' },
  ];

  const handleExport = () => {
    toast.success(`Exporting ${selectedClass.name} analysis report...`);
  };

  return (
    <AdminDashboardLayout
      pageTitle="Class Analysis"
      pageDescription="View total analysis for each class"
    >
      <div className="space-y-8 max-w-7xl">
        {/* Header with Class Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{selectedClass.name}</h2>
            <p className="text-sm text-gray-500 mt-1">Class Teacher: {selectedClass.teacher}</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
              <SelectTrigger className="w-48 h-10 rounded-xl border-gray-200 bg-white">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {adminClassesData.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-10 rounded-xl border-gray-200"
              onClick={handleExport}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* KPI Cards - Cleaner Design */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <Target className="w-6 h-6 text-emerald-600" />
                </div>
                {selectedClass.trendValue !== 0 && (
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      selectedClass.trendValue >= 0
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {selectedClass.trendValue >= 0 ? '↑' : '↓'} {Math.abs(selectedClass.trendValue)}%
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-1">Class Average</p>
              <p className="text-3xl font-bold text-gray-900">{selectedClass.classAverage}%</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-500 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{selectedClass.totalStudents}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-violet-600" />
              </div>
              <p className="text-sm text-gray-500 mb-1">Pass Rate</p>
              <p className="text-3xl font-bold text-gray-900">{selectedClass.overallAccuracy}%</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-sm text-gray-500 mb-1">At-Risk Students</p>
              <p className="text-3xl font-bold text-gray-900">{selectedClass.atRiskCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Trend - Minimal Design */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Performance Trend
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">Weekly class average</p>
              </div>
              <div
                className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full ${
                  selectedClass.trendValue >= 0
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                <TrendingUp
                  className={`w-4 h-4 ${selectedClass.trendValue < 0 ? 'rotate-180' : ''}`}
                />
                <span className="font-medium">
                  {selectedClass.trendValue >= 0 ? '+' : ''}
                  {selectedClass.trendValue}% this month
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={selectedClass.performanceTrend}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="areaGradientAdmin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 13, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 13, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      padding: '12px 16px',
                    }}
                    formatter={(v: number) => [`${v}%`, 'Score']}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    fill="url(#areaGradientAdmin)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subject Performance + Distribution - Separated */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subject Performance */}
          <Card className="border-0 shadow-sm bg-white lg:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Subject Performance
              </CardTitle>
              <p className="text-sm text-gray-500">Average scores by subject</p>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[...selectedClass.subjectPerformance].sort(
                      (a, b) => b.avgScore - a.avgScore
                    )}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis
                      dataKey="subject"
                      tick={{ fontSize: 12, fill: '#9ca3af' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 13, fill: '#9ca3af' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        padding: '12px 16px',
                      }}
                      formatter={(v: number) => [`${v}%`, 'Avg Score']}
                    />
                    <Bar
                      dataKey="avgScore"
                      fill="#8b5cf6"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={60}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Performance Distribution */}
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Distribution</CardTitle>
              <p className="text-sm text-gray-500">Student performance levels</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="h-44 w-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="white"
                        strokeWidth={3}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: 'none',
                          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                          padding: '12px 16px',
                        }}
                        formatter={(v: number, name: string) => [`${v} students`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-3">
                {['High (≥80%)', 'Medium (60–79%)', 'Low (<60%)'].map((label, i) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: pieData[i].color }}
                      />
                      <span className="text-sm text-gray-600">{label}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{pieData[i].value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Details - Clean Grid */}
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Subject Details
            </h3>
            <p className="text-sm text-gray-500 mt-1">Performance breakdown by subject</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {selectedClass.subjectPerformance.map((subject) => (
              <Card
                key={subject.subject}
                className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{subject.subject}</h4>
                      <p className="text-xs text-gray-500">{subject.teacher}</p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        subject.avgScore >= 75
                          ? 'bg-emerald-50 text-emerald-700'
                          : subject.avgScore >= 60
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {subject.avgScore}%
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-500">Average Score</span>
                        <span className="font-semibold text-gray-900">{subject.avgScore}%</span>
                      </div>
                      <Progress value={subject.avgScore} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-500">Pass Rate</span>
                        <span className="font-semibold text-gray-900">{subject.passRate}%</span>
                      </div>
                      <Progress value={subject.passRate} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminClassAnalysis;
