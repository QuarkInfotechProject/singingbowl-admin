import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  const body = await request.json();
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  console.log('sent data', JSON.stringify(body));
  try {
    const res = await fetch(`${process.env.BASE_URL}/attributes/destroy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    console.log("response from tags is : ", data)
    console.log(data);
    if (data.status === 'error') {
      return NextResponse.json(data, { status: data.code });
    } else {
      return NextResponse.json(data);
    }
  } catch (error) {
    throw new Error(`${error}`);
  }
}
