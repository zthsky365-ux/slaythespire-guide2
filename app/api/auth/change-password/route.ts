import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("session");

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current and new password required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Decode session token
    const decoded = Buffer.from(sessionCookie.value, "base64").toString("utf-8");
    const userId = decoded.split(":")[0];

    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Note: Password update requires a DB update function - simplified for now
    return NextResponse.json({ message: "Password change not fully implemented with DB yet" });
  } catch {
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}
