"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Eye, Star, Search } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import MarkdownEditor from "@/components/admin/markdown-editor";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  categoryName?: string;
  tags: string[];
  authorId: string;
  status: "published" | "draft" | "archived";
  viewCount: number;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ArticlesPage() {
  const { t } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [articlesRes, categoriesRes] = await Promise.all([
        fetch("/api/articles?all=true"),
        fetch("/api/categories"),
      ]);
      const articlesData = await articlesRes.json();
      const categoriesData = await categoriesRes.json();
      
      // Map categoryId to categoryName for display
      const articlesWithCategoryName = articlesData.map((article: Article) => {
        const category = categoriesData.find((c: Category) => c.id === article.categoryId);
        return {
          ...article,
          categoryName: category?.name || "Uncategorized",
          featured: article.featured || false,
          viewCount: article.viewCount || 0,
        };
      });
      
      setArticles(articlesWithCategoryName);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!editingArticle) return;

    try {
      const isEditing = editingArticle.id && editingArticle.id.length > 0;
      const method = isEditing ? "PUT" : "POST";
      
      const articleData = {
        id: isEditing ? editingArticle.id : undefined,
        title: editingArticle.title,
        excerpt: editingArticle.excerpt,
        content: editingArticle.content,
        categoryId: editingArticle.categoryId,
        tags: editingArticle.tags || [],
        status: editingArticle.status,
        featured: editingArticle.featured || false,
        publishedAt: editingArticle.status === "published" ? (editingArticle.publishedAt || new Date().toISOString()) : null,
      };
      
      await fetch("/api/articles", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleData),
      });
      setIsDialogOpen(false);
      setEditingArticle(null);
      fetchData();
    } catch (error) {
      console.error("Failed to save article:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("article.deleteConfirm"))) return;

    try {
      await fetch(`/api/articles?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Failed to delete article:", error);
    }
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-serif">{t("article.articleList")}</h1>
          <p className="text-muted-foreground mt-1">{t("article.articleList")}</p>
        </div>
        <Button
          onClick={() => {
            setEditingArticle({
              id: "",
              title: "",
              slug: "",
              excerpt: "",
              content: "",
              categoryId: "",
              tags: [],
              authorId: "user-1",
              featured: false,
              status: "draft",
              viewCount: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              publishedAt: null,
            });
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("article.createArticle")}
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("search.placeholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("article.title")}</TableHead>
                <TableHead>{t("article.category")}</TableHead>
                <TableHead>{t("article.status")}</TableHead>
                <TableHead>{t("article.views")}</TableHead>
                <TableHead>{t("article.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    {t("common.loading")}
                  </TableCell>
                </TableRow>
              ) : filteredArticles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    {t("home.noArticles")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {article.featured && <Star className="h-4 w-4 text-amber-500" />}
                        {article.title}
                      </div>
                    </TableCell>
                    <TableCell>{article.categoryName || "Uncategorized"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          article.status === "published"
                            ? "bg-green-500/20 text-green-400"
                            : article.status === "draft"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {article.status === "published" ? t("article.published") : t("article.draft")}
                      </span>
                    </TableCell>
                    <TableCell>{article.viewCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(`/articles/${article.slug}`, "_blank")}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingArticle(article);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(article.id)}
                          className="hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingArticle?.id ? t("article.editArticle") : t("article.createArticle")}
            </DialogTitle>
          </DialogHeader>
          {editingArticle && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">{t("article.title")}</label>
                <Input
                  value={editingArticle.title}
                  onChange={(e) => {
                    setEditingArticle({
                      ...editingArticle,
                      title: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    });
                  }}
                  placeholder={t("article.articleTitle")}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">{t("article.articleExcerpt")}</label>
                <Input
                  value={editingArticle.excerpt}
                  onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                  placeholder={t("article.articleExcerpt")}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">{t("article.content")}</label>
                <MarkdownEditor
                  value={editingArticle.content}
                  onChange={(value) => setEditingArticle({ ...editingArticle, content: value })}
                  placeholder={t("article.articleContent")}
                  minHeight={400}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">{t("article.category")}</label>
                  <Select
                    value={editingArticle.categoryId}
                    onValueChange={(value) => setEditingArticle({ ...editingArticle, categoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("article.selectCategory")} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">{t("article.status")}</label>
                  <Select
                    value={editingArticle.status}
                    onValueChange={(value) =>
                      setEditingArticle({ ...editingArticle, status: value as "published" | "draft" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">{t("article.published")}</SelectItem>
                      <SelectItem value="draft">{t("article.draft")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingArticle.featured}
                    onChange={(e) => setEditingArticle({ ...editingArticle, featured: e.target.checked })}
                  />
                  {t("article.featured")}
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button onClick={handleSave}>{t("common.save")}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
