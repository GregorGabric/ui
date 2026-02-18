"use client"

import { useState } from "react"
import type { Selection } from "react-aria-components"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
} from "@/registry/preskok/ui/preskok-ui/menu"

export default function MenuMultipleDemo() {
  const [selected, setSelected] = useState<Selection>(new Set(["laneAssist"]))

  return (
    <Menu>
      <Button intent="outline">Open</Button>
      <MenuContent
        popover={{ placement: "bottom" }}
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        items={items}
      >
        {(item) => (
          <MenuItem id={item.slug} textValue={item.name}>
            <MenuLabel>{item.name}</MenuLabel>
          </MenuItem>
        )}
      </MenuContent>
    </Menu>
  )
}

const items = [
  {
    name: "Lane Assist",
    slug: "laneAssist",
  },
  {
    name: "Adaptive Cruise Control",
    slug: "adaptiveCruise",
  },
  {
    name: "Blind-Spot Monitoring",
    slug: "blindSpot",
  },
  {
    name: "360 Camera",
    slug: "camera360",
  },
  {
    name: "Heated Seats",
    slug: "heatedSeats",
  },
  {
    name: "Wireless CarPlay",
    slug: "wirelessCarPlay",
  },
  {
    name: "Panoramic Roof",
    slug: "panoramicRoof",
  },
]
