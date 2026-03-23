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
import { Event, Reward, SkillMetrics } from '../types';
import { notifyAllStudents, createNotification } from './notificationService';

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

    // Notify all students about the new event
    await notifyAllStudents({
        title: `New Event: ${event.title}`,
        message: `A new ${event.category.toLowerCase()} has been scheduled for ${new Date(event.date).toLocaleDateString()}. Earn up to ${event.credits} points!`,
        type: 'event'
    }).catch(console.error); // Do not block if notification fails
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
    
    // Notify all students about the new reward
    await notifyAllStudents({
        title: `New Reward Available!`,
        message: `The '${reward.name}' has been added to the store for ${reward.cost} credits. Grab it while it lasts!`,
        type: 'reward'
    }).catch(console.error);
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
    eventSkills?: SkillMetrics
): Promise<void> => {
    // Update the event status in the student's subcollection
    const eventRef = doc(db, 'users', studentUid, 'events', eventId);
    await updateDoc(eventRef, { status: 'Verified' });

    // Add credits and bump skills on the student's main doc
    const userRef = doc(db, 'users', studentUid);
    const updatePayload: Record<string, any> = {
        totalCredits: increment(credits)
    };

    if (eventSkills) {
        if (eventSkills.leadership) updatePayload['skills.leadership'] = increment(eventSkills.leadership);
        if (eventSkills.creativity) updatePayload['skills.creativity'] = increment(eventSkills.creativity);
        if (eventSkills.teamwork) updatePayload['skills.teamwork'] = increment(eventSkills.teamwork);
        if (eventSkills.technical) updatePayload['skills.technical'] = increment(eventSkills.technical);
        if (eventSkills.communication) updatePayload['skills.communication'] = increment(eventSkills.communication);
    } else {
        // Fallback for older events without a split: give 10 points to a default skill
        updatePayload['skills.teamwork'] = increment(10);
    }

    await updateDoc(userRef, updatePayload);

    // Notify the specific student that their points have been verified
    await createNotification(studentUid, {
        title: `Points Verified: +${credits} pts`,
        message: `Your attendance at the event has been officially verified by faculty. ${credits} points have been added to your account!`,
        type: 'verification'
    }).catch(console.error);
};

/** Rejects / removes a student's pending event */
export const rejectStudentEvent = async (
    studentUid: string,
    eventId: string
): Promise<void> => {
    await deleteDoc(doc(db, 'users', studentUid, 'events', eventId));
};
