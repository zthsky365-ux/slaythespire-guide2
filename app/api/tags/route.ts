import { NextRequest, NextResponse } from "next/server";
import { getTags, createTag, deleteTag } from "@/lib/db";

export async function GET() {
  try {
    const tags = await getTags();
    return NextResponse.json(tags);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newTag = await createTag({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      color: color || "#8b5cf6",
    });

    return NextResponse.json(newTag, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Tag ID required" }, { status: 400 });
    }

    // For now, delete and recreate (or implement updateTag in db.ts)
    return NextResponse.json({ message: "Tag update not implemented yet" });
  } catch {
    return NextResponse.json({ error: "Failed to update tag" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Tag ID required" }, { status: 400 });
    }

    await deleteTag(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 });
  }
}
