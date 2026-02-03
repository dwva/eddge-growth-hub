import { useState } from 'react';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  HelpCircle,
  MessageSquare,
  Mail,
  Phone,
  Search,
  BookOpen,
  Video,
  FileText,
  ExternalLink,
  ChevronRight,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

// FAQ data
const faqs = [
  {
    question: 'How do I access my learning materials?',
    answer: 'You can access all your learning materials from the "Learning" section in the sidebar. Click on "Personalized Learn" to view subject-wise content, or use "Study Resources" for additional materials.',
  },
  {
    question: 'How does the AI Doubt Solver work?',
    answer: 'The AI Doubt Solver uses advanced AI to help you understand concepts. Simply type your question, and the AI will provide step-by-step explanations. You can also upload images of problems for visual assistance.',
  },
  {
    question: 'What should I do if I miss a class?',
    answer: 'If you miss a class, you can find recorded sessions under "Resources". You should also check "Homework" for any assignments given and "Announcements" for any important updates you may have missed.',
  },
  {
    question: 'How do I track my progress?',
    answer: 'Go to the "Progress" section in the sidebar. "Performance" shows your overall academic progress with charts and insights. "Achievements" displays badges and milestones you\'ve earned.',
  },
  {
    question: 'How do I submit homework?',
    answer: 'Navigate to "Homework" under the "Updates" section. Find the assignment you need to submit, click the "Submit" button, and upload your work. You\'ll receive a confirmation once submitted.',
  },
  {
    question: 'What is the Planner feature?',
    answer: 'The Planner is your AI-powered study companion that automatically determines your daily learning focus. It tracks your streak, adjusts to exam schedules, and ensures balanced learning without decision fatigue.',
  },
];

const helpResources = [
  { title: 'Getting Started Guide', icon: <BookOpen className="w-5 h-5" />, type: 'article' },
  { title: 'Video Tutorials', icon: <Video className="w-5 h-5" />, type: 'video' },
  { title: 'User Manual', icon: <FileText className="w-5 h-5" />, type: 'pdf' },
];

const StudentHelp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubject, setSupportSubject] = useState('');

  const filteredFaqs = faqs.filter(
    faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSupportSubmit = () => {
    if (!supportSubject.trim() || !supportMessage.trim()) {
      toast.error('Please fill in both subject and message');
      return;
    }
    toast.success('Support request submitted! We\'ll get back to you within 24 hours.');
    setSupportSubject('');
    setSupportMessage('');
  };

  return (
    <StudentDashboardLayout title="Help Center">
      <div className="space-y-6 max-w-4xl">
        {/* Search */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-1">How can we help you?</h2>
            <p className="text-muted-foreground text-xs mb-3">
              Search our knowledge base or browse frequently asked questions
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {helpResources.map((resource, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {resource.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs font-medium">{resource.title}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{resource.type}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-sm">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-6">
                <HelpCircle className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-xs text-muted-foreground">No matching questions found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Can't find what you're looking for? Send us a message and our support team will help you.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1 block">Subject</label>
                <Input
                  placeholder="What do you need help with?"
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Message</label>
                <Textarea
                  placeholder="Describe your issue in detail..."
                  rows={4}
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                />
              </div>
              <Button onClick={handleSupportSubmit}>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>

            {/* Alternative Contact */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs font-medium mb-2">Other ways to reach us</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>support@eddge.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>1800-123-4567</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentHelp;
