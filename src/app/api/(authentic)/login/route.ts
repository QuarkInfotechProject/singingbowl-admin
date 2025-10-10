'use server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  try {
  const res = await fetch(`${process.env.BASE_URL}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body), 
  });
  const data = await res.json();
  if (res.ok) {
  const tokenValue = data.data.token;
  const expiresAt = new Date(data.data.ExpiresAt + ' UTC');
  const userData = data.data.user;
  
  cookies().set({
    name: 'token',
    value: tokenValue,
    httpOnly: true,
    sameSite: false,
    secure: false,
    path: '/',
    expires: expiresAt,
  });
  cookies().set({
    name: 'X-User-ID',
    value: userData.userId,
    httpOnly: false,
    secure: false,
    path: '/',
    expires: expiresAt,
  });
  cookies().set({
    name: 'currentUser',
    value: userData.name,
    httpOnly: false,
    secure: false,

    path: '/',
    expires: expiresAt,
  });
  cookies().set({
    name: 'groupId',
    value: userData.groupId,
    httpOnly: true,
    secure: false,
    // sameSite:true;
    path: '/',
    expires: expiresAt,
  });
  
  return NextResponse.json(data);
    
} else {
  return NextResponse.json(data, { status: res.status });
}
  
} catch (error) {

  throw new Error('Server error');
}
}
