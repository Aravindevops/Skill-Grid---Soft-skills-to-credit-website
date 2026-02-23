import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    query,
    orderBy,
    limit,
    getDocs,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { UserRole, SkillMetrics } from '../types';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: UserRole;
    totalCredits: number;
    rank: number;
    skills: SkillMetrics;
    createdAt?: unknown;
}

const DEFAULT_SKILLS: SkillMetrics = {
    leadership: 0,
    creativity: 0,
    teamwork: 0,
    technical: 0,
    communication: 0,
};

/** Creates a user profile document if it doesn't already exist */
export const createUserProfile = async (
    uid: string,
    name: string,
    email: string,
    avatar: string = ''
): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
        await setDoc(userRef, {
            name,
            email,
            avatar,
            role: UserRole.STUDENT,
            totalCredits: 0,
            rank: 0,
            skills: DEFAULT_SKILLS,
            createdAt: serverTimestamp(),
        });
    }
};

/** Fetches a user profile by uid */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return null;
    return { id: uid, ...(snap.data() as Omit<UserProfile, 'id'>) };
};

/** Updates any fields on the user document */
export const updateUserProfile = async (
    uid: string,
    data: Partial<Omit<UserProfile, 'id'>>
): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data as Record<string, unknown>);
};

/** Fetches top N users by totalCredits for the leaderboard */
export const getLeaderboard = async (topN: number = 20): Promise<UserProfile[]> => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('totalCredits', 'desc'), limit(topN));
    const snap = await getDocs(q);

    return snap.docs.map((d, index) => ({
        id: d.id,
        ...(d.data() as Omit<UserProfile, 'id'>),
        rank: index + 1,
    }));
};
