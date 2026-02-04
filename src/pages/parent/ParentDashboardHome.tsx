import ParentDashboardLayout from '@/components/layout/ParentDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChild } from '@/contexts/ChildContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight,
  ChevronLeft,
  Loader2,
  MoreVertical,
  Heart,
  Play,
  Plus,
  Calculator,
  Microscope,
  BookOpen,
  Globe,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Subject icon mapping
const subjectIcons: { [key: string]: any } = {
  'Mathematics': Calculator,
  'Science': Microscope,
  'English': BookOpen,
  'History': Globe,
  'Geography': Globe,
  'Art': Palette,
};

const subjectColors: { [key: string]: { bg: string; icon: string } } = {
  'Mathematics': { bg: 'bg-blue-50', icon: 'text-blue-600' },
  'Science': { bg: 'bg-purple-50', icon: 'text-purple-600' },
  'English': { bg: 'bg-pink-50', icon: 'text-pink-600' },
  'History': { bg: 'bg-amber-50', icon: 'text-amber-600' },
  'Geography': { bg: 'bg-teal-50', icon: 'text-teal-600' },
};

// Circular Progress Component
const CircularProgress = ({ value, size = 120, strokeWidth = 8 }: { value: number; size?: number; strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-gray-100"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-purple-500 transition-all duration-500"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold bg-purple-500 text-white px-2 py-1 rounded-full">{value}%</span>
      </div>
    </div>
  );
};

