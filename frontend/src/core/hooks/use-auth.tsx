'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation, useRegisterMutation, useLogoutMutation } from '@/core/api/auth-api';
import { RoleSelectionModal } from '@/components/auth/role-selection-modal';

interface User {
  id: string;
  email: string;
  fullName: string;
  roleName: string;
  avatar?: string;
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (credentials: any) => Promise<User>;
  register: (data: any) => Promise<User>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const router = useRouter();

  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);

    // Global Key Listener for Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'A') {
        const currentUserStr = localStorage.getItem('user');
        if (currentUserStr) {
          try {
            const currentUser = JSON.parse(currentUserStr);
            if (currentUser.roleName === 'SUPERADMIN') {
              e.preventDefault();
              setIsRoleModalOpen(true);
            }
          } catch (err) {
            console.error('Failed to parse user from storage:', err);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const login = async (credentials: any) => {
    try {
      const data = await loginMutation(credentials).unwrap();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      
      if (data.user.roleName === 'SUPERADMIN') {
        setIsRoleModalOpen(true);
      } else {
        router.push('/profile');
      }
      return data.user;
    } catch (err: any) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  const register = async (registerData: any) => {
    try {
      await registerMutation(registerData).unwrap();
      // After registration, attempt to login
      return await login({ email: registerData.email, password: registerData.password });
    } catch (err: any) {
      console.error('Registration failed:', err);
      throw err;
    }
  };

  const logout = async () => {
    const currentUser = user;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    
    if (currentUser) {
      try {
        await logoutMutation({ userId: currentUser.id }).unwrap();
      } catch (err) {
        console.error('Logout API call failed:', err);
      }
    }
    
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
      <RoleSelectionModal 
        isOpen={isRoleModalOpen} 
        onClose={() => setIsRoleModalOpen(false)} 
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
