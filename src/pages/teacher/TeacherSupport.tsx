import { useState } from 'react';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, MessageCircle, FileText, ExternalLink, Send, Search } from 'lucide-react';
import { toast } from 'sonner';

const faqs = [
  {
    question: 'How do I switch between Class Teacher and Subject Teacher mode?',
    answer: 'You can switch modes using the toggle button in the header. Class Teacher mode shows features for managing your assigned class, while Subject Teacher mode focuses on your subject across multiple classes.',
  },
  {
    question: 'How do I create and publish an assessment?',
    answer: 'Go to Assessments from the sidebar, click "Create Assessment", fill in the details, add questions, and you can either save as draft or publish directly. Published assessments will be visible to students.',
  },
  {
    question: 'How can I track at-risk students?',
    answer: 'In Class Teacher mode, go to Class Analytics > At-Risk Students to see students who need attention based on their performance, attendance, and assessment trends.',
  },
  {
    question: 'How do I generate questions using AI?',
    answer: 'In Subject Teacher mode, go to AI Tools > Question Generator. Select the class, subject, chapter, and other parameters, then click "Generate Questions". The AI will create CBSE-aligned questions based on your criteria.',
  },
  {
    question: 'How do I communicate with parents?',
    answer: 'Go to Communication from the sidebar. You can view all parent conversations, send messages, and manage PTM schedules from there.',
  },
  {
    question: 'Can I export reports as PDF?',
    answer: 'Yes! Go to Reports, generate the report you need, and click the "Export as PDF" button to download.',
  },
];

const TeacherSupportContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
  });

  const filteredFaqs = faqs.filter(
    faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    if (!contactForm.subject || !contactForm.message) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success('Your message has been sent. We\'ll get back to you soon!');
    setContactForm({ subject: '', message: '' });
  };

  return (
    <div className="space-y-10 max-w-[1600px]">
      {/* Page Header - Clean */}
      <div className="pb-6 border-b border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-sm text-gray-500 mt-2">Get help with using EDDGE Teacher Portal</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">FAQs</p>
                <p className="text-sm text-muted-foreground">Quick answers to common questions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">Documentation</p>
                <p className="text-sm text-muted-foreground">Detailed guides and tutorials</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium">Contact Support</p>
                <p className="text-sm text-muted-foreground">Get help from our team</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Frequently Asked Questions
          </CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          {filteredFaqs.length === 0 && (
            <div className="text-center py-8">
              <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-medium">No matching FAQs found</p>
              <p className="text-sm text-muted-foreground">Try a different search term or contact support</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Contact Support
          </CardTitle>
          <CardDescription>Can't find what you're looking for? Send us a message.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input
              placeholder="What do you need help with?"
              value={contactForm.subject}
              onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              placeholder="Describe your issue or question in detail..."
              value={contactForm.message}
              onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
              rows={5}
            />
          </div>
          <Button onClick={handleSubmit} className="gap-2">
            <Send className="w-4 h-4" />
            Send Message
          </Button>
        </CardContent>
      </Card>

      {/* Documentation Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Getting Started Guide', description: 'Learn the basics of the Teacher Portal' },
              { title: 'Assessment Creation', description: 'How to create and manage assessments' },
              { title: 'AI Tools Guide', description: 'Using AI for question and worksheet generation' },
              { title: 'Communication Features', description: 'Messaging parents and students' },
              { title: 'Analytics & Reports', description: 'Understanding performance data' },
              { title: 'Best Practices', description: 'Tips for effective teaching with EDDGE' },
            ].map((doc, index) => (
              <a
                key={index}
                href="#"
                className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 hover:bg-muted/30 transition-colors group"
              >
                <div>
                  <p className="font-medium group-hover:text-primary">{doc.title}</p>
                  <p className="text-sm text-muted-foreground">{doc.description}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const TeacherSupport = () => {
  return (
    <TeacherDashboardLayout>
      <TeacherSupportContent />
    </TeacherDashboardLayout>
  );
};

export default TeacherSupport;
