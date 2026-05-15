import { NextRequest, NextResponse } from "next/server";

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  notificationEmail: string;
}

// In-memory fallback for settings (no DB table for settings yet)
let settingsCache: SiteSettings = {
  siteName: "Slay the Spire 2 Guide",
  siteDescription: "Your ultimate guide to Slay the Spire 2",
  notificationEmail: ""
};

export async function GET() {
  try {
    return NextResponse.json(settingsCache);
  } catch {
    return NextResponse.json({
      siteName: "Slay the Spire 2 Guide",
      siteDescription: "Your ultimate guide to Slay the Spire 2",
      notificationEmail: ""
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("session");

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { siteName, siteDescription, notificationEmail } = body;

    settingsCache = {
      siteName: siteName || "Slay the Spire 2 Guide",
      siteDescription: siteDescription || "Your ultimate guide to Slay the Spire 2",
      notificationEmail: notificationEmail || ""
    };

    return NextResponse.json({ message: "Settings saved successfully", settings: settingsCache });
  } catch {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
