import { useState } from 'react';
import AdminDashboardLayout from '@/components/layout/AdminDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  GraduationCap,
  Clock,
  CheckCircle,
  Eye,
  Plus
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const reportsData = [
  { id: 1, name: 'Monthly Performance Report', type: 'Performance', date: '2026-02-01', status: 'ready', size: '2.4 MB' },
  { id: 2, name: 'Attendance Summary - January', type: 'Attendance', date: '2026-01-31', status: 'ready', size: '1.8 MB' },
  { id: 3, name: 'Fee Collection Report Q4', type: 'Finance', date: '2026-01-28', status: 'ready', size: '3.2 MB' },
  { id: 4, name: 'Teacher Evaluation Report', type: 'Staff', date: '2026-01-25', status: 'processing', size: '-' },
  { id: 5, name: 'Annual Academic Report 2025', type: 'Academic', date: '2026-01-15', status: 'ready', size: '5.6 MB' },
];

const reportTypes = [
  { name: 'Performance Report', icon: <TrendingUp className="w-5 h-5" />, description: 'Student academic performance analysis', color: 'blue' },
  { name: 'Attendance Report', icon: <Calendar className="w-5 h-5" />, description: 'Daily/Monthly attendance summary', color: 'green' },
  { name: 'Financial Report', icon: <FileText className="w-5 h-5" />, description: 'Fee collection and expenses', color: 'amber' },
  { name: 'Staff Report', icon: <Users className="w-5 h-5" />, description: 'Teacher and staff analytics', color: 'purple' },
];

const AdminReports = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);

  const filteredReports = reportsData.filter(report => 
    selectedType === 'all' || report.type === selectedType
  );

  return (
    <AdminDashboardLayout 
      pageTitle="Reports" 
      pageDescription="Generate and download school reports"
    >
      <div className="space-y-3 md:space-y-6">
        {/* Quick Generate Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((type) => (
            <Card 
              key={type.name} 
              className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-1"
              onClick={() => setIsGenerateOpen(true)}
            >
              <CardContent className="p-4">
                <div className={`w-12 h-12 rounded-xl mb-3 flex items-center justify-center ${
                  type.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  type.color === 'green' ? 'bg-green-100 text-green-600' :
                  type.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {type.icon}
                </div>
                <h3 className="font-semibold">{type.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">24</div>
                <div className="text-sm text-muted-foreground">Reports Generated</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">22</div>
                <div className="text-sm text-muted-foreground">Ready to Download</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">2</div>
                <div className="text-sm text-muted-foreground">Processing</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Reports</CardTitle>
            <div className="flex gap-3">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Performance">Performance</SelectItem>
                  <SelectItem value="Attendance">Attendance</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4" />
                    Generate Report
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate New Report</DialogTitle>
                    <DialogDescription>
                      Select report type and parameters to generate.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Report Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="performance">Performance Report</SelectItem>
                          <SelectItem value="attendance">Attendance Report</SelectItem>
                          <SelectItem value="finance">Financial Report</SelectItem>
                          <SelectItem value="staff">Staff Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Class/Grade</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Classes</SelectItem>
                            <SelectItem value="9">Grade 9</SelectItem>
                            <SelectItem value="10">Grade 10</SelectItem>
                            <SelectItem value="11">Grade 11</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Period</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="quarter">This Quarter</SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsGenerateOpen(false)}>Cancel</Button>
                    <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsGenerateOpen(false)}>Generate</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{report.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {report.type} • {new Date(report.date).toLocaleDateString()} • {report.size}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      className={report.status === 'ready' 
                        ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                        : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                      }
                    >
                      {report.status === 'ready' ? 'Ready' : 'Processing'}
                    </Badge>
                    {report.status === 'ready' && (
                      <>
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminReports;
