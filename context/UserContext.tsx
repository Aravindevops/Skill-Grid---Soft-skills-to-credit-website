import React, { createContext, useContext, useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { UserProfile } from '../services/userService';

interface UserContextType {
    userProfile: UserProfile | null;
    isLoadingProfile: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    useEffect(() => {
        if (!user) {
            setUserProfile(null);
            setIsLoadingProfile(false);
            return;
        }

        // Real-time listener — updates the UI whenever Firestore data changes
        const userRef = doc(db, 'users', user.id);
        const unsubscribe = onSnapshot(
            userRef,
            (snap) => {
                if (snap.exists()) {
                    setUserProfile({ id: snap.id, ...(snap.data() as Omit<UserProfile, 'id'>) });
                } else {
                    setUserProfile(null);
                }
                setIsLoadingProfile(false);
            },
            (error) => {
                console.error('Error streaming user profile:', error);
                setIsLoadingProfile(false);
            }
        );

        return () => unsubscribe();
    }, [user]);

    return (
        <UserContext.Provider value={{ userProfile, isLoadingProfile }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within a UserProvider');
    return context;
};
