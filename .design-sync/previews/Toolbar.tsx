import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from "lucide-react"

import { Toolbar, ToolbarGroup, ToolbarItem, ToolbarSeparator } from "preskok"

export function Horizontal() {
  return (
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
  )
}

export function Vertical() {
  return (
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
  )
}
