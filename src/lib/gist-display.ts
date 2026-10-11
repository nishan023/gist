import type { Gist } from "./types";

export const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Markdown: "#8b949e",
  Python: "#3572a5",
  Shell: "#89e051",
  SQL: "#a371f7",
  JSON: "#292929",
  Go: "#00add8",
  Rust: "#dea584",
  Vue: "#41b883",
  PHP: "#4f5d95",
  Ruby: "#701516",
  Java: "#b07219",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Swift: "#f05138",
  Kotlin: "#a97bff",
  Dart: "#00b4ab",
  YAML: "#cb171e",
  Dockerfile: "#384d54",
  Text: "#8b949e",
};

export function languageColor(language: string | null | undefined) {
  return languageColors[language || ""] || "#8b949e";
}

export function gistTitle(gist: Gist) {
  const file = gist.files[0]?.filename;
  if (file) return file.replace(/\.[^/.]+$/, "");
  return gist.description.split("\n")[0]?.trim() || "untitled";
}

export function gistSummary(gist: Gist) {
  const text = gist.description.replace(/\s+/g, " ").trim();
  if (text) return text;
  const language = gist.files[0]?.language || "plain text";
  return `A ${language} snippet, saved for reference.`;
}

export function relativeTime(iso: string | undefined) {
  if (!iso) return "—";
  const delta = Date.now() - new Date(iso).getTime();
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "always" });
  if (delta < minute) return "just now";
  if (delta < hour) return rtf.format(-Math.round(delta / minute), "minute");
  if (delta < day) return rtf.format(-Math.round(delta / hour), "hour");
  if (delta < week) return rtf.format(-Math.round(delta / day), "day");
  if (delta < month) return rtf.format(-Math.round(delta / week), "week");
  if (delta < year) return rtf.format(-Math.round(delta / month), "month");
  return rtf.format(-Math.round(delta / year), "year");
}

export function uniqueLanguages(gists: Gist[]) {
  return Array.from(
    new Set(
      gists.flatMap((gist) =>
        gist.files.map((file) => file.language || "Text"),
      ),
    ),
  ).sort();
}
