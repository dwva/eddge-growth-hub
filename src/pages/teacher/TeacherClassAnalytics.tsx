import { useNavigate } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import StatCard from '@/components/shared/StatCard';
import { useTeacherMode } from '@/contexts/TeacherModeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Target, Users, BarChart3, TrendingUp, AlertCircle, 
  AlertTriangle, Download
} from 'lucide-react';
import { classAnalyticsData, atRiskStudents as atRiskData } from '@/data/teacherMockData';
import { toast } from 'sonner';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';

const pieData = [
  { name: 'High', value: classAnalyticsData.distribution.high, color: '#10b981' },
  { name: 'Medium', value: classAnalyticsData.distribution.medium, color: '#f59e0b' },
  { name: 'Low', value: classAnalyticsData.distribution.low, color: '#ef4444' },
];

const TeacherClassAnalyticsContent = () => {
  const navigate = useNavigate();
  const { currentMode } = useTeacherMode();

  if (currentMode !== 'class_teacher') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Class Teacher Mode Required</h2>
        <p className="text-muted-foreground mb-4">This page is only accessible in Class Teacher mode.</p>
        <Button onClick={() => navigate('/teacher')}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-[1600px]">
      {/* Page Header - Clean */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Class Analytics</h1>
          <p className="text-sm text-gray-500 mt-2">Performance metrics for Class 10-A</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 h-10 rounded-xl border-gray-200" onClick={() => toast.success('Exporting report...')}>
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Section 1: Key Metrics */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-5">Key Metrics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard 
            title="Class Average" 
            value={`${classAnalyticsData.classAverage}%`} 
            icon={<Target className="w-5 h-5" />} 
            trend={{ value: 3, isPositive: true }}
            iconBg="bg-emerald-50 text-emerald-600"
          />
          <StatCard 
            title="Total Students" 
            value={classAnalyticsData.totalStudents} 
            icon={<Users className="w-5 h-5" />} 
            iconBg="bg-blue-50 text-blue-600"
          />
          <StatCard 
            title="Pass Rate" 
            value={`${classAnalyticsData.overallAccuracy}%`} 
            icon={<BarChart3 className="w-5 h-5" />} 
            iconBg="bg-violet-50 text-violet-600"
          />
          <StatCard 
            title="At-Risk" 
            value={atRiskData.length} 
            icon={<AlertTriangle className="w-5 h-5" />} 
            iconBg="bg-red-50 text-red-600"
          />
        </div>
      </div>

      {/* Section 2: Performance Trends */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-5">Performance Trends</h2>
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Performance Over Time</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Weekly class average scores</p>
              </div>
              <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">+3% this month</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={classAnalyticsData.performanceTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 13, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 13, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', padding: '12px 16px' }} 
                    formatter={(v: number) => [`${v}%`, 'Score']} 
                  />
                  <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#areaGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 3: Distribution & Subject Comparison */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-5">Distribution & Subject Comparison</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Distribution Pie Chart - 1 column */}
            <Card className="lg:col-span-1 border-0 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Distribution</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex gap-6 items-center">
                  <div className="h-40 w-40 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} paddingAngle={4} dataKey="value" stroke="white" strokeWidth={2}>
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} formatter={(v: number, name: string) => [`${v} students`, name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2">
                    {['High Performers (≥80%)', 'Average (60-79%)', 'Need Support (<60%)'].map((label, i) => (
                      <div key={label} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pieData[i].color }} />
                        <span className="text-sm text-gray-600 flex-1">{label}</span>
                        <span className="text-sm font-semibold">{pieData[i].value}</span>
                        <Progress value={(pieData[i].value / classAnalyticsData.totalStudents) * 100} className="w-20 h-1.5" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subject Comparison - 2 columns */}
            <Card className="lg:col-span-2 border-0 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Subject Comparison</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[...classAnalyticsData.subjectPerformance].sort((a, b) => b.avgScore - a.avgScore)} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 13, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', padding: '12px 16px' }} 
                        formatter={(v: number) => [`${v}%`, 'Avg Score']} 
                      />
                      <Bar dataKey="avgScore" fill="#8b5cf6" radius={[8, 8, 0, 0]} maxBarSize={48} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      {/* Section 4: Subject Breakdown */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-5">Subject Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {classAnalyticsData.subjectPerformance.map((subject) => (
            <Card key={subject.subject} className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{subject.subject}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{subject.teacher}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    subject.avgScore >= 75 ? 'bg-emerald-50 text-emerald-700' :
                    subject.avgScore >= 60 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                  }`}>
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
  );
};

const TeacherClassAnalytics = () => {
  return (
    <TeacherDashboardLayout>
      <TeacherClassAnalyticsContent />
    </TeacherDashboardLayout>
  );
};

export default TeacherClassAnalytics;
