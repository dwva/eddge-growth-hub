import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Menu, Bell, User, Settings, LogOut, Search } from 'lucide-react';
import ParentSidebar from './ParentSidebar';
import { ChildProvider, useChild } from '@/contexts/ChildContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ParentDashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

const ParentDashboardLayoutInner = ({ children, title = "Parent Dashboard" }: ParentDashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { children: childrenList, selectedChild, setSelectedChild } = useChild();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleChildChange = (childId: string) => {
    const child = childrenList.find(c => c.id === childId);
    if (child) {
      setSelectedChild(child);
    }
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden font-sans">
      {/* Desktop Sidebar - Fixed */}
      <aside className={cn(
        "hidden md:flex flex-col transition-all duration-300 h-screen sticky top-0 flex-shrink-0 overflow-hidden",
        collapsed ? "w-0" : "w-56"
      )}>
        <ParentSidebar collapsed={collapsed} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <ParentSidebar isMobile onMobileClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header - Fixed */}
        <header className="h-14 border-b border-border bg-card px-4 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
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
              <Menu className="w-5 h-5 text-muted-foreground" />
            </Button>
            
            {/* Search Bar */}
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search progress, reports..." 
                className="pl-9 w-64 h-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>
          
          {/* Right Side: Notification + Profile */}
          <div className="flex items-center gap-3">
            {/* Child Switcher (Compact) */}
            {childrenList.length > 1 && (
              <Select value={selectedChild?.id} onValueChange={handleChildChange}>
                <SelectTrigger className="w-[140px] h-9 text-xs border-0 bg-muted/50">
                  <SelectValue placeholder="Select child" />
                </SelectTrigger>
                <SelectContent>
                  {childrenList.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      <div className="flex items-center gap-2">
                        <span>{child.avatar}</span>
                        <span className="text-xs">{child.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-primary/10 hover:text-primary transition-all duration-200 h-9 w-9"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-destructive rounded-full text-[10px] text-white flex items-center justify-center font-medium">3</span>
            </Button>

            {/* Profile Dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-9 px-2 gap-2 rounded-full hover:bg-muted/50">
                  <Avatar className="w-8 h-8 border border-primary/20">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                      {user?.name?.charAt(0) || 'P'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-xs font-medium">{user?.name || 'Parent'}</span>
                    <span className="text-[10px] text-muted-foreground">{selectedChild?.class || 'Parent'}</span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="end">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-primary/20">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.name?.charAt(0) || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user?.name || 'Parent'}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email || 'parent@eddge.com'}</p>
                    </div>
                  </div>
                  {selectedChild && (
                    <p className="text-[10px] text-muted-foreground mt-2 px-1">
                      Viewing: {selectedChild.name} • {selectedChild.class}
                    </p>
                  )}
                </div>
                <div className="p-2">
                  <button 
                    onClick={() => navigate('/parent/settings')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        {/* Page Content - Scrollable */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
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
