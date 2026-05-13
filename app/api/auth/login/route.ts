import { NextRequest, NextResponse } from "next/server";
import { readData } from "@/lib/db";
import type { User } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const users = readData<User[]>("users.json");
    const user = users.find((u) => u.email === email);

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create a simple session token (in production, use proper JWT)
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

    // Also set a user cookie for client-side access
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
