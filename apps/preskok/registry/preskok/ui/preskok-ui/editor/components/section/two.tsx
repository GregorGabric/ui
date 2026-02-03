import type { Editor } from "@tiptap/react"
import {
  BoldIcon,
  ItalicIcon,
  MoreHorizontalIcon,
  RemoveFormattingIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react"

import type { ToggleProps } from "@/registry/preskok/ui/preskok-ui/toggle"

import type { FormatAction } from "../../types"
import { ToolbarSection } from "../toolbar-section"

type TextStyleAction =
  | "bold"
  | "italic"
  | "underline"
  | "strikethrough"
  | "clearFormatting"

interface TextStyle extends FormatAction {
  value: TextStyleAction
}

const formatActions: Array<TextStyle> = [
  {
    value: "bold",
    label: "Bold",
    icon: <BoldIcon data-slot="icon" />,
    action: (editor) => editor.chain().focus().toggleBold().run(),
    isActive: (editor) => editor.isActive("bold"),
    canExecute: (editor) =>
      editor.can().chain().focus().toggleBold().run() &&
      !editor.isActive("codeBlock"),
    shortcuts: ["mod", "B"],
  },
  {
    value: "italic",
    label: "Italic",
    icon: <ItalicIcon data-slot="icon" />,
    action: (editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (editor) => editor.isActive("italic"),
    canExecute: (editor) =>
      editor.can().chain().focus().toggleItalic().run() &&
      !editor.isActive("codeBlock"),
    shortcuts: ["mod", "I"],
  },
  {
    value: "underline",
    label: "Underline",
    icon: <UnderlineIcon data-slot="icon" />,
    action: (editor) => editor.chain().focus().toggleUnderline().run(),
    isActive: (editor) => editor.isActive("underline"),
    canExecute: (editor) =>
      editor.can().chain().focus().toggleUnderline().run() &&
      !editor.isActive("codeBlock"),
    shortcuts: ["mod", "U"],
  },
  {
    value: "strikethrough",
    label: "Strikethrough",
    icon: <StrikethroughIcon data-slot="icon" />,
    action: (editor) => editor.chain().focus().toggleStrike().run(),
    isActive: (editor) => editor.isActive("strike"),
    canExecute: (editor) =>
      editor.can().chain().focus().toggleStrike().run() &&
      !editor.isActive("codeBlock"),
    shortcuts: ["mod", "shift", "S"],
  },
  {
    value: "clearFormatting",
    label: "Clear formatting",
    icon: <RemoveFormattingIcon data-slot="icon" />,
    action: (editor) => editor.chain().focus().unsetAllMarks().run(),
    isActive: () => false,
    canExecute: (editor) =>
      editor.can().chain().focus().unsetAllMarks().run() &&
      !editor.isActive("codeBlock"),
    shortcuts: ["mod", "\\"],
  },
]

interface SectionTwoProps extends Pick<ToggleProps, "size"> {
  editor: Editor
  activeActions?: Array<TextStyleAction>
  mainActionCount?: number
}

const defaultActiveActions = formatActions.map((action) => action.value)

export const SectionTwo = ({
  editor,
  activeActions = defaultActiveActions,
  mainActionCount = 2,
  size = "lg",
}: SectionTwoProps) => {
  return (
    <ToolbarSection
      editor={editor}
      actions={formatActions}
      activeActions={activeActions}
      mainActionCount={mainActionCount}
      dropdownIcon={<MoreHorizontalIcon data-slot="icon" />}
      dropdownTooltip="More formatting"
      dropdownClassName="w-8"
      size={size}
    />
  )
}
