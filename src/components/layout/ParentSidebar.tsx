import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  LayoutDashboard,
  TrendingUp,
  Award,
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
    icon: <TrendingUp className="w-5 h-5" />,
    items: [
      { label: 'Progress', icon: <TrendingUp className="w-4 h-4" />, path: '/parent/child-progress/1' },
      { label: 'Achievements', icon: <Award className="w-4 h-4" />, path: '/parent/achievements' },
    ],
  },
  {
    title: 'Communication',
    icon: <MessageSquare className="w-5 h-5" />,
    items: [{ label: 'Messages', icon: <MessageSquare className="w-4 h-4" />, path: '/parent/communications' }],
  },
  {
    title: 'Learning',
    icon: <BookOpen className="w-5 h-5" />,
    items: [
      { label: 'Homework', icon: <FileText className="w-4 h-4" />, path: '/parent/homework' },
      { label: 'Announcements', icon: <Bell className="w-4 h-4" />, path: '/parent/announcements' },
    ],
  },
];

interface ParentSidebarProps {
  collapsed?: boolean;
  isMobile?: boolean;
  onMobileClose?: () => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

const ParentSidebar = ({ collapsed = false, isMobile = false, onMobileClose, onCollapseChange }: ParentSidebarProps) => {
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
    <div className="flex flex-col h-full bg-white border-r border-gray-100 font-sans">
      {/* Logo */}
      <div
        className={cn(
          'p-6 flex items-center gap-3 border-b border-gray-100',
          collapsed && !isMobile && 'justify-center p-4',
        )}
      >
        <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        {showText && (
          <div>
            <span className="text-2xl font-bold text-primary tracking-tight">EDDGE</span>
            <span className="text-xs text-gray-500 block">Parent Portal</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav
        className={cn(
          'flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide',
          collapsed && !isMobile ? 'px-2' : '',
        )}
      >
        {/* Dashboard */}
        <button
          onClick={() => handleNavigate('/parent')}
          className={cn(
            'w-full flex items-center px-4 py-3 gap-3 rounded-xl transition-all duration-200',
            collapsed && !isMobile ? 'justify-center px-2' : '',
            isDashboardActive
              ? 'bg-primary/10 text-primary'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
          )}
        >
          <LayoutDashboard
            className={cn(
              'w-5 h-5 flex-shrink-0',
              isDashboardActive ? 'text-primary' : 'text-gray-400',
            )}
          />
          {showText && (
            <>
              <span className="font-medium text-sm flex-1 text-left">Dashboard</span>
              {isDashboardActive && <span className="w-2 h-2 rounded-full bg-primary ml-auto" />}
            </>
          )}
        </button>

        {/* Collapsible Sections */}
        {navSections.map((section) => (
          <div key={section.title}>
            {collapsed && !isMobile ? (
              // Collapsed: Show only icons
              <div className="space-y-1">
                <div className="w-full flex justify-center py-1.5 text-gray-400">
                  <span className="flex-shrink-0">{section.icon}</span>
                </div>
                {section.items.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={cn(
                      'w-full flex justify-center p-2 rounded-lg transition-all duration-200',
                      isPathActive(item.path)
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600',
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
                      'w-full flex items-center px-4 py-3 gap-3 rounded-xl transition-all duration-200',
                      isSectionActive(section)
                        ? 'text-primary'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    )}
                  >
                    <span
                      className={cn(
                        'flex-shrink-0',
                        isSectionActive(section) ? 'text-primary' : 'text-gray-400',
                      )}
                    >
                      {section.icon}
                    </span>
                    {showText && (
                      <>
                        <span className="font-medium text-sm flex-1 text-left">{section.title}</span>
                        <ChevronDown
                          className={cn(
                            'w-4 h-4 text-gray-400 transition-transform duration-200',
                            openSections.includes(section.title) && 'rotate-180',
                          )}
                        />
                      </>
                    )}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div
                    className={cn(
                      'ml-4 pl-2 space-y-1 border-l-2 border-gray-200',
                      collapsed && !isMobile && 'ml-0 pl-0 border-0',
                    )}
                  >
                    {section.items.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleNavigate(item.path)}
                        className={cn(
                          'w-full flex items-center px-3 py-2.5 gap-3 rounded-lg transition-all duration-200',
                          collapsed && !isMobile ? 'justify-center px-2' : '',
                          isPathActive(item.path)
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700',
                        )}
                      >
                        <span
                          className={cn(
                            'flex-shrink-0',
                            isPathActive(item.path) ? 'text-primary' : 'text-gray-400',
                          )}
                        >
                          {item.icon}
                        </span>
                        {showText && (
                          <>
                            <span className="font-medium text-xs flex-1 text-left">{item.label}</span>
                            {isPathActive(item.path) && (
                              <span className="w-1.5 h-1.5 rounded-full bg-primary ml-auto" />
                            )}
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      {showText && (
        <div className="p-3 space-y-2 flex-shrink-0">
          <button
            onClick={() => handleNavigate('/parent/support')}
            className={cn(
              'w-full flex items-center px-4 py-3 gap-3 rounded-xl transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            )}
          >
            <HelpCircle className="w-5 h-5 flex-shrink-0 text-gray-400" />
            <span className="font-medium text-sm">Help & Support</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 gap-3 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      )}

      {/* Collapsed Icons */}
      {!showText && (
        <div className="p-3 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={() => handleNavigate('/parent/support')}
            className="w-full flex justify-center items-center py-3 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors mb-2"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex justify-center items-center py-3 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ParentSidebar;