import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface ParamT {
  params: {
    name: string;
  };
}
export async function GET(request: Request, { params }: ParamT) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  try {
    const res = await fetch(
      `${process.env.BASE_URL}/emails/show/${params.name}`,
      {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
  console.log(data)
    return NextResponse.json(data);
  } catch (error) {
    throw new Error(`${error}`);
  }
}
