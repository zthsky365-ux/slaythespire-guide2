import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paths = searchParams.get("paths") || "/";
    const pathList = paths.split(",").map((p) => p.trim());

    for (const path of pathList) {
      revalidatePath(path);
      console.log(`[revalidate] Invalidated cache for: ${path}`);
    }

    return NextResponse.json({ success: true, revalidated: pathList });
  } catch (error) {
    console.error("[revalidate] Error:", error);
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
