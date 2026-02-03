import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChild } from '@/contexts/ChildContext';
import {
  Home,
  TrendingUp,
  Award,
  Calendar,
  MessageSquare,
  BookOpen,
  Bell,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

interface ParentSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const ParentSidebar = ({ isCollapsed, onToggle }: ParentSidebarProps) => {
  const location = useLocation();
  const { t } = useLanguage();
  const { selectedChild } = useChild();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['performance', 'communication', 'learning']);

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const navGroups = [
    {
      id: 'main',
      items: [
        { label: t('nav.home'), icon: Home, path: '/parent' },
      ],
    },
    {
      id: 'performance',
      title: 'Student Performance',
      items: [
        { label: t('nav.progress'), icon: TrendingUp, path: `/parent/child-progress/${selectedChild?.id || '1'}` },
        { label: t('nav.achievements'), icon: Award, path: '/parent/achievements' },
      ],
    },
    {
      id: 'communication',
      title: 'Communication',
      items: [
        { label: t('nav.meetings'), icon: Calendar, path: '/parent/meetings' },
        { label: t('nav.messages'), icon: MessageSquare, path: '/parent/communications' },
      ],
    },
    {
      id: 'learning',
      title: 'Learning',
      items: [
        { label: t('nav.homework'), icon: BookOpen, path: '/parent/homework' },
        { label: t('nav.announcements'), icon: Bell, path: '/parent/announcements' },
      ],
    },
  ];

  const bottomItems = [
    { label: t('nav.support'), icon: HelpCircle, path: '/parent/support' },
    { label: t('nav.settings'), icon: Settings, path: '/parent/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/parent') return location.pathname === '/parent';
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-primary via-primary to-primary/90 text-white transition-all duration-300 flex flex-col',
        isCollapsed ? 'w-14' : 'w-56'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        {!isCollapsed && (
          <span className="text-lg font-bold tracking-tight">EDDGE</span>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1 scrollbar-hide">
        {navGroups.map((group) => (
          <div key={group.id}>
            {group.title && !isCollapsed && (
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-medium text-white/60 uppercase tracking-wider hover:text-white/80"
              >
                <span>{group.title}</span>
                {expandedGroups.includes(group.id) ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>
            )}
            
            {(group.id === 'main' || expandedGroups.includes(group.id) || isCollapsed) && (
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all text-[11px]',
                      isActive(item.path)
                        ? 'bg-white/20 text-white font-medium'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                    {isActive(item.path) && !isCollapsed && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom Items */}
      <div className="border-t border-white/10 p-2 space-y-0.5">
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all text-[11px]',
              isActive(item.path)
                ? 'bg-white/20 text-white font-medium'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            )}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default ParentSidebar;
