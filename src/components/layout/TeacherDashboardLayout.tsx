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
  HelpCircle
} from 'lucide-react';

interface TeacherDashboardLayoutProps {
  children: ReactNode;
}

const ModeToggle = () => {
  const { currentMode, setCurrentMode } = useTeacherMode();

  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      <Button
        variant={currentMode === 'class_teacher' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setCurrentMode('class_teacher')}
        className="gap-2 h-8 text-xs"
      >
        <Users className="w-3.5 h-3.5" />
        Class Teacher
      </Button>
      <Button
        variant={currentMode === 'subject_teacher' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setCurrentMode('subject_teacher')}
        className="gap-2 h-8 text-xs"
      >
        <BookOpen className="w-3.5 h-3.5" />
        Subject Teacher
      </Button>
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
        "hidden md:flex flex-col h-screen sticky top-0 flex-shrink-0 transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[260px]"
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
        {/* Top Bar */}
        <header className="h-16 bg-white px-4 md:px-6 flex items-center justify-between sticky top-0 z-10 flex-shrink-0 border-b border-gray-100">
          {/* Left: Menu + Mode Toggle */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            
            {/* Desktop Collapse Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex h-9 w-9"
              onClick={() => setCollapsed(!collapsed)}
            >
              <Menu className="w-5 h-5 text-gray-500" />
            </Button>

            {/* Mode Toggle - Desktop */}
            <div className="hidden lg:block">
              <ModeToggle />
            </div>
          </div>

          {/* Mobile Mode Toggle */}
          <div className="lg:hidden flex items-center">
            <ModeToggle />
          </div>
          
          {/* Right: Icons + Avatar */}
          <div className="flex items-center gap-1.5">
            {/* Support */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/teacher/support')}
              className="hidden sm:flex items-center gap-1.5 h-9 px-3 hover:bg-gray-100 rounded-lg"
            >
              <HelpCircle className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Support</span>
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
                <button className="ml-1">
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
