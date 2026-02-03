import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { TeacherModeProvider, useTeacherMode } from '@/contexts/TeacherModeContext';
import TeacherSidebar from './TeacherSidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  Menu, 
  Bell, 
  MessageSquare, 
  Settings, 
  LogOut, 
  HelpCircle,
  Search,
  SlidersHorizontal
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TeacherDashboardLayoutProps {
  children: ReactNode;
}

const ModeToggle = () => {
  const { currentMode, setCurrentMode } = useTeacherMode();

  return (
    <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-0.5">
      <button
        onClick={() => setCurrentMode('class_teacher')}
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200",
          currentMode === 'class_teacher'
            ? "bg-primary text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-50"
        )}
      >
        <Users className="w-3.5 h-3.5" />
        <span>Class Teacher</span>
      </button>
      <button
        onClick={() => setCurrentMode('subject_teacher')}
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200",
          currentMode === 'subject_teacher'
            ? "bg-primary text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-50"
        )}
      >
        <BookOpen className="w-3.5 h-3.5" />
        <span>Subject Teacher</span>
      </button>
    </div>
  );
};

const TeacherDashboardContent = ({ children }: TeacherDashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const firstName = user?.name?.split(' ')[0] || 'Teacher';

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex font-sans">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 flex-shrink-0 transition-all duration-300 overflow-hidden",
        collapsed ? "w-0" : "w-[260px]"
      )}>
        <TeacherSidebar collapsed={collapsed} onCollapseChange={setCollapsed} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0 border-0">
          <TeacherSidebar isMobile onMobileClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar - matching dashboard layout (Student/Planti style) */}
        <header className="h-20 bg-white px-6 md:px-8 flex items-center justify-between sticky top-0 z-10 flex-shrink-0 border-b border-gray-100">
          {/* Left: Menu + Welcome + Mode Toggle */}
          <div className="flex items-center gap-4">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
            </Sheet>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex h-9 w-9"
              onClick={() => setCollapsed(!collapsed)}
            >
              <Menu className="w-4 h-4 text-gray-500" />
            </Button>
            <div className="hidden sm:block">
              <h1 className="text-base font-semibold text-gray-900">Welcome to EDDGE.</h1>
              <p className="text-[11px] text-gray-500">Hello {firstName}, welcome back!</p>
            </div>
            <ModeToggle />
          </div>

          {/* Center: Search Bar */}
          <div className="hidden lg:flex items-center flex-1 justify-center max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search students, classes, messages..." 
                className="pl-10 pr-12 w-full h-11 bg-gray-50 border-gray-200 rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-primary/30"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          
          {/* Right: Icons + Avatar */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Support */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/teacher/support')}
              className="hidden sm:flex items-center gap-1 h-8 px-2.5 text-xs hover:bg-gray-100 rounded-lg"
            >
              <HelpCircle className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-xs text-gray-600">Support</span>
            </Button>

            {/* Messages */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 hover:bg-gray-100 rounded-lg"
            >
              <MessageSquare className="w-4 h-4 text-gray-500" />
            </Button>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-9 w-9 hover:bg-gray-100 rounded-lg"
            >
              <Bell className="w-4 h-4 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* Avatar */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="ml-2">
                  <Avatar className="w-9 h-9 border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-semibold text-sm">
                      {firstName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-0 bg-white rounded-xl shadow-lg border-0" align="end">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-11 h-11 border-2 border-primary/20">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-semibold">
                        {firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{user?.name || 'Teacher'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || 'teacher@eddge.com'}</p>
                      <p className="text-xs text-primary font-medium mt-0.5">Mathematics • Grade 9-10</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button 
                    onClick={() => navigate('/teacher/settings')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button 
                    onClick={() => navigate('/teacher/support')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-gray-50 transition-colors text-gray-700 sm:hidden"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Support
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

const TeacherDashboardLayout = ({ children }: TeacherDashboardLayoutProps) => {
  return (
    <TeacherModeProvider>
      <TeacherDashboardContent>{children}</TeacherDashboardContent>
    </TeacherModeProvider>
  );
};

export default TeacherDashboardLayout;
