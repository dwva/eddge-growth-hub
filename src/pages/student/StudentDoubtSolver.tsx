import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Send, 
  Paperclip, 
  Mic, 
  Search,
  MoreHorizontal,
  ChevronDown,
  Sparkles,
  BookOpen,
  Calculator,
  FlaskConical,
  PenTool,
  Share,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RotateCcw,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

// Mock conversations
const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'Quadratic Equations Help',
    lastMessage: 'The quadratic formula is...',
    timestamp: new Date(),
    messages: [
      { id: '1a', role: 'user', content: 'How do I solve quadratic equations?', timestamp: new Date() },
      { id: '1b', role: 'assistant', content: 'Great question! A quadratic equation is in the form ax² + bx + c = 0. There are several methods to solve it:\n\n**1. Factoring**\nIf the equation can be factored, this is often the quickest method.\n\n**2. Quadratic Formula**\nx = (-b ± √(b² - 4ac)) / 2a\n\n**3. Completing the Square**\nUseful for deriving the quadratic formula.\n\nWould you like me to walk through an example?', timestamp: new Date() }
    ]
  },
  {
    id: '2',
    title: 'Photosynthesis Process',
    lastMessage: 'Photosynthesis occurs in...',
    timestamp: new Date(Date.now() - 86400000),
    messages: []
  },
  {
    id: '3',
    title: 'Newton\'s Laws of Motion',
    lastMessage: 'The three laws are...',
    timestamp: new Date(Date.now() - 172800000),
    messages: []
  },
  {
    id: '4',
    title: 'Essay Writing Tips',
    lastMessage: 'Start with a strong thesis...',
    timestamp: new Date(Date.now() - 259200000),
    messages: []
  },
  {
    id: '5',
    title: 'World War II Timeline',
    lastMessage: 'The war began in 1939...',
    timestamp: new Date(Date.now() - 604800000),
    messages: []
  }
];

// Suggestion chips
const suggestions = [
  { icon: Calculator, label: 'Help with Math', color: 'text-blue-500' },
  { icon: FlaskConical, label: 'Explain Science', color: 'text-emerald-500' },
  { icon: BookOpen, label: 'Study Tips', color: 'text-amber-500' },
  { icon: PenTool, label: 'Writing Help', color: 'text-pink-500' },
];

// Mock AI responses
const mockResponses = [
  "I'd be happy to help you with that! Let me break this down step by step...\n\n**Key Concepts:**\n1. First, let's understand the basics\n2. Then we'll apply the formula\n3. Finally, we'll verify our answer\n\nWould you like me to elaborate on any of these points?",
  "Great question! This is a common topic that many students find challenging. Here's a clear explanation:\n\n**The Main Idea:**\nThink of it like building blocks - each concept builds on the previous one.\n\n**Example:**\nLet's say we have a problem like this...\n\nDoes this make sense so far?",
  "Absolutely! Let me explain this concept in a way that's easy to understand.\n\n**Important Points:**\n- This principle was discovered by...\n- It applies in situations where...\n- The formula we use is...\n\n**Pro Tip:** Remember to always check your units!\n\nWant me to show you a practice problem?",
];

const StudentDoubtSolver = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = () => {
    setActiveConversation(null);
    setMessages([]);
    setInput('');
    setMobileSidebarOpen(false);
  };

  const handleSelectConversation = (conv: Conversation) => {
    setActiveConversation(conv);
    setMessages(conv.messages);
    setMobileSidebarOpen(false);
  };

  const simulateAIResponse = (userMessage: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    simulateAIResponse(input.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  };

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

  const renderConversationGroup = (title: string, convs: Conversation[]) => {
    if (convs.length === 0) return null;
    return (
      <div className="mb-4">
        <p className="text-xs text-muted-foreground px-3 mb-2 font-medium">{title}</p>
        {convs.map(conv => (
          <button
            key={conv.id}
            onClick={() => handleSelectConversation(conv)}
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
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:relative z-50 h-full bg-card border-r border-border flex flex-col transition-all duration-300",
        sidebarOpen ? "w-64" : "w-0 lg:w-0",
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="flex-shrink-0 p-4 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-primary">EDDGE</span>
              <span className="text-xs text-muted-foreground block">Doubt Solver</span>
            </div>
          </div>
          <Button
            onClick={handleNewChat}
            className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-white"
          >
            <Plus className="w-4 h-4" />
            New chat
          </Button>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full bg-muted border-0 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Conversation history */}
        <ScrollArea className="flex-1 px-2">
          {renderConversationGroup('Today', grouped.today)}
          {renderConversationGroup('Yesterday', grouped.yesterday)}
          {renderConversationGroup('Previous 7 Days', grouped.thisWeek)}
          {renderConversationGroup('Older', grouped.older)}
        </ScrollArea>

        {/* User section */}
        <div className="flex-shrink-0 p-3 border-t border-border">
          <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-sm font-medium text-white">
              S
            </div>
            <span className="text-sm text-foreground truncate flex-1 text-left">Student</span>
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-background to-muted/30">
        {/* Header */}
        <header className="flex-shrink-0 h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <button className="flex items-center gap-1 text-lg font-semibold hover:bg-muted rounded-lg px-2 py-1 transition-colors text-foreground">
              <span>Doubt Solver</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Share className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Chat area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {messages.length === 0 ? (
            /* Empty state - Welcome screen */
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <div className="max-w-2xl w-full text-center space-y-8">
                {/* Logo/Icon */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/25">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Main heading */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    What can I help with?
                  </h1>
                  <p className="text-muted-foreground">Ask me anything about your studies</p>
                </div>

                {/* Suggestions */}
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(`${suggestion.label}: `)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card hover:bg-muted text-sm text-foreground transition-colors border border-border shadow-sm"
                    >
                      <suggestion.icon className={cn("w-4 h-4", suggestion.color)} />
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Messages */
            <ScrollArea className="flex-1 px-4">
              <div className="max-w-3xl mx-auto py-6 space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-4",
                      message.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-sm">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
                        message.role === 'user'
                          ? "bg-primary text-white"
                          : "bg-card border border-border text-foreground"
                      )}
                    >
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      
                      {/* Action buttons for assistant messages */}
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-1 mt-3 pt-2 border-t border-border">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted">
                            <Copy className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted">
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted">
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted">
                            <RotateCcw className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-sm font-medium text-foreground">
                        S
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-sm">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-card border border-border rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          )}

          {/* Input area */}
          <div className="flex-shrink-0 p-4 bg-gradient-to-t from-background to-transparent">
            <div className="max-w-3xl mx-auto">
              <div className="relative bg-card rounded-2xl border border-border shadow-lg focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about your studies..."
                  className="w-full min-h-[52px] max-h-[200px] bg-transparent border-0 resize-none px-4 py-3 pr-28 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                  rows={1}
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-lg transition-colors",
                      input.trim()
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-2">
                AI-powered doubt solving for students. Responses are for educational purposes.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDoubtSolver;
