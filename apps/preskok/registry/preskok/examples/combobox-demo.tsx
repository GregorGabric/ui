"use client"

import { ComboBox } from "@/registry/preskok/ui/preskok-ui/combo-box"

type VehicleMake = {
  id: string
  name: string
  country: string
}

const vehicleMakes: Array<VehicleMake> = [
  { id: "toyota", name: "Toyota", country: "Japan" },
  { id: "honda", name: "Honda", country: "Japan" },
  { id: "ford", name: "Ford", country: "USA" },
  { id: "chevrolet", name: "Chevrolet", country: "USA" },
  { id: "bmw", name: "BMW", country: "Germany" },
  { id: "mercedes", name: "Mercedes-Benz", country: "Germany" },
  { id: "audi", name: "Audi", country: "Germany" },
  { id: "hyundai", name: "Hyundai", country: "South Korea" },
  { id: "kia", name: "Kia", country: "South Korea" },
  { id: "volkswagen", name: "Volkswagen", country: "Germany" },
]

export default function ComboboxDemo() {
  return (
    <div className="space-y-4">
      <ComboBox label="Vehicle Make" placeholder="Search makes...">
        <ComboBox.Input />
        <ComboBox.List items={vehicleMakes}>
          {(item: VehicleMake) => (
            <ComboBox.Option id={item.id} textValue={item.name}>
              <div className="flex w-full items-center justify-between">
                <span>{item.name}</span>
                <span className="text-muted-foreground text-xs">
                  {item.country}
                </span>
              </div>
            </ComboBox.Option>
          )}
        </ComboBox.List>
      </ComboBox>

      <ComboBox
        label="Vehicle Model"
        placeholder="Search models..."
        defaultInputValue="Camry"
      >
        <ComboBox.Input />
        <ComboBox.List
          items={[
            { id: "camry", name: "Camry" },
            { id: "corolla", name: "Corolla" },
            { id: "rav4", name: "RAV4" },
            { id: "highlander", name: "Highlander" },
            { id: "prius", name: "Prius" },
          ]}
        >
          {(item) => (
            <ComboBox.Option id={item.id} textValue={item.name}>
              {item.name}
            </ComboBox.Option>
          )}
        </ComboBox.List>
      </ComboBox>
    </div>
  )
}
