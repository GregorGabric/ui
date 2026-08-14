import { ColorSlider } from "preskok"

export function Default() {
  return (
    <div className="grid w-72 gap-5">
      <ColorSlider label="Hue" channel="hue" defaultValue="hsl(216, 98%, 52%)" />
      <ColorSlider
        label="Opacity"
        channel="alpha"
        defaultValue="hsla(216, 98%, 52%, 0.65)"
      />
      <ColorSlider
        label="Brightness"
        colorSpace="hsb"
        channel="brightness"
        defaultValue="hsb(216, 98%, 68%)"
      />
    </div>
  )
}

export function Vertical() {
  return (
    <ColorSlider
      label="Hue"
      channel="hue"
      orientation="vertical"
      defaultValue="hsl(216, 98%, 52%)"
    />
  )
}
