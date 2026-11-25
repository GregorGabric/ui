"use client"

import { useState } from "react"
import type { Selection } from "react-aria-components/GridList"

import {
  GridList,
  GridListDescription,
  GridListHeader,
  GridListItem,
  GridListLabel,
  GridListSpacer,
  GridListStart,
} from "@/registry/preskok/ui/preskok-ui/grid-list"

function formatSelection(selection: Selection) {
  if (selection === "all") {
    return "All"
  }

  return Array.from(selection).join(", ")
}

export function Component() {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set(["sync", "review"])
  )

  return (
    <div className="grid w-full max-w-xl gap-8">
      <GridList
        selectionMode="multiple"
        selectionBehavior="toggle"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        aria-label="Release tasks"
      >
        <GridListHeader>Release checklist</GridListHeader>
        {tasks.map((item) => (
          <GridListItem key={item.id} id={item.id} textValue={item.name}>
            <GridListStart>
              <div>
                <GridListLabel>{item.name}</GridListLabel>
                <GridListDescription>{item.description}</GridListDescription>
              </div>
            </GridListStart>
            <GridListSpacer />
            <span className="text-sm text-muted-foreground">{item.owner}</span>
          </GridListItem>
        ))}
      </GridList>
      <p className="-mt-6 text-sm text-muted-foreground">
        Selected tasks: {formatSelection(selectedKeys)}
      </p>
    </div>
  )
}

const tasks = [
  {
    id: "sync",
    name: "Sync staging data",
    description: "Refresh anonymized customer records",
    owner: "Data",
  },
  {
    id: "review",
    name: "Review accessibility",
    description: "Keyboard pass for checkout overlays",
    owner: "Design",
  },
  {
    id: "flags",
    name: "Enable feature flags",
    description: "Ramp release cohort to 20%",
    owner: "Growth",
  },
  {
    id: "docs",
    name: "Publish changelog",
    description: "Update release notes before deploy",
    owner: "Docs",
  },
]
