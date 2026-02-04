import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  LayoutDashboard,
  TrendingUp,
  Award,
  Calendar,
  MessageSquare,
  BookOpen,
  Bell,
  HelpCircle,
  LogOut,
  ChevronDown,
  Sparkles,
  FileText,
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
    title: 'Performance',
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    items: [
      { label: 'Progress', icon: <TrendingUp className="w-3 h-3" />, path: '/parent/child-progress/1' },
      { label: 'Achievements', icon: <Award className="w-3 h-3" />, path: '/parent/achievements' },
    ],
  },
  {
    title: 'Communication',
    icon: <MessageSquare className="w-3.5 h-3.5" />,
    items: [{ label: 'Messages', icon: <MessageSquare className="w-3 h-3" />, path: '/parent/communications' }],
  },
  {
    title: 'Learning',
    icon: <BookOpen className="w-3.5 h-3.5" />,
    items: [
      { label: 'Homework', icon: <FileText className="w-3 h-3" />, path: '/parent/homework' },
      { label: 'Announcements', icon: <Bell className="w-3 h-3" />, path: '/parent/announcements' },
    ],
  },
];

interface ParentSidebarProps {
  collapsed?: boolean;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

const ParentSidebar = ({ collapsed = false, isMobile = false, onMobileClose }: ParentSidebarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openSections, setOpenSections] = useState<string[]>(['Performance', 'Communication', 'Learning']);

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
    setOpenSections((prev) => (prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]));
  };

  const isPathActive = (path: string) => {
    if (path.includes('/child-progress/')) {
      return location.pathname.includes('/child-progress/');
    }
    return location.pathname === path;
  };

  const isDashboardActive = location.pathname === '/parent';

  const isSectionActive = (section: NavSection) => section.items.some((item) => isPathActive(item.path));

  const showText = !collapsed || isMobile;

  return (
    <div className="flex flex-col h-full gradient-sidebar font-sans">
      {/* Logo */}
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-4 border-b border-white/10',
          collapsed && !isMobile && 'justify-center px-2',
        )}
      >
        <div
          className={cn(
            'rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0',
            collapsed && !isMobile ? 'w-7 h-7' : 'w-8 h-8',
          )}
        >
          <Sparkles className={cn(collapsed && !isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4', 'text-white')} />
        </div>
        {showText && (
          <div>
            <span className="text-sm font-bold text-white tracking-tight">EDDGE</span>
            <p className="text-[9px] text-white/60">Parent Portal</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav
        className={cn(
          'flex-1 py-2 space-y-0.5 overflow-y-auto scrollbar-hide',
          collapsed && !isMobile ? 'px-1.5' : 'px-2',
        )}
      >
        {/* Dashboard */}
        <button
          onClick={() => handleNavigate('/parent')}
          className={cn(
            'w-full flex items-center gap-2 rounded-lg transition-all duration-200',
            collapsed && !isMobile ? 'justify-center p-2' : 'px-2.5 py-2',
            isDashboardActive ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white',
          )}
        >
          <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
          {showText && (
            <>
              <span className="text-[11px] font-medium">Dashboard</span>
              {isDashboardActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
            </>
          )}
        </button>

        {/* Spacer */}
        <div className="h-1" />

        {/* Collapsible Sections */}
        {navSections.map((section) => (
          <div key={section.title}>
            {collapsed && !isMobile ? (
              // Collapsed: Show only icons
              <div className="space-y-0.5">
                <div className="w-full flex justify-center py-1.5 text-white/40">
                  <span className="flex-shrink-0">{section.icon}</span>
                </div>
                {section.items.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={cn(
                      'w-full flex justify-center p-2 rounded-lg transition-all duration-200',
                      isPathActive(item.path)
                        ? 'bg-white/20 text-white'
                        : 'text-white/60 hover:bg-white/10 hover:text-white',
                    )}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                  </button>
                ))}
              </div>
            ) : (
              // Expanded: Full collapsible
              <Collapsible open={openSections.includes(section.title)} onOpenChange={() => toggleSection(section.title)}>
                <CollapsibleTrigger asChild>
                  <button
                    className={cn(
                      'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all duration-200',
                      isSectionActive(section)
                        ? 'text-white'
                        : 'text-white/60 hover:bg-white/10 hover:text-white',
                    )}
                  >
                    <span className="flex-shrink-0">{section.icon}</span>
                    <span className="text-[11px] font-medium">{section.title}</span>
                    <ChevronDown
                      className={cn(
                        'ml-auto w-3 h-3 transition-transform duration-200',
                        openSections.includes(section.title) && 'rotate-180',
                      )}
                    />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-0 ml-2.5 pl-2.5 border-l border-white/10">
                  {section.items.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className={cn(
                        'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all duration-200',
                        isPathActive(item.path)
                          ? 'bg-white/20 text-white'
                          : 'text-white/50 hover:bg-white/10 hover:text-white',
                      )}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span className={section.title === 'Learning' ? 'text-[9px]' : 'text-[10px]'}>{item.label}</span>
                    </button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-white/10 p-2 space-y-0.5">
        <button
          onClick={() => handleNavigate('/parent/support')}
          className={cn(
            'w-full flex items-center gap-2 rounded-lg transition-all duration-200 text-white/60 hover:bg-white/10 hover:text-white',
            collapsed && !isMobile ? 'justify-center p-2' : 'px-2.5 py-1.5',
          )}
        >
          <HelpCircle className="w-4 h-4 flex-shrink-0" />
          {showText && <span className="text-[10px]">Help & Support</span>}
        </button>

        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-2 rounded-lg transition-all duration-200 text-white/60 hover:bg-white/10 hover:text-white',
            collapsed && !isMobile ? 'justify-center p-2' : 'px-2.5 py-1.5',
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {showText && <span className="text-[10px]">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default ParentSidebar;
