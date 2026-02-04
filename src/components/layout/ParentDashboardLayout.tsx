import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Menu, Search, Mail, Bell } from 'lucide-react';
import ParentSidebar from './ParentSidebar';
import { ChildProvider, useChild } from '@/contexts/ChildContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ParentDashboardLayoutProps {
  children: ReactNode;
  rightSidebar?: ReactNode;
  title?: string;
}

const ParentDashboardLayoutInner = ({ children, rightSidebar, title = "Parent Dashboard" }: ParentDashboardLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const { selectedChild } = useChild();

  return (
    <div className="h-screen bg-[#f8f9fc] flex overflow-hidden font-sans">
      {/* Desktop Sidebar - Fixed */}
      <aside className="hidden md:flex flex-col w-56 h-screen sticky top-0 flex-shrink-0 overflow-hidden bg-white border-r border-gray-100">
        <ParentSidebar />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <ParentSidebar isMobile onMobileClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar with Search */}
        <header className="h-16 px-6 flex items-center justify-between sticky top-0 z-10 flex-shrink-0 bg-[#f8f9fc]">
          <div className="flex items-center gap-4 flex-1">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            
            {/* Search Bar - Centered like in the design */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Search your child's progress..." 
                  className="pl-11 h-11 bg-white border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
                />
              </div>
            </div>
          </div>
          
          {/* Right Side: Icons + Profile */}
          <div className="flex items-center gap-2 ml-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-xl bg-white shadow-sm border border-gray-100 hover:bg-gray-50"
            >
              <Mail className="w-5 h-5 text-gray-500" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-10 w-10 rounded-xl bg-white shadow-sm border border-gray-100 hover:bg-gray-50"
            >
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-medium">3</span>
            </Button>
            
            {/* Profile */}
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200">
              <Avatar className="w-10 h-10 border-2 border-primary/20">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-sm font-medium">
                  {user?.name?.charAt(0) || 'P'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold text-gray-800 hidden lg:block">{user?.name || 'Parent'}</span>
            </div>
          </div>
        </header>

        {/* Content Area - Main + Right Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content - Scrollable */}
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>

          {/* Right Sidebar - Fixed on large screens */}
          {rightSidebar && (
            <aside className="hidden xl:block w-80 h-full overflow-y-auto border-l border-gray-100 bg-white p-5 flex-shrink-0">
              {rightSidebar}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

const ParentDashboardLayout = ({ children, rightSidebar, title }: ParentDashboardLayoutProps) => {
  return (
    <LanguageProvider>
      <ChildProvider>
        <ParentDashboardLayoutInner title={title} rightSidebar={rightSidebar}>
          {children}
        </ParentDashboardLayoutInner>
      </ChildProvider>
    </LanguageProvider>
  );
};

export default ParentDashboardLayout;
