import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { 
  Menu, 
  LogOut, 
  ChevronLeft,
  GraduationCap,
  Bell,
  Search,
  ChevronDown,
  HelpCircle
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: ReactNode;
  path: string;
  badge?: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

interface AdminDashboardLayoutProps {
  children: ReactNode;
  navSections: NavSection[];
  pageTitle: string;
  pageDescription?: string;
  headerActions?: ReactNode;
}

const AdminDashboardLayout = ({ 
  children, 
  navSections, 
  pageTitle, 
  pageDescription,
  headerActions 
}: AdminDashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo Header */}
      <div className={cn(
        "p-6 border-b border-white/10",
        collapsed && !isMobile && "p-4"
      )}>
        <div className={cn(
          "flex items-center gap-3",
          collapsed && !isMobile && "justify-center"
        )}>
          <div className="w-10 h-10 rounded-xl gradient-admin flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          {(!collapsed || isMobile) && (
            <div>
              <div className="font-bold text-lg text-white">EDDGE</div>
              <div className="text-xs text-gray-400">Management Portal</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto scrollbar-hide">
        {navSections.map((section, sectionIdx) => (
          <div key={sectionIdx} className="space-y-1">
            {section.title && (!collapsed || isMobile) && (
              <div className="px-4 pb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </span>
              </div>
            )}
            {section.items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) setMobileOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-white/10 text-white backdrop-blur-sm" 
                      : "text-gray-400 hover:text-white hover:bg-white/5",
                    collapsed && !isMobile && "justify-center px-3"
                  )}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {(!collapsed || isMobile) && (
                    <>
                      <span className="font-medium flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/10">
        {/* User Profile */}
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-3",
          collapsed && !isMobile && "justify-center p-2"
        )}>
          <div className="w-10 h-10 rounded-full gradient-admin flex items-center justify-center font-medium text-white flex-shrink-0">
            {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AD'}
          </div>
          {(!collapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white truncate">{user?.name}</div>
              <div className="text-xs text-gray-400 capitalize">{user?.role}</div>
            </div>
          )}
        </div>

        {/* Help & Logout */}
        <div className="space-y-1">
          <button
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors",
              collapsed && !isMobile && "justify-center px-3"
            )}
          >
            <HelpCircle className="w-5 h-5" />
            {(!collapsed || isMobile) && <span>Help & Support</span>}
          </button>
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors",
              collapsed && !isMobile && "justify-center px-3"
            )}
          >
            <LogOut className="w-5 h-5" />
            {(!collapsed || isMobile) && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar - Dark Navy */}
      <aside className={cn(
        "hidden md:flex flex-col gradient-admin-sidebar h-screen sticky top-0 flex-shrink-0 transition-all duration-300",
        collapsed ? "w-20" : "w-72"
      )}>
        <NavContent />
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-20 -right-3 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 hover:scale-110 transition-all duration-200 z-10"
        >
          <ChevronLeft className={cn("w-4 h-4 text-gray-600 transition-transform duration-200", collapsed && "rotate-180")} />
        </button>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0 gradient-admin-sidebar border-0">
          <NavContent isMobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
          <div className="px-6 md:px-8 py-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Trigger */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
              </Sheet>
              
              {/* Page Title */}
              <div>
                <h1 className="text-xl font-bold text-gray-900">{pageTitle}</h1>
                {pageDescription && (
                  <p className="text-sm text-gray-500">{pageDescription}</p>
                )}
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Search - Desktop */}
              <div className="relative hidden lg:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative rounded-xl hover:bg-gray-100"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* Header Actions */}
              {headerActions}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
