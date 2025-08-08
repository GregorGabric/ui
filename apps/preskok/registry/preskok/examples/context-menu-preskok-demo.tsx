"use client"

import { ContextMenu } from "@/registry/preskok/ui/preskok-ui/context-menu"

export default function ContextMenuPreskokDemo() {
  return (
    <ContextMenu>
      <ContextMenu.Trigger className="rounded border px-3 py-2">
        Right click me
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>Copy</ContextMenu.Item>
        <ContextMenu.Item>Paste</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item isDanger>Delete</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  )
}
