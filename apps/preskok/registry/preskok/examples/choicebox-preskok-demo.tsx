"use client"

import { Choicebox } from "@/registry/preskok/ui/preskok-ui/choicebox"

export function Component() {
  return (
    <Choicebox aria-label="Select car packages" selectionMode="multiple">
      <Choicebox.Item
        textValue="sedan"
        label="Sedan"
        description="Comfortable family car with excellent fuel economy."
      />
      <Choicebox.Item
        textValue="suv"
        label="SUV"
        description="Versatile vehicle with enhanced cargo space and off-road capability."
      />
      <Choicebox.Item
        textValue="luxury"
        label="Luxury"
        description="Premium features with leather interior and advanced technology package."
      />
      <Choicebox.Item
        textValue="electric"
        label="Electric"
        description="Zero-emission vehicle with cutting-edge battery technology."
      />
    </Choicebox>
  )
}
