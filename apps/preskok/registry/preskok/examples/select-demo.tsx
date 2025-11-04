"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/preskok/ui/preskok-ui/select"

export const cars = [
  { id: 1, name: "Audi" },
  { id: 2, name: "BMW" },
  { id: 3, name: "Mercedes-Benz" },
  { id: 4, name: "Volkswagen" },
  { id: 5, name: "Ford" },
]
export default function SelectDemo() {
  return (
    <Select aria-label="Cars" placeholder="Select a car">
      <SelectTrigger />
      <SelectContent items={cars}>
        {(item) => (
          <SelectItem id={item.id} textValue={item.name}>
            {item.name}
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  )
}
