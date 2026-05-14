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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Megaphone } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Textarea } from "@/components/ui/textarea";

interface AdPlacement {
  id: string;
  title: string;
  position: "header" | "sidebar" | "footer" | "in-article";
  code: string;
  status: "active" | "inactive";
}

export default function AdsPage() {
  const { t } = useLanguage();
  const [ads, setAds] = useState<AdPlacement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAd, setEditingAd] = useState<AdPlacement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await fetch("/api/ads");
      const data = await res.json();
      setAds(data);
    } catch (error) {
      console.error("Failed to fetch ads:", error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!editingAd) return;

    try {
      const method = ads.find((a) => a.id === editingAd.id) ? "PUT" : "POST";
      await fetch("/api/ads", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingAd),
      });
      setIsDialogOpen(false);
      setEditingAd(null);
      fetchAds();
    } catch (error) {
      console.error("Failed to save ad:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("ad.deleteConfirm"))) return;

    try {
      await fetch(`/api/ads?id=${id}`, { method: "DELETE" });
      fetchAds();
    } catch (error) {
      console.error("Failed to delete ad:", error);
    }
  };

  const positionLabels: Record<string, string> = {
    header: t("ad.header"),
    sidebar: t("ad.sidebar"),
    footer: t("ad.footer"),
    "in-article": t("ad.inArticle"),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-serif">{t("ad.adPlacements")}</h1>
          <p className="text-muted-foreground mt-1">{t("ad.adList")}</p>
        </div>
        <Button
          onClick={() => {
            setEditingAd({ id: "", title: "", position: "sidebar", code: "", status: "inactive" });
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("ad.createAd")}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("ad.title")}</TableHead>
                <TableHead>{t("ad.position")}</TableHead>
                <TableHead>{t("ad.status")}</TableHead>
                <TableHead>{t("article.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">{t("common.loading")}</TableCell>
                </TableRow>
              ) : ads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">{t("home.noArticles")}</TableCell>
                </TableRow>
              ) : (
                ads.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Megaphone className="h-4 w-4 text-primary" />
                        {ad.title}
                      </div>
                    </TableCell>
                    <TableCell>{positionLabels[ad.position] || ad.position}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${ad.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {ad.status === "active" ? t("ad.active") : t("ad.inactive")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingAd(ad); setIsDialogOpen(true); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(ad.id)} className="hover:text-destructive">
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingAd?.id ? t("ad.editAd") : t("ad.createAd")}</DialogTitle>
          </DialogHeader>
          {editingAd && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">{t("ad.title")}</label>
                <Input value={editingAd.title} onChange={(e) => setEditingAd({ ...editingAd, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">{t("ad.position")}</label>
                  <Select value={editingAd.position} onValueChange={(value) => setEditingAd({ ...editingAd, position: value as AdPlacement["position"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="header">{t("ad.header")}</SelectItem>
                      <SelectItem value="sidebar">{t("ad.sidebar")}</SelectItem>
                      <SelectItem value="footer">{t("ad.footer")}</SelectItem>
                      <SelectItem value="in-article">{t("ad.inArticle")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">{t("ad.status")}</label>
                  <Select value={editingAd.status} onValueChange={(value) => setEditingAd({ ...editingAd, status: value as AdPlacement["status"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t("ad.active")}</SelectItem>
                      <SelectItem value="inactive">{t("ad.inactive")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">{t("ad.code")}</label>
                <Textarea value={editingAd.code} onChange={(e) => setEditingAd({ ...editingAd, code: e.target.value })} placeholder="Google AdSense code or HTML" className="min-h-[150px]" />
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
