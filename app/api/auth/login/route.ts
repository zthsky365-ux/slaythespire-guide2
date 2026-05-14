import { NextRequest, NextResponse } from "next/server";

// Default admin user
const DEFAULT_USERS = [
  { id: "user-1", email: "zthsky365@gmail.com", password: "wwy_20130202", name: "Admin", role: "admin", createdAt: "2026-01-01T00:00:00Z" },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Find user from default users (for Vercel deployment)
    const user = DEFAULT_USERS.find((u) => u.email === email);

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create session token
    const sessionToken = Buffer.from(`${user.id}:${Date.now()}`).toString("base64");

    const { password: _, ...safeUser } = user;

    const response = NextResponse.json({
      user: safeUser,
      message: "Login successful"
    });

    // Set session cookie
    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    // Set user cookie for client-side access
    response.cookies.set("user", JSON.stringify(safeUser), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
