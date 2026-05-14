"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

interface TagData {
  id: string;
  name: string;
  slug: string;
  color: string;
  articleCount: number;
}

const tagColors = [
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-yellow-500",
  "bg-lime-500",
  "bg-green-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-sky-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-fuchsia-500",
  "bg-pink-500",
];

export default function TagsPage() {
  const { t } = useLanguage();
  const [tags, setTags] = useState<TagData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTag, setEditingTag] = useState<TagData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await fetch("/api/tags");
      const data = await res.json();
      setTags(data);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!editingTag) return;

    try {
      const method = tags.find((tag) => tag.id === editingTag.id) ? "PUT" : "POST";
      await fetch("/api/tags", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTag),
      });
      setIsDialogOpen(false);
      setEditingTag(null);
      fetchTags();
    } catch (error) {
      console.error("Failed to save tag:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("tag.deleteConfirm"))) return;

    try {
      await fetch(`/api/tags?id=${id}`, { method: "DELETE" });
      fetchTags();
    } catch (error) {
      console.error("Failed to delete tag:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-serif">{t("tag.tagList")}</h1>
          <p className="text-muted-foreground mt-1">{t("tag.tagList")}</p>
        </div>
        <Button
          onClick={() => {
            setEditingTag({
              id: "",
              name: "",
              slug: "",
              color: "bg-purple-500",
              articleCount: 0,
            });
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("tag.createTag")}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("tag.name")}</TableHead>
                <TableHead>{t("tag.slug")}</TableHead>
                <TableHead>{t("tag.color")}</TableHead>
                <TableHead>{t("tag.count")}</TableHead>
                <TableHead>{t("article.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">{t("common.loading")}</TableCell>
                </TableRow>
              ) : tags.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">{t("home.noArticles")}</TableCell>
                </TableRow>
              ) : (
                tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        {tag.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">/{tag.slug}</TableCell>
                    <TableCell>
                      <div className={`inline-block w-6 h-6 rounded ${tag.color}`} />
                    </TableCell>
                    <TableCell>{tag.articleCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingTag(tag); setIsDialogOpen(true); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(tag.id)} className="hover:text-destructive">
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
            <DialogTitle>{editingTag?.id ? t("tag.editTag") : t("tag.createTag")}</DialogTitle>
          </DialogHeader>
          {editingTag && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">{t("tag.name")}</label>
                <Input
                  value={editingTag.name}
                  onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">{t("tag.color")}</label>
                <div className="flex flex-wrap gap-2">
                  {tagColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded ${color} ${editingTag.color === color ? "ring-2 ring-white ring-offset-2" : ""}`}
                      onClick={() => setEditingTag({ ...editingTag, color })}
                    />
                  ))}
                </div>
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
