"use client"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/preskok/ui/preskok-ui/toggle-group"

export default function ToggleGroupDemo() {
  return (
    <ToggleGroup aria-label="Car body types">
      <ToggleGroupItem id="sedan">Sedan</ToggleGroupItem>
      <ToggleGroupItem id="suv">SUV</ToggleGroupItem>
      <ToggleGroupItem id="coupe">Coupe</ToggleGroupItem>
      <ToggleGroupItem id="truck">Truck</ToggleGroupItem>
    </ToggleGroup>
  )
}
