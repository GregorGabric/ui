import type { Editor } from "@tiptap/react"
import { ChevronDownIcon, MinusIcon, PlusIcon, QuoteIcon } from "lucide-react"

import { LinkEditPopover } from "@/registry/preskok/ui/preskok-ui/editor/components/link/link-edit-popover"
import type { ToggleProps } from "@/registry/preskok/ui/preskok-ui/toggle"

import type { FormatAction } from "../../types"
import { ToolbarSection } from "../toolbar-section"

type InsertElementAction = "blockquote" | "horizontalRule"
interface InsertElement extends FormatAction {
  value: InsertElementAction
}

const formatActions: Array<InsertElement> = [
  {
    value: "blockquote",
    label: "Blockquote",
    icon: <QuoteIcon className="size-5" />,
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive("blockquote"),
    canExecute: (editor) =>
      editor.can().chain().focus().toggleBlockquote().run(),
    shortcuts: ["mod", "shift", "B"],
  },
  {
    value: "horizontalRule",
    label: "Divider",
    icon: <MinusIcon className="size-5" />,
    action: (editor) => editor.chain().focus().setHorizontalRule().run(),
    isActive: () => false,
    canExecute: (editor) =>
      editor.can().chain().focus().setHorizontalRule().run(),
    shortcuts: ["mod", "alt", "-"],
  },
]

interface SectionFiveProps extends Pick<ToggleProps, "size"> {
  editor: Editor
  activeActions?: Array<InsertElementAction>
  mainActionCount?: number
}

const defaultActiveActions = formatActions.map((action) => action.value)

export const SectionFive = ({
  editor,
  activeActions = defaultActiveActions,
  mainActionCount = 0,
  size,
}: SectionFiveProps) => {
  return (
    <>
      <LinkEditPopover editor={editor} size={size} />
      <ToolbarSection
        editor={editor}
        actions={formatActions}
        activeActions={activeActions}
        mainActionCount={mainActionCount}
        dropdownIcon={
          <>
            <PlusIcon className="size-5" />
            <ChevronDownIcon className="size-4" />
          </>
        }
        dropdownTooltip="Insert elements"
        size={size}
      />
    </>
  )
}
