import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const API_SECRET = process.env.API_SECRET;

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const body = await req.json();
  if (!body.nonce || !body.timestamp || !body.signature) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { nonce, timestamp, signature } = body;
  const expectedSignature = crypto
    .createHmac('sha256', API_SECRET)
    .update(`${nonce}${timestamp}`)
    .digest('hex');

  if (signature !== expectedSignature || Date.now() - timestamp > 30000) {
    return NextResponse.json({ error: 'Invalid signature or expired request' }, { status: 403 });
  }

  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  return NextResponse.json({ token }, { 
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    }
  });
}