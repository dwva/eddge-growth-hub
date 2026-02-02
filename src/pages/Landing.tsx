import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Sparkles, Users, Brain, ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Hero Section - Full Center */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
            <span className="text-3xl font-semibold tracking-tight text-foreground">EDDGE</span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 text-sm font-medium rounded-full bg-primary/10 text-primary">
            <Sparkles className="w-4 h-4" />
            AI-Powered Learning Platform
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl tracking-tight">
            Your AI-Powered
            <span className="block text-primary mt-2">Education Operating System</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-8 text-lg text-muted-foreground sm:text-xl leading-relaxed max-w-2xl mx-auto">
            Personalized learning journeys for students, powerful tools for teachers, 
            and real-time insights for parents and administrators. All in one platform.
          </p>

          {/* CTA Button */}
          <div className="mt-12">
            <Button 
              onClick={() => navigate('/login')}
              size="lg"
              className="gradient-primary font-semibold px-10 py-7 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>10,000+ Students</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>500+ Schools</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>98% Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Why Choose EDDGE?</h2>
            <p className="mt-4 text-lg text-muted-foreground">Empowering education through intelligent technology</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-card rounded-2xl border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Adaptive Learning</h3>
              <p className="text-muted-foreground">AI-powered system that adapts to each student's learning pace and style.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-card rounded-2xl border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">5 Role-Based Dashboards</h3>
              <p className="text-muted-foreground">Tailored experiences for students, teachers, parents, admins, and super admins.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-card rounded-2xl border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">AI Learning Companion</h3>
              <p className="text-muted-foreground">Personal AI assistant to help with doubts, practice, and progress tracking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">EDDGE</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 EDDGE. Empowering Education Through AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
