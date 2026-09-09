import { Button, Card, CardBody, CardTitle } from "@lumio/ui";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-96 items-center justify-center">
      <Card className="max-w-md text-center">
        <CardTitle>Page not found</CardTitle>
        <CardBody className="space-y-4">
          <div className="space-y-2">
            <p className="font-display text-display-xs font-medium text-paper">404</p>
            <p className="font-ui text-body text-ink-400">
              The admin page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <Link href="/">
              <Button>Go to admin home</Button>
            </Link>
            <Button
              variant="secondary"
              onClick={() => {
                window.history.back();
              }}
            >
              Go back
            </Button>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}
