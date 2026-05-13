"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { AdPlacement } from "@/lib/types";

const AD_SIZES = [
  { value: "728x90", label: "Leaderboard (728x90)" },
  { value: "300x250", label: "Medium Rectangle (300x250)" },
  { value: "300x600", label: "Wide Skyscraper (300x600)" },
  { value: "320x50", label: "Mobile Banner (320x50)" },
];

const AD_POSITIONS = [
  { value: "header", label: "Header" },
  { value: "sidebar", label: "Sidebar" },
  { value: "content", label: "In-Content" },
  { value: "footer", label: "Footer" },
];

export default function AdsPage() {
  const [ads, setAds] = useState<AdPlacement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<AdPlacement | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "content",
    size: "300x250",
    enabled: true,
    code: "",
  });

  useEffect(() => {
    fetchAds();
  }, []);

  async function fetchAds() {
    try {
      const res = await fetch("/api/ads");
      const data = await res.json();
      setAds(data);
    } catch (error) {
      console.error("Failed to fetch ads:", error);
    }
    setLoading(false);
  }

  const handleEdit = (ad: AdPlacement) => {
    setEditingAd(ad);
    setFormData({
      name: ad.name,
      position: ad.position,
      size: ad.size,
      enabled: ad.enabled,
      code: ad.code,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ad placement?")) return;
    
    try {
      await fetch(`/api/ads?id=${id}`, { method: "DELETE" });
      fetchAds();
    } catch (error) {
      console.error("Failed to delete ad:", error);
    }
  };

  const handleToggle = async (ad: AdPlacement) => {
    try {
      await fetch("/api/ads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ad.id, enabled: !ad.enabled }),
      });
      fetchAds();
    } catch (error) {
      console.error("Failed to toggle ad:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingAd) {
        await fetch("/api/ads", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingAd.id, ...formData }),
        });
      } else {
        await fetch("/api/ads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      setIsDialogOpen(false);
      setEditingAd(null);
      fetchAds();
    } catch (error) {
      console.error("Failed to save ad:", error);
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
          <h1 className="font-serif text-3xl font-bold text-foreground">Ad Placements</h1>
          <p className="text-muted-foreground mt-1">Manage your Google AdSense placements</p>
        </div>
        <Button onClick={() => {
          setEditingAd(null);
          setFormData({
            name: "",
            position: "content",
            size: "300x250",
            enabled: true,
            code: "",
          });
          setIsDialogOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          New Placement
        </Button>
      </div>

      {/* Info Banner */}
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
        <h3 className="font-semibold text-primary mb-2">Google AdSense Integration</h3>
        <p className="text-sm text-muted-foreground">
          To display Google ads, paste your AdSense code in the &quot;Ad Code&quot; field for each placement. 
          The code will be rendered in the specified position on your site.
        </p>
      </div>

      {/* Ad List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ads.map((ad) => (
          <div
            key={ad.id}
            className={`p-6 bg-card rounded-xl border transition-all ${
              ad.enabled ? "border-border" : "border-dashed opacity-60"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">{ad.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {AD_POSITIONS.find((p) => p.value === ad.position)?.label} - {ad.size}
                </p>
              </div>
              <Badge variant={ad.enabled ? "default" : "outline"}>
                {ad.enabled ? "Active" : "Disabled"}
              </Badge>
            </div>

            {/* Preview Box */}
            <div 
              className="mb-4 bg-secondary/50 rounded-lg flex items-center justify-center"
              style={{ 
                height: ad.size === "300x600" ? "200px" : ad.size === "728x90" ? "80px" : ad.size === "320x50" ? "50px" : "120px"
              }}
            >
              <span className="text-muted-foreground text-sm">
                {ad.size} Preview
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant={ad.enabled ? "outline" : "primary"}
                size="sm"
                onClick={() => handleToggle(ad)}
              >
                {ad.enabled ? "Disable" : "Enable"}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleEdit(ad)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(ad.id)}>
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
            <DialogTitle>{editingAd ? "Edit Ad Placement" : "Create New Ad Placement"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Header Banner"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Position</label>
                <Select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  options={AD_POSITIONS}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Size</label>
                <Select
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  options={AD_SIZES}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Google AdSense Code</label>
              <Textarea
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Paste your Google AdSense code here..."
                className="min-h-[150px] font-mono text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="enabled"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="enabled" className="text-sm">Enable this ad placement</label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingAd ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
