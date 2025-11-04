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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/preskok/ui/preskok-ui/select"
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
            <Select value="logistics" aria-label="Area">
              <SelectTrigger id={`area-${id}`} className="w-full" />
              <SelectContent>
                <SelectItem id="logistics">Logistics</SelectItem>
                <SelectItem id="auctions">Auctions</SelectItem>
                <SelectItem id="documentation">Documentation</SelectItem>
                <SelectItem id="billing">Billing</SelectItem>
                <SelectItem id="platform">Platform</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor={`security-level-${id}`}>Security Level</Label>
            <Select value="2" aria-label="Security Level">
              <SelectTrigger
                id={`security-level-${id}`}
                className="w-full [&_span]:!block [&_span]:truncate"
              />
              <SelectContent>
                <SelectItem id="1">Severity 1 (Highest)</SelectItem>
                <SelectItem id="2">Severity 2</SelectItem>
                <SelectItem id="3">Severity 3</SelectItem>
                <SelectItem id="4">Severity 4 (Lowest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <TextField
          aria-label="Subject"
          data-placeholder="Issue with cross-border transport booking"
        />

        <div className="flex flex-col gap-3">
          <Textarea
            aria-label="Description"
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
