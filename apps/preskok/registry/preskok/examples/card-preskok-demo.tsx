"use client"

import { MoreHorizontalIcon } from "lucide-react"

import { Badge } from "@/registry/preskok/ui/preskok-ui/badge"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import {
  Menu,
  MenuContent,
  MenuItem,
} from "@/registry/preskok/ui/preskok-ui/menu"

export default function CardPreskokDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Release readiness</CardTitle>
          <CardDescription>Checkout redesign launch checklist</CardDescription>
          <CardAction>
            <Menu>
              <Button size="sq-sm" intent="plain" aria-label="More actions">
                <MoreHorizontalIcon />
              </Button>
              <MenuContent placement="bottom end">
                <MenuItem>Duplicate</MenuItem>
                <MenuItem>Archive</MenuItem>
              </MenuContent>
            </Menu>
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

      <Card>
        <CardHeader
          title="Team capacity"
          description="Engineering coverage for this week"
        />
        <CardContent>
          <div className="space-y-2">
            <div className="text-3xl font-semibold tabular-nums">12</div>
            <p className="text-muted-foreground text-sm">
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
    </div>
  )
}
