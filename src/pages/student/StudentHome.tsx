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
      {/* Max width container with consistent horizontal centering */}
      <div className="w-full space-y-6">
        
        {/* Hero Section - General Focus */}
        <Card className="relative overflow-hidden border-0 shadow-lg rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[hsl(280,70%,55%)]" />
          {/* Mountain shapes in background */}
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-20">
            <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="xMaxYMax slice">
              <path d="M200 200 L280 80 L320 120 L380 40 L400 60 L400 200 Z" fill="white" fillOpacity="0.3" />
              <path d="M250 200 L320 100 L360 140 L400 80 L400 200 Z" fill="white" fillOpacity="0.2" />
            </svg>
          </div>
          
          {/* Card Content - 32px padding */}
          <CardContent className="relative p-8">
            {/* Title - Serif font for elegance */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              General Focus
            </h1>
            
            {/* Subtitle - 8px margin top */}
            <div className="flex items-center gap-2 text-white/90 mb-6">
              <Mountain className="w-5 h-5" />
              <span className="text-base">40 Days to Summit</span>
            </div>

            {/* Today's Mission - 24px margin bottom */}
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">🎯</span>
                <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">Today's Mission</span>
              </div>
              <p className="text-white text-base">
                Review General concepts • Practice General problems
              </p>
            </div>

            {/* CTA and Stats Row - Flex with space-between */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Button 
                className="bg-white text-primary hover:bg-white/90 font-semibold h-11 px-6 rounded-xl shadow-md"
              >
                <Zap className="w-4 h-4 mr-2" />
                Start Today's Plan
              </Button>

              {/* Stats - 12px gap between pills */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full h-10 px-4">
                  <Flame className="w-4 h-4 text-orange-300" />
                  <span className="text-white font-medium text-sm">7 day</span>
                  <span className="text-white/70 text-sm">streak</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full h-10 px-4">
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span className="text-white font-medium text-sm">+120</span>
                  <span className="text-white/70 text-sm">XP</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full h-10 px-4">
                  <Trophy className="w-4 h-4 text-yellow-300" />
                  <span className="text-white font-medium text-sm">Rank</span>
                  <span className="text-white/70 text-sm">#5</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress to Peak - 24px vertical spacing */}
        <div className="space-y-2">
          {/* Header row - aligned on same baseline */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-foreground">Progress to Peak</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-green-600 font-medium">0% Complete</span>
              <span className="text-sm text-muted-foreground">(Base Camp)</span>
            </div>
          </div>
          {/* Progress bar - 8px height */}
          <Progress value={0} className="h-2 bg-muted" />
          {/* Helper text - centered */}
          <p className="text-center text-sm text-muted-foreground pt-1">
            Click to see your journey checkpoint
          </p>
        </div>

        {/* Quick Actions Section - 24px top margin */}
        <div>
          {/* Section header - baseline aligned */}
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Quick Actions</h2>
            <span className="text-sm text-muted-foreground">Quick access</span>
          </div>
          
          {/* Cards grid - 16px gap */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: ClipboardCheck, label: 'Homework', active: false },
              { icon: MessageSquare, label: 'Doubt', active: true },
              { icon: Bell, label: 'Updates', active: false },
              { icon: Award, label: 'Achievements', active: false },
            ].map((action, idx) => (
              <Card 
                key={idx} 
                className={`cursor-pointer hover:shadow-lg transition-all duration-200 rounded-xl ${
                  action.active ? 'border-2 border-primary/40 bg-white' : 'border border-border bg-white hover:border-primary/20'
                }`}
              >
                {/* Card content - 24px padding, centered content */}
                <CardContent className="p-6 flex flex-col items-center justify-center text-center min-h-[120px]">
                  <action.icon className={`w-7 h-7 mb-3 ${action.active ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Notes - 24px top margin */}
        <Card className="border border-border bg-white rounded-xl">
          <CardContent className="p-6">
            {/* Header - vertically centered, baseline aligned */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Quick Notes</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10">
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            {/* Notes list */}
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

        {/* Your Next Step - 24px top margin */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Your Next Step</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Based on recent tests and practice accuracy
          </p>
          <Card className="border border-border bg-white rounded-xl">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[120px]">
              <BookOpen className="w-12 h-12 text-muted-foreground/30 mb-3" />
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
