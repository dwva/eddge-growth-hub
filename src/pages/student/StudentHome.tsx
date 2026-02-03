import { useState } from 'react';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Flame,
  Zap,
  Trophy,
  Mountain,
  ClipboardCheck,
  MessageSquare,
  Bell,
  Award,
  Plus,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const StudentHome = () => {
  const { user } = useAuth();
  const [notes] = useState([
    { id: 1, content: 'ugu', date: 'Jan 29' }
  ]);

  return (
    <StudentDashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Hero Section - General Focus */}
        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[hsl(280,70%,55%)]" />
          {/* Mountain shapes in background */}
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-20">
            <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="xMaxYMax slice">
              <path d="M200 200 L280 80 L320 120 L380 40 L400 60 L400 200 Z" fill="white" fillOpacity="0.3" />
              <path d="M250 200 L320 100 L360 140 L400 80 L400 200 Z" fill="white" fillOpacity="0.2" />
            </svg>
          </div>
          
          <CardContent className="relative p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'serif' }}>
              General Focus
            </h1>
            <div className="flex items-center gap-2 text-white/90 mb-6">
              <Mountain className="w-5 h-5" />
              <span className="text-base">40 Days to Summit</span>
            </div>

            {/* Today's Mission */}
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-300">🎯</span>
                <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">Today's Mission</span>
              </div>
              <p className="text-white text-base">
                Review General concepts • Practice General problems
              </p>
            </div>

            {/* CTA and Stats Row */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Button 
                className="bg-white text-primary hover:bg-white/90 font-semibold px-6 py-2.5 rounded-xl shadow-md"
              >
                <Zap className="w-4 h-4 mr-2" />
                Start Today's Plan
              </Button>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Flame className="w-4 h-4 text-orange-300" />
                  <span className="text-white font-medium">7 day</span>
                  <span className="text-white/70 text-sm">streak</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span className="text-white font-medium">+120</span>
                  <span className="text-white/70 text-sm">XP</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Trophy className="w-4 h-4 text-yellow-300" />
                  <span className="text-white font-medium">Rank</span>
                  <span className="text-white/70 text-sm">#5</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress to Peak */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="font-medium text-foreground">Progress to Peak</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-green-600 font-medium">0% Complete</span>
              <span className="text-muted-foreground">(Base Camp)</span>
            </div>
          </div>
          <Progress value={0} className="h-2 bg-muted" />
          <p className="text-center text-sm text-muted-foreground">
            Click to see your journey checkpoint
          </p>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Quick Actions</h2>
            <span className="text-sm text-muted-foreground">Quick access</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: ClipboardCheck, label: 'Homework', color: 'text-muted-foreground' },
              { icon: MessageSquare, label: 'Doubt', color: 'text-primary', active: true },
              { icon: Bell, label: 'Updates', color: 'text-muted-foreground' },
              { icon: Award, label: 'Achievements', color: 'text-muted-foreground' },
            ].map((action, idx) => (
              <Card 
                key={idx} 
                className={`cursor-pointer hover:shadow-lg transition-all duration-200 border-2 ${
                  action.active ? 'border-primary/30 bg-white' : 'border-transparent bg-white hover:border-border'
                }`}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <action.icon className={`w-7 h-7 mb-3 ${action.color}`} />
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Notes */}
        <Card className="border bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Quick Notes</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10">
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="py-2">
                  <p className="text-sm text-foreground">{note.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{note.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Your Next Step */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-2">Your Next Step</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Based on recent tests and practice accuracy
          </p>
          <Card className="border bg-white">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[120px]">
              <BookOpen className="w-12 h-12 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">
                AI recommendations will appear here based on your learning progress
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentHome;
