import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  try {
    const res = await fetch(`${process.env.BASE_URL}/file-categories`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (res.status == 200) {
      return NextResponse.json(data);
    }
  } catch (error) {
    throw new Error(`${error}`);
  }
}