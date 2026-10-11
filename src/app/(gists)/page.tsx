import { Suspense } from "react";
import { getGists, isDemo } from "@/lib/github";
import { uniqueLanguages } from "@/lib/gist-display";
import { GistBrowser } from "./_components/gist-browser";
import { ProfileHero } from "./_components/profile-hero";

export const revalidate = 300;

export default async function Home() {
  const gists = await getGists();
  return (
    <div className="space-y-6 px-4 py-4 sm:px-6 sm:py-8">
      <ProfileHero
        gistCount={gists.length}
        languageCount={uniqueLanguages(gists).length}
        lastUpdated={gists[0]?.updated_at}
      />
      {isDemo && (
        <div className="rounded-lg border border-dashed border-border bg-subtle px-4 py-3 text-xs text-muted-foreground">
          Preview collection · Connect your GitHub account in the server
          environment to show your own gists.
        </div>
      )}
      <Suspense>
        <GistBrowser gists={gists} />
      </Suspense>
    </div>
  );
}
