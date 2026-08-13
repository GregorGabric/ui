import { MoreHorizontalIcon } from "lucide-react"

import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "preskok"

export function WithMenuAndFooter() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Release readiness</CardTitle>
        <CardDescription>Checkout redesign launch checklist</CardDescription>
        <CardAction>
          <Button size="sq-sm" intent="plain" aria-label="More actions">
            <MoreHorizontalIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">QA pass</span>
            <Badge intent="success">Complete</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Rollout</span>
            <Badge intent="warning">20%</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Owner</span>
            <span>Growth</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button intent="outline">Preview</Button>
        <Button>Ship</Button>
      </CardFooter>
    </Card>
  )
}

export function StatSummary() {
  return (
    <Card className="max-w-sm">
      <CardHeader title="Team capacity" description="Engineering coverage for this week" />
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-semibold tabular-nums">12</div>
          <p className="text-sm text-muted-foreground">
            Available reviewers across three squads.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" intent="secondary">
          View schedule
        </Button>
      </CardFooter>
    </Card>
  )
}
