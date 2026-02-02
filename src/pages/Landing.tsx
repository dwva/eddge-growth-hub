import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Sparkles, Users, Brain } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-primary relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">EDDGE</span>
            </div>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-white text-primary hover:bg-white/90 font-semibold px-6"
            >
              Sign In
            </Button>
          </div>
        </header>

        {/* Main Hero Content */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white/90 text-sm font-medium">AI-Powered Learning Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Your AI-Powered
              <br />
              <span className="text-white/90">Education Operating System</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Personalized learning journeys for students, powerful tools for teachers, 
              and real-time insights for parents and administrators. All in one platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                onClick={() => navigate('/login')}
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-black/10"
              >
                Get Started
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-xl"
              >
                Learn More
              </Button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-3">
                <Brain className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Adaptive Learning</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-3">
                <Users className="w-5 h-5 text-white" />
                <span className="text-white font-medium">5 Role-Based Dashboards</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-3">
                <Sparkles className="w-5 h-5 text-white" />
                <span className="text-white font-medium">AI Learning Companion</span>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full px-6 py-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-white/60 text-sm">
              © 2026 EDDGE. Empowering Education Through AI.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
