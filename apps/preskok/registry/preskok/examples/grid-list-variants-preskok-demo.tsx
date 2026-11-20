"use client"

import { useState } from "react"
import type { Selection } from "react-aria-components/GridList"

import type { GridListVariant } from "@/registry/preskok/ui/preskok-ui/grid-list"
import {
  GridList,
  GridListDescription,
  GridListHeader,
  GridListItem,
  GridListLabel,
  GridListSpacer,
  GridListStart,
} from "@/registry/preskok/ui/preskok-ui/grid-list"

const variants: Array<GridListVariant> = ["card", "bordered", "plain"]

export default function GridListVariantsPreskokDemo() {
  return (
    <div className="grid w-full gap-8 lg:grid-cols-3">
      {variants.map((variant) => (
        <VariantList key={variant} variant={variant} />
      ))}
    </div>
  )
}

function VariantList({ variant }: { variant: GridListVariant }) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set(["review"])
  )

  return (
    <GridList
      variant={variant}
      aria-label={`${variant} grid list`}
      selectionMode="multiple"
      selectionBehavior="toggle"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
    >
      <GridListHeader>{variant}</GridListHeader>
      {tasks.map((task) => (
        <GridListItem key={task.id} id={task.id} textValue={task.name}>
          <GridListStart>
            <div>
              <GridListLabel>{task.name}</GridListLabel>
              <GridListDescription>{task.owner}</GridListDescription>
            </div>
          </GridListStart>
          <GridListSpacer />
          <span className="text-sm text-muted-foreground tabular-nums">
            {task.due}
          </span>
        </GridListItem>
      ))}
    </GridList>
  )
}

const tasks = [
  { id: "sync", name: "Sync staging data", owner: "Data", due: "Mon" },
  { id: "review", name: "Review accessibility", owner: "Design", due: "Tue" },
  { id: "flags", name: "Enable feature flags", owner: "Growth", due: "Thu" },
]
