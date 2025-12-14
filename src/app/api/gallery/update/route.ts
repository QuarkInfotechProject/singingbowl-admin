import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * PUT: Update gallery order
 * Body: { images: number[] } - Array of image IDs in new display order
 */
export async function PUT(request: NextRequest) {
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
        const response = await fetch(`${API_URL}/gallery/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ images }),
        });

        if (!response.ok) {
            throw new Error("Failed to update gallery order");
        }

        const data = await response.json();
        return NextResponse.json({
            message: "Gallery order updated successfully",
            data,
        });
    } catch (error) {
        console.error("Error updating gallery:", error);
        return NextResponse.json(
            { error: "Failed to update gallery order" },
            { status: 500 }
        );
    }
}

/**
 * DELETE: Remove image from gallery
 * Body: { imageId: number } - ID of the image to remove
 */
export async function DELETE(request: NextRequest) {
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
        const { imageId } = body;

        if (!imageId) {
            return NextResponse.json(
                { error: "Invalid request body. 'imageId' is required." },
                { status: 400 }
            );
        }

        // TODO: Replace with actual API endpoint when ready
        const response = await fetch(`${API_URL}/gallery/${imageId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to remove image from gallery");
        }

        const data = await response.json();
        return NextResponse.json({
            message: "Image removed from gallery successfully",
            data,
        });
    } catch (error) {
        console.error("Error removing image from gallery:", error);
        return NextResponse.json(
            { error: "Failed to remove image from gallery" },
            { status: 500 }
        );
    }
}
