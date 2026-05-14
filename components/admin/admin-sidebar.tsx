"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  FolderTree, 
  Tags, 
  Megaphone, 
  BarChart3, 
  Settings,
  LogOut,
  Sword,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";

const adminNavItems = [
  { href: "/admin", labelKey: "common.dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", labelKey: "article.articleList", icon: FileText },
  { href: "/admin/categories", labelKey: "category.categoryList", icon: FolderTree },
  { href: "/admin/tags", labelKey: "tag.tagList", icon: Tags },
  { href: "/admin/users", labelKey: "user.users", icon: Users },
  { href: "/admin/ads", labelKey: "ad.adPlacements", icon: Megaphone },
  { href: "/admin/stats", labelKey: "stats.title", icon: BarChart3 },
  { href: "/admin/settings", labelKey: "common.settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="w-64 min-h-screen border-r border-border bg-card flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
            <Sword className="h-6 w-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-foreground">Slay Guide</span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/admin" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-xs text-muted-foreground">{t("settings.language")}</span>
          <LanguageSwitcher />
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t("common.logout")}
        </Button>
      </div>
    </aside>
  );
}
