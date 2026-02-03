import * as React from "react"
import type { Editor } from "@tiptap/react"
import { CaseSensitiveIcon, ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Menu,
  MenuContent,
  MenuItem,
} from "@/registry/preskok/ui/preskok-ui/menu"
import type { ToggleProps } from "@/registry/preskok/ui/preskok-ui/toggle"

import type { FormatAction } from "../../types"
import { ShortcutKey } from "../shortcut-key"
import { ToolbarButton } from "../toolbar-button"

type Level = 1 | 2 | 3 | 4 | 5 | 6
interface TextStyle extends Omit<
  FormatAction,
  "value" | "icon" | "action" | "isActive" | "canExecute"
> {
  element: keyof React.JSX.IntrinsicElements
  level?: Level
  className: string
}

const formatActions: Array<TextStyle> = [
  {
    label: "Normal Text",
    element: "span",
    className: "grow",
    shortcuts: ["mod", "alt", "0"],
  },
  {
    label: "Heading 1",
    element: "h1",
    level: 1,
    className: "m-0 grow text-3xl font-extrabold",
    shortcuts: ["mod", "alt", "1"],
  },
  {
    label: "Heading 2",
    element: "h2",
    level: 2,
    className: "m-0 grow text-xl font-bold",
    shortcuts: ["mod", "alt", "2"],
  },
  {
    label: "Heading 3",
    element: "h3",
    level: 3,
    className: "m-0 grow text-lg font-semibold",
    shortcuts: ["mod", "alt", "3"],
  },
  {
    label: "Heading 4",
    element: "h4",
    level: 4,
    className: "m-0 grow text-base font-semibold",
    shortcuts: ["mod", "alt", "4"],
  },
  {
    label: "Heading 5",
    element: "h5",
    level: 5,
    className: "m-0 grow text-sm font-normal",
    shortcuts: ["mod", "alt", "5"],
  },
  {
    label: "Heading 6",
    element: "h6",
    level: 6,
    className: "m-0 grow text-sm font-normal",
    shortcuts: ["mod", "alt", "6"],
  },
]

interface SectionOneProps extends Pick<ToggleProps, "size"> {
  editor: Editor
  activeLevels?: Array<Level>
}

const defaultActiveLevels = [1, 2, 3, 4, 5, 6]

export const SectionOne: React.FC<SectionOneProps> = ({
  editor,
  activeLevels = defaultActiveLevels,
  size,
}) => {
  const filteredActions = React.useMemo(
    () =>
      formatActions.filter(
        (action) => !action.level || activeLevels.includes(action.level)
      ),
    [activeLevels]
  )

  const handleStyleChange = React.useCallback(
    (level?: Level) => {
      if (level) {
        editor.chain().focus().toggleHeading({ level }).run()
      } else {
        editor.chain().focus().setParagraph().run()
      }
    },
    [editor]
  )

  const renderMenuItem = React.useCallback(
    ({ label, element: Element, level, className, shortcuts }: TextStyle) => (
      <MenuItem
        key={label}
        onAction={() => {
          handleStyleChange(level)
        }}
        className={cn("flex flex-row items-center justify-between gap-4", {
          "bg-accent": level
            ? editor.isActive("heading", { level })
            : editor.isActive("paragraph"),
        })}
        aria-label={label}
      >
        <Element className={className}>{label}</Element>
        <ShortcutKey keys={shortcuts} />
      </MenuItem>
    ),
    [editor, handleStyleChange]
  )

  return (
    <Menu>
      <ToolbarButton
        tooltip="Text styles"
        aria-label="Text styles"
        isDisabled={editor.isActive("codeBlock")}
        size={size}
        className="gap-0"
      >
        <CaseSensitiveIcon className="size-5" />
        <ChevronDownIcon className="size-5" />
      </ToolbarButton>

      <MenuContent popover={{ placement: "bottom start" }} className="w-full">
        {filteredActions.map(renderMenuItem)}
      </MenuContent>
    </Menu>
  )
}

SectionOne.displayName = "SectionOne"
