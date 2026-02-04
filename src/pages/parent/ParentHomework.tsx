import { useState } from 'react';
import ParentDashboardLayout from '@/components/layout/ParentDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { homeworkList } from '@/data/parentMockData';
import { useLanguage } from '@/contexts/LanguageContext';
import { BookOpen } from 'lucide-react';

const ParentHomeworkContent = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');

  const filteredHomework = homeworkList.filter(hw => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return hw.status === 'pending';
    if (activeTab === 'completed') return hw.status === 'completed';
    return true;
  });

  const subjectColors: Record<string, string> = {
    'Mathematics': 'bg-blue-100 text-blue-700',
    'Science': 'bg-purple-100 text-purple-700',
    'English': 'bg-pink-100 text-pink-700',
    'History': 'bg-amber-100 text-amber-700',
    'Geography': 'bg-teal-100 text-teal-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t('nav.homework')}</h1>
        <p className="text-muted-foreground">View your child's homework assignments</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">{t('homework.all')}</TabsTrigger>
          <TabsTrigger value="pending">{t('homework.pending')}</TabsTrigger>
          <TabsTrigger value="completed">{t('homework.completed')}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredHomework.length > 0 ? (
            <div className="space-y-3 text-xs">
              {filteredHomework.map((homework) => (
                <Card key={homework.id} className="hover:shadow-md transition-shadow text-xs">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2">
                      <div>
                        <h3 className="font-semibold text-sm">{homework.title}</h3>
                        <div className="flex items-center gap-2 mt-1 text-[11px]">
                          <Badge className={subjectColors[homework.subject] || 'bg-gray-100 text-gray-700'}>
                            {homework.subject}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{homework.teacher}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1">{homework.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                        <span>Assigned: {homework.assignedDate}</span>
                        <span>Due: {homework.dueDate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">
                  {activeTab === 'pending' ? 'No pending homework' :
                   activeTab === 'completed' ? 'No completed homework' :
                   'No homework assignments'}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {activeTab === 'pending' ? 'All homework has been completed!' :
                   activeTab === 'completed' ? 'No homework completed yet.' :
                   'No homework assignments available.'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ParentHomework = () => {
  return (
    <ParentDashboardLayout>
      <ParentHomeworkContent />
    </ParentDashboardLayout>
  );
};

export default ParentHomework;
