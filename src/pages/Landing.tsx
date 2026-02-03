import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Sparkles, ArrowRight } from 'lucide-react';
import { GLSLHills } from '@/components/ui/glsl-hills';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-sans relative overflow-hidden">
      {/* GLSL Hills Background */}
      <GLSLHills 
        speed={0.3} 
        cameraZ={130}
        color={{ r: 0.55, g: 0.36, b: 0.86 }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background pointer-events-none" />

      {/* Hero Section - Full Center */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
            <span className="text-3xl font-semibold tracking-tight text-foreground">EDDGE</span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 text-sm font-medium rounded-full bg-primary/10 text-primary backdrop-blur-sm">
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

        </div>
      </section>
    </div>
  );
};

export default Landing;
