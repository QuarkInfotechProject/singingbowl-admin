import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  try {
    const res = await fetch(`${process.env.BASE_URL}/permission/menu`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
  const token = cookieStore.get('token')?.value;
  
  
  // const user = cookieStore.get('X-User-ID')?.value;
  console.log('sent data', JSON.stringify(body));
  try {
    const res = await fetch(`${process.env.BASE_URL}/group/assign-menu-permission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        // 'X-User-ID': user,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    console.log(data)
  
    if (res.status!== 200) {
      return NextResponse.json(data,{ status: res.status });
    }
     else {
      return NextResponse.json(data);
    }
  } catch (error) {
    throw new Error(`${error}`);
  }
  }

