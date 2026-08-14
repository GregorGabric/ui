import { Input, Label, TagField } from "preskok"

export function Default() {
  return (
    <TagField defaultValue={["WELCOME10", "SUMMER25"]} className="w-full max-w-md">
      <Label>Coupon codes</Label>
      <Input placeholder="Add codes, press Enter" />
    </TagField>
  )
}
