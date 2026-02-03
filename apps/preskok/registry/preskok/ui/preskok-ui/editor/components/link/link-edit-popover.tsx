import * as React from "react"
import type { Editor } from "@tiptap/react"
import { Link2Icon } from "lucide-react"

import {
  Popover,
  PopoverContent,
} from "@/registry/preskok/ui/preskok-ui/popover"
import type { ToggleProps } from "@/registry/preskok/ui/preskok-ui/toggle"

import { ToolbarButton } from "../toolbar-button"
import { LinkEditBlock } from "./link-edit-block"

interface LinkEditPopoverProps extends Pick<ToggleProps, "size"> {
  editor: Editor
}

const LinkEditPopover = ({ editor, size }: LinkEditPopoverProps) => {
  const [open, setOpen] = React.useState(false)

  const { from, to } = editor.state.selection
  const text = editor.state.doc.textBetween(from, to, " ")

  const onSetLink = React.useCallback(
    (url: string, text?: string, openInNewTab?: boolean) => {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .insertContent({
          type: "text",
          text: text || url,
          marks: [
            {
              type: "link",
              attrs: {
                href: url,
                target: openInNewTab ? "_blank" : "",
              },
            },
          ],
        })
        .setLink({ href: url })
        .run()

      editor.commands.enter()
      setOpen(false)
    },
    [editor]
  )

  return (
    <Popover isOpen={open} onOpenChange={setOpen}>
      <ToolbarButton
        tooltip="Link"
        aria-label="Insert link"
        isDisabled={editor.isActive("codeBlock")}
        size={size}
      >
        <Link2Icon className="size-5" />
      </ToolbarButton>
      <PopoverContent placement="bottom end">
        <LinkEditBlock onSave={onSetLink} defaultText={text} />
      </PopoverContent>
    </Popover>
  )
}

export { LinkEditPopover }
