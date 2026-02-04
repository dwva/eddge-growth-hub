import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  MessageSquare,
  ClipboardCheck,
  FolderOpen,
  TrendingUp,
  Award,
  Sparkles,
  GraduationCap,
  BarChart3,
  Bell,
  FileText,
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
}

interface NavSection {
  label: string;
  icon: React.ReactNode;
  items: NavItem[];
}

// Collapsible sections matching the reference
const navSections: NavSection[] = [
  {
    label: 'Learning',
    icon: <GraduationCap className="w-5 h-5" />,
    items: [
      { label: 'Planner', icon: <CalendarCheck className="w-4 h-4" />, path: '/student/planner' },
      { label: 'Personalized Learn', icon: <BookOpen className="w-4 h-4" />, path: '/student/learning' },
      { label: 'Practice', icon: <ClipboardCheck className="w-4 h-4" />, path: '/student/practice' },
      { label: 'Revision', icon: <FolderOpen className="w-4 h-4" />, path: '/student/revision' },
      { label: 'AI Doubt Solver', icon: <MessageSquare className="w-4 h-4" />, path: '/student/doubt-solver' },
    ],
  },
  {
    label: 'Resources',
    icon: <BarChart3 className="w-5 h-5" />,
    items: [
      { label: 'Study Resources', icon: <FolderOpen className="w-4 h-4" />, path: '/student/resources' },
      { label: 'PYQ Papers', icon: <FileText className="w-4 h-4" />, path: '/student/pyq' },
    ],
  },
  {
    label: 'Updates',
    icon: <Bell className="w-5 h-5" />,
    items: [
      { label: 'Events & Announcements', icon: <CalendarCheck className="w-4 h-4" />, path: '/student/announcements' },
      { label: 'Attendance', icon: <CalendarCheck className="w-4 h-4" />, path: '/student/attendance' },
      { label: 'Homework', icon: <ClipboardCheck className="w-4 h-4" />, path: '/student/homework' },
    ],
  },
  {
    label: 'Progress',
    icon: <TrendingUp className="w-5 h-5" />,
    items: [
      { label: 'Performance', icon: <TrendingUp className="w-4 h-4" />, path: '/student/performance' },
      { label: 'Achievements', icon: <Award className="w-4 h-4" />, path: '/student/achievements' },
    ],
  },
];

interface StudentSidebarProps {
  collapsed?: boolean;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

const StudentSidebar = ({ collapsed = false, isMobile = false, onMobileClose }: StudentSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [openSections, setOpenSections] = useState<string[]>(['Learning', 'Resources', 'Updates', 'Progress']);

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
    <div className="flex flex-col h-full bg-white dark:bg-sidebar border-r border-gray-100 dark:border-sidebar-border font-sans">
      {/* Logo section - p-6, gap-3, border-b */}
      <div className={cn(
        "p-6 flex items-center gap-3 border-b border-gray-100 dark:border-sidebar-border",
        collapsed && !isMobile && "justify-center p-4"
      )}>
        <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        {showText && (
          <div>
            <span className="text-2xl font-bold text-primary tracking-tight">EDDGE</span>
            <span className="text-xs text-muted-foreground dark:text-sidebar-foreground/80 block">Student Portal</span>
          </div>
        )}
      </div>

      {/* Navigation container - px-3 py-4, space-y-1 */}
      <nav className={cn(
        "flex-1 px-3 py-4 overflow-y-auto scrollbar-hide",
        collapsed && !isMobile && "px-2"
      )}>
        {/* Dashboard - Top-level item: px-4 py-3, gap-3, rounded-xl */}
        <div className="space-y-1">
          <button
            onClick={() => handleNavigate('/student')}
            className={cn(
              "w-full flex items-center px-4 py-3 gap-3 rounded-xl transition-all duration-200",
              collapsed && !isMobile && "justify-center px-2",
              isPathActive('/student')
                ? "bg-primary/10 dark:bg-primary/20 text-primary" 
                : "text-gray-600 dark:text-sidebar-foreground hover:bg-gray-50 dark:hover:bg-sidebar-accent hover:text-gray-900 dark:hover:text-sidebar-accent-foreground"
            )}
          >
            <LayoutDashboard className={cn(
              "w-5 h-5 flex-shrink-0",
              isPathActive('/student') ? "text-primary" : "text-gray-400 dark:text-sidebar-foreground/70"
            )} />
            {showText && (
              <>
                <span className="font-medium text-sm flex-1 text-left">Dashboard</span>
                {isPathActive('/student') && (
                  <span className="w-2 h-2 rounded-full bg-primary ml-auto" />
                )}
              </>
            )}
          </button>

          {/* Collapsible Sections - Module headers: px-4 py-3, gap-3, rounded-xl */}
          {navSections.map((section) => (
            <Collapsible
              key={section.label}
              open={openSections.includes(section.label)}
              onOpenChange={() => toggleSection(section.label)}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "w-full flex items-center px-4 py-3 gap-3 rounded-xl transition-all duration-200",
                    collapsed && !isMobile && "justify-center px-2",
                    isSectionActive(section)
                      ? "text-primary" 
                      : "text-gray-600 dark:text-sidebar-foreground hover:bg-gray-50 dark:hover:bg-sidebar-accent hover:text-gray-900 dark:hover:text-sidebar-accent-foreground"
                  )}
                >
                  <span className={cn(
                    "flex-shrink-0",
                    isSectionActive(section) ? "text-primary" : "text-gray-400 dark:text-sidebar-foreground/70"
                  )}>
                    {section.icon}
                  </span>
                  {showText && (
                    <>
                      <span className="font-medium text-sm flex-1 text-left">{section.label}</span>
                      <ChevronDown className={cn(
                        "w-4 h-4 text-gray-400 dark:text-sidebar-foreground/70 transition-transform duration-200",
                        openSections.includes(section.label) ? "rotate-180" : ""
                      )} />
                    </>
                  )}
                </button>
              </CollapsibleTrigger>
              
              {/* Submodule container - ml-4 pl-2, space-y-1, border-l-2 */}
              <CollapsibleContent>
                <div className={cn(
                        "ml-4 pl-2 space-y-1 border-l-2 border-gray-200 dark:border-sidebar-border",
                        collapsed && !isMobile && "ml-0 pl-0 border-0"
                )}>
                  {/* Submodule links - px-3 py-2.5, gap-3, rounded-lg */}
                  {section.items.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className={cn(
                        "w-full flex items-center px-3 py-2.5 gap-3 rounded-lg transition-all duration-200",
                        collapsed && !isMobile && "justify-center px-2",
                        isPathActive(item.path)
                          ? "bg-primary/10 dark:bg-primary/20 text-primary" 
                          : "text-gray-500 dark:text-sidebar-foreground/80 hover:bg-gray-50 dark:hover:bg-sidebar-accent hover:text-gray-700 dark:hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <span className={cn(
                        "flex-shrink-0",
                        isPathActive(item.path) ? "text-primary" : "text-gray-400 dark:text-sidebar-foreground/70"
                      )}>
                        {item.icon}
                      </span>
                      {showText && (
                        <>
                          <span className="font-medium text-xs flex-1 text-left">{item.label}</span>
                          {isPathActive(item.path) && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary ml-auto" />
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

      {/* Bottom section */}
      {showText && (
        <div className="p-3 space-y-2 flex-shrink-0">
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 gap-3 rounded-xl text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      )}

      {/* Collapsed Icons */}
      {!showText && (
        <div className="p-3 border-t border-gray-100 dark:border-sidebar-border flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex justify-center items-center py-3 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentSidebar;