import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Menu, 
  LogOut, 
  Bell,
  Search,
  Settings,
  HelpCircle,
  MessageSquare,
  SlidersHorizontal
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

  const firstName = user?.name?.split(' ')[0] || 'Admin';

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex font-sans w-full">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 flex-shrink-0 transition-all duration-300 overflow-hidden",
        collapsed ? "w-0" : "w-[16.25rem] max-w-[16.25rem]"
      )}>
        <AdminSidebar collapsed={collapsed} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[18rem] max-w-[85vw] p-0 border-0">
          <AdminSidebar isMobile onMobileClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar - matching student dashboard */}
        <header className="h-14 md:h-16 bg-white px-3 md:px-4 lg:px-6 flex items-center justify-between sticky top-0 z-10 flex-shrink-0 border-b border-gray-100 shadow-sm w-full">
          {/* Left: Menu + Page Title */}
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

            {/* Page Title */}
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">{pageTitle}</h1>
              {pageDescription && (
                <p className="text-xs text-gray-500">{pageDescription}</p>
              )}
            </div>
          </div>
          
          {/* Center: Search */}
          <div className="hidden lg:flex items-center flex-1 justify-center max-w-md mx-2 lg:mx-4">
            <div className="relative w-full max-w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search teachers, students, classes..." 
                className="pl-9 pr-10 w-full h-9 bg-gray-50 border-gray-200 rounded-lg text-sm focus-visible:ring-1 focus-visible:ring-primary/30"
              />
              <button className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors">
                <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          </div>
          
          {/* Right: Icons + Avatar */}
          <div className="flex items-center gap-1.5">
            {/* Support */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/admin/support')}
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

            {/* Header Actions */}
            {headerActions}

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
              <PopoverContent className="w-[15rem] max-w-[90vw] p-0 bg-white rounded-xl shadow-lg border-0" align="end">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-11 h-11 border-2 border-primary/20">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-semibold">
                        {firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{user?.name || 'Admin'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@eddge.com'}</p>
                      <p className="text-xs text-primary font-medium mt-0.5 capitalize">{user?.role || 'Administrator'}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button 
                    onClick={() => navigate('/admin/settings')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button 
                    onClick={() => navigate('/admin/support')}
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
        <main className="flex-1 p-3 md:p-4 lg:p-6 xl:p-8 overflow-y-auto w-full max-w-full">
          <div className="w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
