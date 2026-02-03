import { useState } from 'react';
import ParentDashboardLayout from '@/components/layout/ParentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChild } from '@/contexts/ChildContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  Bell,
  Shield,
  Globe,
  LogOut,
  Smartphone,
  Key,
  Fingerprint,
  Monitor,
  ChevronRight,
  Plus,
  Edit2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const ParentSettings = () => {
  const { t, language, setLanguage } = useLanguage();
  const { children } = useChild();
  const { user } = useAuth();

  const [notifications, setNotifications] = useState({
    homework: true,
    messages: true,
    announcements: true,
    attendance: true,
    studyTimer: false,
  });

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  ];

  const privacyItems = [
    { label: 'Data Tracked', description: 'View what data is collected' },
    { label: 'App Permissions', description: 'Manage app permissions' },
    { label: 'Study Time Info', description: 'Study time tracking details' },
    { label: 'Parent Controls', description: 'Parental control settings' },
  ];

  return (
    <ParentDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">{t('nav.settings')}</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t('settings.profile')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Parent Name</Label>
                    <Input defaultValue={user?.name || 'Parent User'} className="mt-1" />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input defaultValue="+91 98765 43210" className="mt-1" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Email Address</Label>
                    <Input defaultValue={user?.email || 'parent@eddge.com'} className="mt-1" />
                  </div>
                </div>

                {/* Children List */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <Label>Child's Details</Label>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Child
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {children.map((child) => (
                      <div key={child.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{child.avatar}</span>
                          <div>
                            <p className="font-medium">{child.name}</p>
                            <p className="text-xs text-muted-foreground">{child.class}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="mt-4">{t('common.save')}</Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  {t('settings.notifications')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'homework', label: 'Homework Alerts' },
                  { key: 'messages', label: 'Teacher Messages' },
                  { key: 'announcements', label: 'Announcements' },
                  { key: 'attendance', label: 'Attendance Alerts' },
                  { key: 'studyTimer', label: 'Study Timer Alerts' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <Label htmlFor={item.key}>{item.label}</Label>
                    <Switch
                      id={item.key}
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Privacy & Permissions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {t('settings.privacy')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {privacyItems.map((item, index) => (
                    <Dialog key={index}>
                      <DialogTrigger asChild>
                        <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                          <div className="text-left">
                            <p className="font-medium text-sm">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{item.label}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground">
                            {item.description} settings and information will appear here.
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Language Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  {t('settings.language')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as 'en' | 'hi' | 'ta')}
                      className={cn(
                        'w-full p-3 rounded-lg text-left transition-colors',
                        language === lang.code
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      )}
                    >
                      <span className="font-medium">{lang.native}</span>
                      <span className="text-sm ml-2 opacity-70">({lang.label})</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Logout & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <LogOut className="w-5 h-5" />
                  Logout & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Monitor className="w-4 h-4 mr-2" />
                  Logout from All Devices
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Logout from Current Device
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Monitor className="w-4 h-4 mr-2" />
                      Session Management
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Active Sessions</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-3">
                      <div className="p-3 rounded-lg bg-muted">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4" />
                            <span className="text-sm">Current Device</span>
                          </div>
                          <span className="text-xs text-green-600">Active</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Chrome on Windows • Mumbai, India
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Key className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-4">
                      <div>
                        <Label>Current Password</Label>
                        <Input type="password" className="mt-1" />
                      </div>
                      <div>
                        <Label>New Password</Label>
                        <Input type="password" className="mt-1" />
                      </div>
                      <div>
                        <Label>Confirm New Password</Label>
                        <Input type="password" className="mt-1" />
                      </div>
                      <Button className="w-full">Update Password</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="pt-3 border-t space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Two-Factor Auth</span>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="w-4 h-4" />
                      <span className="text-sm">Biometric Login</span>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ParentDashboardLayout>
  );
};

export default ParentSettings;
