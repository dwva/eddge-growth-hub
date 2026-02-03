import { useState } from 'react';
import TeacherDashboardLayout from '@/components/layout/TeacherDashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Bell, Palette, Lock, Camera } from 'lucide-react';
import { toast } from 'sonner';

const TeacherSettingsContent = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || 'Teacher',
    email: user?.email || 'teacher@eddge.com',
    phone: '+91 98765 43210',
    subject: 'Mathematics',
    classes: 'Class 9-A, 9-B, 10-A, 10-B',
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    parentMessages: true,
    studentMessages: true,
    assessmentReminders: true,
    ptmReminders: true,
  });
  const [theme, setTheme] = useState('light');

  const handleProfileUpdate = () => {
    toast.success('Profile updated successfully');
  };

  const handlePasswordChange = () => {
    toast.success('Password change request sent to your email');
  };

  const handleNotificationUpdate = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Notification preferences updated');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid h-8 p-1 rounded-lg bg-gray-100">
          <TabsTrigger value="profile" className="gap-1.5 text-xs px-2.5 py-1.5 h-7 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
            <User className="w-3.5 h-3.5" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5 text-xs px-2.5 py-1.5 h-7 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
            <Bell className="w-3.5 h-3.5" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1.5 text-xs px-2.5 py-1.5 h-7 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
            <Palette className="w-3.5 h-3.5" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 text-xs px-2.5 py-1.5 h-7 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
            <Lock className="w-3.5 h-3.5" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and teaching details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-white text-xl">
                      {profile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <p className="font-medium">{profile.name}</p>
                  <p className="text-sm text-muted-foreground">{profile.subject} Teacher</p>
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Primary Subject</Label>
                  <Input value={profile.subject} disabled />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Assigned Classes</Label>
                  <Input value={profile.classes} disabled />
                </div>
              </div>

              <Button onClick={handleProfileUpdate}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={() => handleNotificationUpdate('emailNotifications')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={() => handleNotificationUpdate('pushNotifications')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Parent Messages</p>
                    <p className="text-sm text-muted-foreground">Get notified when parents send messages</p>
                  </div>
                  <Switch
                    checked={notifications.parentMessages}
                    onCheckedChange={() => handleNotificationUpdate('parentMessages')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Student Messages</p>
                    <p className="text-sm text-muted-foreground">Get notified when students send messages</p>
                  </div>
                  <Switch
                    checked={notifications.studentMessages}
                    onCheckedChange={() => handleNotificationUpdate('studentMessages')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Assessment Reminders</p>
                    <p className="text-sm text-muted-foreground">Reminders for upcoming assessments</p>
                  </div>
                  <Switch
                    checked={notifications.assessmentReminders}
                    onCheckedChange={() => handleNotificationUpdate('assessmentReminders')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">PTM Reminders</p>
                    <p className="text-sm text-muted-foreground">Reminders for scheduled meetings</p>
                  </div>
                  <Switch
                    checked={notifications.ptmReminders}
                    onCheckedChange={() => handleNotificationUpdate('ptmReminders')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>Customize the appearance of your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                More customization options coming soon!
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="Confirm new password" />
              </div>
              <Button onClick={handlePasswordChange}>Update Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable 2FA</p>
                  <p className="text-sm text-muted-foreground">Use an authenticator app for login</p>
                </div>
                <Button variant="outline">Setup</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const TeacherSettings = () => {
  return (
    <TeacherDashboardLayout>
      <TeacherSettingsContent />
    </TeacherDashboardLayout>
  );
};

export default TeacherSettings;
