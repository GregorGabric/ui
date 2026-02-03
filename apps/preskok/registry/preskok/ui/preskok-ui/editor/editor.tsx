import "./styles/index.css"

import type { Content, Editor as TiptapEditor } from "@tiptap/react"
import { EditorContent, EditorContext } from "@tiptap/react"

import { cn } from "@/lib/utils"
import { useEditorContext } from "@/registry/preskok/ui/preskok-ui/editor/hooks/use-editor-context"
import { Separator } from "@/registry/preskok/ui/separator"

import { LinkBubbleMenu } from "./components/bubble-menu/link-bubble-menu"
import { MeasuredContainer } from "./components/measured-container"
import { SectionFive } from "./components/section/five"
import { SectionFour } from "./components/section/four"
import { SectionOne } from "./components/section/one"
import { SectionThree } from "./components/section/three"
import { SectionTwo } from "./components/section/two"
import type { UseEditorProps } from "./hooks/use-editor"
import { useEditor } from "./hooks/use-editor"

const DEFAULT_ACTIVE_LEVELS: Array<1 | 2 | 3 | 4 | 5 | 6> = [1, 2, 3, 4, 5, 6]
const DEFAULT_TEXT_STYLE_ACTIONS: Array<
  "bold" | "italic" | "underline" | "strikethrough" | "clearFormatting"
> = ["bold", "italic", "underline", "strikethrough", "clearFormatting"]
const DEFAULT_LIST_ACTIONS: Array<"orderedList" | "bulletList"> = [
  "orderedList",
  "bulletList",
]
const DEFAULT_INSERT_ACTIONS: Array<"blockquote" | "horizontalRule"> = [
  "blockquote",
  "horizontalRule",
]

export interface MinimalTiptapProps extends Omit<UseEditorProps, "onUpdate"> {
  value?: Content
  onChange?: (value: Content) => void
  className?: string
  editorContentClassName?: string
}

const Toolbar = ({ editor }: { editor: TiptapEditor }) => (
  <div className="border-border flex shrink-0 overflow-x-auto border-b px-2 py-1.5">
    <div className="flex w-max items-center gap-px">
      <SectionOne editor={editor} activeLevels={DEFAULT_ACTIVE_LEVELS} />

      <Separator
        orientation="vertical"
        className="mx-1 data-[orientation=vertical]:h-3/4!"
      />

      <SectionTwo
        editor={editor}
        activeActions={DEFAULT_TEXT_STYLE_ACTIONS}
        mainActionCount={3}
      />

      <Separator
        orientation="vertical"
        className="mx-1 data-[orientation=vertical]:h-3/4!"
      />

      <SectionThree editor={editor} />

      <Separator
        orientation="vertical"
        className="mx-1 data-[orientation=vertical]:h-3/4!"
      />

      <SectionFour
        editor={editor}
        activeActions={DEFAULT_LIST_ACTIONS}
        mainActionCount={0}
      />

      <Separator
        orientation="vertical"
        className="mx-1 data-[orientation=vertical]:h-3/4!"
      />

      <SectionFive
        editor={editor}
        activeActions={DEFAULT_INSERT_ACTIONS}
        mainActionCount={0}
      />
    </div>
  </div>
)

export const Editor = ({
  value,
  onChange,
  className,
  editorContentClassName,
  ...props
}: MinimalTiptapProps) => {
  const editor = useEditor({
    value,
    onUpdate: onChange,
    ...props,
  })

  if (!editor) {
    return null
  }

  return (
    <EditorContext value={{ editor }}>
      <MainEditor
        editor={editor}
        className={className}
        editorContentClassName={editorContentClassName}
      />
    </EditorContext>
  )
}

export const MainEditor = ({
  editor: providedEditor,
  className,
  editorContentClassName,
}: MinimalTiptapProps & { editor: TiptapEditor }) => {
  const { editor } = useEditorContext(providedEditor)

  if (!editor) {
    return null
  }

  return (
    <MeasuredContainer
      as="div"
      name="editor"
      className={cn(
        "border-border min-data-[orientation=vertical]:h-72 flex h-auto w-full flex-col rounded-md border",
        className
      )}
    >
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className={cn(
          "minimal-tiptap-editor h-full px-5 py-4 focus:outline-hidden",
          editorContentClassName
        )}
      />
      <LinkBubbleMenu editor={editor} />
    </MeasuredContainer>
  )
}
