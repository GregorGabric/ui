import type { Editor } from "@tiptap/react"

import type { MinimalTiptapProps } from "./minimal-tiptap"

type ShortcutKeyResult = {
  symbol: string
  readable: string
}

export const isClient = (): boolean => typeof window !== "undefined"

export const isMacOS = (): boolean =>
  isClient() && window.navigator.userAgent.includes("Macintosh")

const shortcutKeyMap = {
  mod: isMacOS()
    ? { symbol: "⌘", readable: "Command" }
    : { symbol: "Ctrl", readable: "Control" },
  alt: isMacOS()
    ? { symbol: "⌥", readable: "Option" }
    : { symbol: "Alt", readable: "Alt" },
  shift: { symbol: "⇧", readable: "Shift" },
} as const satisfies Record<string, ShortcutKeyResult>

type ShortcutKey =
  | Uppercase<keyof typeof shortcutKeyMap>
  | Lowercase<keyof typeof shortcutKeyMap>

export const getShortcutKey = (key: ShortcutKey): ShortcutKeyResult => {
  const lowerKey = key.toLowerCase() as Lowercase<keyof typeof shortcutKeyMap>
  const result = shortcutKeyMap[lowerKey]
  return result || { symbol: key, readable: key }
}

export const getShortcutKeys = (
  keys: Array<ShortcutKey>
): Array<ShortcutKeyResult> => keys.map(getShortcutKey)

export const getOutput = (
  editor: Editor,
  format: MinimalTiptapProps["output"]
): object | string => {
  switch (format) {
    case "json":
      return editor.getJSON()
    case "html":
      return editor.isEmpty ? "" : editor.getHTML()
    default:
      return editor.getText()
  }
}
