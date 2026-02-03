import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTeacherMode } from '@/contexts/TeacherModeContext';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  BarChart3,
  ClipboardList,
  MessageCircle,
  FileText,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronRight,
  Sparkles,
  BookOpen,
  Brain,
  AlertTriangle,
  Calendar,
  Settings,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';

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
      { id: 'behaviour', label: 'Behaviour & Notes', icon: <FileText className="w-4 h-4" />, path: '/teacher/my-class/behaviour' },
    ],
  },
  {
    id: 'class-analytics',
    label: 'Class Analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    children: [
      { id: 'overall', label: 'Overall Performance', icon: <BarChart3 className="w-4 h-4" />, path: '/teacher/class-analytics/overall' },
      { id: 'subject-wise', label: 'Subject-wise Analysis', icon: <BookOpen className="w-4 h-4" />, path: '/teacher/class-analytics/subject-wise' },
      { id: 'at-risk', label: 'At-Risk Students', icon: <AlertTriangle className="w-4 h-4" />, path: '/teacher/class-analytics/at-risk' },
    ],
  },
  { id: 'assessments', label: 'Assessments', icon: <ClipboardList className="w-5 h-5" />, path: '/teacher/assessments' },
  {
    id: 'communication',
    label: 'Communication',
    icon: <MessageCircle className="w-5 h-5" />,
    children: [
      { id: 'parent-messages', label: 'Parent Messages', icon: <MessageCircle className="w-4 h-4" />, path: '/teacher/communication' },
      { id: 'student-messages', label: 'Student Messages', icon: <MessageCircle className="w-4 h-4" />, path: '/teacher/communication/students' },
      { id: 'announcements', label: 'Announcements', icon: <FileText className="w-4 h-4" />, path: '/teacher/announcements/events' },
      { id: 'ptm', label: 'PTM Scheduling', icon: <Calendar className="w-4 h-4" />, path: '/teacher/meetings' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: <FileText className="w-5 h-5" />,
    children: [
      { id: 'student-reports', label: 'Student Reports', icon: <FileText className="w-4 h-4" />, path: '/teacher/reports/students' },
      { id: 'class-summary', label: 'Class Summary', icon: <FileText className="w-4 h-4" />, path: '/teacher/reports/class-summary' },
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
  { id: 'assessments', label: 'Assessments', icon: <ClipboardList className="w-5 h-5" />, path: '/teacher/assessments' },
  {
    id: 'ai-tools',
    label: 'AI Tools',
    icon: <Brain className="w-5 h-5" />,
    children: [
      { id: 'question-gen', label: 'Question Generator', icon: <Sparkles className="w-4 h-4" />, path: '/teacher/ai-tools/question-generator' },
      { id: 'worksheet-gen', label: 'Worksheet Generator', icon: <FileText className="w-4 h-4" />, path: '/teacher/ai-tools/worksheet-generator' },
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    icon: <MessageCircle className="w-5 h-5" />,
    children: [
      { id: 'parent-messages', label: 'Parent Messages', icon: <MessageCircle className="w-4 h-4" />, path: '/teacher/communication' },
      { id: 'student-messages', label: 'Student Messages', icon: <MessageCircle className="w-4 h-4" />, path: '/teacher/communication/students' },
      { id: 'announcements', label: 'Announcements', icon: <FileText className="w-4 h-4" />, path: '/teacher/announcements/events' },
      { id: 'ptm', label: 'PTM Scheduling', icon: <Calendar className="w-4 h-4" />, path: '/teacher/meetings' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: <FileText className="w-5 h-5" />,
    children: [
      { id: 'subject-performance', label: 'Subject Performance', icon: <BarChart3 className="w-4 h-4" />, path: '/teacher/reports/subject-performance' },
    ],
  },
];

const TeacherSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentMode } = useTeacherMode();
  const [expandedModules, setExpandedModules] = useState<string[]>(['my-class', 'my-subject']);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = currentMode === 'class_teacher' ? classTeacherNavItems : subjectTeacherNavItems;
  const showText = !isCollapsed;

  const isActive = (path?: string) => path && location.pathname === path;
  const isModuleActive = (item: NavItem): boolean => {
    if (item.path && isActive(item.path)) return true;
    if (item.children) {
      return item.children.some(child => isActive(child.path));
    }
    return false;
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={cn(
        "h-screen fixed left-0 top-0 flex flex-col bg-gradient-to-b from-primary via-primary/95 to-primary/90 text-white transition-all duration-300 z-50",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        {showText && (
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight">EDDGE</span>
            <span className="text-xs text-white/70">Teacher Portal</span>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleCollapse}
        className="absolute top-6 -right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center border border-white/20 hover:bg-primary/80 transition-colors"
      >
        {isCollapsed ? (
          <PanelLeft className="w-3 h-3 text-white" />
        ) : (
          <PanelLeftClose className="w-3 h-3 text-white" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => (
          <div key={item.id}>
            {item.children ? (
              <>
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isModuleActive(item)
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {item.icon}
                  {showText && (
                    <>
                      <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
                      {expandedModules.includes(item.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </>
                  )}
                </button>

                {/* Submodule Links */}
                {showText && expandedModules.includes(item.id) && (
                  <div className="ml-4 pl-2 space-y-1 border-l-2 border-white/20">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => child.path && handleNavigate(child.path)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                          isActive(child.path)
                            ? "bg-white/25 text-white"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        {child.icon}
                        <span className="font-medium text-xs">{child.label}</span>
                        {isActive(child.path) && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* Top-level Item */
              <button
                onClick={() => item.path && handleNavigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive(item.path)
                    ? "bg-white/25 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                {item.icon}
                {showText && (
                  <>
                    <span className="font-medium text-sm">{item.label}</span>
                    {isActive(item.path) && (
                      <div className="w-2 h-2 rounded-full bg-white ml-auto" />
                    )}
                  </>
                )}
              </button>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      {showText && (
        <div className="p-3 space-y-2 flex-shrink-0">
          {/* Help Center Card */}
          <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="flex justify-center -mt-6 mb-3">
              <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-primary" />
              </div>
            </div>
            
            <div className="text-center relative z-10">
              <h4 className="font-semibold text-white text-sm">EDDGE Support</h4>
              <p className="text-[11px] text-white/70 mt-1 leading-relaxed">
                Need help with EDDGE?<br />
                Contact support anytime.
              </p>
              <button
                onClick={() => handleNavigate('/teacher/support')}
                className="mt-3 w-full bg-white text-primary text-xs font-semibold py-2.5 px-3 rounded-lg hover:bg-white/90 transition-colors shadow-sm"
              >
                Go To Support
              </button>
            </div>
          </div>

          {/* Settings */}
          <button
            onClick={() => handleNavigate('/teacher/settings')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Settings</span>
          </button>

          {/* Logout */}
          <button
            onClick={() => handleNavigate('/login')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200 border-t border-white/10"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      )}

      {/* Collapsed Bottom Icons */}
      {!showText && (
        <div className="p-3 space-y-2 border-t border-white/10">
          <button
            onClick={() => handleNavigate('/teacher/support')}
            className="w-full flex justify-center py-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleNavigate('/teacher/settings')}
            className="w-full flex justify-center py-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleNavigate('/login')}
            className="w-full flex justify-center py-2 rounded-lg text-white/70 hover:bg-red-500/20 hover:text-red-200 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      )}
    </aside>
  );
};

export default TeacherSidebar;
