"use client"

import { useState } from "react"
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

import { Toggle } from "@/registry/preskok/ui/preskok-ui/toggle"

export default function ToggleDemo() {
  const [isBold, setIsBold] = useState(true)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle aria-label="Toggle bold" isSelected={isBold} onChange={setIsBold}>
        <BoldIcon className="h-4 w-4" />
      </Toggle>
      <Toggle defaultSelected aria-label="Toggle italic">
        <ItalicIcon className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle underline">
        <UnderlineIcon className="h-4 w-4" />
      </Toggle>
      <Toggle isDisabled aria-label="Toggle disabled">
        <UnderlineIcon className="h-4 w-4" />
      </Toggle>
    </div>
  )
}
