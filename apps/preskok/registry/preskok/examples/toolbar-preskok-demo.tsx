"use client"

import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from "lucide-react"

import {
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  ToolbarSeparator,
} from "@/registry/preskok/ui/preskok-ui/toolbar"

export default function ToolbarPreskokDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-medium">Horizontal Toolbar</h3>
        <Toolbar aria-label="Text formatting">
          <ToolbarGroup aria-label="Text style">
            <ToolbarItem aria-label="Bold">
              <BoldIcon className="size-4" />
            </ToolbarItem>
            <ToolbarItem aria-label="Italic">
              <ItalicIcon className="size-4" />
            </ToolbarItem>
            <ToolbarItem aria-label="Underline">
              <UnderlineIcon className="size-4" />
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup aria-label="Text alignment">
            <ToolbarItem aria-label="Align left">
              <AlignLeftIcon className="size-4" />
            </ToolbarItem>
            <ToolbarItem aria-label="Align center">
              <AlignCenterIcon className="size-4" />
            </ToolbarItem>
            <ToolbarItem aria-label="Align right">
              <AlignRightIcon className="size-4" />
            </ToolbarItem>
          </ToolbarGroup>
        </Toolbar>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium">Vertical Toolbar</h3>
        <Toolbar orientation="vertical" aria-label="Text formatting">
          <ToolbarGroup aria-label="Text style">
            <ToolbarItem aria-label="Bold">
              <BoldIcon className="size-4" />
            </ToolbarItem>
            <ToolbarItem aria-label="Italic">
              <ItalicIcon className="size-4" />
            </ToolbarItem>
            <ToolbarItem aria-label="Underline">
              <UnderlineIcon className="size-4" />
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup aria-label="Text alignment">
            <ToolbarItem aria-label="Align left">
              <AlignLeftIcon className="size-4" />
            </ToolbarItem>
            <ToolbarItem aria-label="Align center">
              <AlignCenterIcon className="size-4" />
            </ToolbarItem>
            <ToolbarItem aria-label="Align right">
              <AlignRightIcon className="size-4" />
            </ToolbarItem>
          </ToolbarGroup>
        </Toolbar>
      </div>
    </div>
  )
}
