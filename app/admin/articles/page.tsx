"use client";

import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/admin/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import type { Article, Category } from "@/lib/types";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    categoryId: "",
    tags: "",
    status: "draft",
    coverImage: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [articlesRes, categoriesRes] = await Promise.all([
        fetch("/api/articles").then((res) => res.json()),
        fetch("/api/categories").then((res) => res.json()),
      ]);
      // Get all articles (including unpublished) from the full list
      const allArticlesRes = await fetch("/api/admin/articles").then((res) => res.json()).catch(() => articlesRes);
      setArticles(articlesRes);
      setCategories(categoriesRes);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setLoading(false);
  }

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      categoryId: article.categoryId,
      tags: article.tags.join(", "),
      status: article.status,
      coverImage: article.coverImage || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    
    try {
      await fetch(`/api/articles?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Failed to delete article:", error);
    }
  };

  const handleToggleStatus = async (article: Article) => {
    const newStatus = article.status === "published" ? "draft" : "published";
    try {
      await fetch("/api/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: article.id, status: newStatus }),
      });
      fetchData();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (editingArticle) {
        await fetch("/api/articles", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingArticle.id, ...data }),
        });
      } else {
        await fetch("/api/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
      setIsDialogOpen(false);
      setEditingArticle(null);
      fetchData();
    } catch (error) {
      console.error("Failed to save article:", error);
    }
  };

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64"><p>Loading...</p></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Articles</h1>
          <p className="text-muted-foreground mt-1">Manage your content</p>
        </div>
        <Button onClick={() => {
          setEditingArticle(null);
          setFormData({
            title: "",
            content: "",
            excerpt: "",
            categoryId: categories[0]?.id || "",
            tags: "",
            status: "draft",
            coverImage: "",
          });
          setIsDialogOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          New Article
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <DataTable
        data={filteredArticles}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingArticle ? "Edit Article" : "Create New Article"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Article title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content (Markdown)</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your article content in Markdown..."
                className="min-h-[300px] font-mono text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Excerpt</label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief description of the article"
                className="min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  options={categories.map((c) => ({ value: c.id, label: c.name }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  options={[
                    { value: "draft", label: "Draft" },
                    { value: "published", label: "Published" },
                    { value: "archived", label: "Archived" },
                  ]}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., Ironclad, Builds, Beginner"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cover Image URL</label>
              <Input
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingArticle ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
