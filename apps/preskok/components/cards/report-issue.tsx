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
import { Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Select } from "@/registry/preskok/ui/preskok-ui/select"
import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"
import { Textarea } from "@/registry/preskok/ui/preskok-ui/textarea"

export function CardsReportIssue() {
  const id = React.useId()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report an issue</CardTitle>
        <CardDescription>
          Which area of vehicle logistics or remarketing needs attention?
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <Label htmlFor={`area-${id}`}>Area</Label>
            <Select selectedKey="logistics" aria-label="Area">
              <Select.Trigger id={`area-${id}`} className="w-full" />
              <Select.List>
                <Select.Option id="logistics">Logistics</Select.Option>
                <Select.Option id="auctions">Auctions</Select.Option>
                <Select.Option id="documentation">Documentation</Select.Option>
                <Select.Option id="billing">Billing</Select.Option>
                <Select.Option id="platform">Platform</Select.Option>
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
        <TextField
          label="Subject"
          placeholder="Issue with cross-border transport booking"
        />

        <div className="flex flex-col gap-3">
          <Textarea
            label="Description"
            id={`description-${id}`}
            placeholder="Include VINs, lane/routes, timing windows, and any carrier references."
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
