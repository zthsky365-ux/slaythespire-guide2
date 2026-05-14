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
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  articleCount: number;
}

export default function CategoriesPage() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!editingCategory) return;

    try {
      const method = categories.find((c) => c.id === editingCategory.id) ? "PUT" : "POST";
      await fetch("/api/categories", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCategory),
      });
      setIsDialogOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("category.deleteConfirm"))) return;

    try {
      await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-serif">{t("category.categoryList")}</h1>
          <p className="text-muted-foreground mt-1">{t("category.categoryList")}</p>
        </div>
        <Button
          onClick={() => {
            setEditingCategory({
              id: "",
              name: "",
              slug: "",
              description: "",
              icon: "folder",
              articleCount: 0,
            });
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("category.createCategory")}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("category.name")}</TableHead>
                <TableHead>{t("category.slug")}</TableHead>
                <TableHead>{t("category.description")}</TableHead>
                <TableHead>{t("category.count")}</TableHead>
                <TableHead>{t("article.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">{t("common.loading")}</TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">{t("home.noArticles")}</TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FolderTree className="h-4 w-4 text-primary" />
                        {category.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">/{category.slug}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>{category.articleCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingCategory(category); setIsDialogOpen(true); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)} className="hover:text-destructive">
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory?.id ? t("category.editCategory") : t("category.createCategory")}</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">{t("category.name")}</label>
                <Input value={editingCategory.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">{t("category.description")}</label>
                <Input value={editingCategory.description} onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t("common.cancel")}</Button>
                <Button onClick={handleSave}>{t("common.save")}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
