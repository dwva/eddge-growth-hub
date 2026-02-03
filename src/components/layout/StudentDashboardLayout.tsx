import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Menu, Bell, ChevronLeft, ChevronDown, Settings, LogOut, Search } from 'lucide-react';
import StudentSidebar from './StudentSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface StudentDashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

const StudentDashboardLayout = ({ children, title }: StudentDashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const firstName = user?.name?.split(' ')[0] || 'Alex';

  return (
    <div className="h-screen bg-background flex overflow-hidden font-sans">
      {/* Desktop Sidebar - Fixed width: 176px expanded, 56px collapsed */}
      <aside className={cn(
        "hidden md:flex flex-col transition-all duration-300 h-screen sticky top-0 flex-shrink-0 relative",
        collapsed ? "w-14" : "w-44"
      )}>
        <StudentSidebar collapsed={collapsed} />
        {/* Collapse Toggle - Positioned at 64px from top (below header) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-[72px] -right-3 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center shadow-md hover:bg-accent hover:scale-105 transition-all duration-200 z-10"
        >
          <ChevronLeft className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform duration-200", collapsed && "rotate-180")} />
        </button>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <StudentSidebar isMobile onMobileClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header - Fixed height: 64px, consistent with sidebar header */}
        <header className="h-16 border-b border-border bg-white px-4 md:px-6 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
          {/* Left: Menu + Search */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-10 w-10 flex items-center justify-center">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            
            {/* Desktop Hamburger - 40px touch target */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex h-10 w-10 items-center justify-center"
              onClick={() => setCollapsed(!collapsed)}
            >
              <Menu className="w-5 h-5 text-muted-foreground" />
            </Button>
            
            {/* Search Bar - Height: 40px, consistent border-radius */}
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-4 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search courses, lessons, resources..." 
                className="pl-10 w-72 lg:w-80 h-10 bg-muted/40 border-0 rounded-full text-sm focus-visible:ring-1 focus-visible:ring-primary/30"
              />
            </div>
          </div>
          
          {/* Right: Notification + Profile - 16px gap between elements */}
          <div className="flex items-center gap-4">
            {/* Notification - 40px touch target */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-10 w-10 flex items-center justify-center hover:bg-muted/50 transition-colors"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-destructive rounded-full text-[10px] text-white flex items-center justify-center font-semibold">3</span>
            </Button>

            {/* Profile Dropdown - Consistent height alignment */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-10 px-2 gap-3 rounded-full hover:bg-muted/50 flex items-center">
                  <Avatar className="w-8 h-8 border-2 border-primary/20">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                      {firstName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start justify-center">
                    <span className="text-sm font-medium leading-tight">{firstName}</span>
                    <span className="text-[11px] text-muted-foreground leading-tight">Class 9</span>
                  </div>
                  <ChevronDown className="hidden md:block w-4 h-4 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0 bg-white" align="end">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-primary/20">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{user?.name || 'Alex'}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email || 'student@eddge.com'}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2">Class 9 • CBSE Board</p>
                </div>
                <div className="p-2">
                  <button 
                    onClick={() => navigate('/student/settings')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        {/* Page Content - 24px padding on desktop, 16px on mobile */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-[#f8f9fc]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboardLayout;
