"use client"

import {
  ArchiveIcon,
  CarFrontIcon,
  CopyIcon,
  ExternalLinkIcon,
  FolderInputIcon,
  PencilIcon,
} from "lucide-react"

import { Badge } from "@/registry/preskok/ui/preskok-ui/badge"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuSubMenu,
} from "@/registry/preskok/ui/preskok-ui/menu"

export default function MenuContextMenuPreskokDemo() {
  return (
    <Menu trigger="contextMenu">
      <Button
        intent="outline"
        className="w-full max-w-md justify-start gap-3 rounded-xl bg-background p-4 text-left whitespace-normal hover:bg-accent/50 sm:p-4"
      >
        <CarFrontIcon data-slot="icon" />
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-3 font-medium text-foreground">
            <span className="truncate">2025 Volvo EX30</span>
            <span className="shrink-0 tabular-nums">€39,900</span>
          </span>
          <span className="flex items-center justify-between gap-3 font-normal text-muted-foreground">
            <span className="truncate">Single Motor Extended Range</span>
            <Badge intent="success" className="shrink-0">
              Available
            </Badge>
          </span>
          <span className="mt-2 block font-normal text-muted-foreground">
            Right-click or long-press for actions.
          </span>
        </span>
      </Button>
      <MenuContent popover={{ className: "min-w-56" }}>
        <MenuItem>
          <ExternalLinkIcon data-slot="icon" />
          <MenuLabel>Open vehicle</MenuLabel>
        </MenuItem>
        <MenuItem>
          <PencilIcon data-slot="icon" />
          <MenuLabel>Edit details</MenuLabel>
        </MenuItem>
        <MenuItem>
          <CopyIcon data-slot="icon" />
          <MenuLabel>Duplicate</MenuLabel>
        </MenuItem>
        <MenuSubMenu>
          <MenuItem>
            <FolderInputIcon data-slot="icon" />
            <MenuLabel>Move to</MenuLabel>
          </MenuItem>
          <MenuContent popover={{ className: "min-w-40" }}>
            <MenuItem>Available</MenuItem>
            <MenuItem>Reserved</MenuItem>
            <MenuItem>In service</MenuItem>
          </MenuContent>
        </MenuSubMenu>
        <MenuSeparator />
        <MenuItem intent="danger">
          <ArchiveIcon data-slot="icon" />
          <MenuLabel>Archive vehicle</MenuLabel>
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}
