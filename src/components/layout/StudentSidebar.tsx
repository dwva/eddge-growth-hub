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
  Sparkles
} from 'lucide-react';

// Flat nav items - Planti style (no collapsible sections)
const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/student' },
  { label: 'Learning', icon: <BookOpen className="w-5 h-5" />, path: '/student/learning' },
  { label: 'Planner', icon: <CalendarCheck className="w-5 h-5" />, path: '/student/planner' },
  { label: 'AI Doubt Solver', icon: <MessageSquare className="w-5 h-5" />, path: '/student/doubts' },
  { label: 'Homework', icon: <ClipboardCheck className="w-5 h-5" />, path: '/student/homework' },
  { label: 'Resources', icon: <FolderOpen className="w-5 h-5" />, path: '/student/resources' },
];

const progressItems = [
  { label: 'Progress', icon: <TrendingUp className="w-5 h-5" />, path: '/student/performance' },
  { label: 'Achievements', icon: <Award className="w-5 h-5" />, path: '/student/achievements' },
];

interface StudentSidebarProps {
  collapsed?: boolean;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

const StudentSidebar = ({ collapsed = false, isMobile = false, onMobileClose }: StudentSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const isPathActive = (path: string) => location.pathname === path;
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

      {/* Navigation - Planti flat style */}
      <nav className={cn(
        "flex-1 py-4 overflow-y-auto scrollbar-hide",
        collapsed && !isMobile ? "px-2" : "px-3"
      )}>
        {/* Main Nav Items */}
        <div className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={cn(
                "w-full flex items-center rounded-xl transition-all duration-200 h-11",
                collapsed && !isMobile ? "justify-center px-2" : "gap-3 px-4",
                isPathActive(item.path)
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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

        {/* Divider + Section Label */}
        {showText && (
          <div className="mt-6 mb-3 px-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Progress
            </span>
          </div>
        )}
        {!showText && <div className="h-6" />}

        {/* Progress Items */}
        <div className="space-y-1">
          {progressItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={cn(
                "w-full flex items-center rounded-xl transition-all duration-200 h-11",
                collapsed && !isMobile ? "justify-center px-2" : "gap-3 px-4",
                isPathActive(item.path)
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
      </nav>

      {/* Bottom Help Card - Planti style */}
      {showText && (
        <div className="p-4">
          <div className="bg-primary/5 rounded-2xl p-4 relative overflow-hidden">
            {/* Decorative circle */}
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
