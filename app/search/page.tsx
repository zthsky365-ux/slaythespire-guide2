"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ArticleGrid } from "@/components/articles/article-grid";
import type { Article, Category } from "@/lib/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialTag = searchParams.get("tag") || "";
  
  const [query, setQuery] = useState(initialTag);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [articlesRes, categoriesRes] = await Promise.all([
          fetch("/api/articles").then((res) => res.json()),
          fetch("/api/categories").then((res) => res.json()),
        ]);
        setArticles(articlesRes);
        setCategories(categoriesRes);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredArticles = articles.filter((article) => {
    if (!query) return true;
    const searchLower = query.toLowerCase();
    return (
      article.title.toLowerCase().includes(searchLower) ||
      article.content.toLowerCase().includes(searchLower) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="min-h-screen">
      {/* Search Header */}
      <header className="py-12 bg-gradient-to-b from-card to-background">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl font-bold text-center mb-8">Search Guides</h1>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title, content, or tags..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 h-14 text-lg bg-card"
              />
            </div>
            {query && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                Found {filteredArticles.length} result{filteredArticles.length !== 1 ? "s" : ""} for "{query}"
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
                  <div className="h-48 bg-secondary" />
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-secondary rounded w-3/4" />
                    <div className="h-4 bg-secondary rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <ArticleGrid articles={filteredArticles} categories={categories} showFeatured={false} />
          ) : (
            <div className="text-center py-16">
              <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-4">
                No articles found matching your search.
              </p>
              <p className="text-sm text-muted-foreground">
                Try different keywords or browse by category.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>}>
      <SearchContent />
    </Suspense>
  );
}
