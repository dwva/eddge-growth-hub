import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Menu, 
  LogOut, 
  ChevronLeft,
  Bell,
  Search,
  Settings,
  User,
  HelpCircle
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import AdminSidebar from './AdminSidebar';

interface AdminDashboardLayoutProps {
  children: ReactNode;
  pageTitle: string;
  pageDescription?: string;
  headerActions?: ReactNode;
}

const AdminDashboardLayout = ({ 
  children, 
  pageTitle, 
  pageDescription,
  headerActions 
}: AdminDashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 flex-shrink-0 transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}>
        <AdminSidebar collapsed={collapsed} />
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-16 -right-3 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 hover:scale-110 transition-all duration-200 z-10"
        >
          <ChevronLeft className={cn("w-3.5 h-3.5 text-gray-600 transition-transform duration-200", collapsed && "rotate-180")} />
        </button>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0 border-0">
          <AdminSidebar isMobile onMobileClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
          <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Trigger */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="flex-shrink-0 h-8 w-8">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
              </Sheet>
              
              {/* Page Title */}
              <div>
                <h1 className="text-sm font-semibold text-foreground">{pageTitle}</h1>
                {pageDescription && (
                  <p className="text-xs text-muted-foreground">{pageDescription}</p>
                )}
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Search - Desktop */}
              <div className="relative hidden lg:block">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input 
                  placeholder="Search..."
                  className="pl-8 pr-3 py-1.5 w-48 h-8 text-xs bg-muted/50 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Support Button */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/admin/support')}
                className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-lg hover:bg-muted text-xs"
              >
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Support</span>
              </Button>

              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative rounded-lg hover:bg-muted h-8 w-8"
              >
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full"></span>
              </Button>

              {/* Header Actions */}
              {headerActions}

              {/* User Menu */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-muted rounded-lg h-8">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                        {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AD'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <div className="text-xs font-medium">{user?.name}</div>
                      <div className="text-[10px] text-muted-foreground capitalize">{user?.role}</div>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-1.5" align="end">
                  <div className="space-y-0.5">
                    <button className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md hover:bg-muted transition-colors">
                      <User className="w-3.5 h-3.5" />
                      Profile
                    </button>
                    <button 
                      onClick={() => navigate('/admin/settings')}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md hover:bg-muted transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Settings
                    </button>
                    <hr className="my-1" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-5 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
