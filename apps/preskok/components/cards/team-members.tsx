"use client"

import { ChevronDown } from "lucide-react"

import { Avatar } from "@/registry/preskok/ui/preskok-ui/avatar"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import {
  Menu,
  MenuContent,
  MenuItem,
} from "@/registry/preskok/ui/preskok-ui/menu"

const teamMembers = [
  {
    name: "Sofia Davis",
    email: "m@example.com",
    avatar: "/avatars/01.png",
    role: "Owner",
  },
  {
    name: "Jackson Lee",
    email: "p@example.com",
    avatar: "/avatars/02.png",
    role: "Developer",
  },
  {
    name: "Isabella Nguyen",
    email: "i@example.com",
    avatar: "/avatars/03.png",
    role: "Billing",
  },
]

const roles = [
  {
    name: "Viewer",
    description: "Can view and comment.",
  },
  {
    name: "Developer",
    description: "Can view, comment and edit.",
  },
  {
    name: "Billing",
    description: "Can view, comment and manage billing.",
  },
  {
    name: "Owner",
    description: "Admin-level access to all resources.",
  },
]

export function CardsTeamMembers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Operations Team</CardTitle>
        <CardDescription>
          Invite logistics, sales, and finance to collaborate on shipments and
          vehicle sales.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {teamMembers.map((member) => (
          <div
            key={member.name}
            className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <div className="flex min-w-0 items-center gap-4">
              <Avatar
                className="border"
                src={member.avatar}
                alt={member.name}
                initials={member.name.charAt(0)}
              />
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="truncate text-sm leading-none font-medium">
                  {member.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {member.email}
                </p>
              </div>
            </div>
            <Menu>
              <Button
                intent="plain"
                className="self-end shadow-none sm:ml-auto sm:self-auto"
              >
                {member.role} <ChevronDown />
              </Button>

              <MenuContent placement="bottom end">
                {roles.map((role) => (
                  <MenuItem key={role.name}>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{role.name}</p>
                      <p className="text-muted-foreground">
                        {role.description}
                      </p>
                    </div>
                  </MenuItem>
                ))}
              </MenuContent>
            </Menu>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
