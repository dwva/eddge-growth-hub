import { useState } from 'react';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Zap,
  TrendingUp,
  BookOpen,
  Calculator,
  Atom,
  Brain,
  ArrowRight,
  Flame,
  CheckCircle,
  MessageSquare,
  FileText,
  Clock,
  CalendarDays,
  Target
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Recent activity data
const recentActivity = [
  { id: 1, title: 'Completed Algebra Practice', subtitle: 'Mathematics', time: '3 min ago', icon: '📐' },
  { id: 2, title: 'Asked a doubt in Physics', subtitle: 'Kinematics chapter', time: '15 min ago', icon: '❓' },
  { id: 3, title: 'Homework submitted', subtitle: 'Chemistry - Atoms', time: '1 hour ago', icon: '✅' },
  { id: 4, title: 'Completed Chapter Quiz', subtitle: 'Biology - Cells', time: '2 hours ago', icon: '🧪' },
  { id: 5, title: 'Watched video lesson', subtitle: 'Physics - Motion', time: '3 hours ago', icon: '▶️' },
  { id: 6, title: 'Practice session done', subtitle: 'Aptitude - Numbers', time: '5 hours ago', icon: '🔢' },
];

// Subject cards data
const subjects = [
  { 
    id: 1, 
    name: 'Mathematics', 
    icon: <Calculator className="w-8 h-8" />,
    color: 'bg-blue-50',
    iconColor: 'text-blue-500',
    progress: 65
  },
  { 
    id: 2, 
    name: 'Science', 
    icon: <Atom className="w-8 h-8" />,
    color: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    progress: 48
  },
  { 
    id: 3, 
    name: 'Aptitude', 
    icon: <Brain className="w-8 h-8" />,
    color: 'bg-purple-50',
    iconColor: 'text-purple-500',
    progress: 72
  },
];

const StudentHome = () => {
  const { user } = useAuth();

  return (
    <StudentDashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Main Grid - Planti Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Hero Row: Focus Card + Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              
              {/* Hero Card - Today's Focus (3/5 width) */}
              <Card className="md:col-span-3 relative overflow-hidden border-0 shadow-sm rounded-2xl bg-gradient-to-br from-primary via-primary to-purple-600 min-h-[200px]">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4 blur-xl" />
                
                <CardContent className="relative p-6 flex flex-col justify-between h-full">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                      Today's Focus
                    </h2>
                    <p className="text-white/80 text-sm md:text-base max-w-xs">
                      Your personalized learning plan for today
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-6">
                    <Button className="bg-white text-primary hover:bg-white/90 font-semibold rounded-xl shadow-md">
                      Start Today's Plan
                    </Button>
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl">
                      View Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card - My Stats (2/5 width) */}
              <Card className="md:col-span-2 relative overflow-hidden border-0 shadow-sm rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 min-h-[200px]">
                {/* Decorative top right curve */}
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/20 rounded-full" />
                
                <CardContent className="relative p-6 flex flex-col justify-between h-full">
                  <h3 className="text-lg font-bold text-gray-900">My Stats</h3>
                  
                  <div className="flex gap-6 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Today</p>
                      <p className="text-xl font-bold text-gray-900">2.5 hrs</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">This Week</p>
                      <p className="text-xl font-bold text-gray-900">12 hrs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-semibold text-gray-700">7 day streak</span>
                    </div>
                  </div>
                  
                  <button className="mt-4 flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors group">
                    Go to my progress
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </CardContent>
              </Card>
            </div>

            {/* My Learning Section - 3 Card Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">My Learning</h3>
                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors">
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                  <Card 
                    key={subject.id} 
                    className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-all duration-300 cursor-pointer group overflow-hidden"
                  >
                    <CardContent className="p-5">
                      <div className={`w-16 h-16 ${subject.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                        <span className={subject.iconColor}>{subject.icon}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900">{subject.name}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${subject.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{subject.progress}%</span>
                      </div>
                    </CardContent>
                    {/* Arrow indicator on hover */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Bottom Cards Row - Weekly Performance + Upcoming Tasks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Weekly Performance */}
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-900">Weekly Performance</h4>
                    <button className="text-xs text-gray-500 hover:text-primary flex items-center gap-1">
                      View All <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {['🎯', '📚', '✨'].map((emoji, i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white text-lg">
                          {emoji}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">85% accuracy</p>
                      <p className="text-xs text-gray-500">12 tasks completed • 7 days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Tasks */}
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-900">Upcoming Tasks</h4>
                    <button className="text-xs text-gray-500 hover:text-primary flex items-center gap-1">
                      View All <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {['📝', '📖', '🧮'].map((emoji, i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white text-lg">
                          {emoji}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">3 pending</p>
                      <p className="text-xs text-gray-500">Due today & tomorrow</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Activity Feed (1/3 width) */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm rounded-2xl h-full">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                  <button className="text-xs text-gray-500 hover:text-primary flex items-center gap-1">
                    View All <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div 
                      key={activity.id} 
                      className="flex items-start gap-3 group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-lg group-hover:bg-primary/10 transition-colors">
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate group-hover:text-primary transition-colors">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{activity.subtitle}</p>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentHome;
