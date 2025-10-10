import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  try {
    const res = await fetch(`${process.env.BASE_URL}/logout`, {
      method: 'POST',
      headers: {  
        Authorization: `Bearer ${token}`,
      },
    });
    
    const data = await res.json();
  
   
    if (res.status == 200) {
      cookieStore.delete('token');
      cookieStore.delete('X-User-ID');
      cookieStore.delete('currentUser');
      cookieStore.delete('groupId')
      
    }
   
    return NextResponse.json(data);
  } catch (error) {
    throw new Error(`${error}`);
  }
}
