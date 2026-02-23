import {
    collection,
    getDocs,
    doc,
    setDoc,
    query,
    orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Event } from '../types';

/** Fetches all campus-wide events from /events collection */
export const getAllEvents = async (): Promise<Event[]> => {
    const eventsRef = collection(db, 'events');
    const snap = await getDocs(eventsRef);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Event, 'id'>) }));
};

/** Fetches the logged-in user's own event history from /users/{uid}/events */
export const getUserEvents = async (uid: string): Promise<Event[]> => {
    const userEventsRef = collection(db, 'users', uid, 'events');
    const q = query(userEventsRef, orderBy('date', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Event, 'id'>) }));
};

/** Registers a user for an event by adding it to their /events subcollection */
export const registerForEvent = async (uid: string, event: Event): Promise<void> => {
    const eventRef = doc(db, 'users', uid, 'events', event.id);
    await setDoc(eventRef, {
        title: event.title,
        date: event.date,
        category: event.category,
        credits: event.credits,
        status: 'Upcoming',
        description: event.description,
    });
};
