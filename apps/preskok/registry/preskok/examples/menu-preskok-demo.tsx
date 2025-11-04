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
  MenuSection,
  MenuSeparator,
  MenuShortcut,
  MenuTrigger,
} from "@/registry/preskok/ui/preskok-ui/menu"

export default function MenuPreskokDemo() {
  return (
    <Menu>
      <MenuTrigger>
        <Button intent="outline" className="gap-1">
          Menu <ChevronDownIcon className="size-4" />
        </Button>
      </MenuTrigger>
      <MenuContent className="min-w-56">
        <MenuHeader>Actions</MenuHeader>
        <MenuItem id="new">
          <MenuLabel>New File</MenuLabel>
          <MenuDescription>Create a new file</MenuDescription>
          <MenuShortcut>⌘N</MenuShortcut>
        </MenuItem>
        <MenuItem id="open">
          <MenuLabel>Open</MenuLabel>
          <MenuDescription>Open existing file</MenuDescription>
          <MenuShortcut>⌘O</MenuShortcut>
        </MenuItem>
        <MenuItem id="save">
          <MenuLabel>Save</MenuLabel>
          <MenuDescription>Save current file</MenuDescription>
          <MenuShortcut>⌘S</MenuShortcut>
        </MenuItem>
        <MenuSeparator />
        <MenuSection label="Edit">
          <MenuItem id="cut">Cut</MenuItem>
          <MenuItem id="copy">Copy</MenuItem>
          <MenuItem id="paste">Paste</MenuItem>
        </MenuSection>
        <MenuSeparator />
        <MenuItem id="quit" intent="danger">
          <MenuLabel>Quit</MenuLabel>
          <MenuShortcut>⌘Q</MenuShortcut>
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}
