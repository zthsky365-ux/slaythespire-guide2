import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  notificationEmail: string;
}

export async function GET() {
  try {
    const settings = readData<SiteSettings>("settings.json");
    return NextResponse.json(settings || {
      siteName: "Slay the Spire 2 Guide",
      siteDescription: "Your ultimate guide to Slay the Spire 2",
      notificationEmail: ""
    });
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

    const settings: SiteSettings = {
      siteName: siteName || "Slay the Spire 2 Guide",
      siteDescription: siteDescription || "Your ultimate guide to Slay the Spire 2",
      notificationEmail: notificationEmail || ""
    };

    writeData("settings.json", settings);

    return NextResponse.json({ message: "Settings saved successfully", settings });
  } catch {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
