"use client"

import { useState } from "react"
import {
  BoxIcon,
  CogIcon,
  HomeIcon,
  NotebookIcon,
  ShieldIcon,
} from "lucide-react"

import { Avatar } from "@/registry/preskok/ui/preskok-ui/avatar"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { CommandMenu } from "@/registry/preskok/ui/preskok-ui/command-menu"

export function Component() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        intent="outline"
        onPress={() => {
          setIsOpen((prev) => !prev)
        }}
      >
        Open
      </Button>
      <CommandMenu isOpen={isOpen} onOpenChange={setIsOpen}>
        <CommandMenu.Search placeholder="Quick search..." />
        <CommandMenu.List>
          <CommandMenu.Section title="Pages">
            <CommandMenu.Item textValue="Home" href="#">
              <HomeIcon size={16} />
              <CommandMenu.Label>Home</CommandMenu.Label>
            </CommandMenu.Item>
            <CommandMenu.Item textValue="Docs" href="#">
              <NotebookIcon size={16} />
              <CommandMenu.Label>Docs</CommandMenu.Label>
              <CommandMenu.Keyboard keys="⌘k" />
            </CommandMenu.Item>
            <CommandMenu.Item textValue="Vehicles" href="#">
              <BoxIcon size={16} />
              <CommandMenu.Label>Vehicles</CommandMenu.Label>
            </CommandMenu.Item>
          </CommandMenu.Section>
          <CommandMenu.Section title="Dashboard">
            <CommandMenu.Item textValue="settings" href="#">
              <CogIcon size={16} />
              <CommandMenu.Label>Settings</CommandMenu.Label>
              <CommandMenu.Keyboard keys="⌘s" />
            </CommandMenu.Item>
            <CommandMenu.Item textValue="security" href="#">
              <ShieldIcon size={16} />
              <CommandMenu.Label>Security</CommandMenu.Label>
            </CommandMenu.Item>
          </CommandMenu.Section>
          <CommandMenu.Section title="Team">
            {users.map((user) => (
              <CommandMenu.Item textValue={user.name} key={user.id}>
                <Avatar src={user.image_url} size="sm" />
                <CommandMenu.Label>{user.name}</CommandMenu.Label>
              </CommandMenu.Item>
            ))}
          </CommandMenu.Section>
        </CommandMenu.List>
      </CommandMenu>
    </>
  )
}

const users = [
  {
    id: 1,
    name: "Alex Chen",
    image_url: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    image_url: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    image_url: "https://i.pravatar.cc/150?img=3",
  },
  { id: 5, name: "Emma Wilson", image_url: "https://i.pravatar.cc/150?img=5" },
  {
    id: 6,
    name: "David Kim",
    image_url: "https://i.pravatar.cc/150?img=6",
  },
]
