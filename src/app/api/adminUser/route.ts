import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const requestData = await request.json();
    console.log("payload recieved is : ", requestData)
    console.log("pagess?????????????",page)

    const res = await fetch(`${process.env.BASE_URL}/users?page=${page}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    });
    const data = await res.json();
    console.log("payload Sent isdata her: ", data)

    return NextResponse.json(data);
  } catch (error) {
    throw new Error(`${error}`);
  }
}

