import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  //   const body = await request.json();
  const cookieStore = cookies();

  const token = cookieStore.get("token")?.value;
  // const page = request.nextUrl.searchParams.getAll('page');
  //   console.log("bodyof coupons", body);

  try {
    const res = await fetch(`${process.env.BASE_URL}/coupons`, {
      method: "POST",
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      //   body: JSON.stringify(body),
    });
    const data = await res.json();
    console.log("dat aof couipns", data);

    if (data.status === "error") {
      return NextResponse.json(data, { status: data.code });
    } else {
      return NextResponse.json(data);
    }
  } catch (error) {
    throw new Error(`${error}`);
  }
}
