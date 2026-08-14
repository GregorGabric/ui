import { Keyboard } from "preskok"

export function Shortcuts() {
  return (
    <div className="flex items-center gap-4">
      <Keyboard className="inline">⌘K</Keyboard>
      <Keyboard className="inline">⇧⌘P</Keyboard>
    </div>
  )
}

export function InlineWithLabels() {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      Save <Keyboard className="inline">⌘S</Keyboard>
      <span aria-hidden="true">·</span>
      Cancel <Keyboard className="inline">Esc</Keyboard>
    </div>
  )
}
