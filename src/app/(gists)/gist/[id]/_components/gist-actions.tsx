"use client";

import { useState } from "react";
import { Link2, MoreHorizontal } from "lucide-react";
export function GistActions({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(`${window.location.origin}/gist/${id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative flex items-center gap-2 self-start">
      <button
        type="button"
        onClick={copyLink}
        className="flex items-center gap-1.5 rounded-md border border-border bg-subtle px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
      >
        <Link2 className="size-3.5 text-muted-foreground" />
        <span>{copied ? "Copied!" : "Copy link"}</span>
      </button>
      <button
        type="button"
        aria-label="More options"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center justify-center rounded-md border border-border bg-subtle px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <MoreHorizontal className="size-4" />
      </button>
      {open && (
        <div className="absolute top-10 right-0 z-10 min-w-36 rounded-md border border-border bg-popover py-1 text-xs shadow-lg">
          <a
            href={`https://gist.github.com/${id}`}
            target="_blank"
            rel="noreferrer"
            className="block px-3 py-1.5 hover:bg-muted"
          >
            View on GitHub
          </a>
        </div>
      )}
    </div>
  );
}
