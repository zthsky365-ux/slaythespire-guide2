import { NextRequest, NextResponse } from "next/server";

const DEFAULT_USERS = [
  { id: "user-1", email: "admin@example.com", password: "admin123", name: "Admin", role: "admin", createdAt: "2026-01-01T00:00:00Z" },
];

export async function GET(request: NextRequest) {
  try {
    const userCookie = request.cookies.get("user");
    
    if (!userCookie) {
      return NextResponse.json({ user: null });
    }

    const user = JSON.parse(userCookie.value);
    const { password: _, ...safeUser } = user;

    return NextResponse.json({ user: safeUser });
  } catch {
    return NextResponse.json({ user: null });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, currentPassword, newPassword } = body;

    // Get current user from cookie
    const userCookie = request.cookies.get("user");
    if (!userCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const currentUser = JSON.parse(userCookie.value);
    const user = DEFAULT_USERS.find(u => u.id === currentUser.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password if changing password
    if (currentPassword || newPassword) {
      if (user.password !== currentPassword) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }
      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
      }
    }

    // Update user (in production, this would update the database)
    const updatedUser = {
      ...user,
      name: name || user.name,
      email: email || user.email,
    };

    const { password: _, ...safeUser } = updatedUser;

    const response = NextResponse.json({ user: safeUser });
    response.cookies.set("user", JSON.stringify(safeUser), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
