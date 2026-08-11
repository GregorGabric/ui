"use client"

import { useState } from "react"
import { useKeyboard } from "react-aria/useKeyboard"

import { Input } from "@/registry/preskok/ui/preskok-ui/input"
import { Keyboard } from "@/registry/preskok/ui/preskok-ui/keyboard"

export default function KeyboardShortcutsPreskokDemo() {
  const [message, setMessage] = useState("No shortcut used yet")
  const { keyboardProps } = useKeyboard({
    shortcuts: {
      "Mod+s": () => setMessage("Draft saved"),
      Escape: () => setMessage("Editing cancelled"),
    },
  })

  return (
    <div className="w-full max-w-md space-y-3">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor="shortcut-offer-name" className="text-sm font-medium">
          Offer name
        </label>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          Save <Keyboard className="inline">⌘S</Keyboard>
          <span aria-hidden="true">·</span>
          Cancel <Keyboard className="inline">Esc</Keyboard>
        </div>
      </div>
      <Input
        {...keyboardProps}
        id="shortcut-offer-name"
        defaultValue="Summer fleet offer"
      />
      <p
        aria-live="polite"
        className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground"
      >
        {message}
      </p>
    </div>
  )
}
