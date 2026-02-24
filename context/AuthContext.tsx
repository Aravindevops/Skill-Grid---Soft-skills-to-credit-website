import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
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
import { createUserProfile, createFacultyProfile, getUserProfile } from '../services/userService';

interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  login: (email: string, password: string, expectedRole?: 'student' | 'faculty') => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  facultySignup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Read role from Firestore
        const profile = await getUserProfile(firebaseUser.uid);
        const role = profile?.role ?? UserRole.STUDENT;
        setUserRole(role);

        const userToSet: User = {
          ...CURRENT_USER,
          id: firebaseUser.uid,
          name: firebaseUser.displayName || profile?.name || 'User',
          email: firebaseUser.email || '',
          role,
        };
        setUser(userToSet);
      } else {
        setUser(null);
        setUserRole(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string, expectedRole?: 'student' | 'faculty') => {
    if (!auth) throw new Error('Firebase Auth is not initialized');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Faculty accounts don't require email verification
    if (expectedRole !== 'faculty' && !userCredential.user.emailVerified) {
      await signOut(auth);
      throw new Error('Please verify your email before logging in. Check your inbox for the verification link.');
    }

    // Role check for faculty login
    if (expectedRole === 'faculty') {
      const profile = await getUserProfile(userCredential.user.uid);
      if (profile?.role !== UserRole.FACULTY) {
        await signOut(auth);
        throw new Error('This account is not a faculty account.');
      }
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    if (!auth) throw new Error('Firebase Auth is not initialized');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    await createUserProfile(userCredential.user.uid, name, email, '');
    await sendEmailVerification(userCredential.user);
  };

  const facultySignup = async (name: string, email: string, password: string) => {
    if (!auth) throw new Error('Firebase Auth is not initialized');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    await createFacultyProfile(userCredential.user.uid, name, email);
    // Sign out so faculty must log in explicitly
    await signOut(auth);
  };

  const googleSignIn = async () => {
    if (!auth) throw new Error('Firebase Auth is not initialized');
    const result = await signInWithPopup(auth, googleProvider);
    const { uid, displayName, email, photoURL } = result.user;
    await createUserProfile(uid, displayName || 'User', email || '', photoURL || '');
  };

  const logout = async () => {
    if (!auth) throw new Error('Firebase Auth is not initialized');
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, userRole, login, signup, facultySignup, logout, googleSignIn, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
