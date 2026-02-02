import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Home, 
  BookOpen, 
  PenTool, 
  FileText, 
  BarChart3, 
  Calendar, 
  Settings,
  User,
  Bell,
  Palette
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { label: 'Home', icon: <Home className="w-5 h-5" />, path: '/student' },
  { label: 'Learning', icon: <BookOpen className="w-5 h-5" />, path: '/student/learning' },
  { label: 'Practice', icon: <PenTool className="w-5 h-5" />, path: '/student/practice' },
  { label: 'Tests', icon: <FileText className="w-5 h-5" />, path: '/student/tests' },
  { label: 'Performance', icon: <BarChart3 className="w-5 h-5" />, path: '/student/performance' },
  { label: 'Attendance', icon: <Calendar className="w-5 h-5" />, path: '/student/attendance' },
  { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/student/settings' },
];

const avatars = ['🎓', '👨‍🎓', '👩‍🎓', '🧑‍💻', '🦊', '🐻', '🐼', '🦁', '🐸', '🦄'];

const StudentSettings = () => {
  const { user } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '🎓');
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  return (
    <DashboardLayout navItems={navItems} title="Settings">
      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
                {selectedAvatar}
              </div>
              <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" defaultValue={user?.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={user?.email} disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avatar Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Choose Avatar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {avatars.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${
                    selectedAvatar === avatar
                      ? 'bg-primary/20 ring-2 ring-primary'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive reminders and updates</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Updates</p>
                <p className="text-sm text-muted-foreground">Weekly progress reports</p>
              </div>
              <Switch checked={emailUpdates} onCheckedChange={setEmailUpdates} />
            </div>
          </CardContent>
        </Card>

        <Button className="w-full">Save Changes</Button>
      </div>
    </DashboardLayout>
  );
};

export default StudentSettings;
