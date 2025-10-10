import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  const page = request.nextUrl.searchParams.get('page') || '1'; 


  try {
    const res = await fetch(`${process.env.BASE_URL}/files?page=${page}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    if (res.status == 200) {
      return NextResponse.json(data);
    }
  } catch (error) {
    throw new Error(`${error}`);
  }
}