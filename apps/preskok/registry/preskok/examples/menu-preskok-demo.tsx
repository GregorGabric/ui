"use client"

import { PencilIcon, TrashIcon } from "lucide-react"

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
          <PencilIcon data-slot="icon" />
          <MenuLabel>Edit</MenuLabel>
        </MenuItem>
        <MenuSeparator />
        <MenuItem intent="danger">
          <TrashIcon data-slot="icon" />
          <MenuLabel>Delete</MenuLabel>
        </MenuItem>
        <MenuItem intent="warning">
          <TrashIcon data-slot="icon" />
          <MenuLabel>Warning</MenuLabel>
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}
