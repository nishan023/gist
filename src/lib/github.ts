import "server-only";
import { cache } from "react";
import { demoGists } from "./demo";
import type { Gist, GistFile } from "./types";

type GitHubGist = Omit<Gist, "files"> & {
  public: boolean;
  owner: { login: string };
  files: Record<string, GistFile>;
};
export const isDemo = !process.env.GITHUB_USERNAME;
const username = process.env.GITHUB_USERNAME || "";
const publishSecret = process.env.PUBLISH_SECRET_GISTS === "true";
const excluded = new Set(
  (process.env.EXCLUDED_GIST_IDS || "").split(",").map((id) => id.trim()),
);

async function github<T>(path: string): Promise<T | null> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {}),
    },
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(15000),
  });
  if (response.status === 404) return null;
  if (!response.ok)
    throw new Error(
      `GitHub request failed (${response.status}). Check server configuration or rate limits.`,
    );
  return response.json() as Promise<T>;
}
function allowed(gist: GitHubGist) {
  return (
    gist.owner?.login.toLowerCase() === username.toLowerCase() &&
    (gist.public || publishSecret) &&
    !excluded.has(gist.id)
  );
}
function serialize(gist: GitHubGist, withContent = false): Gist {
  return {
    id: gist.id,
    description: gist.description || "",
    created_at: gist.created_at,
    updated_at: gist.updated_at,
    files: Object.values(gist.files).map((file) => ({
      filename: file.filename,
      language: file.language,
      size: file.size,
      ...(withContent
        ? { content: file.content, truncated: file.truncated }
        : {}),
    })),
  };
}
export const getGists = cache(async (): Promise<Gist[]> => {
  if (isDemo)
    return demoGists.map((gist) => ({
      ...gist,
      files: gist.files.map((file) => ({
        filename: file.filename,
        language: file.language,
        size: file.size,
      })),
    }));
  if (publishSecret && !process.env.GITHUB_TOKEN)
    throw new Error(
      "Publishing secret gists requires a server-side GitHub token.",
    );
  const result: Gist[] = [];
  // Fetch every upstream page so client filtering and page counts stay accurate.
  for (let page = 1; ; page++) {
    const path = publishSecret
      ? "/gists"
      : `/users/${encodeURIComponent(username)}/gists`;
    const batch = await github<GitHubGist[]>(
      `${path}?per_page=100&page=${page}`,
    );
    if (!batch) throw new Error("GitHub user was not found.");
    result.push(...batch.filter(allowed).map((gist) => serialize(gist)));
    if (batch.length < 100) break;
  }
  return result.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
});
export const getGist = cache(async (id: string): Promise<Gist | null> => {
  if (isDemo) return demoGists.find((gist) => gist.id === id) || null;
  if (!/^[a-f\d]{5,64}$/i.test(id)) return null;
  const gist = await github<GitHubGist>(`/gists/${id}`);
  if (!gist || !allowed(gist)) return null;
  return serialize(gist, true);
});
