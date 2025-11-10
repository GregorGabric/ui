"use client"

import { Pencil, Trash2 } from "lucide-react"

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuTrigger,
} from "@/registry/preskok/ui/preskok-ui/menu"

export default function MenuPreskokDemo() {
  return (
    <Menu>
      <MenuTrigger>Open</MenuTrigger>
      <MenuContent popover={{ placement: "bottom" }}>
        <MenuItem>
          <MenuLabel>View</MenuLabel>
        </MenuItem>
        <MenuItem>
          <Pencil data-slot="icon" />
          <MenuLabel>Edit</MenuLabel>
        </MenuItem>
        <MenuSeparator />
        <MenuItem intent="danger">
          <Trash2 data-slot="icon" />
          <MenuLabel>Delete</MenuLabel>
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}
