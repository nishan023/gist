# Nishan’s gists

A simple Next.js App Router site for `gist.dhakalnishan.com.np`. Built with TypeScript, Tailwind CSS, shadcn/ui, and React Icons.

## Run locally

Requires Node.js 20.9+ (Node.js 24 LTS recommended).

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Without a GitHub username, the site displays a labeled example collection and disables indexing. No fake entries are mixed with live data.

## Connect your gists

Set these in `.env.local` and in your hosting provider’s environment settings:

```dotenv
GITHUB_USERNAME=your-github-login
GITHUB_TOKEN=your-server-only-token
PUBLISH_SECRET_GISTS=true
EXCLUDED_GIST_IDS=
SITE_URL=https://gist.dhakalnishan.com.np
```

Use a token belonging to the configured account with access to read its gists. A fine-grained token with Gists read permission is preferred; a classic token uses the `gist` scope. Never put the token in a `NEXT_PUBLIC_` variable or commit it.

`PUBLISH_SECRET_GISTS=true` deliberately makes all of your secret gist contents visible to everyone on this website, including search engines. GitHub secret gists are unlisted, not private access-controlled documents. Keep credentials and personal data out of published gists. Use comma-separated `EXCLUDED_GIST_IDS` to omit selected gists from listings, detail routes, and the sitemap. Public-only mode is the default.

All code is read on `/gist/[id]`. Visitors are never redirected to GitHub. Markdown and HTML are displayed as source text, never executed. Copy and download work directly on the site. GitHub-truncated files show an explicit partial-preview message, and downloading incomplete files is disabled.

## Structure

```text
src/app/(gists)/
  _components/                  Collection and gist cards
  page.tsx                      Server-rendered collection
  gist/[id]/
    _components/file-viewer.tsx  On-site reader
    page.tsx                    Detail page and metadata
src/components/ui/              Shared shadcn components
src/lib/github.ts               Server-only GitHub access and publishing rules
src/lib/demo.ts                 Labeled setup preview
```

## Caching and performance

GitHub requests and rendered pages revalidate every 300 seconds. Next.js prefetches internal links and keeps visited routes in its browser router cache. Search, sorting, and pagination use the already-loaded metadata in memory, with no extra API request on each click. Code content loads only on the detail page. There is no localStorage copy of gist content and no browser-visible GitHub token. Assets receive Next.js’s hashed immutable caching. System fonts avoid an external font request.

Changes may take five minutes plus the next request to appear. To urgently remove previously published content, remove/exclude it, redeploy with a cleared deployment cache, and purge any additional CDN cache. Copies already downloaded by visitors cannot be revoked.

## Deploy

1. Push the project to your repository and import it into a Next.js-compatible host such as Vercel.
2. Configure the server environment variables above before the production build.
3. Run `npm run build`; start with `npm start` on Node.js hosting. This app requires a server and cannot use a static export.
4. Add `gist.dhakalnishan.com.np` as a custom domain in the host dashboard.
5. Set the DNS record exactly as instructed by your host and enable HTTPS.
6. Confirm your actual collection, a detail page, `/robots.txt`, and `/sitemap.xml` on the deployed domain.

The project uses Webpack because the scaffold’s Turbopack CSS worker failed on this Windows environment. Both development and production use the same supported compiler path.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev
```

SEO includes canonical URLs, per-gist metadata, Open Graph image, Twitter cards, sitemap, robots, semantic content, and structured data. The UI supports keyboard navigation, reduced motion, and narrow screens. Search input stays 16px on mobile to prevent browser focus zoom; other mobile text is compact.

Known dependency advisory at setup: the current Next.js ESLint tooling pulls in `braces@3.0.3`, which has an upstream high-severity advisory. No patched braces release was available; production dependencies have zero reported advisories. Do not use `npm audit fix --force` to downgrade Next.js tooling across major versions. Update when upstream publishes a compatible fix.
