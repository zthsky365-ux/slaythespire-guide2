import { NextResponse } from "next/server";
import { getArticles } from "@/lib/db";

export async function GET() {
  try {
    const articles = await getArticles();
    // Return all articles (including unpublished) for admin
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
