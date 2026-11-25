"use client"

import { useDragAndDrop } from "react-aria-components/useDragAndDrop"
import { useListData } from "react-stately"

import {
  GridList,
  GridListDescription,
  GridListItem,
  GridListLabel,
  GridListStart,
} from "@/registry/preskok/ui/preskok-ui/grid-list"

export default function GridListReorderPreskokDemo() {
  const list = useListData({ initialItems: tasks })
  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => ({
        "text/plain": list.getItem(key)?.name ?? "",
      })),
    // Replaces the browser's translucent snapshot of the row. Dragging several selected rows
    // shows how many are moving.
    renderDragPreview: (items) => (
      <div className="flex items-center gap-2 rounded-lg bg-overlay px-3 py-2 text-sm/6 font-medium text-overlay-foreground shadow-lg ring-1 ring-foreground/10">
        {items[0]?.["text/plain"]}
        {items.length > 1 && (
          <span className="rounded-full bg-primary px-1.5 text-xs/5 text-primary-foreground tabular-nums">
            {items.length}
          </span>
        )}
      </div>
    ),
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
      items={list.items}
      dragAndDropHooks={dragAndDropHooks}
      className="w-sm max-w-full"
    >
      {(item) => (
        <GridListItem id={item.id} textValue={item.name}>
          <GridListStart>
            <div>
              <GridListLabel>{item.name}</GridListLabel>
              <GridListDescription>{item.owner}</GridListDescription>
            </div>
          </GridListStart>
        </GridListItem>
      )}
    </GridList>
  )
}

const tasks = [
  { id: "sync", name: "Sync staging data", owner: "Data" },
  { id: "review", name: "Review accessibility", owner: "Design" },
  { id: "flags", name: "Enable feature flags", owner: "Growth" },
  { id: "docs", name: "Publish changelog", owner: "Docs" },
]
