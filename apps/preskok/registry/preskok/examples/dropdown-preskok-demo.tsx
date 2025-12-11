"use client"

import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Menu,
  MenuContent,
  MenuDescription,
  MenuHeader,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuShortcut,
} from "@/registry/preskok/ui/preskok-ui/menu"

export default function DropdownPreskokDemo() {
  return (
    <Menu>
      <Button intent="outline" className="gap-1">
        Options <ChevronDownIcon className="size-4" />
      </Button>
      <MenuContent className="min-w-56">
        <MenuHeader>Account</MenuHeader>
        <MenuItem id="profile">
          <MenuLabel>Profile</MenuLabel>
          <MenuDescription>View your profile</MenuDescription>
          <MenuShortcut keys="⌘P">⌘P</MenuShortcut>
        </MenuItem>
        <MenuItem id="settings">
          <MenuLabel>Settings</MenuLabel>
          <MenuDescription>Manage preferences</MenuDescription>
          <MenuShortcut keys="⌘,">⌘,</MenuShortcut>
        </MenuItem>

        <MenuSeparator />

        <MenuItem intent="danger" id="delete" aria-label="Delete">
          <MenuLabel>Delete Account</MenuLabel>
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}
