import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin' | 'superadmin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; redirectTo?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const mockUsers: Record<string, { password: string; user: User }> = {
  'student@eddge.com': {
    password: 'student123',
    user: {
      id: '1',
      email: 'student@eddge.com',
      name: 'Alex Johnson',
      role: 'student',
      avatar: '🎓',
    },
  },
  'teacher@eddge.com': {
    password: 'teacher123',
    user: {
      id: '2',
      email: 'teacher@eddge.com',
      name: 'Sarah Williams',
      role: 'teacher',
      avatar: '👩‍🏫',
    },
  },
  'parent@eddge.com': {
    password: 'parent123',
    user: {
      id: '3',
      email: 'parent@eddge.com',
      name: 'Michael Johnson',
      role: 'parent',
      avatar: '👨‍👩‍👧',
    },
  },
  'admin@eddge.com': {
    password: 'admin123',
    user: {
      id: '4',
      email: 'admin@eddge.com',
      name: 'Dr. Emily Chen',
      role: 'admin',
      avatar: '🏫',
    },
  },
  'superadmin@eddge.com': {
    password: 'super123',
    user: {
      id: '5',
      email: 'superadmin@eddge.com',
      name: 'System Administrator',
      role: 'superadmin',
      avatar: '⚙️',
    },
  },
};

const roleRoutes: Record<UserRole, string> = {
  student: '/student',
  teacher: '/teacher',
  parent: '/parent',
  admin: '/admin',
  superadmin: '/superadmin',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('eddge_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; redirectTo?: string }> => {
    const mockUser = mockUsers[email.toLowerCase()];
    
    if (!mockUser) {
      return { success: false, error: 'User not found' };
    }
    
    if (mockUser.password !== password) {
      return { success: false, error: 'Invalid password' };
    }

    setUser(mockUser.user);
    localStorage.setItem('eddge_user', JSON.stringify(mockUser.user));
    
    return { 
      success: true, 
      redirectTo: roleRoutes[mockUser.user.role] 
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eddge_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function getRoleRoute(role: UserRole): string {
  return roleRoutes[role];
}
