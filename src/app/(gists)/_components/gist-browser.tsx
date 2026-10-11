"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/search-box";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Gist } from "@/lib/types";
import { uniqueLanguages } from "@/lib/gist-display";
import { GistCard } from "./gist-card";

const PAGE_SIZE = 15;

export function GistBrowser({ gists }: { gists: Gist[] }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [language, setLanguage] = useState("all");
  const [sort, setSort] = useState("updated");
  const [page, setPage] = useState(1);
  const languages = useMemo(() => uniqueLanguages(gists), [gists]);

  const filtered = useMemo(
    () =>
      gists
        .filter(
          (gist) =>
            (language === "all" ||
              gist.files.some(
                (file) => (file.language || "Text") === language,
              )) &&
            `${gist.description} ${gist.files.map((file) => `${file.filename} ${file.language}`).join(" ")}`
              .toLowerCase()
              .includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "created"
            ? b.created_at.localeCompare(a.created_at)
            : b.updated_at.localeCompare(a.updated_at),
        ),
    [gists, query, language, sort],
  );

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visiblePages = Array.from({ length: pages }, (_, index) => index + 1)
    .filter((n) => n === 1 || n === pages || Math.abs(n - currentPage) <= 1)
    .reduce<number[]>((list, n) => {
      if (list.length && n - list[list.length - 1] > 1) list.push(-n);
      list.push(n);
      return list;
    }, []);

  function goToPage(next: number) {
    setPage(next);
    document
      .getElementById("collection")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section id="collection" className="scroll-mt-6 space-y-4" aria-label="Gist collection">
      <div className="flex flex-col items-stretch justify-between gap-3 pt-2 md:flex-row md:items-center">
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            className="inline-flex items-center gap-2 border-b-2 border-primary pb-2 text-sm font-semibold"
          >
            <span>All Gists</span>
            <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {gists.length}
            </span>
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center md:max-w-2xl md:justify-end">
          <SearchBox
            id="toolbar-search"
            placeholder="Search gists by title, filename or language..."
            className="w-full sm:flex-1"
            inputClassName="rounded-lg py-2 pr-4"
            showShortcut={false}
          />
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Select
              value={language}
              onValueChange={(value) => {
                setLanguage(value);
                setPage(1);
              }}
            >
              <SelectTrigger
                className="h-8! min-w-[120px] rounded-lg bg-subtle text-xs"
                aria-label="Filter by language"
              >
                <SelectValue placeholder="All Languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {languages.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={sort}
              onValueChange={(value) => {
                setSort(value);
                setPage(1);
              }}
            >
              <SelectTrigger
                className="h-8! min-w-[100px] rounded-lg bg-subtle text-xs"
                aria-label="Sort gists"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Latest</SelectItem>
                <SelectItem value="created">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filtered.length ? (
        <div className="grid grid-cols-1 gap-3 pt-1 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(start, start + PAGE_SIZE).map((gist) => (
            <GistCard key={gist.id} gist={gist} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed bg-subtle px-4 py-20 text-center">
          <Search className="mx-auto mb-4 text-muted-foreground" size={24} />
          <h3 className="font-medium">
            {gists.length ? "No snippets found" : "A fresh page"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {gists.length
              ? "Try another search or a different language."
              : "There are no published gists to show yet."}
          </p>
          {gists.length > 0 && (
            <Button
              variant="outline"
              className="mt-5"
              onClick={() => {
                setLanguage("all");
                setPage(1);
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      {filtered.length > 0 && pages > 1 && (
        <nav aria-label="Pagination" className="flex items-center justify-center pt-4 pb-2 sm:pt-8 sm:pb-4">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1 text-xs">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span aria-hidden>‹</span>
              <span className="hidden sm:inline">Previous</span>
            </button>
            {visiblePages.map((n) =>
              n < 0 ? (
                <span key={n} className="px-1 text-muted-foreground">
                  …
                </span>
              ) : (
                <button
                  key={n}
                  type="button"
                  aria-current={n === currentPage ? "page" : undefined}
                  onClick={() => goToPage(n)}
                  className={
                    n === currentPage
                      ? "flex h-7 w-8 items-center justify-center rounded-md bg-primary font-medium text-white"
                      : "flex h-7 w-8 items-center justify-center rounded-md font-medium text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground"
                  }
                >
                  {n}
                </button>
              ),
            )}
            <button
              type="button"
              disabled={currentPage === pages}
              onClick={() => goToPage(currentPage + 1)}
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-foreground transition-colors hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="hidden sm:inline">Next</span>
              <span aria-hidden>›</span>
            </button>
          </div>
        </nav>
      )}
    </section>
  );
}
