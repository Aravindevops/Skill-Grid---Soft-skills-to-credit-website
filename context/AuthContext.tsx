import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { auth, googleProvider } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
  User as FirebaseUser
} from 'firebase/auth';
import { CURRENT_USER } from '../constants';
import { createUserProfile } from '../services/userService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.error("Firebase Auth is not initialized. Check your environment variables.");
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userToSet: User = {
          ...CURRENT_USER,
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
        };
        setUser(userToSet);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth is not initialized");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    if (!userCredential.user.emailVerified) {
      await signOut(auth);
      throw new Error("Please verify your email before logging in. Check your inbox for the verification link.");
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth is not initialized");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Set the display name immediately
    await updateProfile(userCredential.user, { displayName: name });
    // Create Firestore profile
    await createUserProfile(userCredential.user.uid, name, email, '');
    // Send verification email
    await sendEmailVerification(userCredential.user);
  };

  const googleSignIn = async () => {
    if (!auth) throw new Error("Firebase Auth is not initialized");
    const result = await signInWithPopup(auth, googleProvider);
    const { uid, displayName, email, photoURL } = result.user;
    // Create Firestore profile if first time (createUserProfile is idempotent)
    await createUserProfile(uid, displayName || 'User', email || '', photoURL || '');
  };

  const logout = async () => {
    if (!auth) throw new Error("Firebase Auth is not initialized");
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, googleSignIn, isAuthenticated: !!user, isLoading }}>
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
