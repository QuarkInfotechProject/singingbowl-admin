import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';


export async function POST(request: NextRequest) {
  const body = await request.json();
  const cookieStore = cookies();

  const token = cookieStore.get('token')?.value;
  const page = request.nextUrl.searchParams.getAll('page');

 
  try {
    const res = await fetch(`${process.env.BASE_URL}/attributes?page=${page[0]}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    
    if (data.status === 'error') {
      return NextResponse.json(data, { status: data.code });
    } else {
      return NextResponse.json(data);
    }
  } catch (error) {
    throw new Error(`${error}`);
  }
}
