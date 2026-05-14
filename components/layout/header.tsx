"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Menu, X, Sword, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const checkLogin = () => {
      const cookies = document.cookie.split(";");
      const sessionCookie = cookies.find(c => c.trim().startsWith("session="));
      setIsLoggedIn(!!sessionCookie);
    };
    checkLogin();
    const interval = setInterval(checkLogin, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsLoggedIn(false);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/category/card-guides", label: "Card Guides" },
    { href: "/category/character-builds", label: t("nav.categories") },
    { href: "/category/boss-strategies", label: "Bosses" },
    { href: "/category/tips", label: "Tips" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
              <Sword className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg text-foreground">Slay Guide</span>
              <span className="text-xs text-muted-foreground">Slay the Spire 2</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link href="/admin">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {t("nav.admin")}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="primary" size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  {t("common.login")}
                </Button>
              </Link>
            )}

            <div className="hidden md:block relative">
              {isSearchOpen ? (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 animate-fade-in">
                  <Input
                    placeholder={t("search.placeholder")}
                    className="pr-10"
                    autoFocus
                    onBlur={() => setIsSearchOpen(false)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-4 pt-2">
                <Input
                  placeholder={t("search.placeholder")}
                  className="w-full"
                />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
