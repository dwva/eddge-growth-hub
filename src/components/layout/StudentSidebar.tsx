import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  ChevronDown,
  Sparkles,
  User
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
      { label: 'Planner', icon: <CalendarCheck className="w-3.5 h-3.5" />, path: '/student/planner' },
      { label: 'Learn', icon: <BookOpen className="w-3.5 h-3.5" />, path: '/student/learning' },
      { label: 'AI Doubts', icon: <MessageSquare className="w-3.5 h-3.5" />, path: '/student/doubts' },
    ],
  },
  {
    title: 'Resources',
    icon: <FolderOpen className="w-4 h-4" />,
    items: [
      { label: 'Study Materials', icon: <FolderOpen className="w-3.5 h-3.5" />, path: '/student/resources' },
      { label: 'PYQ Papers', icon: <FileText className="w-3.5 h-3.5" />, path: '/student/pyq' },
    ],
  },
  {
    title: 'Updates',
    icon: <Bell className="w-4 h-4" />,
    items: [
      { label: 'Events', icon: <Bell className="w-3.5 h-3.5" />, path: '/student/events' },
      { label: 'Homework', icon: <ClipboardCheck className="w-3.5 h-3.5" />, path: '/student/homework' },
    ],
  },
  {
    title: 'Progress',
    icon: <TrendingUp className="w-4 h-4" />,
    items: [
      { label: 'Performance', icon: <TrendingUp className="w-3.5 h-3.5" />, path: '/student/performance' },
      { label: 'Achievements', icon: <Award className="w-3.5 h-3.5" />, path: '/student/achievements' },
    ],
  },
];

interface StudentSidebarProps {
  collapsed?: boolean;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

const StudentSidebar = ({ collapsed = false, isMobile = false, onMobileClose }: StudentSidebarProps) => {
  const { logout, user } = useAuth();
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

  const showText = !collapsed || isMobile;

  return (
    <div className="flex flex-col h-full gradient-sidebar font-sans">
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-5 border-b border-white/10",
        collapsed && !isMobile && "justify-center px-2"
      )}>
        <div className={cn(
          "rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0",
          collapsed && !isMobile ? "w-8 h-8" : "w-10 h-10"
        )}>
          <Sparkles className={cn(collapsed && !isMobile ? "w-4 h-4" : "w-5 h-5", "text-white")} />
        </div>
        {showText && (
          <div>
            <span className="text-base font-bold text-white tracking-tight">EDDGE</span>
            <p className="text-[10px] text-white/60">Student Portal</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 py-4 space-y-1 overflow-y-auto scrollbar-hide",
        collapsed && !isMobile ? "px-2" : "px-3"
      )}>
        {/* Dashboard */}
        <button
          onClick={() => handleNavigate('/student')}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl transition-all duration-200",
            collapsed && !isMobile ? "justify-center p-2.5" : "px-3 py-2.5",
            isPathActive('/student')
              ? "bg-white/20 text-white" 
              : "text-white/70 hover:bg-white/10 hover:text-white"
          )}
        >
          <LayoutDashboard className="w-[18px] h-[18px] flex-shrink-0" />
          {showText && (
            <>
              <span className="text-[13px] font-medium">Dashboard</span>
              {isPathActive('/student') && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </>
          )}
        </button>

        {/* Spacer */}
        <div className="h-2" />

        {/* Collapsible Sections */}
        {navSections.map((section) => (
          <div key={section.title} className="mb-1">
            {collapsed && !isMobile ? (
              // Collapsed: Show only icons
              <div className="space-y-1">
                <div className="w-full flex justify-center py-2 text-white/40">
                  <span className="flex-shrink-0">{section.icon}</span>
                </div>
                {section.items.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={cn(
                      "w-full flex justify-center p-2.5 rounded-xl transition-all duration-200",
                      isPathActive(item.path)
                        ? "bg-white/20 text-white" 
                        : "text-white/60 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
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
                  <button
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                      isSectionActive(section)
                        ? "text-white"
                        : "text-white/60 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <span className="flex-shrink-0">{section.icon}</span>
                    <span className="text-[13px] font-medium">{section.title}</span>
                    <ChevronDown className={cn(
                      "ml-auto w-3.5 h-3.5 transition-transform duration-200",
                      openSections.includes(section.title) && "rotate-180"
                    )} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-0.5 mt-1 ml-3 pl-3 border-l border-white/10">
                  {section.items.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200",
                        isPathActive(item.path)
                          ? "bg-white/20 text-white" 
                          : "text-white/50 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span className="text-[12px]">{item.label}</span>
                    </button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-white/10 p-3 space-y-1">
        <button
          onClick={() => handleNavigate('/student/help')}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl transition-all duration-200 text-white/60 hover:bg-white/10 hover:text-white",
            collapsed && !isMobile ? "justify-center p-2.5" : "px-3 py-2.5"
          )}
        >
          <HelpCircle className="w-[18px] h-[18px] flex-shrink-0" />
          {showText && <span className="text-[12px]">Help & Support</span>}
        </button>

        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl transition-all duration-200 text-white/60 hover:bg-white/10 hover:text-white",
            collapsed && !isMobile ? "justify-center p-2.5" : "px-3 py-2.5"
          )}
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {showText && <span className="text-[12px]">Logout</span>}
        </button>

        {/* User Profile */}
        <div className={cn(
          "mt-3 pt-3 border-t border-white/10",
          collapsed && !isMobile ? "flex justify-center" : ""
        )}>
          {collapsed && !isMobile ? (
            <Avatar className="w-9 h-9 border-2 border-white/20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-white/20 text-white text-xs">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex items-center gap-3 px-2">
              <Avatar className="w-9 h-9 border-2 border-white/20">
                <AvatarImage src="" />
                <AvatarFallback className="bg-white/20 text-white text-xs">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-white truncate">
                  {user?.name || 'Student'}
                </p>
                <p className="text-[10px] text-white/50 truncate">
                  {user?.email || 'student@eddge.com'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;
