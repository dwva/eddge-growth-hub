import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  FileText,
  Bell,
  DollarSign,
  Settings,
  Sparkles,
  ChevronDown,
  UserPlus,
  School,
  Calendar,
  BarChart3,
  Megaphone,
  Receipt,
  Cog
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SubItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface NavSection {
  label: string;
  icon: React.ReactNode;
  subItems: SubItem[];
}

const navSections: NavSection[] = [
  {
    label: 'Management',
    icon: <Users className="w-5 h-5" />,
    subItems: [
      { label: 'Teachers', icon: <Users className="w-4 h-4" />, path: '/admin/teachers' },
      { label: 'Students', icon: <GraduationCap className="w-4 h-4" />, path: '/admin/students' },
      { label: 'Classes', icon: <BookOpen className="w-4 h-4" />, path: '/admin/classes' },
      { label: 'Attendance', icon: <ClipboardList className="w-4 h-4" />, path: '/admin/attendance' },
    ]
  },
  {
    label: 'Administration',
    icon: <FileText className="w-5 h-5" />,
    subItems: [
      { label: 'Reports', icon: <BarChart3 className="w-4 h-4" />, path: '/admin/reports' },
      { label: 'Announcements', icon: <Megaphone className="w-4 h-4" />, path: '/admin/announcements' },
    ]
  },
  {
    label: 'Finance',
    icon: <DollarSign className="w-5 h-5" />,
    subItems: [
      { label: 'Fee Collection', icon: <Receipt className="w-4 h-4" />, path: '/admin/finance' },
    ]
  },
  {
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    subItems: [
      { label: 'School Settings', icon: <Cog className="w-4 h-4" />, path: '/admin/settings' },
    ]
  },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

const AdminSidebar = ({ collapsed = false, isMobile = false, onMobileClose }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSections, setOpenSections] = useState<string[]>(['Management', 'Administration']);

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const isPathActive = (path: string) => location.pathname === path;
  const isSectionActive = (section: NavSection) => section.subItems.some(item => location.pathname === item.path);
  const showText = !collapsed || isMobile;

  const toggleSection = (label: string) => {
    setOpenSections(prev => 
      prev.includes(label) 
        ? prev.filter(s => s !== label)
        : [...prev, label]
    );
  };

  return (
    <div className="flex flex-col h-full gradient-sidebar font-sans">
      {/* Logo */}
      <div className={cn(
        "flex items-center h-20 border-b border-white/10",
        collapsed && !isMobile ? "justify-center px-3" : "gap-3 px-5"
      )}>
        <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        {showText && (
          <div>
            <span className="text-xl font-bold text-white tracking-tight">EDDGE</span>
            <span className="text-xs text-white/70 block">Admin Portal</span>
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
          onClick={() => handleNavigate('/admin')}
          className={cn(
            "w-full flex items-center rounded-2xl transition-all duration-200 h-12 mb-4",
            collapsed && !isMobile ? "justify-center px-2" : "gap-3 px-4",
            isPathActive('/admin')
              ? "bg-white/20 backdrop-blur-sm text-white" 
              : "text-white/80 hover:bg-white/10"
          )}
        >
          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
          {showText && (
            <>
              <span className="font-medium flex-1 text-left">Dashboard</span>
              {isPathActive('/admin') && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </>
          )}
        </button>

        {/* Collapsible Sections */}
        <div className="space-y-2">
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
                      ? "text-white" 
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  )}
                >
                  <span className="flex-shrink-0">{section.icon}</span>
                  {showText && (
                    <>
                      <span className="font-medium flex-1 text-left">{section.label}</span>
                      <ChevronDown 
                        className={cn(
                          "w-4 h-4 transition-transform duration-200",
                          openSections.includes(section.label) ? "rotate-180" : ""
                        )} 
                      />
                    </>
                  )}
                </button>
              </CollapsibleTrigger>
              
              {showText && (
                <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                  <div className="ml-4 pl-4 border-l border-white/20 mt-1 space-y-1">
                    {section.subItems.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleNavigate(item.path)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                          isPathActive(item.path)
                            ? "bg-white/15 text-white font-medium" 
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <span className="flex-shrink-0">{item.icon}</span>
                        <span className="text-sm">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </CollapsibleContent>
              )}
            </Collapsible>
          ))}
        </div>
      </nav>

      {/* Bottom section - collapsed only shows icon */}
      {!showText && (
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => handleNavigate('/admin/settings')}
            className="w-full flex justify-center items-center h-10 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;
