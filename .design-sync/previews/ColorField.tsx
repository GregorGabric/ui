import { ColorField, Input, Label } from "preskok"

export function Default() {
  return (
    <div className="w-56">
      <ColorField defaultValue="#1d4ed8">
        <Label>Hex</Label>
        <Input placeholder="#000000" />
      </ColorField>
    </div>
  )
}

export function Channels() {
  return (
    <div className="grid w-72 grid-cols-3 gap-3">
      <ColorField defaultValue="#1d4ed8" colorSpace="hsl" channel="hue">
        <Label>Hue</Label>
        <Input />
      </ColorField>
      <ColorField
        defaultValue="#1d4ed8"
        colorSpace="hsl"
        channel="saturation"
      >
        <Label>Saturation</Label>
        <Input />
      </ColorField>
      <ColorField defaultValue="#1d4ed8" colorSpace="hsl" channel="lightness">
        <Label>Lightness</Label>
        <Input />
      </ColorField>
    </div>
  )
}
