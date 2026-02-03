import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTeacherMode } from '@/contexts/TeacherModeContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  BarChart3,
  ClipboardList,
  MessageCircle,
  FileText,
  LogOut,
  ChevronDown,
  Sparkles,
  BookOpen,
  Brain,
  AlertTriangle,
  Calendar,
  Settings,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: NavItem[];
}

// Class Teacher Mode Navigation
const classTeacherNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/teacher' },
  {
    id: 'my-class',
    label: 'My Class',
    icon: <FolderOpen className="w-5 h-5" />,
    children: [
      { id: 'students', label: 'Students', icon: <Users className="w-4 h-4" />, path: '/teacher/my-class/students' },
      { id: 'attendance', label: 'Mark Attendance', icon: <Calendar className="w-4 h-4" />, path: '/teacher/my-class/attendance' },
      { id: 'class-summary', label: 'Class Summary', icon: <FileText className="w-4 h-4" />, path: '/teacher/reports/class-summary' },
    ],
  },
  { id: 'class-analytics', label: 'Class Analytics', icon: <BarChart3 className="w-5 h-5" />, path: '/teacher/class-analytics' },
  { id: 'assessments', label: 'Assessments', icon: <ClipboardList className="w-5 h-5" />, path: '/teacher/assessments' },
  {
    id: 'communication',
    label: 'Communication',
    icon: <MessageCircle className="w-5 h-5" />,
    children: [
      { id: 'parent-messages', label: 'Parent Messages', icon: <MessageCircle className="w-4 h-4" />, path: '/teacher/communication' },
      { id: 'announcements', label: 'Announcements', icon: <FileText className="w-4 h-4" />, path: '/teacher/announcements/events' },
    ],
  },
];

// Subject Teacher Mode Navigation
const subjectTeacherNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/teacher' },
  {
    id: 'my-subject',
    label: 'My Subject',
    icon: <BookOpen className="w-5 h-5" />,
    children: [
      { id: 'classes', label: 'Classes', icon: <Users className="w-4 h-4" />, path: '/teacher/my-subject/classes' },
      { id: 'students', label: 'Students', icon: <Users className="w-4 h-4" />, path: '/teacher/my-subject/students' },
    ],
  },
  {
    id: 'subject-analytics',
    label: 'Subject Analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    children: [
      { id: 'chapters', label: 'Chapters', icon: <BookOpen className="w-4 h-4" />, path: '/teacher/subject-analytics/chapters' },
      { id: 'topics', label: 'Topics', icon: <FileText className="w-4 h-4" />, path: '/teacher/subject-analytics/topics' },
      { id: 'mistakes', label: 'Common Mistakes', icon: <AlertTriangle className="w-4 h-4" />, path: '/teacher/subject-analytics/mistakes' },
    ],
  },
  {
    id: 'ai-tools',
    label: 'AI Tools',
    icon: <Brain className="w-5 h-5" />,
    children: [
      { id: 'question-gen', label: 'Question Generator', icon: <Sparkles className="w-4 h-4" />, path: '/teacher/ai-tools/question-generator' },
      { id: 'worksheet-gen', label: 'Worksheet Generator', icon: <FileText className="w-4 h-4" />, path: '/teacher/ai-tools/worksheet-generator' },
      { id: 'assessments', label: 'Assessments', icon: <ClipboardList className="w-4 h-4" />, path: '/teacher/assessments' },
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    icon: <MessageCircle className="w-5 h-5" />,
    children: [
      { id: 'parent-messages', label: 'Parent Messages', icon: <MessageCircle className="w-4 h-4" />, path: '/teacher/communication' },
      { id: 'announcements', label: 'Announcements', icon: <FileText className="w-4 h-4" />, path: '/teacher/announcements/events' },
    ],
  },
];

