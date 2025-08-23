"use client"

import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/preskok/ui/avatar"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/registry/preskok/ui/preskok-ui/menu"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  return (
    <Menu>
      <MenuTrigger>
        <Button intent="plain" size="sq-sm">
          <Avatar className="size-8 rounded-md">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
        </Button>
      </MenuTrigger>
      <MenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        placement="bottom end"
      >
        <Menu.Header className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user.email}
              </span>
            </div>
          </div>
        </Menu.Header>
        <MenuSeparator />
        <MenuItem>
          <Sparkles />
          Upgrade to Pro
        </MenuItem>
        <MenuSeparator />
        <MenuItem>
          <BadgeCheck />
          Account
        </MenuItem>
        <MenuItem>
          <CreditCard />
          Billing
        </MenuItem>
        <MenuItem>
          <Bell />
          Notifications
        </MenuItem>
        <MenuSeparator />
        <MenuItem>
          <LogOut />
          Log out
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}
