import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import StatCard from '@/components/shared/StatCard';
import AIAvatar from '@/components/shared/AIAvatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Flame,
  Star,
  Trophy,
  Clock
} from 'lucide-react';
import { subjects, studentPerformance, upcomingTests } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const StudentHome = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Student';
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <StudentDashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* AI Avatar Greeting */}
        <AIAvatar 
          message={`${greeting}, ${firstName}! 🌟 You're on a ${studentPerformance.streak}-day learning streak. Ready to continue where you left off in Algebra?`}
          size="md"
        />

        {/* Today's Focus Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-primary" />
              <span className="font-semibold text-primary">Today's Focus</span>
            </div>
            <h3 className="text-lg font-bold mb-1">Complete Quadratic Equations - Chapter 3</h3>
            <p className="text-sm text-muted-foreground">You're 80% through this chapter. Just 2 more concepts to go!</p>
            <Progress value={80} className="mt-3 h-2" />
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="XP Points"
            value={studentPerformance.xp.toLocaleString()}
            icon={<Star className="w-5 h-5" />}
          />
          <StatCard
            title="Level"
            value={studentPerformance.level}
            icon={<Trophy className="w-5 h-5" />}
          />
          <StatCard
            title="Streak"
            value={`${studentPerformance.streak} days`}
            icon={<Flame className="w-5 h-5" />}
          />
          <StatCard
            title="Study Time"
            value={studentPerformance.totalStudyTime}
            icon={<Clock className="w-5 h-5" />}
          />
        </div>

        {/* Subjects Grid */}
        <div>
          <h2 className="text-lg font-semibold mb-4">My Subjects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <Card key={subject.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg ${subject.color} flex items-center justify-center text-white text-xl`}>
                      {subject.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{subject.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {subject.completedChapters}/{subject.chapters} chapters
                      </p>
                    </div>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">{subject.progress}% complete</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Tests */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Upcoming Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTests.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div>
                  <p className="font-medium">{test.name}</p>
                  <p className="text-sm text-muted-foreground">{test.subject}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-primary">{new Date(test.date).toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground">{test.duration}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentHome;
