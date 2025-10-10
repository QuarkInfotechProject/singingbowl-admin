import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
    const body = await request.json();
  const token = cookieStore.get('token')?.value;
  // const page = request.nextUrl.searchParams.get('page') || '1'; 
 console.log("body",body)
//  console.log("pagesdfg",page)
  try {
    const res = await fetch(
      `${process.env.BASE_URL}/orders-for-processing`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    console.log("Response data:", data);
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