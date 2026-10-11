import type { Gist } from "./types";

// Only shown when no GitHub username is configured. Never mixed with live data.
const examples = [
  [
    "use-debounce.ts",
    "TypeScript",
    "A tiny debounce hook for React",
    "Keep search inputs responsive and avoid unnecessary requests.",
    "export function debounce<T extends (...args: never[]) => void>(fn: T, delay = 300) {\n  let timer: ReturnType<typeof setTimeout>;\n  return (...args: Parameters<T>) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}",
  ],
  [
    "globals.css",
    "CSS",
    "A better starting point for CSS",
    "The little resets I reach for at the start of every project.",
    "*, *::before, *::after { box-sizing: border-box; }\nbody { margin: 0; line-height: 1.5; }\nimg { display: block; max-width: 100%; }\nbutton, input { font: inherit; }",
  ],
  [
    "git-commands.md",
    "Markdown",
    "Git commands I keep coming back to",
    "A quick reference for everyday branches, commits, and fixes.",
    "# Everyday Git\n\nCreate a branch:\n```sh\ngit switch -c feature/my-change\n```\n\nReview your changes:\n```sh\ngit diff\ngit status\n```",
  ],
  [
    "format-date.ts",
    "TypeScript",
    "Format dates without a library",
    "A simple Intl.DateTimeFormat helper with sensible defaults.",
    "export const formatDate = (date: string) =>\n  new Intl.DateTimeFormat('en', {\n    day: 'numeric', month: 'short', year: 'numeric',\n  }).format(new Date(date));",
  ],
  [
    "fetch-json.ts",
    "TypeScript",
    "A small, typed fetch wrapper",
    "Less boilerplate. Clear errors. Just the data you need.",
    "export async function fetchJSON<T>(url: string): Promise<T> {\n  const response = await fetch(url);\n  if (!response.ok) throw new Error('Request failed');\n  return response.json() as Promise<T>;\n}",
  ],
  [
    "grid.css",
    "CSS",
    "Responsive grids, without the breakpoints",
    "Let CSS do the heavy lifting with auto-fit and minmax.",
    ".grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));\n  gap: 1.5rem;\n}",
  ],
  [
    "array-utils.js",
    "JavaScript",
    "Little array utilities",
    "A few useful helpers for working with everyday data.",
    "export const unique = (items) => [...new Set(items)];\nexport const compact = (items) => items.filter(Boolean);",
  ],
  [
    "terminal.sh",
    "Shell",
    "My everyday terminal shortcuts",
    "Small shortcuts that save a few keystrokes.",
    "alias ll='ls -lah'\nalias gs='git status'\nalias gd='git diff'",
  ],
  [
    "reading-notes.md",
    "Markdown",
    "Notes on building for the web",
    "A reminder to keep things simple, accessible, and fast.",
    "# Build for people\n\n- Start with semantic HTML.\n- Make the small screen work first.\n- Ship less JavaScript.\n- Keep the code understandable.",
  ],
  [
    "sleep.ts",
    "TypeScript",
    "An awaitable timeout",
    "A tiny promise helper for a deliberate pause.",
    "export const sleep = (ms: number) =>\n  new Promise<void>((resolve) => setTimeout(resolve, ms));",
  ],
];
export const demoGists: Gist[] = examples.map(
  ([filename, language, title, description, content], index) => ({
    id: `demo-${index + 1}`,
    description: `${title}\n${description}`,
    created_at: "2026-09-01T00:00:00Z",
    updated_at: `2026-10-${String(8 - Math.floor(index / 2)).padStart(2, "0")}T00:00:00Z`,
    files: [{ filename, language, content, size: content.length }],
  }),
);
