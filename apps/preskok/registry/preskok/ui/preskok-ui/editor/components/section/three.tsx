import * as React from "react"
import type { Editor } from "@tiptap/react"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import {
  Popover,
  PopoverBody,
  PopoverContent,
} from "@/registry/preskok/ui/preskok-ui/popover"
import type { ToggleProps } from "@/registry/preskok/ui/preskok-ui/toggle"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/preskok/ui/preskok-ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
} from "@/registry/preskok/ui/preskok-ui/tooltip"

import { useTheme } from "../../hooks/use-theme"
import { ToolbarButton } from "../toolbar-button"

interface ColorItem {
  cssVar: string
  label: string
  darkLabel?: string
}

interface ColorPalette {
  label: string
  colors: Array<ColorItem>
  inverse: string
}

const COLORS: Array<ColorPalette> = [
  {
    label: "Palette 1",
    inverse: "var(--background)",
    colors: [
      { cssVar: "var(--foreground)", label: "Default" },
      { cssVar: "var(--mt-accent-bold-blue)", label: "Bold blue" },
      { cssVar: "var(--mt-accent-bold-teal)", label: "Bold teal" },
      { cssVar: "var(--mt-accent-bold-green)", label: "Bold green" },
      { cssVar: "var(--mt-accent-bold-orange)", label: "Bold orange" },
      { cssVar: "var(--mt-accent-bold-red)", label: "Bold red" },
      { cssVar: "var(--mt-accent-bold-purple)", label: "Bold purple" },
    ],
  },
  {
    label: "Palette 2",
    inverse: "var(--background)",
    colors: [
      { cssVar: "var(--mt-accent-gray)", label: "Gray" },
      { cssVar: "var(--mt-accent-blue)", label: "Blue" },
      { cssVar: "var(--mt-accent-teal)", label: "Teal" },
      { cssVar: "var(--mt-accent-green)", label: "Green" },
      { cssVar: "var(--mt-accent-orange)", label: "Orange" },
      { cssVar: "var(--mt-accent-red)", label: "Red" },
      { cssVar: "var(--mt-accent-purple)", label: "Purple" },
    ],
  },
  {
    label: "Palette 3",
    inverse: "var(--foreground)",
    colors: [
      { cssVar: "hsl(var(--background))", label: "White", darkLabel: "Black" },
      { cssVar: "var(--mt-accent-blue-subtler)", label: "Blue subtle" },
      { cssVar: "var(--mt-accent-teal-subtler)", label: "Teal subtle" },
      { cssVar: "var(--mt-accent-green-subtler)", label: "Green subtle" },
      { cssVar: "var(--mt-accent-yellow-subtler)", label: "Yellow subtle" },
      { cssVar: "var(--mt-accent-red-subtler)", label: "Red subtle" },
      { cssVar: "var(--mt-accent-purple-subtler)", label: "Purple subtle" },
    ],
  },
]

const ColorButton = ({
  color,
  isSelected,
  inverse,
}: {
  color: ColorItem
  isSelected: boolean
  inverse: string
}) => {
  const isDarkMode = useTheme()
  const label = isDarkMode && color.darkLabel ? color.darkLabel : color.label

  return (
    <Tooltip>
      <ToggleGroupItem
        className="relative size-7 rounded-md p-0"
        id={color.cssVar}
        aria-label={label}
        style={{ backgroundColor: color.cssVar }}
      >
        {isSelected ? (
          <CheckIcon
            className="absolute inset-0 m-auto size-4"
            style={{ color: inverse }}
          />
        ) : null}
      </ToggleGroupItem>
      <TooltipContent placement="bottom">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}

ColorButton.displayName = "ColorButton"

interface ColorPickerProps {
  palette: ColorPalette
  selectedColor: string
  inverse: string
  onColorChange: (value: string) => void
}

const ColorPicker = ({
  palette,
  selectedColor,
  inverse,
  onColorChange,
}: ColorPickerProps) => (
  <ToggleGroup
    selectionMode="single"
    selectedKeys={selectedColor ? new Set([selectedColor]) : new Set()}
    onSelectionChange={(keys) => {
      const first = Array.from(keys)[0]
      if (typeof first === "string") {
        onColorChange(first)
      }
    }}
    className="gap-2 [box-shadow:none]"
  >
    {palette.colors.map((color) => (
      <ColorButton
        key={color.cssVar}
        inverse={inverse}
        color={color}
        isSelected={selectedColor === color.cssVar}
      />
    ))}
  </ToggleGroup>
)

ColorPicker.displayName = "ColorPicker"

interface SectionThreeProps extends Pick<ToggleProps, "size"> {
  editor: Editor
}

interface TextStyleAttrs {
  color?: string
}

export const SectionThree: React.FC<SectionThreeProps> = ({ editor, size }) => {
  const textStyleAttrs = editor.getAttributes("textStyle") as TextStyleAttrs
  const color =
    typeof textStyleAttrs.color === "string"
      ? textStyleAttrs.color
      : "var(--foreground)"
  const [localColor, setLocalColor] = React.useState<string | null>(null)
  const selectedColor = localColor ?? color

  const handleColorChange = (value: string) => {
    setLocalColor(value)
    const storedMarks = editor.state.storedMarks
    if (storedMarks) {
      const textStyleMarkType = editor.schema.marks.textStyle
      editor.view.dispatch(editor.state.tr.removeStoredMark(textStyleMarkType))
    }

    setTimeout(() => {
      editor.chain().setColor(value).run()
      setLocalColor(null)
    }, 0)
  }

  return (
    <Popover>
      <ToolbarButton
        tooltip="Text color"
        aria-label="Text color"
        className="gap-0"
        size={size}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
          style={{ color: selectedColor }}
        >
          <path d="M4 20h16" />
          <path d="m6 16 6-12 6 12" />
          <path d="M8 12h8" />
        </svg>
        <ChevronDownIcon className="size-4" />
      </ToolbarButton>

      <PopoverContent placement="bottom start" className={"max-w-max"}>
        <PopoverBody className="py-4">
          {COLORS.map((palette) => (
            <ColorPicker
              key={palette.label}
              palette={palette}
              inverse={palette.inverse}
              selectedColor={selectedColor}
              onColorChange={handleColorChange}
            />
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

SectionThree.displayName = "SectionThree"
