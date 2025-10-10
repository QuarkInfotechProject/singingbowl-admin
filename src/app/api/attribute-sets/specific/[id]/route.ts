import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface ParamT {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: ParamT) {
  const cookieStore = cookies();
  console.log('requrest got of id ', params.id);
  const token = cookieStore.get('token')?.value;
  // const user = cookieStore.get('X-User-ID')?.value;
  try {
    const res = await fetch(`${process.env.BASE_URL}/attribute-sets/show/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
     
      },
    });
    const data = await res.json();
    console.log('response', data);
    if (data.status === 'error') {
      return NextResponse.json(data, { status: data.code });
    } else {
      return NextResponse.json(data);
    }
  } catch (error) {
    throw new Error(`${error}`);
  }
}

