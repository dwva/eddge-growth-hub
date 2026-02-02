import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { subjects, chapters } from '@/data/mockData';

const StudentLearning = () => {
  return (
    <StudentDashboardLayout title="Personalized Learn">
      <div className="space-y-6">
        {/* Continue Learning */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-5">
            <Badge className="mb-2">Continue Learning</Badge>
            <h3 className="text-lg font-bold mb-1">Quadratic Equations</h3>
            <p className="text-sm text-muted-foreground mb-3">Mathematics • Chapter 3</p>
            <Progress value={65} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">65% complete</p>
          </CardContent>
        </Card>

        {/* Subjects List */}
        <div>
          <h2 className="text-lg font-semibold mb-4">All Subjects</h2>
          <div className="space-y-4">
            {subjects.map((subject) => (
              <Card key={subject.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg ${subject.color} flex items-center justify-center text-white text-2xl`}>
                        {subject.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{subject.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {subject.completedChapters} of {subject.chapters} chapters completed
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={subject.progress} className="h-2 mb-2" />
                  
                  {/* Show chapters for Math and Science */}
                  {chapters[subject.id as keyof typeof chapters] && (
                    <div className="mt-4 space-y-2">
                      {chapters[subject.id as keyof typeof chapters].slice(0, 3).map((chapter) => (
                        <div 
                          key={chapter.id}
                          className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg cursor-pointer hover:bg-secondary transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {chapter.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-primary" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                            )}
                            <span className={chapter.completed ? 'text-muted-foreground' : 'font-medium'}>
                              {chapter.name}
                            </span>
                          </div>
                          <Badge variant="secondary">{chapter.concepts} concepts</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentLearning;
