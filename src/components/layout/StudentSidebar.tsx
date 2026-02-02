import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  LayoutDashboard,
  GraduationCap,
  Calendar,
  BookOpen,
  MessageCircleQuestion,
  FolderOpen,
  FileText,
  Bell,
  ClipboardList,
  TrendingUp,
  Trophy,
  HelpCircle,
  LogOut,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface NavSection {
  title: string;
  icon: ReactNode;
  items: {
    label: string;
    icon: ReactNode;
    path: string;
  }[];
}

const navSections: NavSection[] = [
  {
    title: 'Learning',
    icon: <GraduationCap className="w-5 h-5" />,
    items: [
      { label: 'Planner', icon: <Calendar className="w-4 h-4" />, path: '/student/planner' },
      { label: 'Personalized Learn', icon: <BookOpen className="w-4 h-4" />, path: '/student/learning' },
      { label: 'AI Doubt Solver', icon: <MessageCircleQuestion className="w-4 h-4" />, path: '/student/doubts' },
    ],
  },
  {
    title: 'Resources',
    icon: <FolderOpen className="w-5 h-5" />,
    items: [
      { label: 'Study Resources', icon: <FolderOpen className="w-4 h-4" />, path: '/student/resources' },
      { label: 'PYQ Papers', icon: <FileText className="w-4 h-4" />, path: '/student/pyq' },
    ],
  },
  {
    title: 'Updates',
    icon: <Bell className="w-5 h-5" />,
    items: [
      { label: 'Events & Announcements', icon: <Bell className="w-4 h-4" />, path: '/student/events' },
      { label: 'Homework', icon: <ClipboardList className="w-4 h-4" />, path: '/student/homework' },
    ],
  },
  {
    title: 'Progress',
    icon: <TrendingUp className="w-5 h-5" />,
    items: [
      { label: 'Performance', icon: <TrendingUp className="w-4 h-4" />, path: '/student/performance' },
      { label: 'Achievements', icon: <Trophy className="w-4 h-4" />, path: '/student/achievements' },
    ],
  },
];

interface StudentSidebarProps {
  collapsed?: boolean;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

const StudentSidebar = ({ collapsed = false, isMobile = false, onMobileClose }: StudentSidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openSections, setOpenSections] = useState<string[]>(['Learning', 'Resources', 'Updates', 'Progress']);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const toggleSection = (title: string) => {
    setOpenSections(prev => 
      prev.includes(title) 
        ? prev.filter(s => s !== title)
        : [...prev, title]
    );
  };

  const isPathActive = (path: string) => location.pathname === path;
  const isSectionActive = (section: NavSection) => 
    section.items.some(item => location.pathname === item.path);

  return (
    <div className="flex flex-col h-full bg-sidebar font-sans">
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-2 px-3 py-4 border-b border-sidebar-border",
        collapsed && !isMobile && "justify-center px-2"
      )}>
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 shadow-sm">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        {(!collapsed || isMobile) && (
          <div>
            <span className="text-base font-semibold text-gradient tracking-tight">EDDGE</span>
            <p className="text-[10px] text-muted-foreground">Student Portal</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {/* Dashboard - Always visible */}
        <button
          onClick={() => handleNavigate('/student')}
          className={cn(
            "w-full flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all duration-200 mb-1",
            isPathActive('/student')
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-primary"
          )}
        >
          <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
          {(!collapsed || isMobile) && (
            <span className="text-sm font-medium">Dashboard</span>
          )}
          {isPathActive('/student') && (!collapsed || isMobile) && (
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground" />
          )}
        </button>

        {/* Collapsible Sections */}
        {navSections.map((section) => (
          <Collapsible
            key={section.title}
            open={openSections.includes(section.title)}
            onOpenChange={() => toggleSection(section.title)}
          >
            <CollapsibleTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all duration-200",
                  isSectionActive(section)
                    ? "text-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <span className="flex-shrink-0 [&>svg]:w-4 [&>svg]:h-4">{section.icon}</span>
                {(!collapsed || isMobile) && (
                  <>
                    <span className="text-sm font-medium">{section.title}</span>
                    <ChevronDown className={cn(
                      "ml-auto w-3.5 h-3.5 transition-transform duration-200",
                      openSections.includes(section.title) && "rotate-180"
                    )} />
                  </>
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-0.5 mt-0.5">
              {section.items.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all duration-200 ml-1.5",
                    isPathActive(item.path)
                      ? "bg-sidebar-accent text-primary font-medium" 
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-primary"
                  )}
                >
                  <span className="flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5">{item.icon}</span>
                  {(!collapsed || isMobile) && (
                    <span className="text-xs">{item.label}</span>
                  )}
                </button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto border-t border-sidebar-border">
        {/* Help & Support */}
        <div className="px-2 py-1.5">
          <button
            onClick={() => handleNavigate('/student/help')}
            className={cn(
              "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all duration-200",
              "text-sidebar-foreground hover:bg-sidebar-accent hover:text-primary"
            )}
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            {(!collapsed || isMobile) && (
              <span className="text-sm font-medium">Help & Support</span>
            )}
          </button>
        </div>

        {/* Logout */}
        <div className="p-2 pt-0">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "w-full justify-start gap-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 h-8",
              collapsed && !isMobile && "justify-center px-2"
            )}
          >
            <LogOut className="w-4 h-4" />
            {(!collapsed || isMobile) && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;
