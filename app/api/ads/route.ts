import { NextResponse } from "next/server";
import { getAdPlacements, createAdPlacement, updateAdPlacement, deleteAdPlacement } from "@/lib/db";

export async function GET() {
  try {
    const ads = await getAdPlacements();
    return NextResponse.json(ads);
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json({ error: "Failed to fetch ads" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, position, size, enabled, code } = body;

    if (!name || !position || !size) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const ad = await createAdPlacement({
      name,
      position,
      size,
      enabled: enabled ?? true,
      code: code || "",
    });

    return NextResponse.json(ad, { status: 201 });
  } catch (error) {
    console.error("Error creating ad:", error);
    return NextResponse.json({ error: "Failed to create ad" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Ad ID is required" }, { status: 400 });
    }

    const ad = await updateAdPlacement(id, data);

    if (!ad) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }

    return NextResponse.json(ad);
  } catch (error) {
    console.error("Error updating ad:", error);
    return NextResponse.json({ error: "Failed to update ad" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Ad ID is required" }, { status: 400 });
    }

    const success = await deleteAdPlacement(id);

    if (!success) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting ad:", error);
    return NextResponse.json({ error: "Failed to delete ad" }, { status: 500 });
  }
}
