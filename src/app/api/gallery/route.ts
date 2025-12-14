import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * GET: Fetch all gallery images
 * Returns the list of images currently in the gallery
 */
export async function GET(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // TODO: Replace with actual API endpoint when ready
        const response = await fetch(`${API_URL}/gallery`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch gallery");
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching gallery:", error);
        return NextResponse.json(
            { error: "Failed to fetch gallery" },
            { status: 500 }
        );
    }
}

/**
 * POST: Save gallery images
 * Body: { images: number[] } - Array of image IDs in display order
 */
export async function POST(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { images } = body;

        if (!Array.isArray(images)) {
            return NextResponse.json(
                { error: "Invalid request body. 'images' must be an array." },
                { status: 400 }
            );
        }

        // TODO: Replace with actual API endpoint when ready
        const response = await fetch(`${API_URL}/gallery`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ images }),
        });

        if (!response.ok) {
            throw new Error("Failed to save gallery");
        }

        const data = await response.json();
        return NextResponse.json({
            message: "Gallery saved successfully",
            data,
        });
    } catch (error) {
        console.error("Error saving gallery:", error);
        return NextResponse.json(
            { error: "Failed to save gallery" },
            { status: 500 }
        );
    }
}
