import { useState } from 'react';
import ParentDashboardLayout from '@/components/layout/ParentDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { homeworkList } from '@/data/parentMockData';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { differenceInDays, parseISO, isToday, isPast } from 'date-fns';

const ParentHomework = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');

  const getStatusInfo = (homework: typeof homeworkList[0]) => {
    const dueDate = parseISO(homework.dueDate);
    const daysUntilDue = differenceInDays(dueDate, new Date());

    if (homework.status === 'completed') {
      return { label: t('homework.completed'), className: 'bg-green-100 text-green-700', icon: CheckCircle2 };
    }
    if (isPast(dueDate) && !isToday(dueDate)) {
      const daysOverdue = Math.abs(daysUntilDue);
      return { label: `${t('homework.overdue')} (${daysOverdue}d)`, className: 'bg-red-100 text-red-700', icon: AlertCircle };
    }
    if (isToday(dueDate)) {
      return { label: t('homework.dueToday'), className: 'bg-orange-100 text-orange-700', icon: Clock };
    }
    if (daysUntilDue <= 3) {
      return { label: `${t('homework.dueSoon')} (${daysUntilDue}d)`, className: 'bg-yellow-100 text-yellow-700', icon: Clock };
    }
    return { label: t('homework.pending'), className: 'bg-blue-100 text-blue-700', icon: Circle };
  };

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
    <ParentDashboardLayout>
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
              <div className="space-y-3">
                {filteredHomework.map((homework) => {
                  const statusInfo = getStatusInfo(homework);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <Card key={homework.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg ${homework.status === 'completed' ? 'bg-green-100' : 'bg-muted'}`}>
                            {homework.status === 'completed' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold">{homework.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className={subjectColors[homework.subject] || 'bg-gray-100 text-gray-700'}>
                                    {homework.subject}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">{homework.teacher}</span>
                                </div>
                              </div>
                              <Badge className={statusInfo.className}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{homework.description}</p>
                            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                              <span>Assigned: {homework.assignedDate}</span>
                              <span>Due: {homework.dueDate}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
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
    </ParentDashboardLayout>
  );
};

export default ParentHomework;
