import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

import { Toggle } from "preskok"

export function Default() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle defaultSelected aria-label="Toggle bold">
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
