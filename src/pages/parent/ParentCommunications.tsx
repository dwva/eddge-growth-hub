import { useState } from 'react';
import ParentDashboardLayout from '@/components/layout/ParentDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { teachers, messages } from '@/data/parentMockData';
import {
  Search,
  Send,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ParentCommunications = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentTeacher = teachers.find(t => t.id === selectedTeacher);
  const conversationMessages = messages.filter(
    m => m.senderId === selectedTeacher || m.receiverId === selectedTeacher
  );

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedTeacher) {
      // In real app, this would send to API
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <ParentDashboardLayout>
      <div className="h-[calc(100vh-8rem)]">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
        
        <div className="flex h-[calc(100%-3rem)] border rounded-lg overflow-hidden">
          {/* Teacher List Sidebar */}
          <div className="w-80 border-r flex flex-col bg-card">
            {/* Search */}
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search teachers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Teacher List */}
            <div className="flex-1 overflow-y-auto">
              {filteredTeachers.map((teacher) => (
                <button
                  key={teacher.id}
                  onClick={() => setSelectedTeacher(teacher.id)}
                  className={cn(
                    'w-full p-3 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left border-b',
                    selectedTeacher === teacher.id && 'bg-muted'
                  )}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {teacher.avatar}
                    </div>
                    {teacher.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm truncate">{teacher.name}</h4>
                      <span className="text-[10px] text-muted-foreground">{teacher.lastMessageTime}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{teacher.subject}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{teacher.lastMessage}</p>
                  </div>
                  {teacher.unreadCount > 0 && (
                    <Badge className="bg-primary text-[10px] h-5 w-5 p-0 flex items-center justify-center">
                      {teacher.unreadCount}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedTeacher && currentTeacher ? (
              <>
                {/* Chat Header */}
                <div className="p-3 border-b flex items-center gap-3 bg-card">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {currentTeacher.avatar}
                    </div>
                    {currentTeacher.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{currentTeacher.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {currentTeacher.subject} • {currentTeacher.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
                  {conversationMessages.map((message) => {
                    const isSent = message.senderId === 'parent';
                    return (
                      <div
                        key={message.id}
                        className={cn('flex', isSent ? 'justify-end' : 'justify-start')}
                      >
                        <div
                          className={cn(
                            'max-w-[70%] rounded-lg p-3',
                            isSent ? 'bg-green-500 text-white' : 'bg-white shadow-sm'
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className={cn('flex items-center gap-1 mt-1', isSent ? 'justify-end' : 'justify-start')}>
                            <span className={cn('text-[10px]', isSent ? 'text-white/70' : 'text-muted-foreground')}>
                              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isSent && (
                              message.read ? (
                                <CheckCheck className="w-3 h-3 text-white/70" />
                              ) : (
                                <Check className="w-3 h-3 text-white/70" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input Area */}
                <div className="p-3 border-t bg-card">
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                      <Paperclip className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                      <Smile className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-muted/30">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Select a Conversation</h3>
                  <p className="text-muted-foreground">Choose a teacher from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ParentDashboardLayout>
  );
};

export default ParentCommunications;
