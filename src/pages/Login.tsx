import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithJWT } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use JWT flow for SuperAdmin
      const isSuperAdmin = email.toLowerCase() === 'superadmin@eddge.com';
      
      if (isSuperAdmin) {
        // Use JWT authentication for SuperAdmin
        const result = await loginWithJWT(email, password, 'ROOT');
        
        if (result.success && result.redirectTo) {
          toast({
            title: 'Welcome back!',
            description: 'Login successful. Redirecting to SuperAdmin dashboard...',
          });
          navigate(result.redirectTo);
        } else {
          toast({
            title: 'Login failed',
            description: result.error || 'Please check your credentials',
            variant: 'destructive',
          });
        }
      } else {
        // Use regular login for other roles
        const result = await login(email, password);
        
        if (result.success && result.redirectTo) {
          toast({
            title: 'Welcome back!',
            description: 'Login successful. Redirecting to your dashboard...',
          });
          navigate(result.redirectTo);
        } else {
          toast({
            title: 'Login failed',
            description: result.error || 'Please check your credentials',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    { role: 'Student', email: 'student@eddge.com', password: 'student123' },
    { role: 'Teacher', email: 'teacher@eddge.com', password: 'teacher123' },
    { role: 'Parent', email: 'parent@eddge.com', password: 'parent123' },
    { role: 'Admin', email: 'admin@eddge.com', password: 'admin123' },
    { role: 'Super Admin', email: 'superadmin@eddge.com', password: 'super123' },
  ];

  const fillCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-background flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 md:px-6 py-6 md:py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6 md:mb-8">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl gradient-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <span className="text-2xl md:text-3xl font-bold text-gradient">EDDGE</span>
          </div>

          {/* Login Card */}
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-3 md:pb-4 p-4 md:p-6">
              <CardTitle className="text-xl md:text-2xl">Welcome Back</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Sign in with your credentials to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                <div className="space-y-1.5 md:space-y-2">
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10 md:h-11 text-sm"
                  />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <Label htmlFor="password" className="text-sm">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-10 md:h-11 pr-10 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-10 md:h-11 font-semibold text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t">
                <p className="text-xs md:text-sm text-muted-foreground text-center mb-2 md:mb-3">
                  Demo Credentials (click to fill)
                </p>
                <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                  {demoCredentials.map((cred) => (
                    <button
                      key={cred.role}
                      onClick={() => fillCredentials(cred.email, cred.password)}
                      className="text-[10px] md:text-xs px-2 md:px-3 py-1.5 md:py-2 rounded-lg bg-secondary hover:bg-accent transition-colors text-left"
                    >
                      <span className="font-medium text-foreground">{cred.role}</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Login;
