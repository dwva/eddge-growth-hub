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
  ArrowLeft,
  MoreVertical,
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
      <div className="-m-6 md:-m-8 lg:m-0 h-screen lg:h-[calc(100vh-8rem)]">
        {/* Desktop Header */}
        <h1 className="hidden lg:block text-2xl font-bold mb-4">Messages</h1>
        
        <div className="flex h-full lg:h-[calc(100%-3rem)] border-0 lg:border rounded-none lg:rounded-lg overflow-hidden bg-white">
          {/* Teacher List Sidebar - Hidden on mobile when chat is selected */}
          <div className={cn(
            'w-full lg:w-80 border-r flex flex-col bg-[#f0f2f5] transition-transform duration-300',
            selectedTeacher ? 'hidden lg:flex' : 'flex'
          )}>
            {/* Mobile Header for Chat List */}
            <div className="lg:hidden bg-primary text-white p-4">
              <h1 className="text-lg font-semibold">Messages</h1>
            </div>

            {/* Search */}
            <div className="p-3 border-b bg-white lg:bg-card">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search teachers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-[#f0f2f5] lg:bg-background border-0 rounded-lg"
                />
              </div>
            </div>

            {/* Teacher List */}
            <div className="flex-1 overflow-y-auto bg-white">
              {filteredTeachers.map((teacher) => (
                <button
                  key={teacher.id}
                  onClick={() => setSelectedTeacher(teacher.id)}
                  className={cn(
                    'w-full p-3 lg:p-3 flex items-center gap-3 hover:bg-[#f5f6f6] lg:hover:bg-muted/50 transition-colors text-left border-b border-[#e9edef] lg:border-border',
                    selectedTeacher === teacher.id && 'bg-[#e9edef] lg:bg-muted'
                  )}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 lg:w-10 lg:h-10 rounded-full bg-purple-100 lg:bg-primary/10 flex items-center justify-center text-base lg:text-sm font-medium text-primary">
                      {teacher.avatar}
                    </div>
                    {teacher.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 lg:w-3 lg:h-3 rounded-full bg-primary border-2 border-white lg:border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-medium text-sm lg:text-sm text-gray-900 truncate">{teacher.name}</h4>
                      <span className="text-xs lg:text-[10px] text-[#667781] lg:text-muted-foreground ml-2">{teacher.lastMessageTime}</span>
                    </div>
                    <p className="text-xs text-[#667781] lg:text-muted-foreground truncate">{teacher.lastMessage || teacher.subject}</p>
                  </div>
                  {teacher.unreadCount > 0 && (
                    <Badge className="bg-primary text-white text-xs lg:text-[10px] h-5 w-5 lg:h-5 lg:w-5 p-0 flex items-center justify-center rounded-full flex-shrink-0">
                      {teacher.unreadCount}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className={cn(
            'flex-1 flex flex-col transition-transform duration-300',
            selectedTeacher ? 'flex' : 'hidden lg:flex'
          )}>
            {selectedTeacher && currentTeacher ? (
              <>
                {/* Chat Header - WhatsApp Style */}
                <div className="bg-primary lg:bg-card text-white lg:text-foreground p-3 lg:p-3 flex items-center gap-3 border-b border-primary/80 lg:border-border">
                  {/* Back Button - Mobile Only */}
                  <button
                    onClick={() => setSelectedTeacher(null)}
                    className="lg:hidden p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-purple-100 lg:bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {currentTeacher.avatar}
                    </div>
                    {currentTeacher.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary border-2 border-primary lg:border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white lg:text-foreground">{currentTeacher.name}</h4>
                    <p className="text-xs text-white/80 lg:text-muted-foreground">
                      {currentTeacher.online ? 'online' : 'offline'}
                    </p>
                  </div>
                  <button className="p-2 hover:bg-white/10 lg:hover:bg-muted rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-white lg:text-muted-foreground" />
                  </button>
                </div>

                {/* Messages - WhatsApp Style */}
                <div className="flex-1 overflow-y-auto p-2 lg:p-4 space-y-1 lg:space-y-3 bg-[#efeae2] lg:bg-muted/30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9IiNmNWY2ZjYiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] bg-repeat">
                  {conversationMessages.map((message) => {
                    const isSent = message.senderId === 'parent';
                    return (
                      <div
                        key={message.id}
                        className={cn('flex', isSent ? 'justify-end' : 'justify-start')}
                      >
                        <div
                          className={cn(
                            'max-w-[75%] lg:max-w-[70%] rounded-lg px-2 py-1.5 lg:px-3 lg:py-3 shadow-sm',
                            isSent 
                              ? 'bg-purple-100 lg:bg-primary text-gray-900 lg:text-white rounded-tr-none lg:rounded-tr-lg' 
                              : 'bg-white lg:bg-white text-gray-900 rounded-tl-none lg:rounded-tl-lg'
                          )}
                        >
                          <p className="text-sm lg:text-sm leading-relaxed">{message.content}</p>
                          <div className={cn('flex items-center gap-1 mt-0.5 lg:mt-1', isSent ? 'justify-end' : 'justify-start')}>
                            <span className={cn('text-[11px] lg:text-[10px]', isSent ? 'text-gray-600 lg:text-white/70' : 'text-gray-600 lg:text-muted-foreground')}>
                              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isSent && (
                              message.read ? (
                                <CheckCheck className="w-3.5 h-3.5 lg:w-3 lg:h-3 text-blue-500 lg:text-white/70" />
                              ) : (
                                <Check className="w-3.5 h-3.5 lg:w-3 lg:h-3 text-gray-500 lg:text-white/70" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input Area - WhatsApp Style */}
                <div className="p-2 lg:p-3 border-t border-[#e9edef] lg:border-border bg-[#f0f2f5] lg:bg-card">
                  <div className="flex items-center gap-1 lg:gap-2">
                    <button className="p-2 lg:p-2 rounded-lg hover:bg-[#e9edef] lg:hover:bg-muted transition-colors">
                      <Smile className="w-5 h-5 lg:w-5 lg:h-5 text-[#54656f] lg:text-muted-foreground" />
                    </button>
                    <button className="p-2 lg:p-2 rounded-lg hover:bg-[#e9edef] lg:hover:bg-muted transition-colors">
                      <Paperclip className="w-5 h-5 lg:w-5 lg:h-5 text-[#54656f] lg:text-muted-foreground" />
                    </button>
                    <Input
                      placeholder="Type a message"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 bg-white lg:bg-background border-0 rounded-lg px-4 py-2.5 lg:py-2 text-sm"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 lg:p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5 lg:w-5 lg:h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-[#efeae2] lg:bg-muted/30">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 mx-auto text-[#667781] lg:text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold text-[#111b21] lg:text-foreground">Select a Conversation</h3>
                  <p className="text-[#667781] lg:text-muted-foreground">Choose a teacher from the list to start messaging</p>
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
