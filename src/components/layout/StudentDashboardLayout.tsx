import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Bell, ChevronLeft } from 'lucide-react';
import StudentSidebar from './StudentSidebar';

interface StudentDashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const StudentDashboardLayout = ({ children, title }: StudentDashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Desktop Sidebar - Fixed */}
      <aside className={cn(
        "hidden md:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 h-screen sticky top-0 flex-shrink-0 relative",
        collapsed ? "w-16" : "w-64"
      )}>
        <StudentSidebar collapsed={collapsed} />
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-20 -right-3 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-accent hover:scale-110 transition-all duration-200 z-10"
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform duration-200", collapsed && "rotate-180")} />
        </button>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0 bg-sidebar">
          <StudentSidebar isMobile onMobileClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header - Fixed */}
        <header className="h-16 border-b border-border bg-card px-4 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
          
          {/* Notification Icon */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-primary/10 hover:text-primary transition-all duration-200"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </Button>
        </header>

        {/* Page Content - Scrollable */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboardLayout;
