"use client"

import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from "lucide-react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/preskok/ui/preskok-ui/toggle-group"

export default function ToggleGroupDemo() {
  return (
    <div className="grid gap-4">
      <ToggleGroup
        aria-label="Text alignment"
        defaultSelectedKeys={["left"]}
        disallowEmptySelection
      >
        <ToggleGroupItem id="left">
          <AlignLeftIcon />
          Left
        </ToggleGroupItem>
        <ToggleGroupItem id="center">
          <AlignCenterIcon />
          Center
        </ToggleGroupItem>
        <ToggleGroupItem id="right">
          <AlignRightIcon />
          Right
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        aria-label="Visible layers"
        selectionMode="multiple"
        defaultSelectedKeys={["grid", "guides"]}
      >
        <ToggleGroupItem id="grid">Grid</ToggleGroupItem>
        <ToggleGroupItem id="guides">Guides</ToggleGroupItem>
        <ToggleGroupItem id="comments" isDisabled>
          Comments
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
