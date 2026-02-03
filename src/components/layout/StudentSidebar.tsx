import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  MessageSquare,
  ClipboardCheck,
  FolderOpen,
  TrendingUp,
  Award,
  HelpCircle,
  Sparkles,
  ChevronDown,
  Bell,
  FileText,
  BarChart3,
  LogOut,
  GraduationCap
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

// Navigation structure with collapsible sections
const navSections = [
  {
    id: 'learning',
    label: 'Learning',
    icon: <GraduationCap className="w-5 h-5" />,
    children: [
      { label: 'Planner', icon: <CalendarCheck className="w-4 h-4" />, path: '/student/planner' },
      { label: 'Personalized Learn', icon: <BookOpen className="w-4 h-4" />, path: '/student/learning' },
      { label: 'AI Doubt Solver', icon: <MessageSquare className="w-4 h-4" />, path: '/student/doubts' },
    ]
  },
  {
    id: 'resources',
    label: 'Resources',
    icon: <BarChart3 className="w-5 h-5" />,
    children: [
      { label: 'Study Resources', icon: <FolderOpen className="w-4 h-4" />, path: '/student/resources' },
      { label: 'PYQ Papers', icon: <FileText className="w-4 h-4" />, path: '/student/pyq' },
    ]
  },
  {
    id: 'updates',
    label: 'Updates',
    icon: <Bell className="w-5 h-5" />,
    children: [
      { label: 'Events & Announcements', icon: <Bell className="w-4 h-4" />, path: '/student/announcements' },
      { label: 'Homework', icon: <ClipboardCheck className="w-4 h-4" />, path: '/student/homework' },
    ]
  },
  {
    id: 'progress',
    label: 'Progress',
    icon: <TrendingUp className="w-5 h-5" />,
    children: [
      { label: 'Performance', icon: <TrendingUp className="w-4 h-4" />, path: '/student/performance' },
      { label: 'Achievements', icon: <Award className="w-4 h-4" />, path: '/student/achievements' },
    ]
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
  const [openSections, setOpenSections] = useState<string[]>([]);

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isPathActive = (path: string) => location.pathname === path;
  const isSectionActive = (children: { path: string }[]) => 
    children.some(child => location.pathname === child.path);
  const showText = !collapsed || isMobile;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-primary via-primary to-purple-700 font-sans">
      {/* Logo Section */}
      <div className={cn(
        "flex items-center h-20 border-b border-white/10",
        collapsed && !isMobile ? "justify-center px-3" : "gap-3 px-5"
      )}>
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        {showText && (
          <div>
            <span className="text-xl font-bold text-white tracking-tight">EDDGE</span>
            <p className="text-xs text-white/60">Student Portal</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 py-4 overflow-y-auto scrollbar-hide",
        collapsed && !isMobile ? "px-2" : "px-3"
      )}>
        {/* Dashboard - Standalone */}
        <button
          onClick={() => handleNavigate('/student')}
          className={cn(
            "w-full flex items-center rounded-xl transition-all duration-200 h-12 mb-2",
            collapsed && !isMobile ? "justify-center px-2" : "gap-3 px-4",
            isPathActive('/student')
              ? "bg-white/20 text-white font-medium shadow-lg" 
              : "text-white/80 hover:bg-white/10 hover:text-white"
          )}
        >
          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
          {showText && (
            <>
              <span className="text-sm flex-1 text-left">Dashboard</span>
              {isPathActive('/student') && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </>
          )}
        </button>

        {/* Collapsible Sections */}
        <div className="space-y-1 mt-2">
          {navSections.map((section) => (
            <Collapsible
              key={section.id}
              open={openSections.includes(section.id)}
              onOpenChange={() => toggleSection(section.id)}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "w-full flex items-center rounded-xl transition-all duration-200 h-12",
                    collapsed && !isMobile ? "justify-center px-2" : "gap-3 px-4",
                    isSectionActive(section.children)
                      ? "text-white font-medium" 
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <span className="flex-shrink-0">{section.icon}</span>
                  {showText && (
                    <>
                      <span className="text-sm flex-1 text-left">{section.label}</span>
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        openSections.includes(section.id) && "rotate-180"
                      )} />
                    </>
                  )}
                </button>
              </CollapsibleTrigger>
              
              {showText && (
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <div className="ml-4 pl-4 border-l border-white/20 space-y-1 py-1">
                    {section.children.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleNavigate(item.path)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm",
                          isPathActive(item.path)
                            ? "bg-white/15 text-white font-medium" 
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </CollapsibleContent>
              )}
            </Collapsible>
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-white/10 p-3 space-y-1">
        {/* Help & Support */}
        <button
          onClick={() => handleNavigate('/student/help')}
          className={cn(
            "w-full flex items-center rounded-xl transition-all duration-200 h-11",
            collapsed && !isMobile ? "justify-center px-2" : "gap-3 px-4",
            "text-white/80 hover:bg-white/10 hover:text-white"
          )}
        >
          <HelpCircle className="w-5 h-5 flex-shrink-0" />
          {showText && <span className="text-sm">Help & Support</span>}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center rounded-xl transition-all duration-200 h-11",
            collapsed && !isMobile ? "justify-center px-2" : "gap-3 px-4",
            "text-white/80 hover:bg-white/10 hover:text-white"
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {showText && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;
