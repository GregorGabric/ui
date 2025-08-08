"use client"

import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  DropdownDescription,
  DropdownItem,
  DropdownKeyboard,
  DropdownLabel,
  DropdownSection,
  DropdownSeparator,
} from "@/registry/preskok/ui/preskok-ui/dropdown"
import {
  Menu,
  MenuContent,
  MenuHeader,
  MenuItem,
  MenuTrigger,
} from "@/registry/preskok/ui/preskok-ui/menu"

export default function DropdownPreskokDemo() {
  return (
    <Menu>
      <MenuTrigger>
        <Button intent="outline" className="gap-1">
          Options <ChevronDownIcon className="size-4" />
        </Button>
      </MenuTrigger>
      <MenuContent className="min-w-56">
        <MenuHeader>Account</MenuHeader>
        <MenuItem id="profile">
          <DropdownLabel>Profile</DropdownLabel>
          <DropdownDescription>View your profile</DropdownDescription>
          <DropdownKeyboard>⌘P</DropdownKeyboard>
        </MenuItem>
        <MenuItem id="settings">
          <DropdownLabel>Settings</DropdownLabel>
          <DropdownDescription>Manage preferences</DropdownDescription>
          <DropdownKeyboard>⌘,</DropdownKeyboard>
        </MenuItem>
        <DropdownSeparator />
        <DropdownSection title="Danger">
          <DropdownItem id="delete" aria-label="Delete">
            Delete account
          </DropdownItem>
        </DropdownSection>
      </MenuContent>
    </Menu>
  )
}
