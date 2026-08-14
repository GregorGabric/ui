import { ColorSwatch, ColorSwatchPicker, ColorSwatchPickerItem } from "preskok"

const colors = [
  { value: "#ffffff" },
  { value: "#111827" },
  { value: "#2563eb" },
  { value: "#16a34a" },
  { value: "#f59e0b" },
  { value: "#dc2626" },
  { value: "#9333ea", isDisabled: true },
]

export function Default() {
  return (
    <div style={{ maxWidth: 260 }}>
      <ColorSwatchPicker
        aria-label="Pick color"
        defaultValue="#2563eb"
        className="grid grid-cols-4 gap-2 sm:grid-cols-7"
      >
        {colors.map((color) => (
          <ColorSwatchPickerItem
            key={color.value}
            color={color.value}
            isDisabled={color.isDisabled}
          >
            <ColorSwatch />
          </ColorSwatchPickerItem>
        ))}
      </ColorSwatchPicker>
    </div>
  )
}
