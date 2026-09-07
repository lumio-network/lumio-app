import { Badge, Button, Card, CardBody, CardTitle } from "@lumio/ui";

export default function DashboardHome() {
  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <Badge variant="lumen">Scaffold</Badge>
        <h1 className="font-display text-display-l font-medium text-paper">
          Member dashboard — coming soon
        </h1>
        <p className="max-w-2xl font-ui text-body text-ink-400">
          This is where members will see their contributions, the group treasury, open proposals,
          and dividend payouts. The interface is built on Lumio&apos;s real design system; live data
          arrives once the SDK is wired to the on-chain contracts.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardTitle>Treasury</CardTitle>
          <CardBody>Pooled savings for your group, held on-chain.</CardBody>
        </Card>
        <Card>
          <CardTitle>Proposals</CardTitle>
          <CardBody>Vote on how the cooperative allocates its funds.</CardBody>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button>Make a contribution</Button>
        <Button variant="secondary">View proposals</Button>
      </div>
    </section>
  );
}
