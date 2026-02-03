import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Menu, Bell, MessageSquare, Settings, LogOut, Search, SlidersHorizontal } from 'lucide-react';
import StudentSidebar from './StudentSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface StudentDashboardLayoutProps {
  children: ReactNode;
  title?: string; // Optional, kept for backward compatibility
}

const StudentDashboardLayout = ({ children }: StudentDashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const firstName = user?.name?.split(' ')[0] || 'Student';

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex font-sans">
      {/* Desktop Sidebar - Fixed, Slim - Planti style */}
      <aside className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 flex-shrink-0 transition-all duration-300 overflow-hidden",
        collapsed ? "w-0" : "w-[260px]"
      )}>
        <StudentSidebar collapsed={collapsed} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0 border-0">
          <StudentSidebar isMobile onMobileClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar - Planti style */}
        <header className="h-20 bg-white px-6 md:px-8 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
          {/* Left: Welcome Text */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            
            {/* Desktop Collapse Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex h-10 w-10"
              onClick={() => setCollapsed(!collapsed)}
            >
              <Menu className="w-5 h-5 text-gray-500" />
            </Button>

            {/* Welcome Text - Planti style */}
            <div className="hidden sm:block">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Welcome to EDDGE.</h1>
              <p className="text-sm text-gray-500">Hello {firstName}, welcome back!</p>
            </div>
          </div>
          
          {/* Center: Search Bar - Planti style */}
          <div className="hidden lg:flex items-center flex-1 justify-center max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search lessons, topics, doubts..." 
                className="pl-10 pr-12 w-full h-11 bg-gray-50 border-gray-200 rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-primary/30"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          
          {/* Right: Icons + Avatar - Planti style */}
          <div className="flex items-center gap-2">
            {/* Messages */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 hover:bg-gray-100 rounded-xl"
            >
              <MessageSquare className="w-5 h-5 text-gray-500" />
            </Button>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-10 w-10 hover:bg-gray-100 rounded-xl"
            >
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* Avatar - Planti style (larger, no dropdown visible) */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="ml-2">
                  <Avatar className="w-10 h-10 border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-semibold">
                      {firstName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0 bg-white rounded-xl shadow-lg border-0" align="end">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border-2 border-primary/20">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-semibold text-lg">
                        {firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{user?.name || 'Student'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || 'student@eddge.com'}</p>
                      <p className="text-xs text-primary font-medium mt-0.5">Class 9 • CBSE</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button 
                    onClick={() => navigate('/student/settings')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-red-50 transition-colors text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboardLayout;
