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
    <div className="flex flex-col h-full bg-sidebar">
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-6 border-b border-sidebar-border",
        collapsed && !isMobile && "justify-center px-2"
      )}>
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-md">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {(!collapsed || isMobile) && (
          <div>
            <span className="text-xl font-bold text-gradient">EDDGE</span>
            <p className="text-xs text-muted-foreground">Student Portal</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {/* Dashboard - Always visible */}
        <button
          onClick={() => handleNavigate('/student')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 mb-2",
            isPathActive('/student')
              ? "bg-primary text-primary-foreground shadow-md" 
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-primary"
          )}
        >
          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
          {(!collapsed || isMobile) && (
            <span className="font-medium">Dashboard</span>
          )}
          {isPathActive('/student') && (!collapsed || isMobile) && (
            <div className="ml-auto w-2 h-2 rounded-full bg-primary-foreground" />
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
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isSectionActive(section)
                    ? "text-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <span className="flex-shrink-0">{section.icon}</span>
                {(!collapsed || isMobile) && (
                  <>
                    <span className="font-medium">{section.title}</span>
                    <ChevronDown className={cn(
                      "ml-auto w-4 h-4 transition-transform duration-200",
                      openSections.includes(section.title) && "rotate-180"
                    )} />
                  </>
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-1">
              {section.items.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ml-2",
                    isPathActive(item.path)
                      ? "bg-sidebar-accent text-primary font-medium" 
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-primary"
                  )}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {(!collapsed || isMobile) && (
                    <span className="text-sm">{item.label}</span>
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
        <div className="px-3 py-2">
          <button
            onClick={() => handleNavigate('/student/help')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
              "text-sidebar-foreground hover:bg-sidebar-accent hover:text-primary"
            )}
          >
            <HelpCircle className="w-5 h-5 flex-shrink-0" />
            {(!collapsed || isMobile) && (
              <span className="font-medium">Help & Support</span>
            )}
          </button>
        </div>

        {/* Logout */}
        <div className="p-3 pt-0">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200",
              collapsed && !isMobile && "justify-center px-2"
            )}
          >
            <LogOut className="w-5 h-5" />
            {(!collapsed || isMobile) && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;
