import * as React from "react"
import { CopyIcon, ExternalLinkIcon, Unlink2Icon } from "lucide-react"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Tooltip,
  TooltipContent,
} from "@/registry/preskok/ui/preskok-ui/tooltip"

interface LinkPopoverBlockProps {
  url: string
  onClear: () => void
  onEdit: () => void
}

export const LinkPopoverBlock: React.FC<LinkPopoverBlockProps> = ({
  url,
  onClear,
  onEdit,
}) => {
  const [copyTitle, setCopyTitle] = React.useState<string>("Copy")

  const handleCopy = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopyTitle("Copied!")
        setTimeout(() => {
          setCopyTitle("Copy")
        }, 1000)
      })
      .catch(console.error)
  }

  const handleOpenLink = React.useCallback(() => {
    window.open(url, "_blank", "noopener,noreferrer")
  }, [url])

  return (
    <div className="flex p-0.5">
      <div className="inline-flex items-center gap-1">
        <Tooltip>
          <Button intent="plain" onClick={onEdit}>
            Edit link
          </Button>
          <TooltipContent>Edit link</TooltipContent>
        </Tooltip>

        <Tooltip>
          <Button intent="plain" onClick={handleOpenLink}>
            <ExternalLinkIcon data-slot="icon" />
          </Button>
          <TooltipContent>Open link in a new tab</TooltipContent>
        </Tooltip>

        <Tooltip>
          <Button intent="plain" onClick={onClear}>
            <Unlink2Icon data-slot="icon" />
          </Button>
          <TooltipContent>Clear link</TooltipContent>
        </Tooltip>

        <Tooltip>
          <Button intent="plain" onClick={handleCopy}>
            <CopyIcon data-slot="icon" />
          </Button>
          <TooltipContent>{copyTitle}</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
