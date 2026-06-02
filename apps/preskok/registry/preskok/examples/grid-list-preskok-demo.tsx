"use client"

import { useDragAndDrop } from "react-aria-components/useDragAndDrop"
import { useListData } from "react-stately"

import {
  GridList,
  GridListItem,
} from "@/registry/preskok/ui/preskok-ui/grid-list"

export function Component() {
  return (
    <div className="flex flex-col gap-20">
      <GridList
        selectionMode="single"
        items={items1}
        aria-label="Select your favorite bands"
        className="min-w-64"
      >
        {(item) => <GridListItem id={item.id}>{item.name}</GridListItem>}
      </GridList>
      <GridListDemo />
    </div>
  )
}

function GridListDemo() {
  const list = useListData({
    initialItems: items1,
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
      items={list.items}
      aria-label="Droppable list"
      selectionMode="multiple"
      dragAndDropHooks={dragAndDropHooks}
    >
      {(item) => <GridListItem id={item.id}>{item.name}</GridListItem>}
    </GridList>
  )
}

const items1 = [
  { id: 1, name: "The Beatles" },
  { id: 2, name: "Led Zeppelin" },
  { id: 3, name: "Pink Floyd" },
  { id: 4, name: "Queen" },
  { id: 5, name: "The Rolling Stones" },
  { id: 6, name: "The Beach Boys" },
  { id: 7, name: "The Kinks" },
  { id: 8, name: "The Who" },
]

const items2 = [
  { id: "1", name: "The Beatles" },
  { id: "2", name: "Led Zeppelin" },
  { id: "3", name: "Pink Floyd" },
  { id: "4", name: "Queen" },
  { id: "5", name: "The Rolling Stones" },
  { id: "6", name: "The Who" },
]
