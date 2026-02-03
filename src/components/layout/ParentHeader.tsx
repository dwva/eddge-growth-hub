import { useState } from 'react';
import { Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useChild } from '@/contexts/ChildContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ParentHeader = () => {
  const { children, selectedChild, setSelectedChild } = useChild();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications] = useState([
    { id: 1, title: 'New message from Mrs. Sharma', time: '5 min ago', unread: true },
    { id: 2, title: 'PTM reminder for tomorrow', time: '1 hour ago', unread: true },
    { id: 3, title: 'Homework deadline approaching', time: '2 hours ago', unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleChildChange = (childId: string) => {
    const child = children.find(c => c.id === childId);
    if (child) {
      setSelectedChild(child);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-background border-b">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Child Switcher */}
        <div className="flex items-center gap-3">
          {children.length > 1 && (
            <Select
              value={selectedChild?.id}
              onValueChange={handleChildChange}
            >
              <SelectTrigger className="w-[180px] h-9 text-sm">
                <SelectValue placeholder="Select child" />
              </SelectTrigger>
              <SelectContent>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id}>
                    <div className="flex items-center gap-2">
                      <span>{child.avatar}</span>
                      <span>{child.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {children.length === 1 && selectedChild && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-lg">{selectedChild.avatar}</span>
              <div>
                <p className="font-medium">{selectedChild.name}</p>
                <p className="text-[10px] text-muted-foreground">{selectedChild.class}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-destructive">
                    {unreadCount}
                  </Badge>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-3 border-b">
                <h4 className="font-semibold text-sm">Notifications</h4>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-3 border-b last:border-0 hover:bg-muted/50 cursor-pointer',
                      notification.unread && 'bg-primary/5'
                    )}
                  >
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* User Profile */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'P'}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="end">
              <div className="p-2 border-b mb-2">
                <p className="font-medium text-sm">{user?.name || 'Parent'}</p>
                <p className="text-xs text-muted-foreground">{user?.email || 'parent@eddge.com'}</p>
              </div>
              <button
                onClick={() => navigate('/parent/settings')}
                className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted text-sm"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={() => navigate('/parent/settings')}
                className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted text-sm"
              >
                <User className="w-4 h-4" />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted text-sm text-destructive"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default ParentHeader;

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
