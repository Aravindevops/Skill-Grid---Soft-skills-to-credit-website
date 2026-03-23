import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import { AppNotification } from '../types';
import { getAllStudents } from './userService';

/** 
 * Subscribes to the live stream of a user's notifications. 
 * Returns the unsubscribe function.
 */
export const subscribeToNotifications = (
  uid: string,
  onUpdate: (notifications: AppNotification[]) => void
) => {
  const notifRef = collection(db, 'users', uid, 'notifications');
  const q = query(notifRef, orderBy('date', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const notifs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AppNotification[];
    onUpdate(notifs);
  });
};

/**
 * Creates a notification for a single student.
 */
export const createNotification = async (
  uid: string, 
  payload: Omit<AppNotification, 'id' | 'isRead' | 'date'>
): Promise<void> => {
  const notifRef = doc(collection(db, 'users', uid, 'notifications'));
  await setDoc(notifRef, {
    ...payload,
    isRead: false,
    date: new Date().toISOString() // Or serverTimestamp if you parse carefully
  });
};

/**
 * Mass-dispatches a notification to every active student.
 */
export const notifyAllStudents = async (
  payload: Omit<AppNotification, 'id' | 'isRead' | 'date'>
): Promise<void> => {
  const students = await getAllStudents();
  // Using batched writes for efficiency
  const chunkArray = (arr: any[], size: number) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );

  const chunks = chunkArray(students, 400); // Firestore max batch is 500

  for (const chunk of chunks) {
    const batch = writeBatch(db);
    for (const student of chunk) {
      if (!student.id) continue;
      const ref = doc(collection(db, 'users', student.id, 'notifications'));
      batch.set(ref, {
        ...payload,
        isRead: false,
        date: new Date().toISOString()
      });
    }
    await batch.commit();
  }
};

/** Mark a specific notification as read */
export const markNotificationAsRead = async (uid: string, notifId: string): Promise<void> => {
  const docRef = doc(db, 'users', uid, 'notifications', notifId);
  await updateDoc(docRef, { isRead: true });
};

/** Mark all notifications as read */
export const markAllNotificationsAsRead = async (uid: string, unreadIds: string[]): Promise<void> => {
    if (!unreadIds.length) return;
    const batch = writeBatch(db);
    unreadIds.forEach(id => {
      const ref = doc(db, 'users', uid, 'notifications', id);
      batch.update(ref, { isRead: true });
    });
    await batch.commit();
};

/** Delete a specific notification */
export const deleteNotification = async (uid: string, notifId: string): Promise<void> => {
  const docRef = doc(db, 'users', uid, 'notifications', notifId);
  await deleteDoc(docRef);
};
