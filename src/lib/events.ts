import { Timestamp } from "firebase/firestore";
import type { Event } from "@/lib/types";

// Helper to convert Firestore Timestamps to JSON-serializable format (ISO strings)
// This should be used on the server before passing data to a client component.
export const serializeEvent = (event: Event): Event => {
  const newEvent = { ...event };
  // Serialize date fields
  if (event.date && (event.date instanceof Timestamp || (event.date as any).toDate)) {
    newEvent.date = (event.date as Timestamp).toDate().toISOString();
  }
  if (event.createdAt && (event.createdAt instanceof Timestamp || (event.createdAt as any).toDate)) {
    newEvent.createdAt = (event.createdAt as Timestamp).toDate().toISOString();
  }
  return newEvent;
};

// Helper to serialize an array of events
export const serializeEvents = (events: Event[]): Event[] => {
    return events.map(serializeEvent);
}

// Helper to convert firestore date string or timestamp to JS Date for date-fns on the client
export const toDate = (date: string | Timestamp | Date | undefined): Date => {
  if (!date) return new Date(NaN); // Return an invalid date if input is undefined
  if (date instanceof Timestamp) {
    return date.toDate();
  }
  // Check if it's a serialized timestamp object from the client
  if (typeof date === 'object' && date.hasOwnProperty('seconds') && date.hasOwnProperty('nanoseconds')) {
    // @ts-ignore
    return new Timestamp(date.seconds, date.nanoseconds).toDate();
  }
  if (typeof date === 'string') {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }
  if (date instanceof Date) {
      return date;
  }
  return new Date(NaN);
}
