import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface ParamT {
  params: {
    page: string;
  };
}
export async function POST(request: Request,{ params }: ParamT) {

  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;


  try {
    const res = await fetch(`${process.env.BASE_URL}/coupons?page=${params.page}  `, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log(data)
    if (res.status == 200) {
      return NextResponse.json(data);
    }
  } catch (error) {
    throw new Error(`${error}`);
  }
}