"use client"

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

export default function CardPreskokDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Team Listing</CardTitle>
            <CardDescription>
              Collaborative workspace for the team
            </CardDescription>
          </div>
          <CardAction>
            <Button size="sm" intent="outline">
              Edit
            </Button>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">12</div>
          <p className="text-muted-foreground text-sm">Active members</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  )
}
