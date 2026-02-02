import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import StatCard from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp,
  Target,
  Award
} from 'lucide-react';
import { studentPerformance } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const StudentPerformance = () => {
  return (
    <StudentDashboardLayout title="Performance">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Average Score"
            value={`${studentPerformance.averageScore}%`}
            icon={<Target className="w-5 h-5" />}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Total XP"
            value={studentPerformance.xp.toLocaleString()}
            icon={<Award className="w-5 h-5" />}
          />
          <StatCard
            title="Study Time"
            value={studentPerformance.totalStudyTime}
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>

        {/* Weekly Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Study Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentPerformance.weeklyProgress}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    formatter={(value) => [`${value} min`, 'Study Time']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar 
                    dataKey="minutes" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Strengths & Weak Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-2xl">💪</span>
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {studentPerformance.strengths.map((strength, index) => (
                  <Badge key={index} className="bg-primary/10 text-primary hover:bg-primary/20">
                    {strength}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Keep up the great work! These are your strongest areas.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Areas to Improve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {studentPerformance.weakAreas.map((area, index) => (
                  <Badge key={index} variant="secondary">
                    {area}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Focus a bit more here - you're getting better every day!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-lg">
                🤖
              </div>
              <div>
                <h3 className="font-semibold mb-1">AI Recommendation</h3>
                <p className="text-sm text-muted-foreground">
                  Based on your performance, I suggest spending 15 more minutes daily on Geometry. 
                  Try the "Shapes and Angles" practice set - it's designed for your current level!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentPerformance;