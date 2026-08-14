import { ColorArea } from "preskok"

export function Default() {
  return (
    <ColorArea
      defaultValue="hsb(216, 98%, 68%)"
      colorSpace="hsb"
      xChannel="saturation"
      yChannel="brightness"
    />
  )
}

export function Disabled() {
  return (
    <ColorArea
      defaultValue="hsb(216, 98%, 68%)"
      colorSpace="hsb"
      xChannel="saturation"
      yChannel="brightness"
      isDisabled
    />
  )
}
