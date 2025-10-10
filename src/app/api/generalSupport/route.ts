import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
 
  const token = cookieStore.get('token')?.value;


  try {
    const res = await fetch(
      `${process.env.BASE_URL}/general-supports`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'application/json',
        },
        // body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    // console.log("Response data:", data);
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