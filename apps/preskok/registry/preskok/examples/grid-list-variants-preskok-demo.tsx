"use client"

import { useState } from "react"
import type { Selection } from "react-aria-components/GridList"

import type { GridListVariant } from "@/registry/preskok/ui/preskok-ui/grid-list"
import {
  GridList,
  GridListDescription,
  GridListItem,
  GridListLabel,
  GridListSpacer,
  GridListStart,
} from "@/registry/preskok/ui/preskok-ui/grid-list"

const variants: Array<GridListVariant> = ["card", "bordered", "plain"]

export default function GridListVariantsPreskokDemo() {
  return (
    <div className="grid w-208 max-w-full grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] gap-x-6 gap-y-8">
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
    <div className="flex min-w-0 flex-col gap-2">
      <p className="text-sm/6 font-medium capitalize">{variant}</p>
      <GridList
        variant={variant}
        aria-label={`${variant} grid list`}
        selectionMode="multiple"
        selectionBehavior="toggle"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
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
    </div>
  )
}

const tasks = [
  { id: "sync", name: "Sync staging data", owner: "Data", due: "Mon" },
  { id: "review", name: "Review accessibility", owner: "Design", due: "Tue" },
  { id: "flags", name: "Enable feature flags", owner: "Growth", due: "Thu" },
]
