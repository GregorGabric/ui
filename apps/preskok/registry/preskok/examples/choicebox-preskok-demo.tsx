"use client"

import {
  ChoiceBox,
  ChoiceBoxItem,
} from "@/registry/preskok/ui/preskok-ui/choice-box"

export default function ChoiceBoxPreskokDemo() {
  return (
    <ChoiceBox aria-label="Select car packages" selectionMode="multiple">
      <ChoiceBoxItem
        textValue="sedan"
        label="Sedan"
        description="Comfortable family car with excellent fuel economy."
      />
      <ChoiceBoxItem
        textValue="suv"
        label="SUV"
        description="Versatile vehicle with enhanced cargo space and off-road capability."
      />
      <ChoiceBoxItem
        textValue="luxury"
        label="Luxury"
        description="Premium features with leather interior and advanced technology package."
      />
      <ChoiceBoxItem
        textValue="electric"
        label="Electric"
        description="Zero-emission vehicle with cutting-edge battery technology."
      />
    </ChoiceBox>
  )
}
