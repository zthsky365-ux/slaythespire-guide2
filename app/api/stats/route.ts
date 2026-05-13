import { NextResponse } from "next/server";
import { getSiteStats, recordPageView } from "@/lib/db";

export async function GET() {
  try {
    const stats = await getSiteStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { articleId, path, userAgent, referrer } = body;

    await recordPageView({
      articleId: articleId || null,
      path: path || "/",
      visitedAt: new Date().toISOString(),
      userAgent: userAgent || "unknown",
      referrer: referrer || null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error recording page view:", error);
    return NextResponse.json({ error: "Failed to record page view" }, { status: 500 });
  }
}
