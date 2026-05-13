import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import type { Tag } from "@/lib/types";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    const tags = readData<Tag[]>("tags.json");
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

    const tags = readData<Tag[]>("tags.json");
    
    const newTag: Tag = {
      id: generateId(),
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      color: color || "#8b5cf6",
      articleCount: 0,
    };

    tags.push(newTag);
    writeData("tags.json", tags);

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

    const tags = readData<Tag[]>("tags.json");
    const tagIndex = tags.findIndex((t) => t.id === id);

    if (tagIndex === -1) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    const updatedTag = {
      ...tags[tagIndex],
      name: body.name ?? tags[tagIndex].name,
      slug: body.name ? body.name.toLowerCase().replace(/\s+/g, "-") : tags[tagIndex].slug,
      color: body.color ?? tags[tagIndex].color,
    };

    tags[tagIndex] = updatedTag;
    writeData("tags.json", tags);

    return NextResponse.json(updatedTag);
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

    const tags = readData<Tag[]>("tags.json");
    const filteredTags = tags.filter((t) => t.id !== id);

    if (filteredTags.length === tags.length) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    writeData("tags.json", filteredTags);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 });
  }
}
