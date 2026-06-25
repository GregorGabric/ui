"use client"

import { ArrowRightIcon, DownloadIcon, ExternalLinkIcon } from "lucide-react"

import { buttonStyles } from "@/registry/preskok/ui/preskok-ui/button"
import { Link } from "@/registry/preskok/ui/preskok-ui/link"

export default function LinkButtonPreskokDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Link className={buttonStyles()} href="#use-as-button">
        Get started
        <ArrowRightIcon />
      </Link>
      <Link
        className={buttonStyles({ intent: "outline" })}
        href="#use-as-button"
      >
        <DownloadIcon />
        Download
      </Link>
      <Link
        className={buttonStyles({
          intent: "plain",
          size: "sq-md",
          isCircle: true,
        })}
        href="#use-as-button"
        aria-label="Open in new tab"
      >
        <ExternalLinkIcon />
      </Link>
    </div>
  )
}
