import { useState } from 'react';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, MessageCircle, Send, Paperclip, Smile, Check, CheckCheck, 
  Plus, Phone, Video, MoreVertical
} from 'lucide-react';
import { parentConversations } from '@/data/teacherMockData';

interface Message {
  id: string;
  sender: 'teacher' | 'other';
  content: string;
  timestamp: string;
  read: boolean;
}

const mockMessages: Message[] = [
  { id: 'm1', sender: 'other', content: 'Good morning, I wanted to discuss John\'s progress in Mathematics.', timestamp: '9:30 AM', read: true },
  { id: 'm2', sender: 'teacher', content: 'Good morning! Of course, John has been doing well. His recent test scores have improved significantly.', timestamp: '9:35 AM', read: true },
  { id: 'm3', sender: 'other', content: 'That\'s great to hear! We\'ve been practicing at home as well.', timestamp: '9:40 AM', read: true },
  { id: 'm4', sender: 'teacher', content: 'That definitely helps. I\'d suggest focusing on geometry as that\'s an area where he can improve further.', timestamp: '9:45 AM', read: true },
  { id: 'm5', sender: 'other', content: 'Thank you for the update. We\'ll focus on that.', timestamp: '10:30 AM', read: true },
];

const TeacherCommunicationContent = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const filteredConversations = parentConversations.filter(c =>
    c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c as typeof parentConversations[0]).parentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentConversation = parentConversations.find(c => c.id === selectedConversation);
  const displayName = currentConversation 
    ? (currentConversation as typeof parentConversations[0]).parentName 
    : '';

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: `m${Date.now()}`,
      sender: 'teacher',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      read: false,
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const totalUnread = parentConversations.reduce((acc, c) => acc + c.unread, 0);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] min-h-[500px] space-y-6">
      {/* Page Header - Clean */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-100">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-gray-900 truncate">Parent Messages</h1>
          <p className="text-sm text-gray-500 mt-2">
            Communicate with parents
            {totalUnread > 0 && <span className="ml-1 text-primary font-medium">• {totalUnread} unread</span>}
          </p>
        </div>
        <Button size="sm" className="gap-2 h-10 rounded-xl shrink-0">
          <Plus className="w-4 h-4" />
          New Message
        </Button>
      </div>

      {/* Two-column layout: Conversation list + Chat */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 overflow-hidden">
        {/* Conversation List */}
        <Card className="lg:col-span-4 flex flex-col border-0 shadow-sm rounded-2xl overflow-hidden min-h-[280px] lg:min-h-0">
          <div className="p-3 sm:p-4 border-b border-gray-100 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search parents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-2 space-y-1">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left ${
                    selectedConversation === conv.id 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-11 h-11 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm">
                        {conv.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-gray-900 text-sm truncate min-w-0">
                        {(conv as typeof parentConversations[0]).parentName}
                      </p>
                      <span className="text-xs text-gray-400 whitespace-nowrap shrink-0 tabular-nums">
                        {conv.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {conv.studentName} • {conv.studentClass}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2 break-words">
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <Badge className="bg-primary text-white text-xs h-5 min-w-[20px] px-2 rounded-full shrink-0">
                      {conv.unread}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-8 flex flex-col border-0 shadow-sm rounded-2xl overflow-hidden min-h-[400px] lg:min-h-0">
          {selectedConversation && currentConversation ? (
            <>
              <div className="p-3 sm:p-4 border-b border-gray-100 bg-white shrink-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative flex-shrink-0">
                      <Avatar className="w-10 h-10 sm:w-11 sm:h-11 border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm">
                          {currentConversation.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {currentConversation.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate text-sm sm:text-base">{displayName}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {currentConversation.studentName} • {currentConversation.online ? 
                          <span className="text-emerald-600">Online</span> : 
                          'Last seen recently'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg">
                      <Phone className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg">
                      <Video className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </Button>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 min-h-0 p-4 bg-gray-50/50">
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-center gap-4 py-2">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400 px-2">Today</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
                          msg.sender === 'teacher'
                            ? 'bg-primary text-white rounded-br-md'
                            : 'bg-white border border-gray-100 shadow-sm rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                        <div className={`flex items-center gap-1.5 mt-1.5 ${msg.sender === 'teacher' ? 'justify-end' : ''}`}>
                          <span className={`text-[11px] ${msg.sender === 'teacher' ? 'text-primary-foreground/70' : 'text-gray-400'}`}>
                            {msg.timestamp}
                          </span>
                          {msg.sender === 'teacher' && (
                            msg.read 
                              ? <CheckCheck className="w-3.5 h-3.5 text-primary-foreground/70" />
                              : <Check className="w-3.5 h-3.5 text-primary-foreground/70" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-3 sm:p-4 border-t border-gray-100 bg-white shrink-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex-shrink-0">
                    <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  </Button>
                  <div className="flex-1 min-w-0 relative">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      className="pr-10 sm:pr-12 h-10 sm:h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                    />
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg">
                      <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    </Button>
                  </div>
                  <Button 
                    onClick={handleSend} 
                    size="icon"
                    className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex-shrink-0"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 sm:p-8 bg-gray-50/50">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Select a Conversation</h3>
              <p className="text-gray-500 text-sm max-w-xs">
                Choose a parent from the list to start messaging
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const TeacherCommunication = () => {
  return (
    <TeacherDashboardLayout>
      <TeacherCommunicationContent />
    </TeacherDashboardLayout>
  );
};

export default TeacherCommunication;
