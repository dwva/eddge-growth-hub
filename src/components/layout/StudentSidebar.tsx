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
  HelpCircle,
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
      { label: 'AI Doubt Solver', icon: <MessageSquare className="w-4 h-4" />, path: '/student/doubts' },
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
          <span className="text-lg font-bold text-primary tracking-tight">EDDGE</span>
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
            onClick={() => handleNavigate('/student')}
            className={cn(
              "w-full flex items-center rounded-lg transition-all duration-200 h-9",
              collapsed && !isMobile ? "justify-center px-2" : "gap-2.5 px-4",
              isPathActive('/student')
                ? "bg-primary/10 text-primary font-medium" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <span className={cn(
              "flex-shrink-0",
              isPathActive('/student') ? "text-primary" : "text-gray-400"
            )}>
              <LayoutDashboard className="w-4 h-4" />
            </span>
            {showText && (
              <>
                <span className="text-xs flex-1 text-left">Dashboard</span>
                {isPathActive('/student') && (
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
                        <span className="text-xs">{item.label}</span>
                      )}
                    </button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </nav>

      {/* Bottom Section - Help & Sign Out */}
      {showText && (
        <div className="p-3 space-y-2 flex-shrink-0">
          {/* Help Card */}
          <div className="bg-primary/5 rounded-xl p-3 relative overflow-hidden">
            <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-primary/10" />
            <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
              <HelpCircle className="w-3 h-3 text-primary" />
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 text-xs">Help Center</h4>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                Having trouble? Contact us.
              </p>
              <button
                onClick={() => handleNavigate('/student/help')}
                className="mt-2 w-full bg-white text-gray-700 text-xs font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors shadow-sm border border-gray-100"
              >
                Help Center
              </button>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      )}

      {/* Collapsed Icons */}
      {!showText && (
        <div className="p-2 border-t border-gray-100 space-y-1 flex-shrink-0">
          <button
            onClick={() => handleNavigate('/student/help')}
            className="w-full flex justify-center items-center h-8 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-primary transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
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

export default StudentSidebar;
