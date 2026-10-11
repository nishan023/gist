import { GistNavProvider } from "@/components/gist-nav-context";
import { SiteHeader } from "@/components/site-header";

export default function GistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GistNavProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main id="main" className="mx-auto w-full max-w-7xl flex-1">
          {children}
        </main>
      </div>
    </GistNavProvider>
  );
}
