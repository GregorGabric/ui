"use client"

import { useMemo } from "react"

import { Checkbox } from "@/registry/preskok/ui/preskok-ui/checkbox"
import {
  GridList,
  GridListItem,
} from "@/registry/preskok/ui/preskok-ui/grid-list"

export default function GridListPreskokDemo() {
  const items = useMemo(
    () => [
      { id: 1, name: "The Beatles" },
      { id: 2, name: "Led Zeppelin" },
      { id: 3, name: "Pink Floyd" },
      { id: 4, name: "The Rolling Stones" },
    ],
    []
  )

  return (
    <GridList aria-label="Bands" selectionMode="multiple" className="min-w-64">
      {items.map((item) => (
        <GridListItem id={item.id} key={item.id} textValue={item.name}>
          {(values) => (
            <>
              {values.selectionMode === "multiple" &&
                values.selectionBehavior === "toggle" && (
                  <Checkbox className="-mr-2" slot="selection" />
                )}
              {item.name}
            </>
          )}
        </GridListItem>
      ))}
    </GridList>
  )
}
