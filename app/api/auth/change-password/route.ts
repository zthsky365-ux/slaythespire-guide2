import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import type { User } from "@/lib/types";

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

    const users = readData<User[]>("users.json");
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    if (users[userIndex].password !== currentPassword) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    // Update password
    users[userIndex].password = newPassword;
    writeData("users.json", users);

    return NextResponse.json({ message: "Password changed successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}
