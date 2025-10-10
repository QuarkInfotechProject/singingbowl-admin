import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  const page = request.nextUrl.searchParams.getAll('page');
  try {
    const res = await fetch(
      `${process.env.BASE_URL}/attribute-sets?page=${page[0]}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
  
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
export async function POST(request: Request) {
  const body = await request.json();
  const cookieStore = cookies();
  const token = cookieStore.get('User token')?.value;
  

  try {
    const res = await fetch(`${process.env.BASE_URL}/tags`, {
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
