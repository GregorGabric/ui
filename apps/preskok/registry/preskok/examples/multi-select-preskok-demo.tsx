"use client"

import { useState } from "react"

import { Multiselect } from "@/registry/preskok/ui/preskok-ui/multiselect/multiselect"

const fruits = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" },
  { id: 3, name: "Cherry" },
  { id: 4, name: "Date" },
  { id: 5, name: "Elderberry" },
  { id: 6, name: "Fig" },
  { id: 7, name: "Grape" },
  { id: 8, name: "Honeydew" },
  { id: 9, name: "Kiwi" },
  { id: 10, name: "Lemon" },
  { id: 11, name: "Mango" },
  { id: 12, name: "Nectarine" },
  { id: 13, name: "Orange" },
  { id: 14, name: "Papaya" },
  { id: 15, name: "Quince" },
  { id: 16, name: "Raspberry" },
  { id: 17, name: "Strawberry" },
  { id: 18, name: "Tangerine" },
  { id: 19, name: "Ugli Fruit" },
  { id: 20, name: "Watermelon" },
]

export function Component() {
  const [selectedItems, setSelectedItems] = useState<
    (typeof fruits)[number] | null
  >(null)
  const [selectedItemsArray, setSelectedItemsArray] = useState<
    Array<(typeof fruits)[number]>
  >([])

  return (
    <div className="flex gap-4">
      <Multiselect
        items={fruits}
        itemLabel="name"
        itemValue="id"
        value={selectedItems}
        onValueChange={setSelectedItems}
        onClear={() => setSelectedItems(null)}
      />

      <Multiselect
        items={fruits}
        itemLabel="name"
        itemValue="id"
        value={selectedItemsArray}
        onValueChange={setSelectedItemsArray}
        onClear={() => setSelectedItemsArray([])}
        title="Selected fruits"
        multiple
      />
    </div>
  )
}
