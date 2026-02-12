import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { CURRENT_USER } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  signup: (name: string, email: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('skillforge_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string) => {
    // Simulating API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // In a real app, validate credentials here.
        // We just use the mock user but maybe update the ID/Name to pretend it's dynamic
        const userToSet = { ...CURRENT_USER, id: email }; 
        setUser(userToSet);
        localStorage.setItem('skillforge_user', JSON.stringify(userToSet));
        resolve();
      }, 800);
    });
  };

  const signup = async (name: string, email: string) => {
    // Simulating API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const userToSet = { ...CURRENT_USER, name, id: email };
        setUser(userToSet);
        localStorage.setItem('skillforge_user', JSON.stringify(userToSet));
        resolve();
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('skillforge_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};