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

// Subject cards data

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
      <div className="w-full">
        {/* Main Grid - Full Width */}
        <div className="space-y-6">
          
          {/* Hero Row: Focus Card + Stats Card - BLEED LAYOUT (extends to container edges) */}
          <div className="-mx-6 md:-mx-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch px-0">
              
              {/* Hero Card - Today's Focus (7/12 width on desktop) */}
              <Card className="lg:col-span-7 relative overflow-hidden border-0 shadow-sm rounded-3xl bg-gradient-to-br from-primary via-primary to-purple-700">
                {/* Decorative elements - balanced, not distracting */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4" />
                <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full translate-y-1/2 translate-x-1/4" />
                
                <CardContent className="relative p-8 flex flex-col justify-between h-full min-h-[240px]">
                  {/* Top section - Title aligned to same baseline as My Stats */}
                  <div className="pt-2">
                    <h2 className="text-2xl font-bold text-white leading-tight">
                      Today's Focus
                    </h2>
                    <p className="text-white/70 text-sm mt-3 max-w-sm">
                      Your personalized learning plan for today
                    </p>
                  </div>
                  
                  {/* Bottom section - Buttons */}
                  <div className="flex gap-3 pt-6">
                    <Button className="bg-white text-primary hover:bg-white/90 font-semibold rounded-xl px-6 h-11 shadow-md">
                      Start Today's Plan
                    </Button>
                    <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-xl px-6 h-11 bg-transparent">
                      View Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card - My Stats (5/12 width on desktop) */}
              <Card className="lg:col-span-5 relative overflow-hidden border-0 shadow-sm rounded-3xl bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100">
                {/* Decorative elements - balanced */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-orange-200/50 rounded-full translate-y-1/3 translate-x-1/4" />
                
                <CardContent className="relative p-8 flex flex-col justify-between h-full min-h-[240px]">
                  {/* Top section - Title aligned with Today's Focus */}
                  <div className="pt-2">
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">My Stats</h3>
                    
                    {/* Stats row - evenly aligned */}
                    <div className="flex gap-10 mt-5">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Today</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">2.5 hrs</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">This Week</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">12 hrs</p>
                      </div>
                    </div>
                    
                    {/* Streak - aligned with stats content */}
                    <div className="flex items-center gap-1.5 mt-4">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-semibold text-gray-700">7 day streak</span>
                    </div>
                  </div>
                  
                  {/* Bottom section - CTA aligned with buttons baseline */}
                  <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors group pt-6">
                    Go to my progress
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </CardContent>
              </Card>
            </div>
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
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentHome;
