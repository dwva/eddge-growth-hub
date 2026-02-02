import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Sparkles, Users, Brain, ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Landing = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="overflow-x-hidden bg-background">
      {/* Header */}
      <header className="relative py-4 md:py-6">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="#" className="flex items-center gap-2 rounded outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-foreground">EDDGE</span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-10">
              <a href="#" className="text-base font-medium text-muted-foreground transition-all duration-200 hover:text-primary">Features</a>
              <a href="#" className="text-base font-medium text-muted-foreground transition-all duration-200 hover:text-primary">About</a>
              <a href="#" className="text-base font-medium text-muted-foreground transition-all duration-200 hover:text-primary">Pricing</a>
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex lg:items-center lg:space-x-4">
              <Button 
                variant="ghost"
                onClick={() => navigate('/login')}
                className="text-base font-medium"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/login')}
                className="gradient-primary text-base font-medium px-6"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 py-4 border-t border-border">
              <div className="flex flex-col space-y-4">
                <a href="#" className="text-base font-medium text-muted-foreground hover:text-primary">Features</a>
                <a href="#" className="text-base font-medium text-muted-foreground hover:text-primary">About</a>
                <a href="#" className="text-base font-medium text-muted-foreground hover:text-primary">Pricing</a>
                <div className="pt-4 flex flex-col gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/login')}
                    className="w-full"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => navigate('/login')}
                    className="w-full gradient-primary"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:pt-20 lg:pb-36">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-y-8 lg:items-center lg:grid-cols-2 sm:gap-y-20 xl:grid-cols-5">
            {/* Left Content */}
            <div className="text-center xl:col-span-2 lg:text-left md:px-16 lg:px-0">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium rounded-full bg-primary/10 text-primary">
                <Sparkles className="w-4 h-4" />
                AI-Powered Learning Platform
              </div>

              {/* Headline */}
              <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight">
                Your AI-Powered
                <span className="relative inline-block mx-2">
                  <span className="relative z-10 text-primary">Education</span>
                </span>
                Operating System
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl leading-relaxed">
                Personalized learning journeys for students, powerful tools for teachers, 
                and real-time insights for parents and administrators. All in one platform.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center lg:justify-start">
                <Button 
                  onClick={() => navigate('/login')}
                  size="lg"
                  className="gradient-primary font-semibold px-8 py-6 text-lg rounded-xl shadow-lg"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="font-semibold px-8 py-6 text-lg rounded-xl"
                >
                  Watch Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
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

            {/* Right Illustration */}
            <div className="xl:col-span-3">
              <img 
                className="object-cover object-top w-full h-auto mx-auto scale-110 2xl:max-w-screen-2xl xl:scale-100" 
                src="https://d33wubrfki0l68.cloudfront.net/54780decfb9574945bc873b582cdc6156144a2ba/d9fa1/images/hero/4/illustration.png" 
                alt="EDDGE Platform Illustration" 
              />
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
