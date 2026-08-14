import { Description, Label, Radio, RadioGroup } from "preskok"

export function Default() {
  return (
    <RadioGroup name="vehicleType" defaultValue="suv" className="max-w-sm">
      <Label>Vehicle type</Label>
      <Description>Select the type of vehicle you&apos;re interested in.</Description>
      <Radio value="sedan">
        <Label>Sedan</Label>
        <Description>Comfortable 4-door vehicle with trunk storage.</Description>
      </Radio>
      <Radio value="suv">
        <Label>SUV</Label>
        <Description>Spacious vehicle with higher ground clearance.</Description>
      </Radio>
      <Radio value="electric">
        <Label>Electric</Label>
        <Description>Zero-emission vehicle with lower operating costs.</Description>
      </Radio>
    </RadioGroup>
  )
}

export function Compact() {
  return (
    <RadioGroup defaultValue="sedan" className="flex flex-col gap-2">
      <Label>Body style</Label>
      <Radio value="sedan">Sedan</Radio>
      <Radio value="suv">SUV</Radio>
      <Radio value="coupe">Coupe</Radio>
      <Radio value="hatchback">Hatchback</Radio>
      <Radio value="truck" isDisabled>
        Truck
      </Radio>
    </RadioGroup>
  )
}
