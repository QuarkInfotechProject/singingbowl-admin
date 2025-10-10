import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  try {
    const res = await fetch(`${process.env.BASE_URL}/group/menu-mapping`, {
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
   
    throw new Error(`${error}`);
  }
}