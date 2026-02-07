import { useState, FormEvent } from 'react';
import ParentDashboardLayout from '@/components/layout/ParentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Search,
  BookOpen,
  Video,
  FileText,
  ExternalLink,
  Send,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const ParentSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const faqs = [
    { 
      q: 'How do I track my child\'s progress?', 
      a: 'Navigate to the Progress section from the dashboard to see detailed subject-wise performance, test scores, and attendance records. You can view weekly and monthly trends, exam readiness indicators, and compare performance across subjects.' 
    },
    { 
      q: 'How do I schedule a meeting with a teacher?', 
      a: 'Go to the Meetings page and click "Book PTM" to schedule a new parent-teacher meeting. You can choose video call, phone, or in-person meetings. Select your preferred date and time from the available slots.' 
    },
    { 
      q: 'How can I communicate with teachers?', 
      a: 'Use the Messages section to chat with your child\'s teachers. You can send text messages and receive responses in real-time. You can also use the Communication Center to acknowledge announcements and provide feedback.' 
    },
    { 
      q: 'How do I view homework assignments?', 
      a: 'The Homework page shows all pending and completed assignments. You can filter by status to see what\'s due. Each assignment shows the subject, due date, and completion status.' 
    },
    { 
      q: 'How do I change the app language?', 
      a: 'Go to Settings and select your preferred language from the Language section. The app supports English, Hindi, and Tamil. Changes will be applied immediately.' 
    },
  ];

  const resources = [
    { 
      title: 'Getting Started Guide', 
      type: 'Article',
      icon: BookOpen,
      description: 'Learn the basics of using the parent portal'
    },
    { 
      title: 'Video Tutorials', 
      type: 'Video',
      icon: Video,
      description: 'Watch step-by-step video guides'
    },
    { 
      title: 'User Manual', 
      type: 'PDF',
      icon: FileText,
      description: 'Download the complete user guide'
    },
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Submitting:', { subject, message });
    setSubject('');
    setMessage('');
  };

  return (
    <ParentDashboardLayout>
      <div className="space-y-3 md:space-y-6">
        {/* Search Section */}
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
          <CardContent className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">How can we help you?</h1>
            <p className="text-sm md:text-base text-gray-600 mb-6">Search our knowledge base or browse frequently asked questions.</p>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 text-base bg-white border-gray-200 focus:border-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base text-gray-800 mb-1">{resource.title}</h3>
                        <p className="text-xs text-gray-500 mb-2">{resource.type}</p>
                        <p className="text-sm text-gray-600">{resource.description}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FAQ Section */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-primary" />
                </div>
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200 last:border-0">
                    <AccordionTrigger className="text-left text-sm font-medium text-gray-800 hover:no-underline py-4">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-600 pb-4 leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact Support Form */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Contact Support
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">Can't find what you're looking for? Send us a message and our support team will help you.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="subject" className="text-sm font-medium text-gray-700 mb-2 block">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="What do you need help with?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="h-11 bg-white border-gray-200"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2 block">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your issue in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[120px] bg-white border-gray-200 resize-y"
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>

              {/* Contact Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-800 mb-4">Other ways to reach us</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <a href="mailto:support@eddge.com" className="text-sm text-gray-600 hover:text-primary transition-colors">
                      support@eddge.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a href="tel:18001234567" className="text-sm text-gray-600 hover:text-primary transition-colors">
                      1800-123-4567
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ParentDashboardLayout>
  );
};

export default ParentSupport;
