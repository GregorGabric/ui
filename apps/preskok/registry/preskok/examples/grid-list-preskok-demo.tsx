"use client"

import {
  GridList,
  GridListItem,
} from "@/registry/preskok/ui/preskok-ui/grid-list"

export function Component() {
  return (
    <GridList
      selectionMode="single"
      items={items}
      aria-label="Select your favorite bands"
      className="min-w-64"
    >
      {(item) => <GridListItem id={item.id}>{item.name}</GridListItem>}
    </GridList>
  )
}

const items = [
  { id: "1", name: "The Beatles" },
  { id: "2", name: "Led Zeppelin" },
  { id: "3", name: "Pink Floyd" },
  { id: "4", name: "Queen" },
  { id: "5", name: "The Rolling Stones" },
  { id: "6", name: "The Who" },
]
