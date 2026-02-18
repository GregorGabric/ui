"use client"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuSubMenu,
} from "@/registry/preskok/ui/preskok-ui/menu"

export default function MenuSubmenuDemo() {
  return (
    <Menu>
      <Button intent="outline">Open</Button>
      <MenuContent popover={{ placement: "bottom" }}>
        <MenuItem>
          <MenuLabel>Add Vehicle</MenuLabel>
        </MenuItem>
        <MenuSubMenu>
          <MenuItem>
            <MenuLabel>Service</MenuLabel>
          </MenuItem>
          <MenuContent>
            <MenuItem>
              <MenuLabel>Schedule Maintenance</MenuLabel>
            </MenuItem>
            <MenuItem>
              <MenuLabel>Check Recall Status</MenuLabel>
            </MenuItem>
            <MenuSeparator />
            <MenuSubMenu>
              <MenuItem>
                <MenuLabel>Roadside Assistance</MenuLabel>
              </MenuItem>
              <MenuContent>
                <MenuItem>
                  <MenuLabel>Request Tow Truck</MenuLabel>
                </MenuItem>
                <MenuItem>
                  <MenuLabel>Battery Jump Start</MenuLabel>
                </MenuItem>
              </MenuContent>
            </MenuSubMenu>
          </MenuContent>
        </MenuSubMenu>
        <MenuSeparator />
        <MenuItem>
          <MenuLabel>Retire Vehicle</MenuLabel>
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}
