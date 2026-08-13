import { ColorArea, ColorSlider } from "preskok"

export function InColorArea() {
  return (
    <ColorArea
      defaultValue="hsb(216, 98%, 68%)"
      colorSpace="hsb"
      xChannel="saturation"
      yChannel="brightness"
    />
  )
}

export function InColorSlider() {
  return (
    <div className="w-72">
      <ColorSlider label="Hue" channel="hue" defaultValue="hsl(216, 98%, 52%)" />
    </div>
  )
}
