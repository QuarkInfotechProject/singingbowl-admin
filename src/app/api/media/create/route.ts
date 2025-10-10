import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    
 
    try {
      const res = await fetch(`${process.env.BASE_URL}/files/create`, {
        method: 'POST',
        headers: {
       
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
     
      const data = await res.json();
     
    if (res.status!== 200) {
      return NextResponse.json(data,{ status: res.status });
    }
     else {
      return NextResponse.json(data);
    }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  
  
