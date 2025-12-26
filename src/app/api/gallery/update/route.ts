import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

/**
 * POST: Update an existing gallery
 * Body: { id, title, slug, description, status, images: number[] }
 */
export async function POST(request: NextRequest) {
    const body = await request.json();
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    try {
        const res = await fetch(`${process.env.BASE_URL}/galleries/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (data.status === "error") {
            return NextResponse.json(data, { status: data.code });
        } else {
            return NextResponse.json(data);
        }
    } catch (error) {
        console.log("gallery update error", error);
        throw new Error(`${error}`);
    }
}
