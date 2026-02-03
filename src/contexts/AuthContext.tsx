import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  generateToken, 
  validateToken, 
  getStoredToken, 
  removeToken,
  storeToken,
  type AccessLevel 
} from '@/services/jwtAuthService';

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin' | 'superadmin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  accessLevel?: AccessLevel; // For superadmin only
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; redirectTo?: string }>;
  loginWithJWT: (email: string, password: string, accessLevel?: AccessLevel) => Promise<{ success: boolean; error?: string; redirectTo?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  getAccessLevel: () => AccessLevel | null;
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
      accessLevel: 'ROOT', // Default access level
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
    // Check for JWT token first (for SuperAdmin)
    const token = getStoredToken();
    if (token) {
      const payload = validateToken(token);
      if (payload) {
        // Restore user from JWT token
        const stored = localStorage.getItem('eddge_user');
        if (stored) {
          const userData = JSON.parse(stored);
          return userData;
        }
      } else {
        // Invalid token, remove it
        removeToken();
      }
    }
    
    // Fallback to regular user storage
    const stored = localStorage.getItem('eddge_user');
    return stored ? JSON.parse(stored) : null;
  });

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('eddge_user');
    removeToken(); // Also remove JWT token
  }, []);

  // Validate JWT token on app load
  useEffect(() => {
    const token = getStoredToken();
    if (token && user?.role === 'superadmin') {
      const payload = validateToken(token);
      if (!payload) {
        // Token expired or invalid, logout
        logout();
      }
    }
  }, [user, logout]);

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

  const loginWithJWT = async (
    email: string, 
    password: string, 
    accessLevel: AccessLevel = 'ROOT'
  ): Promise<{ success: boolean; error?: string; redirectTo?: string }> => {
    const mockUser = mockUsers[email.toLowerCase()];
    
    if (!mockUser) {
      return { success: false, error: 'User not found' };
    }
    
    if (mockUser.password !== password) {
      return { success: false, error: 'Invalid password' };
    }

    // Only allow JWT login for superadmin
    if (mockUser.user.role !== 'superadmin') {
      return { success: false, error: 'JWT authentication only available for SuperAdmin' };
    }

    // Generate JWT token
    const token = generateToken(mockUser.user.id, email, accessLevel);
    storeToken(token);

    // Update user with access level
    const userWithAccessLevel = {
      ...mockUser.user,
      accessLevel,
    };

    setUser(userWithAccessLevel);
    localStorage.setItem('eddge_user', JSON.stringify(userWithAccessLevel));
    
    return { 
      success: true, 
      redirectTo: '/dashboard/superadmin' 
    };
  };

  const getAccessLevel = (): AccessLevel | null => {
    if (user?.role === 'superadmin' && user.accessLevel) {
      return user.accessLevel;
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginWithJWT,
      logout, 
      isAuthenticated: !!user,
      getAccessLevel 
    }}>
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
