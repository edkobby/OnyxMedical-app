
'use server';

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAdminDb } from "./firebase/client-admin";


export type NotificationType = 
    | 'new_patient' 
    | 'new_appointment' 
    | 'new_telemedicine_request' 
    | 'new_message'
    | 'appointment_update'
    | 'admin_reply';

export interface NotificationPayload {
    title: string;
    description: string;
    type: NotificationType;
    href?: string;
    recipientId: string; // 'admin' or a user's UID
}

/**
 * Creates a notification in the Firestore 'notifications' collection.
 * @param payload - The data for the notification.
 */
export async function createNotification(payload: NotificationPayload) {
    try {
        const adminDb = getAdminDb();
        await addDoc(collection(adminDb, "notifications"), {
            ...payload,
            createdAt: serverTimestamp(),
            read: false,
        });
    } catch (error) {
        console.error("Error creating notification: ", error);
        // In a real-world app, you might want more robust error handling here.
    }
}
