import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "preskok"

export function Single() {
  return (
    <ToggleGroup aria-label="Text alignment" defaultSelectedKeys={["left"]} disallowEmptySelection>
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
  )
}

export function Multiple() {
  return (
    <ToggleGroup aria-label="Visible layers" selectionMode="multiple" defaultSelectedKeys={["grid", "guides"]}>
      <ToggleGroupItem id="grid">Grid</ToggleGroupItem>
      <ToggleGroupItem id="guides">Guides</ToggleGroupItem>
      <ToggleGroupItem id="comments" isDisabled>
        Comments
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
