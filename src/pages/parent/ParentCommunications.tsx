import { useState, useMemo } from 'react';
import ParentDashboardLayout from '@/components/layout/ParentDashboardLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { teachers, messages as initialMessages } from '@/data/parentMockData';
import { Search, Send, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

const ParentCommunications = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentTeacher = teachers.find(t => t.id === selectedTeacher);

  const conversationMessages = useMemo(() => {
    if (!selectedTeacher) return [];
    const filtered = messages.filter(
      m => (m.senderId === selectedTeacher || m.receiverId === selectedTeacher)
    );
    return filtered.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [messages, selectedTeacher]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTeacher) return;

    const message: Message = {
      id: `m${Date.now()}`,
      senderId: 'parent',
      receiverId: selectedTeacher,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const totalUnread = teachers.reduce((acc, t) => acc + t.unreadCount, 0);

  return (
    <ParentDashboardLayout>
      <div className="flex flex-col h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)] min-h-[400px]">
        {/* Page Header */}
        <div className="mb-2 md:mb-3">
          <h1 className="text-base md:text-lg font-bold text-gray-900">Messages</h1>
          <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">
            {totalUnread} unread messages
          </p>
        </div>

        {/* Messaging Interface - Mobile shows one panel at a time */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-3 min-h-0 overflow-hidden">
          {/* Teacher List - Hidden on mobile when chat is selected */}
          <Card
            className={`flex flex-col border-0 shadow-sm bg-gray-50/50 overflow-hidden rounded-lg md:rounded-2xl ${
              selectedTeacher ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <div className="p-2 md:p-3 shrink-0">
              <div className="relative">
                <Search className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400" />
                <Input
                  placeholder="Search teachers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 md:pl-9 h-8 md:h-9 text-xs bg-white border-gray-200 rounded-lg md:rounded-xl"
                />
              </div>
            </div>
            <ScrollArea className="flex-1 min-h-0">
              <div className="px-1.5 md:px-2 pb-2 space-y-0.5">
                {filteredTeachers.map((teacher) => (
                  <button
                    key={teacher.id}
                    onClick={() => setSelectedTeacher(teacher.id)}
                    className={`w-full flex items-start gap-2 md:gap-2.5 p-2 md:p-2.5 rounded-lg md:rounded-xl transition text-left ${
                      selectedTeacher === teacher.id
                        ? 'bg-white shadow-sm'
                        : 'hover:bg-white/60'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="w-8 h-8 md:w-9 md:h-9">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-[10px] md:text-xs">
                          {teacher.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {teacher.online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 md:w-2.5 md:h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="font-semibold text-[11px] md:text-xs truncate text-gray-900">
                          {teacher.name}
                        </p>
                        {teacher.unreadCount > 0 && (
                          <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center shrink-0">
                            <span className="text-[9px] md:text-[10px] text-gray-900 font-semibold">
                              {teacher.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-[9px] md:text-[10px] text-gray-500 mb-0.5">
                        {teacher.subject}
                      </p>
                      <p className="text-[9px] md:text-[10px] text-gray-600 truncate leading-tight">
                        {teacher.lastMessage || teacher.subject}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Chat Area - Full width on mobile when selected */}
          <Card
            className={`lg:col-span-2 flex flex-col border-0 shadow-sm bg-white overflow-hidden rounded-lg md:rounded-2xl ${
              selectedTeacher ? 'flex' : 'hidden lg:flex'
            }`}
          >
            {selectedTeacher && currentTeacher ? (
              <>
                <div className="p-2 md:p-3 border-b bg-white shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-2.5">
                      {/* Back button - mobile only */}
                      <button
                        className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-gray-100 lg:hidden"
                        onClick={() => setSelectedTeacher(null)}
                      >
                        <svg
                          className="w-4 h-4 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <div className="relative">
                        <Avatar className="w-8 h-8 md:w-9 md:h-9">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-[10px] md:text-xs">
                            {currentTeacher.avatar}
                          </AvatarFallback>
                        </Avatar>
                        {currentTeacher.online && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 md:w-2.5 md:h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-[11px] md:text-xs text-gray-900">
                          {currentTeacher.name}
                        </p>
                        <p className="text-[9px] md:text-[10px] text-gray-500">
                          {currentTeacher.subject}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <ScrollArea className="flex-1 min-h-0 p-4 bg-white">
                  <div className="space-y-3 max-w-3xl">
                    {conversationMessages.map((msg) => {
                      const isSent = msg.senderId === 'parent';
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-3 py-2 ${
                              isSent
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-xs leading-relaxed">{msg.content}</p>
                            <div
                              className={`flex items-center gap-1 mt-0.5 ${
                                isSent ? 'justify-end' : ''
                              }`}
                            >
                              <span
                                className={`text-[10px] ${
                                  isSent ? 'text-white/80' : 'text-gray-500'
                                }`}
                              >
                                {new Date(msg.timestamp).toLocaleTimeString(
                                  [],
                                  { hour: 'numeric', minute: '2-digit', hour12: true }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>

                <div className="p-2 md:p-3 border-t bg-white shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="h-8 md:h-9 text-xs rounded-lg md:rounded-xl border-gray-200"
                      />
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      size="icon"
                      className="h-8 w-8 md:h-9 md:w-9 shrink-0 rounded-lg md:rounded-xl bg-gray-900 hover:bg-gray-800"
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
                <p className="text-xs text-gray-600 font-medium">
                  Select a conversation
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Choose a teacher to start messaging
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </ParentDashboardLayout>
  );
};

export default ParentCommunications;
