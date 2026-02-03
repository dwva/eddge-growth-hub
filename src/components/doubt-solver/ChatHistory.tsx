import { Plus, Search, MessageSquare } from 'lucide-react';
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

export function ChatHistory({
  conversations,
  activeConversation,
  onNewChat,
  onSelectConversation,
}: ChatHistoryProps) {
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

  const renderGroup = (title: string, convs: Conversation[]) => {
    if (convs.length === 0) return null;
    return (
      <div className="mb-4">
        <p className="text-xs text-muted-foreground px-3 mb-2 font-medium uppercase tracking-wide">
          {title}
        </p>
        {convs.map(conv => (
          <button
            key={conv.id}
            onClick={() => onSelectConversation(conv)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors truncate",
              activeConversation?.id === conv.id
                ? "bg-primary/10 text-primary font-medium"
                : "text-foreground hover:bg-muted"
            )}
          >
            {conv.title}
          </button>
        ))}
      </div>
    );
  };

  return (
    <aside className="w-64 border-l border-border bg-card flex flex-col flex-shrink-0">
      <div className="p-3 border-b border-border space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm text-foreground">History</span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onNewChat}
          className="w-full gap-2 text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          New Chat
        </Button>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-muted border-0 rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-2 py-2">
        {renderGroup('Today', grouped.today)}
        {renderGroup('Yesterday', grouped.yesterday)}
        {renderGroup('Previous 7 Days', grouped.thisWeek)}
        {renderGroup('Older', grouped.older)}
      </ScrollArea>
    </aside>
  );
}
