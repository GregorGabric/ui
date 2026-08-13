import { ColorPicker } from "preskok"

export function Default() {
  return (
    <ColorPicker
      label="Brand color"
      defaultValue="hsl(216, 98%, 52%)"
      description="#0e63f4"
      showArrow
    />
  )
}

export function WithEyedropper() {
  return (
    <ColorPicker
      label="With eyedropper"
      defaultValue="hsl(42, 95%, 56%)"
      eyeDropper
      placement="right top"
    />
  )
}
