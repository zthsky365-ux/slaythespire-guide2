import { NextRequest, NextResponse } from "next/server";
import type { User } from "@/lib/types";

// Default users for Vercel deployment (file system is read-only)
const DEFAULT_USERS: User[] = [
  { id: "user-1", email: "admin@example.com", password: "admin123", name: "Admin", role: "admin", createdAt: "2026-01-01T00:00:00Z" },
];

export async function GET() {
  try {
    // Remove passwords from response
    const safeUsers = DEFAULT_USERS.map(({ password, ...user }) => user);
    return NextResponse.json(safeUsers);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, role } = body;

    if (!email || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if email already exists
    if (DEFAULT_USERS.find((u) => u.email === email)) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // In Vercel, we return success but user won't persist
    return NextResponse.json({ 
      message: "User creation disabled in demo mode. Default admin user is: admin@example.com / admin123",
      demo: true 
    }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const userIndex = DEFAULT_USERS.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // In Vercel demo mode, return success but data won't persist
    return NextResponse.json({ 
      message: "User updates disabled in demo mode",
      demo: true 
    }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    if (id === "user-1") {
      return NextResponse.json({ error: "Cannot delete default admin user" }, { status: 400 });
    }

    // In Vercel demo mode, return success but data won't persist
    return NextResponse.json({ 
      message: "User deletion disabled in demo mode",
      demo: true 
    }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
