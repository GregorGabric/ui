"use client"

import { ListBox } from "@/registry/preskok/ui/preskok-ui/list-box"

export default function ListBoxPreskokDemo() {
  return (
    <ListBox
      className="max-w-2xs"
      items={cars}
      selectionMode="single"
      aria-label="Cars"
    >
      {(item) => <ListBox.Item id={item.id}>{item.name}</ListBox.Item>}
    </ListBox>
  )
}

const cars = [
  { id: "1", name: "Audi" },
  { id: "2", name: "BMW" },
  { id: "3", name: "Mercedes-Benz" },
  { id: "4", name: "Volkswagen" },
  { id: "5", name: "Ford" },
]
