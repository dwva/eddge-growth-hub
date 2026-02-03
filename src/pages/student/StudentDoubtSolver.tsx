import { useState, useRef, useEffect } from 'react';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PanelRightClose, PanelRightOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessage } from '@/components/doubt-solver/ChatMessage';
import { ThinkingIndicator } from '@/components/doubt-solver/ThinkingIndicator';
import { EmptyState } from '@/components/doubt-solver/EmptyState';
import { ChatInput } from '@/components/doubt-solver/ChatInput';
import { ChatHistory } from '@/components/doubt-solver/ChatHistory';
import { Message, Conversation } from '@/components/doubt-solver/types';
import { mockConversations, mockResponses } from '@/components/doubt-solver/mockData';

const StudentDoubtSolverContent = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleNewChat = () => {
    setActiveConversation(null);
    setMessages([]);
    setInput('');
  };

  const handleSelectConversation = (conv: Conversation) => {
    setActiveConversation(conv);
    setMessages(conv.messages);
  };

  const simulateResponse = (userMessage: string) => {
    setIsThinking(true);

    // Simulate typing delay
    const delay = 1000 + Math.random() * 1000;
    
    setTimeout(() => {
      const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsThinking(false);

      // Update or create conversation
      if (!activeConversation) {
        const newConv: Conversation = {
          id: Date.now().toString(),
          title: userMessage.slice(0, 30) + (userMessage.length > 30 ? '...' : ''),
          lastMessage: response.slice(0, 50),
          timestamp: new Date(),
          messages: [...messages, { id: (Date.now() - 1).toString(), role: 'user', content: userMessage, timestamp: new Date() }, aiMessage]
        };
        setConversations(prev => [newConv, ...prev]);
        setActiveConversation(newConv);
      }
    }, delay);
  };

  const handleSend = () => {
    if (!input.trim() || isThinking) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = input.trim();
    setInput('');
    simulateResponse(messageText);
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] -m-6 md:-m-8">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Header */}
        <header className="flex-shrink-0 h-12 border-b border-border bg-card/50 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-sm text-foreground">AI Doubt Solver</h2>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            {sidebarOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
          </Button>
        </header>

        {/* Chat Content - Flex grow to fill space */}
        <div className="flex-1 flex flex-col min-h-0">
          {messages.length === 0 ? (
            <EmptyState onSuggestionClick={handleSuggestionClick} />
          ) : (
            <ScrollArea ref={scrollAreaRef} className="flex-1">
              <div className="max-w-3xl mx-auto px-4 py-4">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isThinking && <ThinkingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          )}

          {/* Input - Sticky at bottom */}
          <div className="flex-shrink-0 border-t border-border bg-background">
            <ChatInput
              value={input}
              onChange={setInput}
              onSend={handleSend}
              disabled={isThinking}
            />
          </div>
        </div>
      </div>

      {/* Right Sidebar - Chat History */}
      {sidebarOpen && (
        <ChatHistory
          conversations={conversations}
          activeConversation={activeConversation}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
        />
      )}
    </div>
  );
};

const StudentDoubtSolver = () => {
  return (
    <StudentDashboardLayout>
      <StudentDoubtSolverContent />
    </StudentDashboardLayout>
  );
};

export default StudentDoubtSolver;
