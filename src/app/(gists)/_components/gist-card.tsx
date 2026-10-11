"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Clock, FileText, MoreHorizontal } from "lucide-react";
import type { Gist } from "@/lib/types";
import {
  gistSummary,
  gistTitle,
  languageColor,
  relativeTime,
} from "@/lib/gist-display";
export function GistCard({ gist }: { gist: Gist }) {
  const file = gist.files[0];
  const title = gistTitle(gist);
  const href = `/gist/${gist.id}`;

  return (
    <article className="relative flex flex-col justify-between space-y-3 rounded-lg border border-border bg-subtle/50 p-3 transition-colors hover:border-muted-foreground/40 hover:bg-subtle sm:space-y-4 sm:rounded-xl sm:p-4">
      <Link
        href={href}
        aria-label={`Open ${title}`}
        className="absolute inset-0 rounded-lg sm:rounded-xl"
      />
      <div>
        <div className="flex items-start justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <FileText className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate text-xs font-semibold tracking-tight text-link sm:text-sm sm:text-foreground">
              {title}
            </span>
          </div>
          <div className="relative z-10">
            <GistMenu gistId={gist.id} title={title} />
          </div>
        </div>
        <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground sm:mt-2 sm:text-xs">
          {gistSummary(gist)}
        </p>
      </div>
      <div className="flex items-center justify-between pt-0 text-[10px] text-muted-foreground sm:pt-2 sm:text-xs">
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block size-2 rounded-full sm:size-2.5"
            style={{ backgroundColor: languageColor(file?.language) }}
          />
          <span>{file?.language || "Text"}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] sm:text-[11px]">
          <span className="inline-flex items-center gap-1">
            <FileText className="size-3" />
            <span>
              {gist.files.length} {gist.files.length === 1 ? "file" : "files"}
            </span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" />
            <time
              dateTime={gist.updated_at}
              suppressHydrationWarning
            >
              {relativeTime(gist.updated_at)}
            </time>
          </span>
        </div>
      </div>
    </article>
  );
}

function GistMenu({ gistId, title }: { gistId: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function copyLink() {
    await navigator.clipboard.writeText(
      `${window.location.origin}/gist/${gistId}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={`More actions for ${title}`}
        className="-mr-1 p-1 text-muted-foreground hover:text-foreground"
        onClick={() => setOpen((value) => !value)}
      >
        <MoreHorizontal className="size-4" />
      </button>
      {open && (
        <div className="absolute top-7 right-0 z-10 min-w-36 rounded-md border border-border bg-popover py-1 text-xs shadow-lg">
          <button
            type="button"
            className="block w-full px-3 py-1.5 text-left hover:bg-muted"
            onClick={copyLink}
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
          <a
            href={`/gist/${gistId}`}
            className="block px-3 py-1.5 hover:bg-muted"
          >
            Open gist
          </a>
        </div>
      )}
    </div>
  );
}
