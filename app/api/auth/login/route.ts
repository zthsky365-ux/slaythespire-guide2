import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "邮箱和密码不能为空" }, { status: 400 });
    }

    // Find user from database
    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 401 });
    }

    if (user.password !== password) {
      return NextResponse.json({ error: "密码错误" }, { status: 401 });
    }

    // Create session token
    const sessionToken = Buffer.from(`${user.id}:${Date.now()}`).toString("base64");

    const { password: _, ...safeUser } = user;

    const response = NextResponse.json({
      user: safeUser,
      message: "登录成功"
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
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ 
      error: "登录失败，请稍后重试",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
