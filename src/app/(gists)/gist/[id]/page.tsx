import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, FileText } from "lucide-react";
import { GistNavTitle } from "@/components/gist-nav-context";
import { getGist, isDemo } from "@/lib/github";
import {
  gistSummary,
  gistTitle,
  languageColor,
  relativeTime,
} from "@/lib/gist-display";
import { site } from "@/lib/site";
import { FileViewer } from "./_components/file-viewer";
import { GistActions } from "./_components/gist-actions";

export const revalidate = 300;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const gist = await getGist(id);
  if (!gist) return { title: "Gist not found", robots: { index: false } };
  const title = gistTitle(gist);
  const description =
    gistSummary(gist) || `Read ${title}, a code snippet by ${site.author}.`;
  return {
    title,
    description,
    alternates: { canonical: `/gist/${id}` },
    openGraph: {
      title,
      description,
      url: `/gist/${id}`,
      type: "article",
      modifiedTime: gist.updated_at,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function GistPage({ params }: Props) {
  const { id } = await params;
  const gist = await getGist(id);
  if (!gist) notFound();
  const title = gistTitle(gist);
  const language = gist.files[0]?.language || "Text";

  return (
    <div className="flex min-h-[calc(100vh-57px)] flex-col">
      <GistNavTitle title={title} />
      {isDemo && (
        <p className="border-b border-border px-5 py-2 text-xs text-muted-foreground">
          Preview gist · Example content
        </p>
      )}
      <section className="border-b border-border bg-background p-5 md:p-6">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          <span>Back to gists</span>
        </Link>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <FileText className="size-5 text-muted-foreground" />
              <h1 className="text-xl font-bold tracking-tight">{title}</h1>
            </div>
            <p className="text-sm text-muted-foreground">{gistSummary(gist)}</p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block size-2.5 rounded-full"
                  style={{ backgroundColor: languageColor(language) }}
                />
                <span className="text-foreground">{language}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="size-3.5" />
                <span>
                  {gist.files.length}{" "}
                  {gist.files.length === 1 ? "file" : "files"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="size-3.5" />
                <span>Created {relativeTime(gist.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="size-3.5" />
                <span>Updated {relativeTime(gist.updated_at)}</span>
              </div>
            </div>
          </div>
          <GistActions id={id} />
        </div>
      </section>
      <FileViewer files={gist.files} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: title,
            author: { "@type": "Person", name: site.author },
            dateModified: gist.updated_at,
            url: `${site.url}/gist/${id}`,
          }).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
