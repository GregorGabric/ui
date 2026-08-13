import { ColorWheel } from "preskok"

export function Default() {
  return <ColorWheel defaultValue="hsl(216, 98%, 52%)" aria-label="Hue" />
}

export function Disabled() {
  return (
    <ColorWheel defaultValue="hsl(42, 95%, 56%)" isDisabled aria-label="Hue" />
  )
}
