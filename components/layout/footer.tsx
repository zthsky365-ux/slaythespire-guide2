import Link from "next/link";
import { Sword, MessageCircle, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Sword className="h-6 w-6 text-primary" />
              </div>
              <div>
                <span className="font-serif font-bold text-lg">Slay Guide</span>
                <span className="block text-xs text-muted-foreground">Slay the Spire 2</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your ultimate resource for Slay the Spire 2 guides, strategies, and card analysis.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/category/card-guides" className="text-muted-foreground hover:text-foreground transition-colors">
                  Card Guides
                </Link>
              </li>
              <li>
                <Link href="/category/character-builds" className="text-muted-foreground hover:text-foreground transition-colors">
                  Character Builds
                </Link>
              </li>
              <li>
                <Link href="/category/boss-strategies" className="text-muted-foreground hover:text-foreground transition-colors">
                  Boss Strategies
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/combos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Combos & Synergies
                </Link>
              </li>
              <li>
                <Link href="/category/tips" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tips & Tricks
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Connect</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 bg-secondary rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-secondary rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-secondary rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>2026 Slay Guide. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