interface TeacherSidebarProps {
  collapsed?: boolean;
  isMobile?: boolean;
  onMobileClose?: () => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

const TeacherSidebar = ({ collapsed = false, isMobile = false, onMobileClose }: TeacherSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { currentMode } = useTeacherMode();
  
  // Keep all parent sections open by default and maintain based on active path
  const getActiveSections = () => {
    const sections: string[] = [];
    const navItems = currentMode === 'class_teacher' ? classTeacherNavItems : subjectTeacherNavItems;
    
    navItems.forEach(item => {
      if (item.children) {
        // Check if any child path matches current location
        const hasActiveChild = item.children.some(child => 
          child.path && location.pathname.startsWith(child.path.split('/').slice(0, -1).join('/'))
        );
        if (hasActiveChild || item.children.some(child => child.path === location.pathname)) {
          sections.push(item.id);
        }
      }
    });
    
    // Always keep these sections open by default
    return [...new Set([...sections, 'my-class', 'my-subject', 'class-analytics', 'subject-analytics', 'communication', 'ai-tools'])];
  };
  
  const [openSections, setOpenSections] = useState<string[]>(getActiveSections());

  const navItems = currentMode === 'class_teacher' ? classTeacherNavItems : subjectTeacherNavItems;
  const showText = !collapsed || isMobile;

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

  const isPathActive = (path?: string) => path && location.pathname === path;
  const isSectionActive = (item: NavItem): boolean => {
    if (item.path && isPathActive(item.path)) return true;
    if (item.children) {
      return item.children.some(child => isPathActive(child.path));
    }
    return false;
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100 font-sans">
      {/* Logo section */}
      <div className={cn(
        "p-6 flex items-center gap-3 border-b border-gray-100",
        collapsed && !isMobile && "justify-center p-4"
      )}>
        <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        {showText && (
          <div>
            <span className="text-xl font-bold text-primary tracking-tight">EDDGE</span>
            <span className="text-[11px] text-muted-foreground block">Teacher Portal</span>
          </div>
        )}
      </div>

      {/* Navigation container */}
      <nav className={cn(
        "flex-1 px-3 py-4 overflow-y-auto scrollbar-hide",
        collapsed && !isMobile && "px-2"
      )}>
        <div className="space-y-1">
          {navItems.map((item) => (
            <div key={item.id}>
              {item.children ? (
                <Collapsible
                  open={openSections.includes(item.id)}
                  onOpenChange={() => toggleSection(item.id)}
                >
                  <CollapsibleTrigger asChild>
                    <button
                      className={cn(
                        "w-full flex items-center px-4 py-3 gap-3 rounded-xl transition-all duration-200",
                        collapsed && !isMobile && "justify-center px-2",
                        isSectionActive(item)
                          ? "text-primary" 
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <span className={cn(
                        "flex-shrink-0",
                        isSectionActive(item) ? "text-primary" : "text-gray-400"
                      )}>
                        {item.icon}
                      </span>
                      {showText && (
                        <>
                          <span className="font-medium text-xs flex-1 text-left">{item.label}</span>
                          <ChevronDown className={cn(
                            "w-4 h-4 text-gray-400 transition-transform duration-200",
                            openSections.includes(item.id) ? "rotate-180" : ""
                          )} />
                        </>
                      )}
                    </button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className={cn(
                      "ml-4 pl-2 space-y-1 border-l-2 border-gray-200",
                      collapsed && !isMobile && "ml-0 pl-0 border-0"
                    )}>
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => child.path && handleNavigate(child.path)}
                          className={cn(
                            "w-full flex items-center px-3 py-2.5 gap-3 rounded-lg transition-all duration-200",
                            collapsed && !isMobile && "justify-center px-2",
                            isPathActive(child.path)
                              ? "bg-primary/10 text-primary" 
                              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                          )}
                        >
                          <span className={cn(
                            "flex-shrink-0",
                            isPathActive(child.path) ? "text-primary" : "text-gray-400"
                          )}>
                            {child.icon}
                          </span>
                          {showText && (
                            <>
                                      <span className="font-medium text-xs flex-1 text-left">{child.label}</span>
                              {isPathActive(child.path) && (
                                <span className="w-1.5 h-1.5 rounded-full bg-primary ml-auto" />
                              )}
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <button
                  onClick={() => item.path && handleNavigate(item.path)}
                  className={cn(
                    "w-full flex items-center px-4 py-3 gap-3 rounded-xl transition-all duration-200",
                    collapsed && !isMobile && "justify-center px-2",
                    isPathActive(item.path)
                      ? "bg-primary/10 text-primary" 
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
                    <>
                      <span className="font-medium text-xs flex-1 text-left">{item.label}</span>
                      {isPathActive(item.path) && (
                        <span className="w-2 h-2 rounded-full bg-primary ml-auto" />
                      )}
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Bottom section */}
      {showText && (
        <div className="p-3 space-y-2 flex-shrink-0">
          {/* Settings */}
          <button
            onClick={() => handleNavigate('/teacher/settings')}
            className="w-full flex items-center px-4 py-2.5 gap-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
          >
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-xs">Settings</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 gap-3 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-xs">Logout</span>
          </button>
        </div>
      )}

      {/* Collapsed Icons */}
      {!showText && (
        <div className="p-3 border-t border-gray-100 space-y-2 flex-shrink-0">
          <button
            onClick={() => handleNavigate('/teacher/settings')}
            className="w-full flex justify-center items-center py-2.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-primary transition-colors"
          >
            <Settings className="w-5 h-5" />
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

export default TeacherSidebar;
