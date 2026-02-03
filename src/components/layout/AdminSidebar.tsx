import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  FileText,
  Bell,
  DollarSign,
  Settings,
  HelpCircle,
  Sparkles
} from 'lucide-react';

const mainNavItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/admin' },
];

const managementItems = [
  { label: 'Teachers', icon: <Users className="w-5 h-5" />, path: '/admin/teachers', badge: '48' },
  { label: 'Students', icon: <GraduationCap className="w-5 h-5" />, path: '/admin/students' },
  { label: 'Classes', icon: <BookOpen className="w-5 h-5" />, path: '/admin/classes' },
  { label: 'Attendance', icon: <ClipboardList className="w-5 h-5" />, path: '/admin/attendance' },
];

const administrationItems = [
  { label: 'Reports', icon: <FileText className="w-5 h-5" />, path: '/admin/reports' },
  { label: 'Announcements', icon: <Bell className="w-5 h-5" />, path: '/admin/announcements', badge: '3' },
  { label: 'Finance', icon: <DollarSign className="w-5 h-5" />, path: '/admin/finance' },
  { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/admin/settings' },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

const AdminSidebar = ({ collapsed = false, isMobile = false, onMobileClose }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const isPathActive = (path: string) => location.pathname === path;
  const showText = !collapsed || isMobile;

  const renderNavItem = (item: { label: string; icon: React.ReactNode; path: string; badge?: string }) => (
    <button
      key={item.path}
      onClick={() => handleNavigate(item.path)}
      className={cn(
        "w-full flex items-center rounded-xl transition-all duration-200 h-11",
        collapsed && !isMobile ? "justify-center px-2" : "gap-3 px-4",
        isPathActive(item.path)
          ? "bg-primary/10 text-primary font-medium" 
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      )}
    >
      <span className={cn(
        "flex-shrink-0",
        isPathActive(item.path) ? "text-primary" : "text-gray-400"
      )}>
        {item.icon}
      </span>
      {showText && (
        <>
          <span className="text-sm flex-1 text-left">{item.label}</span>
          {item.badge && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {item.badge}
            </span>
          )}
        </>
      )}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100 font-sans">
      {/* Logo */}
      <div className={cn(
        "flex items-center h-16 border-b border-gray-100",
        collapsed && !isMobile ? "justify-center px-3" : "gap-3 px-5"
      )}>
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {showText && (
          <div>
            <span className="text-xl font-bold text-primary tracking-tight">EDDGE</span>
            <span className="text-xs text-muted-foreground block -mt-1">Admin Portal</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 py-4 overflow-y-auto scrollbar-hide",
        collapsed && !isMobile ? "px-2" : "px-3"
      )}>
        {/* Main Nav */}
        <div className="space-y-1">
          {mainNavItems.map(renderNavItem)}
        </div>

        {/* Management Section */}
        {showText && (
          <div className="mt-6 mb-3 px-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Management
            </span>
          </div>
        )}
        {!showText && <div className="h-6" />}
        <div className="space-y-1">
          {managementItems.map(renderNavItem)}
        </div>

        {/* Administration Section */}
        {showText && (
          <div className="mt-6 mb-3 px-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Administration
            </span>
          </div>
        )}
        {!showText && <div className="h-6" />}
        <div className="space-y-1">
          {administrationItems.map(renderNavItem)}
        </div>
      </nav>

      {/* Bottom Help Card */}
      {showText && (
        <div className="p-4">
          <div className="bg-primary/5 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary/10" />
            <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
              <HelpCircle className="w-4 h-4 text-primary" />
            </div>
            
            <div className="mt-8">
              <h4 className="font-semibold text-gray-900 text-sm">Need Help?</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Contact support for any assistance.
              </p>
              <button
                onClick={() => handleNavigate('/admin/support')}
                className="mt-3 w-full bg-white text-gray-700 text-sm font-medium py-2.5 px-4 rounded-xl hover:bg-gray-50 transition-colors shadow-sm border border-gray-100"
              >
                Get Support
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Help Icon */}
      {!showText && (
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => handleNavigate('/admin/support')}
            className="w-full flex justify-center items-center h-10 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-primary transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;
