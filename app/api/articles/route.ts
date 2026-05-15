import { NextResponse } from "next/server";
import { getPublishedArticles, getArticles, createArticle, updateArticle, deleteArticle } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("all") === "true";
    
    // Admin 页面需要获取所有文章（包括草稿），公开页面只获取已发布的
    const articles = showAll ? await getArticles() : await getPublishedArticles();
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, excerpt, categoryId, coverImage, tags, status, authorId } = body;

    if (!title || !content || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const slug = slugify(title);
    const article = await createArticle({
      title,
      slug,
      content,
      excerpt: excerpt || content.slice(0, 160),
      categoryId,
      authorId: authorId || "user-1",
      coverImage: coverImage || null,
      tags: tags || [],
      status: status || "draft",
      publishedAt: status === "published" ? new Date().toISOString() : null,
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
    }

    if (data.title) {
      data.slug = slugify(data.title);
    }

    if (data.status === "published" && !data.publishedAt) {
      data.publishedAt = new Date().toISOString();
    }

    const article = await updateArticle(id, data);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
    }

    const success = await deleteArticle(id);

    if (!success) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
