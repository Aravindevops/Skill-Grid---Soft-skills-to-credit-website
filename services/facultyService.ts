import {
    collection,
    doc,
    addDoc,
    deleteDoc,
    getDocs,
    updateDoc,
    increment,
    query,
    where,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Event, Reward } from '../types';

// ─── Storage ───────────────────────────────────────────────

/** Uploads an image file to Firebase Storage and returns the download URL */
export const uploadImage = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    // Add a 10 second timeout because Firebase SDK can retry indefinitely if the bucket isn't properly initialized
    const uploadTask = uploadBytes(storageRef, file);
    const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Upload timed out. Is Firebase Storage enabled in your console?')), 10000)
    );

    await Promise.race([uploadTask, timeout]);
    return getDownloadURL(storageRef);
};

// ─── Events ────────────────────────────────────────────────

/** Posts a new global event */
export const postEvent = async (
    event: Omit<Event, 'id'>
): Promise<void> => {
    await addDoc(collection(db, 'events'), {
        ...event,
        createdAt: serverTimestamp(),
    });
};

/** Deletes a global event */
export const deleteEvent = async (eventId: string): Promise<void> => {
    await deleteDoc(doc(db, 'events', eventId));
};

/** Fetches all global events */
export const getAllEvents = async (): Promise<Event[]> => {
    const snap = await getDocs(collection(db, 'events'));
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Event, 'id'>) }));
};

// ─── Rewards ───────────────────────────────────────────────

/** Adds a new reward to the store */
export const addReward = async (
    reward: Omit<Reward, 'id'>
): Promise<void> => {
    await addDoc(collection(db, 'rewards'), reward);
};

/** Deletes a reward from the store */
export const deleteReward = async (rewardId: string): Promise<void> => {
    await deleteDoc(doc(db, 'rewards', rewardId));
};

/** Fetches all rewards */
export const getAllRewards = async (): Promise<Reward[]> => {
    const snap = await getDocs(collection(db, 'rewards'));
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Reward, 'id'>) }));
};

// ─── Student Verification ──────────────────────────────────

/** Fetches a student's events that are pending verification */
export interface StudentEvent extends Event {
    studentUid: string;
}

export const getStudentEvents = async (studentUid: string): Promise<Event[]> => {
    const ref = collection(db, 'users', studentUid, 'events');
    const snap = await getDocs(ref);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Event, 'id'>) }));
};

/** Verifies a student's event: marks it Verified and adds credits */
export const verifyStudentEvent = async (
    studentUid: string,
    eventId: string,
    credits: number,
    skillKey: keyof { leadership: number; creativity: number; teamwork: number; technical: number; communication: number }
): Promise<void> => {
    // Update the event status in the student's subcollection
    const eventRef = doc(db, 'users', studentUid, 'events', eventId);
    await updateDoc(eventRef, { status: 'Verified' });

    // Add credits and bump skill on the student's main doc
    const userRef = doc(db, 'users', studentUid);
    await updateDoc(userRef, {
        totalCredits: increment(credits),
        [`skills.${skillKey}`]: increment(10), // each verification adds 10 points to chosen skill
    });
};

/** Rejects / removes a student's pending event */
export const rejectStudentEvent = async (
    studentUid: string,
    eventId: string
): Promise<void> => {
    await deleteDoc(doc(db, 'users', studentUid, 'events', eventId));
};
