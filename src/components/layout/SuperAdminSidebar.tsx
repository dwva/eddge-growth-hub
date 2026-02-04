import { useState, useEffect } from 'react';
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
  Sparkles,
  LogOut,
  Flag,
  Bell,
  Brain,
  Download,
  Settings,
  AlertTriangle,
  Users,
  UserPlus,
  ChevronDown,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface NavGroup {
  id: string;
  label: string;
  defaultExpanded: boolean;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    id: 'platform',
    label: 'PLATFORM',
    defaultExpanded: true,
    items: [
      { label: 'Platform Overview', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard/superadmin' },
      { label: 'Usage Analytics', icon: <TrendingUp className="w-5 h-5" />, path: '/dashboard/superadmin/analytics' },
      { label: 'System Health', icon: <Activity className="w-5 h-5" />, path: '/dashboard/superadmin/health' },
    ],
  },
  {
    id: 'schools',
    label: 'SCHOOLS',
    defaultExpanded: true,
    items: [
      { label: 'School Registry', icon: <School className="w-5 h-5" />, path: '/dashboard/superadmin/schools' },
      { label: 'School Onboarding', icon: <UserPlus className="w-5 h-5" />, path: '/dashboard/superadmin/onboarding' },
      { label: 'Adoption', icon: <TrendingUp className="w-5 h-5" />, path: '/dashboard/superadmin/adoption' },
    ],
  },
  {
    id: 'control',
    label: 'CONTROL',
    defaultExpanded: false,
    items: [
      { label: 'Features', icon: <Flag className="w-5 h-5" />, path: '/dashboard/superadmin/features' },
      { label: 'Alerts', icon: <Bell className="w-5 h-5" />, path: '/dashboard/superadmin/alerts' },
      { label: 'AI Costs', icon: <Brain className="w-5 h-5" />, path: '/dashboard/superadmin/ai-costs' },
      { label: 'Billing', icon: <CreditCard className="w-5 h-5" />, path: '/dashboard/superadmin/billing' },
    ],
  },
  {
    id: 'governance',
    label: 'GOVERNANCE',
    defaultExpanded: false,
    items: [
      { label: 'Security & Compliance', icon: <Shield className="w-5 h-5" />, path: '/dashboard/superadmin/security' },
      { label: 'Audit', icon: <Shield className="w-5 h-5" />, path: '/dashboard/superadmin/audit' },
      { label: 'Incidents', icon: <AlertTriangle className="w-5 h-5" />, path: '/dashboard/superadmin/incidents' },
      { label: 'Export', icon: <Download className="w-5 h-5" />, path: '/dashboard/superadmin/export' },
    ],
  },
  {
    id: 'administration',
    label: 'ADMINISTRATION',
    defaultExpanded: false,
    items: [
      { label: 'Admins & Roles', icon: <Users className="w-5 h-5" />, path: '/dashboard/superadmin/admins' },
      { label: 'Platform Settings', icon: <Settings className="w-5 h-5" />, path: '/dashboard/superadmin/settings' },
    ],
  },
];

interface SuperAdminSidebarProps {
  collapsed?: boolean;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

const SuperAdminSidebar = ({ collapsed = false, isMobile = false, onMobileClose }: SuperAdminSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Initialize expanded state from localStorage or defaults
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') {
      return {};
    }
    const stored = localStorage.getItem('superadmin-sidebar-expanded');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return {};
      }
    }
    // Default expanded state
    const defaults: Record<string, boolean> = {};
    navGroups.forEach(group => {
      defaults[group.id] = group.defaultExpanded;
    });
    return defaults;
  });

  // Persist expanded state to localStorage
  useEffect(() => {
    localStorage.setItem('superadmin-sidebar-expanded', JSON.stringify(expandedGroups));
  }, [expandedGroups]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

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
    if (path === '/dashboard/superadmin') {
      return location.pathname === '/dashboard/superadmin';
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
            <span className="text-xs text-muted-foreground block">SuperAdmin</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 px-3 py-4 overflow-y-auto scrollbar-hide",
        collapsed && !isMobile && "px-2"
      )}>
        <div className="space-y-1">
          {navGroups.map((group) => {
            const isExpanded = expandedGroups[group.id] ?? group.defaultExpanded;

            if (collapsed && !isMobile) {
              // Collapsed mode: show only icons
              return (
                <div key={group.id} className="space-y-1">
                  {group.items.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className={cn(
                        "w-full flex items-center justify-center px-2 py-3 rounded-xl transition-all duration-200",
                        isPathActive(item.path)
                          ? "bg-primary/10 text-primary" 
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                      title={item.label}
                    >
                      <span className={cn(
                        "flex-shrink-0",
                        isPathActive(item.path) ? "text-primary" : "text-gray-400"
                      )}>
                        {item.icon}
                      </span>
                    </button>
                  ))}
                </div>
              );
            }

            // Expanded mode: show groups with collapsible headers
            return (
              <Collapsible
                key={group.id}
                open={isExpanded}
                onOpenChange={() => toggleGroup(group.id)}
              >
                <CollapsibleTrigger asChild>
                  <button
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200",
                      "text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <span>{group.label}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 mt-1">
                  {group.items.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className={cn(
                        "w-full flex items-center px-4 py-3 gap-3 rounded-xl transition-all duration-200 ml-2",
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
                      <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
                      {isPathActive(item.path) && (
                        <span className="w-2 h-2 rounded-full bg-primary ml-auto" />
                      )}
                    </button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </nav>

      {/* Bottom section */}
      {showText && (
        <div className="p-3 flex-shrink-0">
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
        <div className="p-3 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex justify-center items-center py-3 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SuperAdminSidebar;
