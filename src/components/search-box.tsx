"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBox({
  id,
  placeholder = "Search gists...",
  className,
  inputClassName,
  showShortcut = true,
}: {
  id: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  showShortcut?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const query = searchParams.get("q") || "";
  const [value, setValue] = useState(query);

  useEffect(() => {
    setValue(query);
  }, [query]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      event.preventDefault();
      const header = document.getElementById(
        "header-search",
      ) as HTMLInputElement | null;
      (header || inputRef.current)?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function commit(next: string) {
    setValue(next);
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set("q", next);
    else params.delete("q");
    params.delete("page");
    const qs = params.toString();
    if (pathname === "/") {
      router.replace(qs ? `/?${qs}` : "/", { scroll: false });
    } else {
      router.push(qs ? `/?${qs}` : "/");
    }
  }

  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <input
        id={id}
        ref={inputRef}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => commit(event.target.value)}
        className={cn(
          "w-full rounded-md border border-border bg-background py-1.5 pr-7 pl-8 text-xs text-foreground placeholder:text-muted-foreground transition-all focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none",
          inputClassName,
        )}
      />
      {showShortcut && (
        <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted-foreground">
          /
        </kbd>
      )}
    </div>
  );
}
