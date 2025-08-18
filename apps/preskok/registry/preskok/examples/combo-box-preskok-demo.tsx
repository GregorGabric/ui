"use client"

import { ComboBox } from "@/registry/preskok/ui/preskok-ui/combo-box"

type City = { id: string; name: string }
const cities: Array<City> = [
  { id: "nyc", name: "New York" },
  { id: "ldn", name: "London" },
  { id: "tko", name: "Tokyo" },
]

export default function ComboBoxPreskokDemo() {
  return (
    <ComboBox label="City">
      <ComboBox.Input placeholder="Search cities" />
      <ComboBox.List items={cities}>
        {(item: City) => (
          <ComboBox.Option id={item.id} textValue={item.name}>
            {item.name}
          </ComboBox.Option>
        )}
      </ComboBox.List>
    </ComboBox>
  )
}
