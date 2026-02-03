import { useState } from 'react';
import ParentDashboardLayout from '@/components/layout/ParentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Upload,
  Play,
  ChevronRight,
  Send,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const ParentSupport = () => {
  const { t } = useLanguage();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  const faqs = [
    { q: 'How do I track my child\'s progress?', a: 'Navigate to the Progress section from the dashboard to see detailed subject-wise performance, test scores, and attendance records.' },
    { q: 'How do I schedule a meeting with a teacher?', a: 'Go to the Meetings page and click "Book PTM" to schedule a new parent-teacher meeting. You can choose video call, phone, or in-person meetings.' },
    { q: 'How can I communicate with teachers?', a: 'Use the Messages section to chat with your child\'s teachers. You can send text messages and receive responses in real-time.' },
    { q: 'How do I view homework assignments?', a: 'The Homework page shows all pending and completed assignments. You can filter by status to see what\'s due.' },
    { q: 'How do I change the app language?', a: 'Go to Settings and select your preferred language from the Language section. The app supports English, Hindi, and Tamil.' },
  ];

  const appGuides = [
    { title: 'Dashboard Overview', description: 'Learn how to navigate the main dashboard' },
    { title: 'Tracking Progress', description: 'Understanding your child\'s academic progress' },
    { title: 'Messaging Teachers', description: 'How to communicate with teachers' },
    { title: 'Managing Homework', description: 'Viewing and tracking homework assignments' },
    { title: 'Using Study Timer', description: 'Help your child with study schedules' },
    { title: 'Changing Settings', description: 'Customize your app preferences' },
  ];

  return (
    <ParentDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">{t('nav.support')}</h1>
          <p className="text-muted-foreground">Get help and support</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Help Center */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Help Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <div className="space-y-2 cursor-pointer">
                    {faqs.slice(0, 3).map((faq, index) => (
                      <div key={index} className="p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                        <p className="text-sm font-medium">{faq.q}</p>
                      </div>
                    ))}
                    <button className="w-full p-3 rounded-lg border border-dashed text-sm text-primary hover:bg-primary/5 transition-colors">
                      View All FAQs
                    </button>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Frequently Asked Questions</DialogTitle>
                  </DialogHeader>
                  <Accordion type="single" collapsible className="mt-4">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left text-sm">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Raise an Issue */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Raise an Issue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Issue Type</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homework">Homework related</SelectItem>
                    <SelectItem value="app">App not loading</SelectItem>
                    <SelectItem value="marks">Wrong marks displayed</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe your issue in detail..."
                  className="mt-1"
                  rows={4}
                />
              </div>
              <div>
                <Label>Attach Screenshot (Optional)</Label>
                <div className="mt-1">
                  <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to upload</span>
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </div>
              </div>
              <Button className="w-full">{t('common.submit')}</Button>
            </CardContent>
          </Card>

          {/* Live Chat Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Live Chat Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => setChatOpen(true)}
                className="w-full justify-start"
                variant="outline"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Live Chat
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="w-4 h-4 mr-2" />
                Phone Support: +91 1800 123 4567
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Support
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Email</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-4">
                    <div>
                      <Label>To</Label>
                      <Input value="support@eddge.com" disabled className="mt-1" />
                    </div>
                    <div>
                      <Label>Subject</Label>
                      <Input placeholder="Enter subject" className="mt-1" />
                    </div>
                    <div>
                      <Label>Message</Label>
                      <Textarea placeholder="Type your message..." className="mt-1" rows={4} />
                    </div>
                    <Button className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* App Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Play className="w-5 h-5" />
                App Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {appGuides.map((guide, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <button className="p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Play className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-xs font-medium">Step {index + 1}</span>
                        </div>
                        <p className="text-sm font-medium">{guide.title}</p>
                        <p className="text-xs text-muted-foreground">{guide.description}</p>
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{guide.title}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Play className="w-12 h-12 mx-auto text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mt-2">Video tutorial</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="font-medium">Step-by-Step Guide</h4>
                          <ol className="mt-2 space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                            <li>Open the EDDGE app on your device</li>
                            <li>Navigate to the relevant section</li>
                            <li>Follow the on-screen instructions</li>
                            <li>Contact support if you need help</li>
                          </ol>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chat Modal */}
      {chatOpen && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-background border rounded-lg shadow-xl flex flex-col z-50">
          <div className="p-3 border-b flex items-center justify-between bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Live Chat</span>
            </div>
            <button onClick={() => setChatOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="text-center text-sm text-muted-foreground">
              <p>Welcome to EDDGE Support!</p>
              <p className="mt-1">How can we help you today?</p>
            </div>
          </div>
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
              <Button size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </ParentDashboardLayout>
  );
};

export default ParentSupport;
