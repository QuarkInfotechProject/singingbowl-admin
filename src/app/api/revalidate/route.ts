import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { paths, tags, purgeEverything } = payload;

    // Revalidate specific paths if provided
    if (paths && Array.isArray(paths)) {
      paths.forEach((path) => {
        revalidatePath(path);
      });
    }

    // Revalidate specific tags if provided
    if (tags && Array.isArray(tags)) {
      tags.forEach((tag) => {
        revalidateTag(tag);
      });
    }

    if (purgeEverything) {
      revalidatePath("/", "layout");
    }

    return NextResponse.json(
      {
        message: "Revalidation successful",
        revalidated: {
          paths: paths || [],
          tags: tags || [],
          purgeEverything: purgeEverything || false,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { message: "Error revalidating cache" },
      { status: 500 }
    );
  }
}
