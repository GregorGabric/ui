"use client"

import { IconCheck, IconCopy } from "@tabler/icons-react"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Tooltip,
  TooltipContent,
} from "@/registry/preskok/ui/preskok-ui/tooltip"

export function DocsCopyPage({ page }: { page: string }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  return (
    <Tooltip>
      <Button
        intent="outline"
        size="sm"
        className="h-8 pl-1.5 md:h-7 [&>svg]:size-3.5"
        onPress={() => copyToClipboard(page)}
      >
        {isCopied ? <IconCheck /> : <IconCopy />} Copy Page
      </Button>
      <TooltipContent>
        <p>Copy as Markdown</p>
      </TooltipContent>
    </Tooltip>
  )
}
