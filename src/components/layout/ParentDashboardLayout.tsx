import { ReactNode, useState, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu, Bell, MessageSquare, Settings, LogOut, HelpCircle } from 'lucide-react';
import ParentSidebar from './ParentSidebar';
import { ChildProvider, useChild } from '@/contexts/ChildContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ParentDashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

// Context for sharing collapsed state
const ParentLayoutContext = createContext<{
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}>({
  collapsed: false,
  setCollapsed: () => {},
});

export const useParentLayout = () => useContext(ParentLayoutContext);

const ParentDashboardLayoutInner = ({ children, title = "Parent Dashboard" }: ParentDashboardLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const firstName = user?.name?.split(' ')[0] || 'Parent';

  return (
    <ParentLayoutContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="min-h-screen flex w-full bg-[#f8f9fc] font-sans">
        {/* Desktop Sidebar */}
        <aside className={cn(
          "hidden md:flex flex-col h-screen sticky top-0 flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden",
          collapsed ? "w-0" : "w-[260px]"
        )}>
          <ParentSidebar collapsed={collapsed} onCollapseChange={setCollapsed} />
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-72 p-0 border-0">
            <ParentSidebar isMobile onMobileClose={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="h-20 bg-white px-6 md:px-8 flex items-center justify-between sticky top-0 z-50 flex-shrink-0 border-b border-gray-100 shadow-sm">
            {/* Left: Menu + Welcome */}
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
            </div>
            
          {/* Right: Help Center + Icons + Avatar */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Help Center - Desktop only */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/parent/support')}
              className="hidden md:flex items-center gap-1.5 h-9 px-3 hover:bg-gray-100 rounded-lg"
            >
              <HelpCircle className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-600">Support</span>
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

              {/* Avatar with Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="ml-2">
                    <Avatar className="w-9 h-9 border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
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
                        <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-semibold">
                          {firstName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{user?.name || 'Parent'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email || 'parent@eddge.com'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => navigate('/parent/settings')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <button 
                      onClick={() => navigate('/parent/support')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
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

          {/* Content Area - Full width when sidebar is hidden */}
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ParentLayoutContext.Provider>
  );
};

const ParentDashboardLayout = ({ children, title }: ParentDashboardLayoutProps) => {
  return (
    <LanguageProvider>
      <ChildProvider>
        <ParentDashboardLayoutInner title={title}>
          {children}
        </ParentDashboardLayoutInner>
      </ChildProvider>
    </LanguageProvider>
  );
};

export default ParentDashboardLayout;