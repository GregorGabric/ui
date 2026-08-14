import { Description, FieldError, Label, NumberField, NumberInput } from "preskok"

export function Default() {
  return (
    <NumberField
      defaultValue={12}
      minValue={1}
      maxValue={100}
      step={1}
      isRequired
      className="grid w-full max-w-sm gap-2"
    >
      <Label>Team seats</Label>
      <Description>Use steppers or type a value from 1 to 100.</Description>
      <NumberInput />
      <FieldError />
    </NumberField>
  )
}

export function Currency() {
  return (
    <NumberField
      defaultValue={49}
      minValue={0}
      step={5}
      formatOptions={{ style: "currency", currency: "USD" }}
      className="grid w-full max-w-sm gap-2"
    >
      <Label>Monthly add-on budget</Label>
      <NumberInput />
    </NumberField>
  )
}
