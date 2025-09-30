// app/api/calendar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebase-admin';

export async function GET(req: NextRequest) {
  if (!adminDb) {
    return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
  }
  try {
    const snapshot = await adminDb.collection('calendar').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ data });
  } catch (err) {
    console.error('Error fetching calendar data:', err);
    return NextResponse.json({ error: 'Failed to fetch calendar data' }, { status: 500 });
  }
}
