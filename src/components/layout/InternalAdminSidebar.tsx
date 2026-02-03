import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard,
  School,
  TrendingUp,
  CreditCard,
  Activity,
  Shield,
  HelpCircle,
  Sparkles,
  LogOut
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Platform Overview', icon: <LayoutDashboard className="w-5 h-5" />, path: '/internal-admin' },
  { label: 'School Registry', icon: <School className="w-5 h-5" />, path: '/internal-admin/schools' },
  { label: 'Usage Analytics', icon: <TrendingUp className="w-5 h-5" />, path: '/internal-admin/analytics' },
  { label: 'Billing', icon: <CreditCard className="w-5 h-5" />, path: '/internal-admin/billing' },
  { label: 'System Health', icon: <Activity className="w-5 h-5" />, path: '/internal-admin/health' },
  { label: 'Security & Compliance', icon: <Shield className="w-5 h-5" />, path: '/internal-admin/security' },
];

interface InternalAdminSidebarProps {
  collapsed?: boolean;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

const InternalAdminSidebar = ({ collapsed = false, isMobile = false, onMobileClose }: InternalAdminSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isPathActive = (path: string) => {
    if (path === '/internal-admin') {
      return location.pathname === '/internal-admin';
    }
    return location.pathname.startsWith(path);
  };

  const showText = !collapsed || isMobile;

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100 font-sans">
      {/* Logo section */}
      <div className={cn(
        "p-6 flex items-center gap-3 border-b border-gray-100",
        collapsed && !isMobile && "justify-center p-4"
      )}>
        <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        {showText && (
          <div>
            <span className="text-2xl font-bold text-primary tracking-tight">EDDGE</span>
            <span className="text-xs text-muted-foreground block">Internal Admin</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 px-3 py-4 overflow-y-auto scrollbar-hide",
        collapsed && !isMobile && "px-2"
      )}>
        <div className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={cn(
                "w-full flex items-center px-4 py-3 gap-3 rounded-xl transition-all duration-200",
                collapsed && !isMobile && "justify-center px-2",
                isPathActive(item.path)
                  ? "bg-primary/10 text-primary" 
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
                  <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
                  {isPathActive(item.path) && (
                    <span className="w-2 h-2 rounded-full bg-primary ml-auto" />
                  )}
                </>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom section */}
      {showText && (
        <div className="p-3 space-y-2 flex-shrink-0">
          {/* Help Center Card */}
          <div className="bg-gradient-to-br from-primary/15 via-purple-100/50 to-violet-100/60 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="flex justify-center -mt-6 mb-3">
              <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-primary" />
              </div>
            </div>
            
            <div className="text-center relative z-10">
              <h4 className="font-semibold text-gray-900 text-sm">Admin Support</h4>
              <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                Need help with platform<br />
                management? Contact support.
              </p>
              <button
                className="mt-3 w-full bg-white text-gray-800 text-xs font-semibold py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                Contact Support
              </button>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 gap-3 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      )}

      {/* Collapsed Icons */}
      {!showText && (
        <div className="p-3 border-t border-gray-100 space-y-2 flex-shrink-0">
          <button
            className="w-full flex justify-center items-center py-2.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-primary transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex justify-center items-center py-3 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default InternalAdminSidebar;
