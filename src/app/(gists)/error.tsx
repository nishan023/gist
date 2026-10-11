"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold">The collection is taking a moment.</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        We couldn’t load the gists right now. Please try again shortly.
      </p>
      <Button onClick={reset} className="mt-6">
        Try again
      </Button>
    </div>
  );
}
