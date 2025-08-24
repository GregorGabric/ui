"use client"

import { Description, Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Radio, RadioGroup } from "@/registry/preskok/ui/preskok-ui/radio"

export default function RadioGroupDemo() {
  return (
    <RadioGroup name="vehicleType">
      <Label>Vehicle Type</Label>
      <Description>
        Select the type of vehicle you&apos;re interested in
      </Description>

      <Radio value="sedan">
        <Label>Sedan</Label>
        <Description>Comfortable 4-door vehicle with trunk storage</Description>
      </Radio>
      <Radio value="suv">
        <Label>SUV</Label>
        <Description>Spacious vehicle with higher ground clearance</Description>
      </Radio>
      <Radio value="electric">
        <Label>Electric</Label>
        <Description>
          Zero-emission vehicle with lower operating costs
        </Description>
      </Radio>
    </RadioGroup>
  )
}
