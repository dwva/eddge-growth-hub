import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Clock,
  PlayCircle
} from 'lucide-react';
import { upcomingTests } from '@/data/mockData';

const pastTests = [
  { id: 'pt1', subject: 'Mathematics', name: 'Chapter 2 Test', date: '2026-01-20', score: 85, total: 100 },
  { id: 'pt2', subject: 'Science', name: 'Unit Test', date: '2026-01-15', score: 72, total: 100 },
  { id: 'pt3', subject: 'English', name: 'Grammar Quiz', date: '2026-01-10', score: 90, total: 100 },
];

const StudentTests = () => {
  return (
    <StudentDashboardLayout title="Tests & Exams">
      <div className="space-y-6">
        {/* Upcoming Tests */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Upcoming Tests</h2>
          <div className="grid gap-4">
            {upcomingTests.map((test) => (
              <Card key={test.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <Badge variant="secondary" className="mb-2">{test.subject}</Badge>
                      <h3 className="text-lg font-semibold">{test.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(test.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {test.duration}
                        </span>
                      </div>
                    </div>
                    <Button className="w-full sm:w-auto">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Start Mock Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Past Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Past Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastTests.map((test) => (
                <div 
                  key={test.id} 
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{test.name}</p>
                    <p className="text-sm text-muted-foreground">{test.subject} • {new Date(test.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${test.score >= 80 ? 'text-primary' : test.score >= 60 ? 'text-amber-500' : 'text-destructive'}`}>
                      {test.score}/{test.total}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((test.score / test.total) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentTests;