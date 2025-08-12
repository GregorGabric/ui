"use client"

import { ChevronDown } from "lucide-react"

import { Avatar } from "@/registry/preskok/ui/preskok-ui/avatar"
// Button not needed; Menu.Trigger renders a button
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import { Menu } from "@/registry/preskok/ui/preskok-ui/menu"

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
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          Invite your team members to collaborate.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {teamMembers.map((member) => (
          <div
            key={member.name}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <Avatar
                className="border"
                src={member.avatar}
                alt={member.name}
                initials={member.name.charAt(0)}
              />
              <div className="flex flex-col gap-0.5">
                <p className="text-sm leading-none font-medium">
                  {member.name}
                </p>
                <p className="text-muted-foreground text-xs">{member.email}</p>
              </div>
            </div>
            <Menu>
              <Button intent="plain" className="ml-auto shadow-none">
                {member.role} <ChevronDown />
              </Button>
              <Menu.Content placement="bottom end">
                {roles.map((role) => (
                  <Menu.Item key={role.name}>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{role.name}</p>
                      <p className="text-muted-foreground">
                        {role.description}
                      </p>
                    </div>
                  </Menu.Item>
                ))}
              </Menu.Content>
            </Menu>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
