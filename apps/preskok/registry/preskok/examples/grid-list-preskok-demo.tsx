"use client"

import { useState } from "react"
import type { Selection } from "react-aria-components/GridList"
import { useDragAndDrop } from "react-aria-components/useDragAndDrop"
import { useListData } from "react-stately"

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
            <span className="text-muted-foreground text-sm">{item.owner}</span>
          </GridListItem>
        ))}
      </GridList>
      <p className="text-muted-foreground -mt-6 text-sm">
        Selected tasks: {formatSelection(selectedKeys)}
      </p>
      <GridListDemo />
    </div>
  )
}

function GridListDemo() {
  const list = useListData({
    initialItems: tasks,
  })
  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => ({
        "text/plain": list.getItem(key)?.name ?? "",
      })),
    onReorder(e) {
      if (e.target.dropPosition === "before") {
        list.moveBefore(e.target.key, e.keys)
      } else if (e.target.dropPosition === "after") {
        list.moveAfter(e.target.key, e.keys)
      }
    },
  })

  return (
    <GridList
      aria-label="Reorder tasks"
      selectionMode="multiple"
      dragAndDropHooks={dragAndDropHooks}
    >
      <GridListHeader>Drag to reorder</GridListHeader>
      {list.items.map((item) => (
        <GridListItem key={item.id} id={item.id} textValue={item.name}>
          <GridListStart>
            <div>
              <GridListLabel>{item.name}</GridListLabel>
              <GridListDescription>{item.owner}</GridListDescription>
            </div>
          </GridListStart>
        </GridListItem>
      ))}
    </GridList>
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
