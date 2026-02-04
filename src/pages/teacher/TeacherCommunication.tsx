import { useState } from 'react';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, MessageCircle, Send, Check, CheckCheck
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
    <div className="flex flex-col h-[calc(100vh-8rem)] min-h-[500px]">
      {/* Page Header */}
      <div className="mb-3">
        <h1 className="text-xl font-bold text-gray-900">Messages & Inbox</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Client and team communications
        </p>
      </div>

      {/* Messaging Interface */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3 min-h-0 overflow-hidden">
        {/* Conversation List */}
        <Card className="flex flex-col border-0 shadow-sm bg-gray-50/50 overflow-hidden rounded-2xl">
          <div className="p-3 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <Input
                placeholder="Search ....."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs bg-white border-gray-200 rounded-xl"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="px-2 pb-2 space-y-0.5">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl transition text-left ${
                    selectedConversation === conv.id 
                      ? 'bg-white shadow-sm' 
                      : 'hover:bg-white/60'
                  }`}
                >
                  <div className="relative shrink-0">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                        {conv.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="font-semibold text-xs truncate text-gray-900">
                        {(conv as typeof parentConversations[0]).parentName}
                      </p>
                      {conv.unread > 0 && (
                        <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center shrink-0">
                          <span className="text-[10px] text-gray-900 font-semibold">{conv.unread}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 mb-0.5">
                      {conv.studentName}
                    </p>
                    <p className="text-[10px] text-gray-600 truncate leading-tight">
                      {conv.lastMessage}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {conv.timestamp}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col border-0 shadow-sm bg-white overflow-hidden rounded-2xl">
          {selectedConversation && currentConversation ? (
            <>
              <div className="p-3 border-b bg-white shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                          {currentConversation.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-900">{displayName}</p>
                      <p className="text-[10px] text-gray-500">{currentConversation.studentName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
                      <Search className="w-3.5 h-3.5 text-gray-600" />
                    </Button>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4 bg-white">
                <div className="space-y-3 max-w-3xl">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-3 py-2 ${
                          msg.sender === 'teacher'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-xs leading-relaxed">{msg.content}</p>
                        <div className={`flex items-center gap-1 mt-0.5 ${msg.sender === 'teacher' ? 'justify-end' : ''}`}>
                          <span className={`text-[10px] ${msg.sender === 'teacher' ? 'text-white/80' : 'text-gray-500'}`}>
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-3 border-t bg-white shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Search ..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      className="h-9 pr-9 text-xs rounded-xl border-gray-200"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg"
                    >
                      <Search className="w-3.5 h-3.5 text-gray-400" />
                    </Button>
                  </div>
                  <Button 
                    onClick={handleSend} 
                    size="icon"
                    className="h-9 w-9 rounded-xl bg-gray-900 hover:bg-gray-800"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-2">
                <MessageCircle className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-xs text-gray-600 font-medium">Select a conversation</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Choose a parent to start messaging</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
};

const TeacherCommunication = () => {
  return (
    <TeacherDashboardLayout>
      <TeacherCommunicationContent />
    </TeacherDashboardLayout>
  );
};

export default TeacherCommunication;
