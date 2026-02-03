import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
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
  Sparkles,
  ChevronDown,
  LogOut
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
}

interface NavSection {
  label: string;
  icon: React.ReactNode;
  items: NavItem[];
}

// Collapsible sections
const navSections: NavSection[] = [
  {
    label: 'Management',
    icon: <Users className="w-4 h-4" />,
    items: [
      { label: 'Teachers', icon: <Users className="w-4 h-4" />, path: '/admin/teachers', badge: '48' },
      { label: 'Students', icon: <GraduationCap className="w-4 h-4" />, path: '/admin/students' },
      { label: 'Classes', icon: <BookOpen className="w-4 h-4" />, path: '/admin/classes' },
      { label: 'Attendance', icon: <ClipboardList className="w-4 h-4" />, path: '/admin/attendance' },
    ],
  },
  {
    label: 'Administration',
    icon: <Settings className="w-4 h-4" />,
    items: [
      { label: 'Reports', icon: <FileText className="w-4 h-4" />, path: '/admin/reports' },
      { label: 'Announcements', icon: <Bell className="w-4 h-4" />, path: '/admin/announcements', badge: '3' },
      { label: 'Finance', icon: <DollarSign className="w-4 h-4" />, path: '/admin/finance' },
      { label: 'Settings', icon: <Settings className="w-4 h-4" />, path: '/admin/settings' },
    ],
  },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

const AdminSidebar = ({ collapsed = false, isMobile = false, onMobileClose }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [openSections, setOpenSections] = useState<string[]>(['Management', 'Administration']);

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

  const toggleSection = (label: string) => {
    setOpenSections(prev => 
      prev.includes(label) 
        ? prev.filter(s => s !== label)
        : [...prev, label]
    );
  };

  const isPathActive = (path: string) => location.pathname === path;
  const isSectionActive = (section: NavSection) => section.items.some(item => isPathActive(item.path));
  const showText = !collapsed || isMobile;

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100 font-sans">
      {/* Logo */}
      <div className={cn(
        "flex items-center h-14 border-b border-gray-100",
        collapsed && !isMobile ? "justify-center px-2" : "gap-2.5 px-4"
      )}>
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        {showText && (
          <div>
            <span className="text-lg font-bold text-primary tracking-tight">EDDGE</span>
            <span className="text-[10px] text-muted-foreground block -mt-1">Admin Portal</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 py-3 overflow-hidden",
        collapsed && !isMobile ? "px-2" : "px-3"
      )}>
        {/* Dashboard - Standalone */}
        <div className="mb-1">
          <button
            onClick={() => handleNavigate('/admin')}
            className={cn(
              "w-full flex items-center rounded-lg transition-all duration-200 h-9",
              collapsed && !isMobile ? "justify-center px-2" : "gap-2.5 px-4",
              isPathActive('/admin')
                ? "bg-primary/10 text-primary font-medium" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <span className={cn(
              "flex-shrink-0",
              isPathActive('/admin') ? "text-primary" : "text-gray-400"
            )}>
              <LayoutDashboard className="w-4 h-4" />
            </span>
            {showText && (
              <>
                <span className="text-xs flex-1 text-left">Dashboard</span>
                {isPathActive('/admin') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </>
            )}
          </button>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-0.5">
          {navSections.map((section) => (
            <Collapsible
              key={section.label}
              open={openSections.includes(section.label)}
              onOpenChange={() => toggleSection(section.label)}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "w-full flex items-center rounded-lg transition-all duration-200 h-9",
                    collapsed && !isMobile ? "justify-center px-2" : "gap-2.5 px-4",
                    isSectionActive(section)
                      ? "text-primary font-medium" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <span className={cn(
                    "flex-shrink-0",
                    isSectionActive(section) ? "text-primary" : "text-gray-400"
                  )}>
                    {section.icon}
                  </span>
                  {showText && (
                    <>
                      <span className="text-xs flex-1 text-left">{section.label}</span>
                      <ChevronDown className={cn(
                        "w-3.5 h-3.5 text-gray-400 transition-transform duration-200",
                        openSections.includes(section.label) ? "rotate-180" : ""
                      )} />
                    </>
                  )}
                </button>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className={cn(
                  "mt-0.5 space-y-0",
                  collapsed && !isMobile ? "" : "ml-4 pl-4 border-l border-gray-200"
                )}>
                  {section.items.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className={cn(
                        "w-full flex items-center rounded-md transition-all duration-200 h-8",
                        collapsed && !isMobile ? "justify-center px-2" : "gap-2.5 px-3",
                        isPathActive(item.path)
                          ? "bg-primary/10 text-primary font-medium" 
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
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
                          <span className="text-xs flex-1 text-left">{item.label}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </nav>

      {/* Bottom - Sign Out */}
      {showText && (
        <div className="p-3 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      )}

      {/* Collapsed Sign Out */}
      {!showText && (
        <div className="p-2 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex justify-center items-center h-8 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;