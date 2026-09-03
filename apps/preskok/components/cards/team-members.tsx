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
    <Card className="not-prose">
      <CardHeader>
        <CardTitle>Operations Team</CardTitle>
        <CardDescription>
          Invite logistics, sales, and finance to collaborate on shipments and
          vehicle sales.
        </CardDescription>
      </CardHeader>
      <CardContent className="@container/team grid divide-y">
        {teamMembers.map((member) => (
          <div
            key={member.name}
            className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-3 py-4 first:pt-0 last:pb-0 @min-[270px]/team:grid-cols-[auto_minmax(0,1fr)_auto] @min-[270px]/team:py-3"
          >
            <div className="contents">
              <Avatar
                className="shrink-0 border"
                src={member.avatar}
                alt={member.name}
                initials={member.name.charAt(0)}
              />
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="m-0 text-base/5 font-medium break-words sm:text-sm sm:leading-none">
                  {member.name}
                </p>
                <p className="m-0 truncate text-base/6 text-muted-foreground sm:text-xs">
                  {member.email}
                </p>
              </div>
            </div>
            <Menu>
              <Button
                intent="outline"
                className="col-start-2 min-h-12 w-full justify-between shadow-none @min-[270px]/team:col-start-3 @min-[270px]/team:row-start-1 @min-[270px]/team:w-auto @min-[270px]/team:justify-center pointer-fine:min-h-10"
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
