"use client"

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
import { Switch } from "@/registry/preskok/ui/preskok-ui/switch"

export function CardsCookieSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cookie Settings</CardTitle>
        <CardDescription>
          Manage analytics and preferences for Preskok’s B2B vehicle platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="necessary" className="flex flex-col items-start">
            <span>Strictly Necessary</span>
            <span className="text-muted-foreground leading-snug font-normal">
              These cookies are essential in order to use the website and use
              its features.
            </span>
          </Label>
          <Switch id="necessary" isSelected aria-label="Necessary" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="functional" className="flex flex-col items-start">
            <span>Functional Cookies</span>
            <span className="text-muted-foreground leading-snug font-normal">
              These cookies enable features like saved routes, filters, and
              personalized dashboards.
            </span>
          </Label>
          <Switch id="functional" aria-label="Functional" />
        </div>
      </CardContent>
      <CardFooter>
        <Button intent="outline" className="w-full">
          Save preferences
        </Button>
      </CardFooter>
    </Card>
  )
}
