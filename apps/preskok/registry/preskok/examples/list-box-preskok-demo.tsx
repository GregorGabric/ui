"use client"

import {
  ListBox,
  ListBoxDescription,
  ListBoxItem,
  ListBoxLabel,
  ListBoxSection,
} from "@/registry/preskok/ui/preskok-ui/list-box"

export default function ListBoxPreskokDemo() {
  return (
    <ListBox aria-label="Fruits" className="min-w-56">
      <ListBoxSection title="Citrus">
        <ListBoxItem id="orange">
          <ListBoxLabel>Orange</ListBoxLabel>
          <ListBoxDescription>Rich in vitamin C</ListBoxDescription>
        </ListBoxItem>
        <ListBoxItem id="lemon">
          <ListBoxLabel>Lemon</ListBoxLabel>
          <ListBoxDescription>Tart and refreshing</ListBoxDescription>
        </ListBoxItem>
      </ListBoxSection>
      <ListBoxSection title="Berries">
        <ListBoxItem id="strawberry">
          <ListBoxLabel>Strawberry</ListBoxLabel>
          <ListBoxDescription>Sweet and juicy</ListBoxDescription>
        </ListBoxItem>
        <ListBoxItem id="blueberry">
          <ListBoxLabel>Blueberry</ListBoxLabel>
          <ListBoxDescription>Antioxidant-rich</ListBoxDescription>
        </ListBoxItem>
      </ListBoxSection>
    </ListBox>
  )
}
