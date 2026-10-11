"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { GitHubMark } from "@/components/github-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { useGistNav } from "@/components/gist-nav-context";
import { site } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const { title } = useGistNav();
  const [menuOpen, setMenuOpen] = useState(false);
  const gistTitle = pathname.startsWith("/gist/") ? title : null;

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-3 text-foreground transition hover:opacity-80"
            aria-label={`${site.name} home`}
          >
            <GitHubMark className="size-7 sm:size-8" />
            <span className="text-[15px] font-semibold tracking-tight">
              {site.name}
            </span>
          </Link>
          {gistTitle && (
            <nav
              aria-label="Breadcrumb"
              className="hidden items-center gap-1.5 pl-1 text-xs text-muted-foreground sm:flex"
            >
              <Link href="/" className="hover:text-foreground">
                Gists
              </Link>
              <span className="opacity-60">&gt;</span>
              <span className="truncate font-medium text-foreground">
                {gistTitle}
              </span>
            </nav>
          )}
        </div>

        <div className="hidden items-center gap-4 sm:flex">
          <ThemeToggle />
        </div>

        <button
          type="button"
          className="rounded-md p-1 text-foreground sm:hidden"
          aria-label={menuOpen ? "Close menu" : "Toggle menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="space-y-3 border-t border-border px-4 py-3 sm:hidden">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
