
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebase/firebase-admin';

export async function POST(req: Request) {
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  if (!PAYSTACK_SECRET_KEY) {
    console.error('Paystack secret key is not configured.');
    return NextResponse.json({ message: 'Paystack secret key is not configured.' }, { status: 500 });
  }

  const text = await req.text();
  const signature = req.headers.get('x-paystack-signature');
  
  if (!signature) {
    return NextResponse.json({ message: 'No signature found' }, { status: 401 });
  }

  // Verify the webhook signature
  const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(text).digest('hex');
  if (hash !== signature) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(text);

  // Handle the 'charge.success' event
  if (event.event === 'charge.success') {
    const { reference, metadata } = event.data;
    const { invoiceId } = metadata;

    if (!invoiceId) {
      console.log('Webhook received without invoiceId in metadata');
      return NextResponse.json({ status: 'ok, no invoiceId' });
    }

    try {
      if (!adminDb) {
        throw new Error("Firebase Admin not initialized for webhook");
      }
      const invoiceRef = adminDb.collection('invoices').doc(invoiceId);
      await invoiceRef.update({
        status: 'Paid',
        paystackReference: reference,
      });
      console.log(`Invoice ${invoiceId} marked as Paid.`);
    } catch (error) {
      console.error(`Failed to update invoice ${invoiceId}:`, error);
      // Even if DB update fails, return 200 to Paystack to prevent retries
      return NextResponse.json({ status: 'error updating database' }, { status: 500 });
    }
  }

  return NextResponse.json({ status: 'success' });
}

    
