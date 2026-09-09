import { Card } from "@lumio/ui";

export default function Loading() {
  return (
    <section className="space-y-6">
      {/* Skeleton for main heading area */}
      <div className="space-y-4">
        <div className="h-6 w-20 animate-pulse rounded bg-ink-800" />
        <div className="h-12 w-80 animate-pulse rounded bg-ink-800" />
        <div className="h-16 w-full max-w-2xl animate-pulse rounded bg-ink-800" />
      </div>

      {/* Skeleton for cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <div className="animate-pulse space-y-3">
            <div className="h-6 w-24 rounded bg-ink-800" />
            <div className="h-4 w-full rounded bg-ink-800" />
          </div>
        </Card>
        <Card>
          <div className="animate-pulse space-y-3">
            <div className="h-6 w-20 rounded bg-ink-800" />
            <div className="h-4 w-full rounded bg-ink-800" />
          </div>
        </Card>
      </div>

      {/* Skeleton for buttons */}
      <div className="flex flex-wrap gap-3">
        <div className="h-10 w-28 animate-pulse rounded bg-ink-800" />
        <div className="h-10 w-32 animate-pulse rounded bg-ink-800" />
      </div>
    </section>
  );
}
