"use client"

import { Avatar } from "@/registry/preskok/ui/preskok-ui/avatar"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import { Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Select } from "@/registry/preskok/ui/preskok-ui/select"
import { Separator } from "@/registry/preskok/ui/preskok-ui/separator"
import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"

const people = [
  {
    name: "Olivia Martin",
    email: "m@example.com",
    avatar: "/avatars/03.png",
  },
  {
    name: "Isabella Nguyen",
    email: "b@example.com",
    avatar: "/avatars/04.png",
  },
  {
    name: "Sofia Davis",
    email: "p@example.com",
    avatar: "/avatars/05.png",
  },
  {
    name: "Ethan Thompson",
    email: "e@example.com",
    avatar: "/avatars/01.png",
  },
]
export function CardsShare() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Share this document</CardTitle>
        <CardDescription>
          Anyone with the link can view this document.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Label htmlFor="link" className="sr-only">
            Link
          </Label>
          <TextField
            id="link"
            value="http://example.com/link/to/document"
            className="h-8 flex-1"
            isReadOnly
          />
          <Button size="sm" intent="outline" className="shadow-none">
            Copy Link
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-4">
          <div className="text-sm font-medium">People with access</div>
          <div className="grid gap-6">
            {people.map((person) => (
              <div
                key={person.email}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <Avatar
                    src={person.avatar}
                    alt={person.name}
                    initials={person.name.charAt(0)}
                  />
                  <div>
                    <p className="text-sm leading-none font-medium">
                      {person.name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {person.email}
                    </p>
                  </div>
                </div>
                <Select selectedKey="edit" aria-label="Edit">
                  <Select.Trigger className="ml-auto pr-2" />
                  <Select.List>
                    <Select.Option id="edit">Can edit</Select.Option>
                    <Select.Option id="view">Can view</Select.Option>
                  </Select.List>
                </Select>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
