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
  Sword
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/tags", label: "Tags", icon: Tags },
  { href: "/admin/ads", label: "Ad Placements", icon: Megaphone },
  { href: "/admin/stats", label: "Statistics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-4 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-4 mb-6">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Sword className="h-6 w-6 text-primary" />
        </div>
        <div>
          <span className="font-serif font-bold text-foreground">Admin Panel</span>
          <span className="block text-xs text-muted-foreground">Slay Guide</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-primary/20 text-primary font-medium" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="pt-4 border-t border-border space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
        >
          <Sword className="h-5 w-5" />
          Back to Site
        </Link>
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
