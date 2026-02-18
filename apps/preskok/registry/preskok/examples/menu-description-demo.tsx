"use client"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Menu,
  MenuContent,
  MenuDescription,
  MenuItem,
  MenuLabel,
  MenuSeparator,
} from "@/registry/preskok/ui/preskok-ui/menu"

export default function MenuDescriptionDemo() {
  return (
    <Menu>
      <Button intent="outline">Open</Button>
      <MenuContent className="min-w-72" popover={{ placement: "bottom" }}>
        <MenuItem id="new-listing">
          <MenuLabel>New Listing</MenuLabel>
          <MenuDescription>
            Add a vehicle to the dealership inventory.
          </MenuDescription>
        </MenuItem>
        <MenuItem id="book-test-drive">
          <MenuLabel>Book Test Drive</MenuLabel>
          <MenuDescription>
            Reserve a time slot and assign a sales advisor.
          </MenuDescription>
        </MenuItem>
        <MenuSeparator />
        <MenuItem id="mark-sold">
          <MenuLabel>Mark as Sold</MenuLabel>
          <MenuDescription>
            Move the vehicle from available to completed sales.
          </MenuDescription>
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}
