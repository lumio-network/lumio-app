import { Badge, Button, Card, CardBody, CardTitle } from "@lumio/ui";

export default function AdminHome() {
  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <Badge variant="sky">Scaffold</Badge>
        <h1 className="font-display text-display-l font-medium text-paper">
          Admin panel — coming soon
        </h1>
        <p className="max-w-2xl font-ui text-body text-ink-400">
          Cooperative operators will manage members, contribution cycles, proposals, and dividend
          runs here. Built on Lumio&apos;s real design system; live controls arrive once the SDK is
          wired to the on-chain contracts.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardTitle>Members</CardTitle>
          <CardBody>Review and onboard the people in a savings group.</CardBody>
        </Card>
        <Card>
          <CardTitle>Cycles</CardTitle>
          <CardBody>Open and close rotation cycles, and trigger payouts.</CardBody>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button>Create a cycle</Button>
        <Button variant="secondary">Manage members</Button>
      </div>
    </section>
  );
}
