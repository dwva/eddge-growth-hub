import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import { useTeacherMode } from '@/contexts/TeacherModeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  Search, MessageCircle, Phone, Mail, TrendingUp, TrendingDown,
  Clock, Calendar, Users, AlertCircle, AlertTriangle, Download
} from 'lucide-react';
import { parentEngagementData } from '@/data/teacherMockData';
import { toast } from 'sonner';

const TeacherParentEngagementContent = () => {
  const navigate = useNavigate();
  const { currentMode } = useTeacherMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [engagementFilter, setEngagementFilter] = useState('all');

  // Mode restriction
  if (currentMode !== 'class_teacher') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Class Teacher Mode Required</h2>
        <p className="text-muted-foreground mb-4">Parent engagement analytics is only accessible in Class Teacher mode.</p>
        <Button onClick={() => navigate('/teacher')}>Back to Dashboard</Button>
      </div>
    );
  }

  const filteredParents = parentEngagementData.filter(parent => {
    const matchesSearch = parent.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parent.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEngagement = engagementFilter === 'all' || parent.engagementLevel === engagementFilter;
    return matchesSearch && matchesEngagement;
  });

  const highEngagement = parentEngagementData.filter(p => p.engagementLevel === 'high').length;
  const mediumEngagement = parentEngagementData.filter(p => p.engagementLevel === 'medium').length;
  const lowEngagement = parentEngagementData.filter(p => p.engagementLevel === 'low').length;
  
  const avgResponseRate = Math.round(
    parentEngagementData.reduce((acc, p) => acc + p.responseRate, 0) / parentEngagementData.length
  );

  const nonResponsiveParents = parentEngagementData.filter(p => p.engagementLevel === 'low');

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getResponseTimeColor = (time: string) => {
    if (time.includes('hour') && parseInt(time) <= 6) return 'text-emerald-600';
    if (time.includes('hour') && parseInt(time) <= 24) return 'text-amber-600';
    return 'text-red-600';
  };

  const handleExport = () => {
    toast.success('Exporting parent engagement report...');
  };

  return (
    <div className="space-y-6 max-w-[1600px]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parent Engagement Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor parent communication and responsiveness</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl shadow-sm border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">High Engagement</p>
                <p className="text-2xl font-bold text-emerald-600">{highEngagement}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Medium Engagement</p>
                <p className="text-2xl font-bold text-amber-600">{mediumEngagement}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-200 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-red-600">Low Engagement</p>
                <p className="text-2xl font-bold text-red-700">{lowEngagement}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Avg Response Rate</p>
                <p className="text-2xl font-bold text-primary">{avgResponseRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Non-Responsive Parents Alert */}
      {nonResponsiveParents.length > 0 && (
        <Card className="rounded-xl shadow-sm border-2 border-red-200 bg-red-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-red-700">
              <AlertTriangle className="w-5 h-5" />
              Non-Responsive Parents Requiring Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {nonResponsiveParents.map((parent) => (
                <div key={parent.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div>
                    <p className="font-medium text-gray-900">{parent.parentName}</p>
                    <p className="text-sm text-gray-600">Student: {parent.studentName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                      {parent.responseRate}% response
                    </Badge>
                    <Button size="sm" variant="outline" className="gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Contact
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="rounded-xl shadow-sm border-0">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search parents or students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={engagementFilter} onValueChange={setEngagementFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Engagement Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="high">High Engagement</SelectItem>
                <SelectItem value="medium">Medium Engagement</SelectItem>
                <SelectItem value="low">Low Engagement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Parent Engagement Table */}
      <Card className="rounded-xl shadow-sm border-0">
        <CardHeader>
          <CardTitle className="text-base">Parent Communication Details</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredParents.length > 0 ? (
            <div className="space-y-3">
              {filteredParents.map((parent) => (
                <div key={parent.id} className="border rounded-xl p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Parent & Student Info */}
                    <div className="md:col-span-3">
                      <p className="font-semibold text-gray-900">{parent.parentName}</p>
                      <p 
                        className="text-sm text-gray-600 cursor-pointer hover:text-primary"
                        onClick={() => navigate(`/teacher/student-profile/${parent.studentId}`)}
                      >
                        {parent.studentName}
                      </p>
                    </div>

                    {/* Response Rate */}
                    <div className="md:col-span-2">
                      <p className="text-xs text-gray-500 mb-1">Response Rate</p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold">{parent.responseRate}%</span>
                        </div>
                        <Progress value={parent.responseRate} className="h-1.5" />
                      </div>
                    </div>

                    {/* Avg Response Time */}
                    <div className="md:col-span-2">
                      <p className="text-xs text-gray-500 mb-1">Avg Response</p>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className={`text-sm font-medium ${getResponseTimeColor(parent.avgResponseTime)}`}>
                          {parent.avgResponseTime}
                        </span>
                      </div>
                    </div>

                    {/* Last Contacted */}
                    <div className="md:col-span-2">
                      <p className="text-xs text-gray-500 mb-1">Last Contacted</p>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-sm">{parent.lastContacted}</span>
                      </div>
                    </div>

                    {/* Messages Count */}
                    <div className="md:col-span-1">
                      <p className="text-xs text-gray-500 mb-1">Messages</p>
                      <p className="text-sm font-bold">{parent.messageCount}</p>
                    </div>

                    {/* Engagement Level & Actions */}
                    <div className="md:col-span-2 flex flex-col gap-2">
                      <Badge variant="outline" className={`${getEngagementColor(parent.engagementLevel)} justify-center`}>
                        {parent.engagementLevel.charAt(0).toUpperCase() + parent.engagementLevel.slice(1)}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="flex-1 h-7 text-xs gap-1" onClick={() => navigate('/teacher/communication')}>
                          <MessageCircle className="w-3 h-3" />
                          Message
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Phone className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No parents found</h3>
              <p className="text-gray-500">
                {searchQuery || engagementFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No parent engagement data available'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const TeacherParentEngagement = () => {
  return (
    <TeacherDashboardLayout>
      <TeacherParentEngagementContent />
    </TeacherDashboardLayout>
  );
};

export default TeacherParentEngagement;
