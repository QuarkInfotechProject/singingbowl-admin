import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';


interface ParamT {
  params: {
    url: string;
  };
}
export async function GET(request: Request,{ params }: ParamT) {
  
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
 


  try {
    const res = await fetch(`${process.env.BASE_URL}/file-categories/show/${params.url}`, {
      method: 'GET',
      headers: {
       
        Authorization: `Bearer ${token}`,
      },
      
   
    });

    const data = await res.json();
    

    if (res.status !== 200) {
      return NextResponse.json(data, { status: res.status });
    } else {
      return NextResponse.json(data);
    }
  } catch (error) {
    throw new Error(`${error}`);
  }
}
