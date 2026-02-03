import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  LayoutDashboard,
  GraduationCap,
  CalendarCheck,
  BookOpen,
  MessageSquare,
  FolderOpen,
  FileText,
  Bell,
  ClipboardCheck,
  TrendingUp,
  Award,
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
    icon: <GraduationCap className="w-4 h-4" />,
    items: [
      { label: 'Planner', icon: <CalendarCheck className="w-4 h-4" />, path: '/student/planner' },
      { label: 'Personalized Learn', icon: <BookOpen className="w-4 h-4" />, path: '/student/learning' },
      { label: 'AI Doubt Solver', icon: <MessageSquare className="w-4 h-4" />, path: '/student/doubts' },
    ],
  },
  {
    title: 'Resources',
    icon: <FolderOpen className="w-4 h-4" />,
    items: [
      { label: 'Study Resources', icon: <FolderOpen className="w-4 h-4" />, path: '/student/resources' },
      { label: 'PYQ Papers', icon: <FileText className="w-4 h-4" />, path: '/student/pyq' },
    ],
  },
  {
    title: 'Updates',
    icon: <Bell className="w-4 h-4" />,
    items: [
      { label: 'Events & Announcements', icon: <Bell className="w-4 h-4" />, path: '/student/events' },
      { label: 'Homework', icon: <ClipboardCheck className="w-4 h-4" />, path: '/student/homework' },
    ],
  },
  {
    title: 'Progress',
    icon: <TrendingUp className="w-4 h-4" />,
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

  const showText = !collapsed || isMobile;

  return (
    <div className="flex flex-col h-full gradient-sidebar font-sans">
      {/* Logo - p-6 (24px) padding, gap-3 (12px) */}
      <div className={cn(
        "flex items-center h-16 border-b border-white/10",
        collapsed && !isMobile ? "justify-center px-2" : "gap-3 px-5 py-4"
      )}>
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {showText && (
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white tracking-tight leading-tight">EDDGE</span>
            <span className="text-[11px] text-white/60 leading-tight">Student Portal</span>
          </div>
        )}
      </div>

      {/* Navigation - px-3 (12px) wrapper padding */}
      <nav className={cn(
        "flex-1 py-4 overflow-y-auto scrollbar-hide",
        collapsed && !isMobile ? "px-2" : "px-3"
      )}>
        {/* Dashboard - px-4 (16px) horizontal padding */}
        <button
          onClick={() => handleNavigate('/student')}
          className={cn(
            "w-full flex items-center rounded-lg transition-all duration-200 h-10",
            collapsed && !isMobile ? "justify-center px-2" : "gap-3 px-4",
            isPathActive('/student')
              ? "bg-white/20 text-white" 
              : "text-white/80 hover:bg-white/10 hover:text-white"
          )}
        >
          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
          {showText && (
            <>
              <span className="text-sm font-medium flex-1 text-left">Dashboard</span>
              {isPathActive('/student') && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </>
          )}
        </button>

        {/* Spacer - 12px */}
        <div className="h-3" />

        {/* Collapsible Sections - space-y-0.5 for tight spacing */}
        <div className="space-y-0.5">
          {navSections.map((section) => (
            <div key={section.title}>
              {collapsed && !isMobile ? (
                // Collapsed: Show only icons
                <div className="space-y-0.5">
                  <div className="w-full flex justify-center h-8 items-center text-white/50">
                    {section.icon}
                  </div>
                  {section.items.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className={cn(
                        "w-full flex justify-center items-center h-10 rounded-lg transition-all duration-200",
                        isPathActive(item.path)
                          ? "bg-white/20 text-white" 
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              ) : (
                // Expanded: Full collapsible
                <Collapsible
                  open={openSections.includes(section.title)}
                  onOpenChange={() => toggleSection(section.title)}
                >
                  <CollapsibleTrigger asChild>
                    <button className="w-full flex items-center gap-3 px-4 h-10 rounded-lg transition-all duration-200 text-white/80 hover:bg-white/10 hover:text-white">
                      <span className="flex-shrink-0">{section.icon}</span>
                      <span className="text-sm font-medium flex-1 text-left">{section.title}</span>
                      <ChevronUp className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        !openSections.includes(section.title) && "rotate-180"
                      )} />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-7 pl-3 border-l border-white/20 mt-0.5 space-y-0">
                    {section.items.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleNavigate(item.path)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 h-9 rounded-lg transition-all duration-200",
                          isPathActive(item.path)
                            ? "bg-white/20 text-white" 
                            : "text-white/60 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <span className="flex-shrink-0">{item.icon}</span>
                        <span className="text-[13px] text-left">{item.label}</span>
                      </button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Bottom Section - p-3 (12px) padding */}
      <div className="border-t border-white/10 p-3 space-y-0.5">
        <button
          onClick={() => handleNavigate('/student/help')}
          className={cn(
            "w-full flex items-center rounded-lg transition-all duration-200 text-white/70 hover:bg-white/10 hover:text-white",
            collapsed && !isMobile ? "justify-center px-2 h-10" : "gap-3 px-4 h-10"
          )}
        >
          <HelpCircle className="w-5 h-5 flex-shrink-0" />
          {showText && <span className="text-sm text-left">Help & Support</span>}
        </button>

        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center rounded-lg transition-all duration-200 text-white/70 hover:bg-white/10 hover:text-white",
            collapsed && !isMobile ? "justify-center px-2 h-10" : "gap-3 px-4 h-10"
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {showText && <span className="text-sm text-left">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;
