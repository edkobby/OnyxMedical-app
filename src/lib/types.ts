
import type { Timestamp } from "firebase/firestore";
import type { NotificationType } from "./notifications";

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    avatar: string;
    status: 'Online' | 'Offline' | 'On Break';
    patients: number;
    createdAt?: string; // Serialized
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  author: string;
  date: string | Timestamp;
  status: 'Published' | 'Draft';
  content: string;
  imageUrl?: string;
  excerpt?: string;
  tags?: string[];
  createdAt?: string | Timestamp;
}

export interface Event {
    id: string;
    slug: string;
    title: string;
    description: string;
    imageUrl: string;
    date: string | Timestamp;
    location: string;
    status: 'Upcoming' | 'Completed' | 'Canceled';
    createdAt?: string | Timestamp;
}

export interface Message {
    senderId: string;
    senderName: string;
    content: string;
    timestamp: Timestamp | any; // Allow serverTimestamp
}

export interface Conversation {
    id:string;
    patientId: string;
    patientName: string;
    patientEmail: string;
    subject: string;
    lastMessageSnippet: string;
    lastUpdatedAt: Timestamp;
    read: boolean;
    thread: Message[];
}

export interface AppNotification {
    id: string;
    title: string;
    description: string;
    type: NotificationType;
    href?: string;
    read: boolean;
    createdAt: string; // Serialized
}

export interface TelemedicineSession {
    id: string;
    patientId: string;
    patientName: string;
    doctorName: string;
    dateTime: string;
    platform: 'whatsapp' | 'google_meet';
    status: 'Requested' | 'Scheduled' | 'Completed' | 'Canceled';
    sessionLink?: string;
    createdAt: string; // Serialized
}
