"use client";

import { Button, Card, CardBody, CardTitle } from "@lumio/ui";
import { useRouter } from "next/navigation";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  return (
    <section className="flex min-h-96 items-center justify-center">
      <Card className="max-w-md">
        <CardTitle>Something went wrong</CardTitle>
        <CardBody className="space-y-4">
          <p className="font-ui text-body text-ink-400">
            We encountered an error while loading this page. This might be a temporary issue.
          </p>
          {error.message && (
            <details className="rounded-md border border-ink-800 p-3">
              <summary className="cursor-pointer font-mono text-caption text-ink-500">
                Error details
              </summary>
              <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-caption text-ink-400">
                {error.message}
              </pre>
            </details>
          )}
          <div className="flex gap-2">
            <Button onClick={reset}>Try again</Button>
            <Button variant="secondary" onClick={() => router.push("/")}>
              Go home
            </Button>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}
