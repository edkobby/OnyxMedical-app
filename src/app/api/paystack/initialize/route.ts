
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, amount, invoiceId } = await req.json();

  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json(
      { message: 'Paystack secret key is not configured.' },
      { status: 500 }
    );
  }

  if (!email || !amount || !invoiceId) {
    return NextResponse.json({ message: 'Missing required fields: email, amount, or invoiceId.' }, { status: 400 });
  }

  try {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        metadata: {
          invoiceId,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      console.error('Paystack API Error:', data);
      return NextResponse.json({ message: data.message || 'Failed to initialize payment' }, { status: response.status });
    }

    return NextResponse.json(data.data);

  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ message: 'An internal error occurred.' }, { status: 500 });
  }
}
