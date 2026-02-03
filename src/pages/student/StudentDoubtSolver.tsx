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
  Globe,
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
  { icon: Calculator, label: 'Help with Math', color: 'text-blue-400' },
  { icon: FlaskConical, label: 'Explain Science', color: 'text-green-400' },
  { icon: BookOpen, label: 'Study Tips', color: 'text-amber-400' },
  { icon: PenTool, label: 'Writing Help', color: 'text-pink-400' },
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
    
    // Simulate typing delay
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
    
    // Reset textarea height
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
    
    // Auto-resize textarea
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
        <p className="text-xs text-zinc-500 px-3 mb-2 font-medium">{title}</p>
        {convs.map(conv => (
          <button
            key={conv.id}
            onClick={() => handleSelectConversation(conv)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors truncate",
              activeConversation?.id === conv.id
                ? "bg-zinc-700 text-white"
                : "text-zinc-300 hover:bg-zinc-800"
            )}
          >
            {conv.title}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-zinc-900 text-white overflow-hidden">
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:relative z-50 h-full bg-zinc-950 flex flex-col transition-all duration-300",
        sidebarOpen ? "w-64" : "w-0 lg:w-0",
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex-shrink-0 p-3 border-b border-zinc-800">
          <Button
            onClick={handleNewChat}
            variant="outline"
            className="w-full justify-start gap-2 bg-transparent border-zinc-700 text-white hover:bg-zinc-800 hover:text-white"
          >
            <Plus className="w-4 h-4" />
            New chat
          </Button>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full bg-zinc-800 border-0 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600"
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
        <div className="flex-shrink-0 p-3 border-t border-zinc-800">
          <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-medium">
              S
            </div>
            <span className="text-sm text-zinc-300 truncate flex-1 text-left">Student</span>
            <MoreHorizontal className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex-shrink-0 h-14 border-b border-zinc-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-zinc-400 hover:text-white hover:bg-zinc-800"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex text-zinc-400 hover:text-white hover:bg-zinc-800"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <button className="flex items-center gap-1 text-lg font-semibold hover:bg-zinc-800 rounded-lg px-2 py-1 transition-colors">
              <span>Doubt Solver</span>
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white hover:bg-zinc-800"
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
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Main heading */}
                <h1 className="text-3xl md:text-4xl font-medium text-white">
                  What can I help with?
                </h1>

                {/* Suggestions */}
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(`${suggestion.label}: `)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-300 transition-colors border border-zinc-700"
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
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3",
                        message.role === 'user'
                          ? "bg-zinc-700 text-white"
                          : "bg-zinc-800 text-zinc-100"
                      )}
                    >
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      
                      {/* Action buttons for assistant messages */}
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-1 mt-3 pt-2 border-t border-zinc-700">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-white hover:bg-zinc-700">
                            <Copy className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-white hover:bg-zinc-700">
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-white hover:bg-zinc-700">
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-white hover:bg-zinc-700">
                            <RotateCcw className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-600 flex items-center justify-center text-sm font-medium">
                        S
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-zinc-800 rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          )}

          {/* Input area */}
          <div className="flex-shrink-0 p-4">
            <div className="max-w-3xl mx-auto">
              <div className="relative bg-zinc-800 rounded-2xl border border-zinc-700 focus-within:border-zinc-600 transition-colors">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about your studies..."
                  className="w-full min-h-[52px] max-h-[200px] bg-transparent border-0 resize-none px-4 py-3 pr-24 text-white placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                  rows={1}
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-700"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-700"
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
                        ? "bg-white text-zinc-900 hover:bg-zinc-200"
                        : "bg-zinc-700 text-zinc-500"
                    )}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-center text-xs text-zinc-600 mt-2">
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
