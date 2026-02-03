import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  LayoutGrid,
  GraduationCap,
  Calendar,
  BookOpen,
  MessageCircle,
  BarChart3,
  FileText,
  Bell,
  ClipboardList,
  TrendingUp,
  Trophy,
  HelpCircle,
  LogOut,
  ChevronUp,
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
      { label: 'AI Doubt Solver', icon: <MessageCircle className="w-4 h-4" />, path: '/student/doubts' },
    ],
  },
  {
    title: 'Resources',
    icon: <BarChart3 className="w-5 h-5" />,
    items: [
      { label: 'Study Resources', icon: <BarChart3 className="w-4 h-4" />, path: '/student/resources' },
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
  const { logout } = useAuth();
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
    <div className="flex flex-col h-full gradient-sidebar font-sans">
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-5",
        collapsed && !isMobile && "justify-center px-2"
      )}>
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {(!collapsed || isMobile) && (
          <div>
            <span className="text-lg font-bold text-white tracking-tight">EDDGE</span>
            <p className="text-xs text-white/70">Student Portal</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {/* Dashboard - Always visible */}
        <button
          onClick={() => handleNavigate('/student')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
            isPathActive('/student')
              ? "bg-white/20 text-white shadow-sm" 
              : "text-white/80 hover:bg-white/10 hover:text-white"
          )}
        >
          <LayoutGrid className="w-5 h-5 flex-shrink-0" />
          {(!collapsed || isMobile) && (
            <span className="text-sm font-medium">Dashboard</span>
          )}
          {isPathActive('/student') && (!collapsed || isMobile) && (
            <div className="ml-auto w-2 h-2 rounded-full bg-white" />
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
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                  isSectionActive(section)
                    ? "text-white font-medium"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <span className="flex-shrink-0 [&>svg]:w-5 [&>svg]:h-5">{section.icon}</span>
                {(!collapsed || isMobile) && (
                  <>
                    <span className="text-sm font-medium">{section.title}</span>
                    <ChevronUp className={cn(
                      "ml-auto w-4 h-4 transition-transform duration-200",
                      !openSections.includes(section.title) && "rotate-180"
                    )} />
                  </>
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-0.5 mt-1 ml-3">
              {section.items.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200",
                    isPathActive(item.path)
                      ? "bg-white/20 text-white font-medium" 
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <span className="flex-shrink-0 [&>svg]:w-4 [&>svg]:h-4">{item.icon}</span>
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
      <div className="mt-auto border-t border-white/10">
        {/* Help & Support */}
        <div className="px-3 py-2">
          <button
            onClick={() => handleNavigate('/student/help')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
              "text-white/70 hover:bg-white/10 hover:text-white"
            )}
          >
            <HelpCircle className="w-5 h-5 flex-shrink-0" />
            {(!collapsed || isMobile) && (
              <span className="text-sm font-medium">Help & Support</span>
            )}
          </button>
        </div>

        {/* Logout */}
        <div className="p-3 pt-0">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "w-full justify-start gap-3 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 h-10",
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