// Right Sidebar Component
const RightSidebar = () => {
  const { selectedChild } = useChild();
  
  // Mock teachers data
  const teachers = [
    { name: 'Mrs. Sarah Wilson', subject: 'Math Teacher', avatar: 'SW' },
    { name: 'Mr. David Brown', subject: 'Science Teacher', avatar: 'DB' },
    { name: 'Ms. Emily Chen', subject: 'English Teacher', avatar: 'EC' },
  ];

  // Mock weekly progress data
  const weeklyProgress = [
    { period: '1-10 Feb', value: 35 },
    { period: '11-20 Feb', value: 45 },
    { period: '21-30 Feb', value: 55 },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-6">
      {/* Statistics Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800">Statistic</h3>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
        
        {/* Circular Progress with Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <CircularProgress value={selectedChild?.progress || 78} size={100} strokeWidth={6} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-2xl overflow-hidden">
                {selectedChild?.avatar || '👦'}
              </div>
            </div>
          </div>
          
          <h4 className="mt-4 text-base font-semibold text-gray-800">
            {getGreeting()} {selectedChild?.name?.split(' ')[0] || 'Parent'} 🔥
          </h4>
          <p className="text-xs text-gray-500 text-center mt-1">
            Continue tracking your child's progress to achieve their target!
          </p>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div>
        <div className="flex items-center gap-2 h-32 justify-center">
          {weeklyProgress.map((week, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="w-12 bg-gray-100 rounded-lg overflow-hidden" style={{ height: '80px' }}>
                <div 
                  className={`w-full transition-all duration-500 rounded-lg ${
                    index === 2 ? 'bg-purple-500' : 'bg-blue-400'
                  }`}
                  style={{ 
                    height: `${week.value}%`,
                    marginTop: `${100 - week.value}%`
                  }}
                />
              </div>
              <span className="text-[10px] text-gray-400">{week.period}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Teachers Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800">Child's Teachers</h3>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full border border-gray-200">
            <Plus className="w-3 h-3 text-gray-400" />
          </Button>
        </div>
        
        <div className="space-y-3">
          {teachers.map((teacher, index) => (
            <div key={index} className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 text-xs font-medium">
                  {teacher.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{teacher.name}</p>
                <p className="text-xs text-gray-400">{teacher.subject}</p>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs rounded-full border-green-200 text-green-600 hover:bg-green-50">
                Contact
              </Button>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full mt-4 text-sm text-gray-500 rounded-xl">
          See All
        </Button>
      </div>
    </div>
  );
};

const ParentDashboardHomeContent = () => {
  const { selectedChild, isLoading } = useChild();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Mock recent activities data
  const recentActivities = [
    { teacher: 'Mrs. Wilson', date: '2/3/2026', subject: 'Mathematics', desc: 'Chapter 5: Algebra Quiz', type: 'quiz' },
    { teacher: 'Mr. Brown', date: '2/2/2026', subject: 'Science', desc: 'Lab Report: Plant Cells', type: 'assignment' },
    { teacher: 'Ms. Chen', date: '2/1/2026', subject: 'English', desc: 'Essay: My Favorite Book', type: 'homework' },
  ];

  // Mock continue learning data (recent subjects)
  const continueLearning = [
    { title: "Math Problem Solving", subtitle: "Chapter 5: Algebra Basics", image: "📐", category: "Mathematics", progress: 65 },
    { title: "Science Exploration", subtitle: "Unit 3: Plant Biology", image: "🔬", category: "Science", progress: 45 },
    { title: "English Literature", subtitle: "Reading Comprehension", image: "📚", category: "English", progress: 80 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!selectedChild) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-3xl">👶</div>
          <h3 className="mt-4 text-lg font-semibold">No Child Linked</h3>
          <p className="text-muted-foreground">Please link a child to view the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl p-6 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/40 rounded-full" />
        
        <div className="relative z-10">
          <p className="text-purple-200 text-xs font-medium tracking-wider uppercase mb-2">Parent Portal</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Track Your Child's Progress<br />
            with Ease & Confidence
          </h1>
          <p className="text-purple-200 text-sm mb-4 max-w-md">
            Monitor {selectedChild.name}'s academic journey, achievements, and growth all in one place.
          </p>
          <Button 
            onClick={() => navigate(`/parent/child-progress/${selectedChild.id}`)}
            className="bg-white text-purple-600 hover:bg-gray-100 rounded-full px-5 h-10 font-medium shadow-lg"
          >
            View Details
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Subject Progress Cards */}
      <div className="grid grid-cols-3 gap-4">
        {selectedChild.subjects?.slice(0, 3).map((subject, index) => {
          const Icon = subjectIcons[subject.name] || BookOpen;
          const colors = subjectColors[subject.name] || { bg: 'bg-gray-50', icon: 'text-gray-600' };
          
          return (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer bg-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">{subject.score}% completed</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{subject.name}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="w-4 h-4 text-gray-300" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Continue Learning Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Learning</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-gray-200 bg-white">
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-gray-200 bg-purple-500 text-white hover:bg-purple-600">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {continueLearning.map((item, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer bg-white overflow-hidden group">
              <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-5xl relative">
                {item.image}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
              <CardContent className="p-4">
                <Badge 
                  className={`mb-2 text-[10px] font-medium ${
                    item.category === 'Mathematics' ? 'bg-orange-100 text-orange-600' :
                    item.category === 'Science' ? 'bg-purple-100 text-purple-600' :
                    'bg-blue-100 text-blue-600'
                  }`}
                >
                  {item.category}
                </Badge>
                <h3 className="text-sm font-semibold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-xs text-gray-400 mb-3">{item.subtitle}</p>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div 
                    className="bg-green-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                
                <div className="flex items-center gap-2 mt-3">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-[10px] bg-gray-100">T</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-500">Teacher assigned</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activities Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Activities</h2>
          <Button variant="link" className="text-sm text-purple-600 hover:text-purple-700 p-0 h-auto">
            See all
          </Button>
        </div>
        
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Teacher</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Subject</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Description</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.map((activity, index) => (
                    <tr key={index} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                              {activity.teacher.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{activity.teacher}</p>
                            <p className="text-xs text-gray-400">{activity.date}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge 
                          className={`text-[10px] font-medium ${
                            activity.subject === 'Mathematics' ? 'bg-blue-100 text-blue-600' :
                            activity.subject === 'Science' ? 'bg-purple-100 text-purple-600' :
                            'bg-pink-100 text-pink-600'
                          }`}
                        >
                          {activity.subject}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-600">{activity.desc}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200">
                          <Play className="w-3 h-3 text-gray-600 fill-current" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ParentDashboardHome = () => {
  return (
    <ParentDashboardLayout rightSidebar={<RightSidebar />}>
      <ParentDashboardHomeContent />
    </ParentDashboardLayout>
  );
};

export default ParentDashboardHome;
