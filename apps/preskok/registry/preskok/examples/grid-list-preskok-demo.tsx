"use client"

import { GridList } from "@/registry/preskok/ui/preskok-ui/grid-list"

export function Component() {
  return (
    <GridList
      selectionMode="single"
      items={items}
      aria-label="Select your favorite bands"
      className="min-w-64"
    >
      {(item) => <GridList.Item id={item.id}>{item.name}</GridList.Item>}
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
