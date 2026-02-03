import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  GraduationCap,
  BarChart3,
  Bell,
  FileText,
  ChevronDown
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
  const [openSections, setOpenSections] = useState<string[]>(['Learning', 'Resources', 'Updates', 'Progress']);

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
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
      {/* Logo - Planti style */}
      <div className={cn(
        "flex items-center h-16 border-b border-gray-100",
        collapsed && !isMobile ? "justify-center px-3" : "gap-3 px-5"
      )}>
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {showText && (
          <span className="text-xl font-bold text-primary tracking-tight">EDDGE</span>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 py-4 overflow-y-auto scrollbar-hide",
        collapsed && !isMobile ? "px-2" : "px-3"
      )}>
        {/* Dashboard - Standalone */}
        <div className="mb-2">
          <button
            onClick={() => handleNavigate('/student')}
            className={cn(
              "w-full flex items-center rounded-xl transition-all duration-200 h-11",
              collapsed && !isMobile ? "justify-center px-2" : "gap-3 px-4",
              isPathActive('/student')
                ? "bg-primary/10 text-primary font-medium" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <span className={cn(
              "flex-shrink-0",
              isPathActive('/student') ? "text-primary" : "text-gray-400"
            )}>
              <LayoutDashboard className="w-5 h-5" />
            </span>
            {showText && (
              <>
                <span className="text-sm flex-1 text-left">Dashboard</span>
                {isPathActive('/student') && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </>
            )}
          </button>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-1">
          {navSections.map((section) => (
            <Collapsible
              key={section.label}
              open={openSections.includes(section.label)}
              onOpenChange={() => toggleSection(section.label)}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "w-full flex items-center rounded-xl transition-all duration-200 h-11",
                    collapsed && !isMobile ? "justify-center px-2" : "gap-3 px-4",
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
                      <span className="text-sm flex-1 text-left">{section.label}</span>
                      <ChevronDown className={cn(
                        "w-4 h-4 text-gray-400 transition-transform duration-200",
                        openSections.includes(section.label) ? "rotate-180" : ""
                      )} />
                    </>
                  )}
                </button>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className={cn(
                  "mt-1 space-y-0.5",
                  collapsed && !isMobile ? "" : "ml-4 pl-4 border-l border-gray-100"
                )}>
                  {section.items.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className={cn(
                        "w-full flex items-center rounded-lg transition-all duration-200 h-9",
                        collapsed && !isMobile ? "justify-center px-2" : "gap-3 px-3",
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
                        <span className="text-sm">{item.label}</span>
                      )}
                    </button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </nav>

      {/* Bottom Help Card */}
      {showText && (
        <div className="p-4">
          <div className="bg-primary/5 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary/10" />
            <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
              <HelpCircle className="w-4 h-4 text-primary" />
            </div>
            
            <div className="mt-8">
              <h4 className="font-semibold text-gray-900 text-sm">Help Center</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Having trouble? Please contact us for help.
              </p>
              <button
                onClick={() => handleNavigate('/student/help')}
                className="mt-3 w-full bg-white text-gray-700 text-sm font-medium py-2.5 px-4 rounded-xl hover:bg-gray-50 transition-colors shadow-sm border border-gray-100"
              >
                Go To Help Center
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Help Icon */}
      {!showText && (
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => handleNavigate('/student/help')}
            className="w-full flex justify-center items-center h-10 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-primary transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentSidebar;
