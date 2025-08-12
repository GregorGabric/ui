"use client"

import * as React from "react"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import { Input, Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Select } from "@/registry/preskok/ui/preskok-ui/select"
import { Textarea } from "@/registry/preskok/ui/preskok-ui/textarea"

export function CardsReportIssue() {
  const id = React.useId()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report an issue</CardTitle>
        <CardDescription>
          What area are you having problems with?
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <Label htmlFor={`area-${id}`}>Area</Label>
            <Select selectedKey="billing" aria-label="Area">
              <Select.Trigger id={`area-${id}`} className="w-full" />
              <Select.List>
                <Select.Option id="team">Team</Select.Option>
                <Select.Option id="billing">Billing</Select.Option>
                <Select.Option id="account">Account</Select.Option>
                <Select.Option id="deployments">Deployments</Select.Option>
                <Select.Option id="support">Support</Select.Option>
              </Select.List>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor={`security-level-${id}`}>Security Level</Label>
            <Select selectedKey="2" aria-label="Security Level">
              <Select.Trigger
                id={`security-level-${id}`}
                className="w-full [&_span]:!block [&_span]:truncate"
              />
              <Select.List>
                <Select.Option id="1">Severity 1 (Highest)</Select.Option>
                <Select.Option id="2">Severity 2</Select.Option>
                <Select.Option id="3">Severity 3</Select.Option>
                <Select.Option id="4">Severity 4 (Lowest)</Select.Option>
              </Select.List>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor={`subject-${id}`}>Subject</Label>
          <Input id={`subject-${id}`} placeholder="I need help with..." />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor={`description-${id}`}>Description</Label>
          <Textarea
            id={`description-${id}`}
            placeholder="Please include all information relevant to your issue."
            className="min-h-28"
          />
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button intent="plain" size="sm">
          Cancel
        </Button>
        <Button size="sm">Submit</Button>
      </CardFooter>
    </Card>
  )
}
