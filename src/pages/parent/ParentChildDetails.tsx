import { useParams, useNavigate } from 'react-router-dom';
import ParentDashboardLayout from '@/components/layout/ParentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useChild } from '@/contexts/ChildContext';
import {
  ArrowLeft,
  TrendingUp,
  Calendar,
  BookOpen,
  Award,
  MessageSquare,
  FileText,
} from 'lucide-react';

const ParentChildDetailsContent = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const { children } = useChild();

  const child = children.find(c => c.id === childId);

  if (!child) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Child not found</p>
        <Button onClick={() => navigate('/parent')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const quickLinks = [
    { label: 'View Progress', icon: TrendingUp, path: `/parent/child-progress/${child.id}`, color: 'bg-blue-100 text-blue-600' },
    { label: 'Achievements', icon: Award, path: '/parent/achievements', color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Homework', icon: BookOpen, path: '/parent/homework', color: 'bg-orange-100 text-orange-600' },
    { label: 'Messages', icon: MessageSquare, path: '/parent/communications', color: 'bg-purple-100 text-purple-600' },
    { label: 'Meetings', icon: Calendar, path: '/parent/meetings', color: 'bg-green-100 text-green-600' },
    { label: 'Announcements', icon: FileText, path: '/parent/announcements', color: 'bg-red-100 text-red-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/parent')}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">{child.name}'s Profile</h1>
          <p className="text-muted-foreground">{child.class}</p>
        </div>
      </div>

      {/* Child Overview Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-5xl">
              {child.avatar}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{child.name}</h2>
              <p className="text-muted-foreground">{child.class}</p>
              <div className="flex items-center gap-3 mt-3">
                <Badge className="bg-green-100 text-green-700">
                  {child.progress}% Progress
                </Badge>
                <Badge className="bg-blue-100 text-blue-700">
                  {child.attendance}% Attendance
                </Badge>
                {child.streak && child.streak > 0 && (
                  <Badge variant="outline">🔥 {child.streak} day streak</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto text-blue-600" />
            <p className="text-2xl font-bold mt-2">{child.progress}%</p>
            <p className="text-xs text-muted-foreground">Overall Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 mx-auto text-green-600" />
            <p className="text-2xl font-bold mt-2">{child.attendance}%</p>
            <p className="text-xs text-muted-foreground">Attendance</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 mx-auto text-yellow-600" />
            <p className="text-2xl font-bold mt-2">{child.achievements?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Achievements</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 mx-auto text-purple-600" />
            <p className="text-2xl font-bold mt-2">{child.subjects?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Subjects</p>
          </CardContent>
        </Card>
      </div>

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Subject Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {child.subjects?.map((subject, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{subject.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{subject.score}%</span>
                  <Badge className={subject.score >= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                    {subject.grade}
                  </Badge>
                </div>
              </div>
              <Progress value={subject.score} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickLinks.map((link) => (
            <Card
              key={link.path}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(link.path)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center ${link.color}`}>
                  <link.icon className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium mt-2">{link.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const ParentChildDetails = () => {
  return (
    <ParentDashboardLayout>
      <ParentChildDetailsContent />
    </ParentDashboardLayout>
  );
};

export default ParentChildDetails;