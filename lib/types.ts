export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string | null;
  categoryId: string;
  authorId: string;
  status: "draft" | "published" | "archived";
  viewCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "admin" | "editor" | "author";
  createdAt: string;
}

export interface AdPlacement {
  id: string;
  name: string;
  position: "header" | "sidebar" | "content" | "footer";
  size: "728x90" | "300x250" | "300x600" | "320x50";
  enabled: boolean;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageView {
  id: string;
  articleId: string | null;
  path: string;
  visitedAt: string;
  userAgent: string;
  referrer: string | null;
}

export interface SiteStats {
  totalViews: number;
  totalArticles: number;
  totalCategories: number;
  popularArticles: { id: string; title: string; views: number }[];
  recentViews: { date: string; views: number }[];
}
