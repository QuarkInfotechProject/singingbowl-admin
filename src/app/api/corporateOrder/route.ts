import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  const page = request.nextUrl.searchParams.getAll('page');
 console.log(page)

  try {
    const res = await fetch(
      `${process.env.BASE_URL}/corporate-orders?page=${page}`,
      {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        
      }
    );
    const data = await res.json();
    console.log(data)
    if (data.status === 'error') {
      return NextResponse.json(data, { status: data.code });
    } else {
      return NextResponse.json(data);
    }
  } catch (error) {
    console.log('groups get error', error);
    throw new Error(`${error}`);
  }
}