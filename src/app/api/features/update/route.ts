import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
   console.log(body)
    try {
      const res = await fetch(`${process.env.BASE_URL}/features/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      console.log(data)
      if (res.status == 200) {
        return NextResponse.json(data);
      }else{
        return NextResponse.json(data,{
          status:res.status
        });
      }
    } catch (error) {
      console.log("eeror of api",error)
      return NextResponse.json(error)
      
    }
  }
  