import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Menu, Bell, ChevronLeft, User, Settings, LogOut } from 'lucide-react';
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
        "hidden md:flex flex-col transition-all duration-300 h-screen sticky top-0 flex-shrink-0 relative",
        collapsed ? "w-12" : "w-48"
      )}>
        <ParentSidebar collapsed={collapsed} />
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-16 -right-3 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center shadow-md hover:bg-accent hover:scale-110 transition-all duration-200 z-10"
        >
          <ChevronLeft className={cn("w-4 h-4 text-muted-foreground transition-transform duration-200", collapsed && "rotate-180")} />
        </button>
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
            
            {/* Child Switcher */}
            {childrenList.length > 1 ? (
              <Select value={selectedChild?.id} onValueChange={handleChildChange}>
                <SelectTrigger className="w-[160px] h-9 text-sm">
                  <SelectValue placeholder="Select child" />
                </SelectTrigger>
                <SelectContent>
                  {childrenList.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      <div className="flex items-center gap-2">
                        <span>{child.avatar}</span>
                        <span>{child.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : selectedChild ? (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-lg">{selectedChild.avatar}</span>
                <div>
                  <p className="font-medium text-sm">{selectedChild.name}</p>
                  <p className="text-[10px] text-muted-foreground">{selectedChild.class}</p>
                </div>
              </div>
            ) : null}
          </div>
          
          {/* Right Side: Notification + Profile */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-primary/10 hover:text-primary transition-all duration-200 h-9 w-9"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"></span>
            </Button>

            {/* Profile Dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Avatar className="w-8 h-8 border border-border">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="end">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-border">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user?.name || 'Parent'}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email || 'parent@eddge.com'}</p>
                    </div>
                  </div>
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
