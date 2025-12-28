import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

/**
 * POST: Fetch all galleries (List endpoint)
 * The backend expects POST request for listing galleries
 */
export async function POST(request: NextRequest) {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    try {
        // Extract query parameters from the request URL
        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page") || "1";

        // Build the backend URL with query parameters
        const backendUrl = `${process.env.BASE_URL}/galleries?page=${page}`;

        const res = await fetch(backendUrl, {
            method: "POST",
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
        console.log("galleries get error", error);
        throw new Error(`${error}`);
    }
}
