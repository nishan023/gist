import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto max-w-lg px-6 py-24 text-center">
      <p className="text-xs text-muted-foreground">404 / GIST NOT FOUND</p>
      <h1 className="mt-4 text-3xl font-semibold">This page isn’t in the notebook.</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        It may have moved, been removed, or isn’t published here.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-primary px-5 py-3 text-sm text-white"
      >
        Back to collection
      </Link>
    </main>
  );
}
