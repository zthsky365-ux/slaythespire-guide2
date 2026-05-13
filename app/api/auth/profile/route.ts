import { NextRequest, NextResponse } from "next/server";
import { readData } from "@/lib/db";
import type { User } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("session");
    
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Decode session token
    const decoded = Buffer.from(sessionCookie.value, "base64").toString("utf-8");
    const userId = decoded.split(":")[0];

    const users = readData<User[]>("users.json");
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { password: _password, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch {
    return NextResponse.json({ error: "Failed to get profile" }, { status: 500 });
  }
}
