import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, Bell, MessageSquare, Settings, LogOut } from 'lucide-react';
import InternalAdminSidebar from './InternalAdminSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface InternalAdminDashboardLayoutProps {
  children: ReactNode;
}

const InternalAdminDashboardLayout = ({ children }: InternalAdminDashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const firstName = user?.name?.split(' ')[0] || 'Admin';

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex font-sans">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 flex-shrink-0 transition-all duration-300 overflow-hidden",
        collapsed ? "w-0" : "w-[16.25rem] max-w-[16.25rem]"
      )}>
        <InternalAdminSidebar collapsed={collapsed} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[18rem] max-w-[85vw] p-0 border-0">
          <InternalAdminSidebar isMobile onMobileClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 md:h-20 bg-white px-3 md:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-10 flex-shrink-0 border-b border-gray-100 shadow-sm">
          {/* Left: Welcome Text */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                  <Menu className="w-4 h-4 md:w-5 md:h-5" />
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

            {/* Welcome Text */}
            <div className="hidden sm:block">
              <h1 className="text-base md:text-xl lg:text-2xl font-bold text-gray-900">Internal Admin</h1>
              <p className="text-xs md:text-sm text-gray-500">EDDGE Platform Management</p>
            </div>
          </div>
          
          {/* Right: Icons + Avatar */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Messages */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 md:h-10 md:w-10 hover:bg-gray-100 rounded-xl"
            >
              <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
            </Button>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-8 w-8 md:h-10 md:w-10 hover:bg-gray-100 rounded-xl"
            >
              <Bell className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
              <span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* Avatar */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="ml-1 md:ml-2">
                  <Avatar className="w-8 h-8 md:w-10 md:h-10 border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-semibold">
                      {firstName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[16rem] max-w-[90vw] p-0 bg-white rounded-xl shadow-lg border-0" align="end">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border-2 border-primary/20">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-semibold text-lg">
                        {firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{user?.name || 'Admin User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@eddge.com'}</p>
                      <p className="text-xs text-primary font-medium mt-0.5">Internal Admin</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button 
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
        <main className="flex-1 p-3 md:p-6 lg:p-8 overflow-y-auto w-full max-w-full">
          <div className="w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default InternalAdminDashboardLayout;
