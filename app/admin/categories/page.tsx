"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Category } from "@/lib/types";

const ICONS = [
  { value: "layers", label: "Layers" },
  { value: "user", label: "User" },
  { value: "shield", label: "Shield" },
  { value: "zap", label: "Zap" },
  { value: "lightbulb", label: "Lightbulb" },
];

const COLORS = [
  "#8B5CF6", // Purple
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#10B981", // Green
  "#3B82F6", // Blue
  "#EC4899", // Pink
  "#6366F1", // Indigo
  "#14B8A6", // Teal
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "layers",
    color: "#8B5CF6",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
    setLoading(false);
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    try {
      await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        await fetch("/api/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingCategory.id, ...formData }),
        });
      } else {
        await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      setIsDialogOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><p>Loading...</p></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-1">Organize your content</p>
        </div>
        <Button onClick={() => {
          setEditingCategory(null);
          setFormData({
            name: "",
            description: "",
            icon: "layers",
            color: "#8B5CF6",
          });
          setIsDialogOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          New Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="p-6 bg-card rounded-xl border border-border"
          >
            <div className="flex items-start justify-between mb-4">
              <div 
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <span style={{ color: category.color }} className="text-xl font-bold">
                  {category.name.charAt(0)}
                </span>
              </div>
              <Badge 
                variant="outline"
                style={{ borderColor: category.color, color: category.color }}
              >
                {category.name}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {category.description || "No description"}
            </p>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Create New Category"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Category name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description"
                className="min-h-[80px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Icon</label>
              <div className="flex flex-wrap gap-2">
                {ICONS.map((icon) => (
                  <button
                    key={icon.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: icon.value })}
                    className={`p-3 rounded-lg border transition-all ${
                      formData.icon === icon.value
                        ? "border-primary bg-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="text-sm">{icon.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-10 h-10 rounded-lg transition-all ${
                      formData.color === color ? "ring-2 ring-offset-2 ring-offset-background" : ""
                    }`}
                    style={{ 
                      backgroundColor: color,
                    }}
                  />
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingCategory ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
