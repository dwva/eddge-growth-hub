import { useState } from 'react';
import { 
  Plus, 
  Search, 
  PenLine,
  Calculator,
  FlaskConical,
  BookOpen,
  Code,
  Globe,
  FolderOpen,
  MessageSquare,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Conversation } from './types';

interface ChatHistoryProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  onNewChat: () => void;
  onSelectConversation: (conv: Conversation) => void;
}

const tools = [
  { icon: Calculator, label: 'Math Solver', color: 'text-blue-500' },
  { icon: FlaskConical, label: 'Science Helper', color: 'text-emerald-500' },
  { icon: PenLine, label: 'Essay Writer', color: 'text-amber-500' },
  { icon: Code, label: 'Code Helper', color: 'text-purple-500' },
  { icon: Globe, label: 'Research', color: 'text-cyan-500' },
];

const subjects = [
  { id: 'math', label: 'Mathematics', icon: Calculator },
  { id: 'science', label: 'Science', icon: FlaskConical },
  { id: 'english', label: 'English', icon: BookOpen },
];

export function ChatHistory({
  conversations,
  activeConversation,
  onNewChat,
  onSelectConversation,
}: ChatHistoryProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toolsExpanded, setToolsExpanded] = useState(false);
  const [subjectsExpanded, setSubjectsExpanded] = useState(true);

  const groupConversationsByDate = () => {
    const today: Conversation[] = [];
    const yesterday: Conversation[] = [];
    const thisWeek: Conversation[] = [];
    const older: Conversation[] = [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 86400000);
    const weekStart = new Date(todayStart.getTime() - 7 * 86400000);

    conversations.forEach(conv => {
      if (conv.timestamp >= todayStart) {
        today.push(conv);
      } else if (conv.timestamp >= yesterdayStart) {
        yesterday.push(conv);
      } else if (conv.timestamp >= weekStart) {
        thisWeek.push(conv);
      } else {
        older.push(conv);
      }
    });

    return { today, yesterday, thisWeek, older };
  };

  const grouped = groupConversationsByDate();

  const filteredConversations = searchQuery 
    ? conversations.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : null;

  const renderChatItem = (conv: Conversation) => (
    <button
      key={conv.id}
      onClick={() => onSelectConversation(conv)}
      className={cn(
        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors truncate flex items-center gap-2",
        activeConversation?.id === conv.id
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
    >
      <MessageSquare className="w-4 h-4 flex-shrink-0 opacity-60" />
      <span className="truncate">{conv.title}</span>
    </button>
  );

  const renderGroup = (title: string, convs: Conversation[]) => {
    if (convs.length === 0) return null;
    return (
      <div className="mb-3">
        <p className="text-[11px] text-muted-foreground px-3 mb-1 font-medium uppercase tracking-wider">
          {title}
        </p>
        <div className="space-y-0.5">
          {convs.map(renderChatItem)}
        </div>
      </div>
    );
  };

  return (
    <aside className="w-64 border-l border-border bg-card flex flex-col flex-shrink-0">
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {/* New Chat Button */}
          <Button
            variant="ghost"
            onClick={onNewChat}
            className={cn(
              "w-full justify-start gap-3 h-10 px-3 font-normal",
              !activeConversation
                ? "bg-muted text-foreground"
                : "text-foreground hover:bg-muted"
            )}
          >
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <PenLine className="w-3 h-3 text-white" />
            </div>
            <span>New chat</span>
          </Button>

          {/* Search Chats */}
          {searchOpen ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                autoFocus
                onBlur={() => {
                  if (!searchQuery) setSearchOpen(false);
                }}
                className="w-full bg-muted border-0 rounded-lg pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={() => setSearchOpen(true)}
              className="w-full justify-start gap-3 h-10 px-3 font-normal text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Search className="w-5 h-5" />
              <span>Search chats</span>
            </Button>
          )}

          {/* Divider */}
          <div className="h-px bg-border my-2" />

          {/* Tools Section */}
          <button
            onClick={() => setToolsExpanded(!toolsExpanded)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
          >
            <span>Tools</span>
            {toolsExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
          
          {toolsExpanded && (
            <div className="space-y-0.5 mb-2">
              {tools.map((tool, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <tool.icon className={cn("w-4 h-4", tool.color)} />
                  <span>{tool.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-border my-2" />

          {/* Subjects/Projects Section */}
          <button
            onClick={() => setSubjectsExpanded(!subjectsExpanded)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
          >
            <span>Subjects</span>
            {subjectsExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>

          {subjectsExpanded && (
            <div className="space-y-0.5 mb-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <Plus className="w-4 h-4" />
                <span>New subject</span>
              </button>
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <FolderOpen className="w-4 h-4 text-primary" />
                  <span>{subject.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-border my-2" />

          {/* Your Chats Section */}
          <p className="text-[11px] text-muted-foreground px-3 py-2 font-medium uppercase tracking-wider">
            Your chats
          </p>

          {/* Search Results or Grouped Chats */}
          {filteredConversations ? (
            <div className="space-y-0.5">
              {filteredConversations.length > 0 ? (
                filteredConversations.map(renderChatItem)
              ) : (
                <p className="px-3 py-2 text-sm text-muted-foreground">No results found</p>
              )}
            </div>
          ) : (
            <>
              {renderGroup('Today', grouped.today)}
              {renderGroup('Yesterday', grouped.yesterday)}
              {renderGroup('Previous 7 Days', grouped.thisWeek)}
              {renderGroup('Older', grouped.older)}
            </>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
