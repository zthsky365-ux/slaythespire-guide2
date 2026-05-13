import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import type { User } from "@/lib/types";

export async function GET() {
  try {
    const users = readData<User[]>("users.json");
    // Remove passwords from response
    const safeUsers = users.map(({ password, ...user }) => user);
    return NextResponse.json(safeUsers);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password, role } = body;

    if (!email || !name || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const users = readData<User[]>("users.json");

    // Check if email already exists
    if (users.find((u) => u.email === email)) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      password, // In production, hash this password!
      role: role || "editor",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeData("users.json", users);

    const { password: _, ...safeUser } = newUser;
    return NextResponse.json(safeUser, { status: 201 });
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

    const users = readData<User[]>("users.json");
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = {
      ...users[userIndex],
      email: body.email ?? users[userIndex].email,
      name: body.name ?? users[userIndex].name,
      role: body.role ?? users[userIndex].role,
      password: body.password || users[userIndex].password,
    };

    users[userIndex] = updatedUser;
    writeData("users.json", users);

    const { password: _, ...safeUser } = updatedUser;
    return NextResponse.json(safeUser);
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

    const users = readData<User[]>("users.json");
    const filteredUsers = users.filter((u) => u.id !== id);

    if (filteredUsers.length === users.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    writeData("users.json", filteredUsers);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
