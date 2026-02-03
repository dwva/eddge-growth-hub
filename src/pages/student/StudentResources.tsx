import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText,
  Video,
  BookOpen,
  Download,
  Search,
  ExternalLink,
  Clock,
  Star,
  Folder
} from 'lucide-react';
import { useState } from 'react';

// Mock resources data
const resources = [
  {
    id: '1',
    title: 'Quadratic Equations - Complete Notes',
    type: 'pdf',
    subject: 'Mathematics',
    chapter: 'Chapter 3',
    size: '2.4 MB',
    downloads: 245,
    rating: 4.8,
    date: '2026-01-28',
  },
  {
    id: '2',
    title: 'Newton\'s Laws Explained',
    type: 'video',
    subject: 'Science',
    chapter: 'Chapter 2',
    duration: '15:30',
    views: 1250,
    rating: 4.9,
    date: '2026-01-25',
  },
  {
    id: '3',
    title: 'Grammar Rules Handbook',
    type: 'pdf',
    subject: 'English',
    chapter: 'All Chapters',
    size: '5.1 MB',
    downloads: 180,
    rating: 4.6,
    date: '2026-01-20',
  },
  {
    id: '4',
    title: 'Polynomial Division Tutorial',
    type: 'video',
    subject: 'Mathematics',
    chapter: 'Chapter 4',
    duration: '22:45',
    views: 890,
    rating: 4.7,
    date: '2026-01-22',
  },
  {
    id: '5',
    title: 'Chemical Reactions Cheat Sheet',
    type: 'pdf',
    subject: 'Science',
    chapter: 'Chapter 5',
    size: '1.2 MB',
    downloads: 320,
    rating: 4.5,
    date: '2026-01-30',
  },
];

const subjectFolders = [
  { name: 'Mathematics', count: 45, icon: '📐', color: 'bg-blue-100 text-blue-700' },
  { name: 'Science', count: 38, icon: '🔬', color: 'bg-purple-100 text-purple-700' },
  { name: 'English', count: 25, icon: '📚', color: 'bg-pink-100 text-pink-700' },
  { name: 'History', count: 20, icon: '🏛️', color: 'bg-amber-100 text-amber-700' },
  { name: 'Geography', count: 18, icon: '🌍', color: 'bg-teal-100 text-teal-700' },
];

const StudentResources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = !selectedSubject || resource.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'video': return <Video className="w-5 h-5 text-blue-500" />;
      default: return <BookOpen className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <StudentDashboardLayout title="Study Resources">
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search resources by name or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Subject Folders */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Browse by Subject</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {subjectFolders.map((folder) => (
              <button
                key={folder.name}
                onClick={() => setSelectedSubject(selectedSubject === folder.name ? null : folder.name)}
                className={`p-4 rounded-xl border transition-all ${
                  selectedSubject === folder.name 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg ${folder.color} flex items-center justify-center text-xl mb-2`}>
                  {folder.icon}
                </div>
                <p className="text-xs font-medium truncate">{folder.name}</p>
                <p className="text-xs text-muted-foreground">{folder.count} resources</p>
              </button>
            ))}
          </div>
        </div>

        {/* Resources List */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pdf">Documents</TabsTrigger>
            <TabsTrigger value="video">Videos</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        {getTypeIcon(resource.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium truncate">{resource.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {resource.subject}
                          </Badge>
                          <span>{resource.chapter}</span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {resource.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {resource.type === 'pdf' ? (
                        <span className="text-xs text-muted-foreground hidden sm:block">
                          {resource.size}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground hidden sm:block flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {resource.duration}
                        </span>
                      )}
                      <Button size="sm" variant="outline">
                        {resource.type === 'pdf' ? (
                          <>
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Watch
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pdf" className="space-y-3">
            {filteredResources.filter(r => r.type === 'pdf').map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium truncate">{resource.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {resource.subject}
                          </Badge>
                          <span>{resource.size}</span>
                          <span>{resource.downloads} downloads</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="video" className="space-y-3">
            {filteredResources.filter(r => r.type === 'video').map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Video className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium truncate">{resource.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {resource.subject}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {resource.duration}
                          </span>
                          <span>{resource.views} views</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Watch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentResources;
