"use client"

import { NumberField } from "@/registry/preskok/ui/preskok-ui/number-field"

export default function NumberFieldPreskokDemo() {
  return (
    <div className="space-y-4">
      <NumberField
        label="Quantity"
        defaultValue={1}
        minValue={0}
        maxValue={10}
      />
      <NumberField label="Price" prefix="$" defaultValue={9.99} />
    </div>
  )
}
