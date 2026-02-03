import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, MessageCircle, Send, Paperclip, Smile, Check, CheckCheck, Plus } from 'lucide-react';
import { parentConversations, studentConversations } from '@/data/teacherMockData';

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
  { id: 'm5', sender: 'other', content: 'Thank you for the update on John\'s progress.', timestamp: '10:30 AM', read: true },
];

const TeacherCommunicationContent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isStudentTab = searchParams.get('tab') === 'students';
  const [activeTab, setActiveTab] = useState(isStudentTab ? 'students' : 'parents');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const conversations = activeTab === 'parents' ? parentConversations : studentConversations;
  const filteredConversations = conversations.filter(c =>
    c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ('parentName' in c && (c as typeof parentConversations[0]).parentName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const displayName = currentConversation 
    ? (activeTab === 'parents' && 'parentName' in currentConversation 
        ? (currentConversation as typeof parentConversations[0]).parentName 
        : currentConversation.studentName)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Communication</h1>
        <p className="text-muted-foreground">Message parents and students</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setSelectedConversation(null); }}>
        <TabsList>
          <TabsTrigger value="parents">Parent Messages</TabsTrigger>
          <TabsTrigger value="students">Student Messages</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-280px)]">
            {/* Conversation List */}
            <Card className="lg:col-span-1 flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Messages</CardTitle>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Plus className="w-4 h-4" />
                    New
                  </Button>
                </div>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={`Search ${activeTab}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full">
                  <div className="space-y-1 p-3">
                    {filteredConversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv.id)}
                        className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left ${
                          selectedConversation === conv.id ? 'bg-primary/10' : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {conv.avatar}
                            </AvatarFallback>
                          </Avatar>
                          {conv.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm truncate">
                              {activeTab === 'parents' && 'parentName' in conv ? (conv as typeof parentConversations[0]).parentName : conv.studentName}
                            </p>
                            <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{conv.studentName} • {conv.studentClass}</p>
                          <p className="text-sm text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                        </div>
                        {conv.unread > 0 && (
                          <Badge className="bg-green-500 text-white text-xs px-1.5 py-0.5">{conv.unread}</Badge>
                        )}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="lg:col-span-2 flex flex-col">
              {selectedConversation && currentConversation ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="border-b pb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {currentConversation.avatar}
                          </AvatarFallback>
                        </Avatar>
                        {currentConversation.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{displayName}</p>
                        <p className="text-sm text-muted-foreground">
                          {currentConversation.studentName} • {currentConversation.studentClass}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 p-0 overflow-hidden">
                    <ScrollArea className="h-full p-4">
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                msg.sender === 'teacher'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm">{msg.content}</p>
                              <div className={`flex items-center gap-1 mt-1 ${
                                msg.sender === 'teacher' ? 'justify-end' : ''
                              }`}>
                                <span className={`text-xs ${
                                  msg.sender === 'teacher' ? 'text-green-100' : 'text-muted-foreground'
                                }`}>
                                  {msg.timestamp}
                                </span>
                                {msg.sender === 'teacher' && (
                                  msg.read 
                                    ? <CheckCheck className="w-3.5 h-3.5 text-green-100" />
                                    : <Check className="w-3.5 h-3.5 text-green-100" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Paperclip className="w-5 h-5 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Smile className="w-5 h-5 text-muted-foreground" />
                      </Button>
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-1"
                      />
                      <Button onClick={handleSend} className="bg-green-500 hover:bg-green-600">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <MessageCircle className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a Conversation</h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
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
