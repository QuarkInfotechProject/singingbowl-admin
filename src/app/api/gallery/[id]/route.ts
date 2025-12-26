import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

/**
 * GET: Fetch gallery details by ID
 * URL: /api/gallery/[id]
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const { id } = params;

    try {
        const res = await fetch(`${process.env.BASE_URL}/galleries/show/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (data.status === "error") {
            return NextResponse.json(data, { status: data.code });
        } else {
            return NextResponse.json(data);
        }
    } catch (error) {
        console.log("gallery show error", error);
        throw new Error(`${error}`);
    }
}
