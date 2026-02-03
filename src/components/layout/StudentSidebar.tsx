import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  ClipboardCheck,
  Compass,
  RotateCcw,
  MessageSquare,
  TrendingUp,
  Award,
  CalendarDays,
  Settings,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

// Main navigation items
const mainNavItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/student' },
  { label: 'Planner', icon: <CalendarCheck className="w-5 h-5" />, path: '/student/planner' },
  { label: 'Learn', icon: <BookOpen className="w-5 h-5" />, path: '/student/learning' },
  { label: 'Practice', icon: <ClipboardCheck className="w-5 h-5" />, path: '/student/practice' },
  { label: 'Revision', icon: <RotateCcw className="w-5 h-5" />, path: '/student/revision' },
];

// Resources section
const resourcesNavItems: NavItem[] = [
  { label: 'Explore', icon: <Compass className="w-5 h-5" />, path: '/student/resources' },
  { label: 'AI Doubts', icon: <MessageSquare className="w-5 h-5" />, path: '/student/doubts' },
  { label: 'Performance', icon: <TrendingUp className="w-5 h-5" />, path: '/student/performance' },
  { label: 'Achievements', icon: <Award className="w-5 h-5" />, path: '/student/achievements' },
  { label: 'Attendance', icon: <CalendarDays className="w-5 h-5" />, path: '/student/attendance' },
  { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/student/settings' },
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

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const isPathActive = (path: string) => location.pathname === path;
  const showText = !collapsed || isMobile;

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      {/* Logo section */}
      <div className={cn(
        "px-6 py-8 flex items-center gap-3",
        collapsed && !isMobile && "justify-center px-4"
      )}>
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {showText && (
          <span className="text-2xl font-bold text-gray-900 tracking-tight">EDDGE.</span>
        )}
      </div>

      {/* Main Navigation */}
      <nav className={cn(
        "flex-1 px-4 overflow-y-auto scrollbar-hide",
        collapsed && !isMobile && "px-2"
      )}>
        {/* Main Items */}
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                collapsed && !isMobile && "justify-center px-3",
                isPathActive(item.path)
                  ? "text-primary font-medium" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
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

        {/* Resources Section Label */}
        {showText && (
          <div className="px-4 pt-8 pb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Resources</span>
          </div>
        )}

        {/* Resources Items */}
        <div className="space-y-1">
          {resourcesNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                collapsed && !isMobile && "justify-center px-3",
                isPathActive(item.path)
                  ? "text-primary font-medium" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
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

      {/* Bottom section - Help Center Card */}
      {showText && (
        <div className="p-4 flex-shrink-0">
          <div className="bg-gradient-to-br from-primary/10 via-green-50 to-primary/5 rounded-2xl p-5 relative overflow-hidden">
            {/* Question mark floating icon */}
            <div className="absolute -top-1 left-4">
              <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-100">
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            
            <div className="pt-6 text-center">
              <h4 className="font-semibold text-gray-900 text-base">Help Center</h4>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Having trouble in EDDGE.<br />
                Please contact us for more questions.
              </p>
              <button
                onClick={() => handleNavigate('/student/help')}
                className="mt-4 w-full bg-white text-gray-700 text-sm font-medium py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors shadow-sm border border-gray-100"
              >
                Go To Help Center
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Help Icon */}
      {!showText && (
        <div className="p-3 flex-shrink-0">
          <button
            onClick={() => handleNavigate('/student/help')}
            className="w-full flex justify-center items-center py-3 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-primary transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentSidebar;
