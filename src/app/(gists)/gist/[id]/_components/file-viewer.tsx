"use client";

import { useMemo, useState, type ReactNode } from "react";
import { FileText } from "lucide-react";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { GistFile } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FileViewer({ files }: { files: GistFile[] }) {
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);
  const file = files[selected];
  const isMarkdown = /\.(md|markdown)$/i.test(file?.filename ?? "");
  const lines = useMemo(
    () => (file?.content ?? "").split("\n"),
    [file?.content],
  );

  if (!file) {
    return (
      <p className="text-sm text-muted-foreground">This gist has no files.</p>
    );
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(file.content || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="grid min-h-[460px] grid-cols-1 gap-0 md:grid-cols-12">
      <aside className="border-b border-border p-4 md:col-span-3 md:border-r md:border-b-0">
        <h2 className="mb-3 text-xs font-semibold text-muted-foreground">
          Files <span className="font-normal text-foreground">({files.length})</span>
        </h2>
        <div className="space-y-1" role="tablist" aria-label="Gist files">
          {files.map((item, index) => {
            const active = selected === index;
            return (
              <button
                key={item.filename}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setSelected(index);
                  setCopied(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-xs font-medium transition-colors",
                  active
                    ? "border border-border bg-subtle text-link shadow-sm"
                    : "text-muted-foreground hover:bg-subtle/60 hover:text-foreground",
                )}
              >
                <FileText
                  className={cn(
                    "size-4 shrink-0",
                    active ? "text-link" : "text-muted-foreground",
                  )}
                />
                <span className="truncate">{item.filename}</span>
              </button>
            );
          })}
        </div>
      </aside>

      <section
        className="p-4 md:col-span-9"
        aria-label={isMarkdown ? "Markdown preview" : "Code viewer"}
      >
        <div className="overflow-hidden rounded-lg border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border bg-subtle px-4 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <FileText className="size-3.5 text-muted-foreground" />
              <span className="truncate font-mono text-xs font-semibold">
                {file.filename}
              </span>
            </div>
            <button
              type="button"
              onClick={copy}
              disabled={file.content === undefined}
              className="flex items-center gap-1.5 rounded border border-border bg-muted px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-border"
            >
              <CopyIcon />
              <span>
                {copied ? "Copied!" : isMarkdown ? "Copy markdown" : "Copy code"}
              </span>
            </button>
          </div>
          {file.truncated && (
            <p className="border-b border-border bg-muted p-3 text-xs text-muted-foreground">
              This file exceeds the preview limit. Only the available content is
              shown.
            </p>
          )}
          {file.content !== undefined && isMarkdown ? (
            <article className="md-preview p-5 text-sm text-foreground">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {file.content}
              </ReactMarkdown>
            </article>
          ) : file.content !== undefined ? (
            <div className="overflow-x-auto p-4 font-mono text-[13px] leading-[1.65]">
              <table className="w-full border-collapse">
                <tbody>
                  {lines.map((line, index) => (
                    <tr key={index}>
                      <td className="w-8 pr-4 text-right font-mono text-xs text-muted-foreground select-none opacity-60">
                        {index + 1}
                      </td>
                      <td className="text-left whitespace-pre">
                        {highlightLine(line)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="p-8 text-sm text-muted-foreground">
              Content is unavailable for this file.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg
      className="size-3.5 text-muted-foreground"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function highlightLine(line: string): ReactNode {
  if (!line) return "\u00a0";
  const tokens = line.split(
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:import|from|export|const|let|var|function|return|class|extends|new|typeof|interface|type|enum|await|async|if|else)\b|\b(?:true|false|null|undefined)\b|[{}[\]()]|[:,;]|\b[A-Z][A-Za-z0-9_]*\b)/g,
  );
  return tokens.filter(Boolean).map((token, index) => {
    if (/^["'`]/.test(token)) {
      return (
        <span key={index} className="syn-string">
          {token}
        </span>
      );
    }
    if (
      /^(import|from|export|const|let|var|function|return|class|extends|new|typeof|interface|type|enum|await|async|if|else)$/.test(
        token,
      )
    ) {
      return (
        <span key={index} className="syn-keyword">
          {token}
        </span>
      );
    }
    if (/^(true|false|null|undefined)$/.test(token) || /^[A-Z]/.test(token)) {
      return (
        <span key={index} className="syn-constant">
          {token}
        </span>
      );
    }
    if (/^[{}[\]()]$/.test(token)) {
      return (
        <span key={index} className="syn-bracket">
          {token}
        </span>
      );
    }
    if (/^[:,;]$/.test(token)) {
      return (
        <span key={index} className="syn-punctuation">
          {token}
        </span>
      );
    }
    return <span key={index}>{token}</span>;
  });
}
