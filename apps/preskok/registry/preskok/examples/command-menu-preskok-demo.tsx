"use client"

import { useState } from "react"
import {
  BoxIcon,
  CogIcon,
  CreditCardIcon,
  HomeIcon,
  NotebookIcon,
  ShieldCheckIcon,
} from "lucide-react"

import { Avatar } from "@/registry/preskok/ui/preskok-ui/avatar"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  CommandMenu,
  CommandMenuItem,
  CommandMenuLabel,
  CommandMenuList,
  CommandMenuSearch,
  CommandMenuSection,
  CommandMenuShortcut,
} from "@/registry/preskok/ui/preskok-ui/command-menu"

export function Component() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button intent="outline" onPress={() => setIsOpen(true)}>
        Open
      </Button>
      <CommandMenu isOpen={isOpen} onOpenChange={setIsOpen}>
        <CommandMenuSearch placeholder="Quick search..." />
        <CommandMenuList>
          <CommandMenuSection label="Pages">
            <CommandMenuItem textValue="Home" href="#">
              <HomeIcon data-slot="icon" />
              <CommandMenuLabel>Home</CommandMenuLabel>
            </CommandMenuItem>
            <CommandMenuItem textValue="Vehicle Inventory" href="#">
              <NotebookIcon data-slot="icon" />
              <CommandMenuLabel>Vehicle Inventory</CommandMenuLabel>
              <CommandMenuShortcut keys="⌘v" />
            </CommandMenuItem>
            <CommandMenuItem textValue="Components" href="#">
              <BoxIcon data-slot="icon" />
              <CommandMenuLabel>Components</CommandMenuLabel>
            </CommandMenuItem>
          </CommandMenuSection>
          <CommandMenuSection label="Dashboard">
            <CommandMenuItem textValue="billing" href="#">
              <CreditCardIcon data-slot="icon" />
              <CommandMenuLabel>Billing</CommandMenuLabel>
            </CommandMenuItem>
            <CommandMenuItem textValue="settings" href="#">
              <CogIcon data-slot="icon" />
              <CommandMenuLabel>Settings</CommandMenuLabel>
              <CommandMenuShortcut keys="⌘s" />
            </CommandMenuItem>
            <CommandMenuItem textValue="security" href="#">
              <ShieldCheckIcon data-slot="icon" />
              <CommandMenuLabel>Security</CommandMenuLabel>
            </CommandMenuItem>
          </CommandMenuSection>
          <CommandMenuSection label="Team">
            {users.map((user) => (
              <CommandMenuItem textValue={user.name} key={user.id}>
                <Avatar src={user.image_url} />
                <CommandMenuLabel>{user.name}</CommandMenuLabel>
              </CommandMenuItem>
            ))}
          </CommandMenuSection>
        </CommandMenuList>
      </CommandMenu>
    </>
  )
}

const users = [
  {
    id: 1,
    name: "Mike Johnson",
    image_url: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Sarah Martinez",
    image_url: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "David Chen",
    image_url: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 5,
    name: "Emily Rodriguez",
    image_url: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 6,
    name: "James Wilson",
    image_url: "https://i.pravatar.cc/150?img=6",
  },
]
