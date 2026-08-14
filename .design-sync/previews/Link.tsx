import { ArrowUpRightIcon, ArrowRightIcon, DownloadIcon, ExternalLinkIcon } from "lucide-react"

import { buttonStyles, Link } from "preskok"

export function Default() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Link href="/docs">Documentation</Link>
      <Link href="/docs/components">Component index</Link>
      <Link href="https://react-spectrum.adobe.com/react-aria/" target="_blank">
        React Aria
        <ArrowUpRightIcon className="ml-1 inline size-3.5" />
      </Link>
      <Link isDisabled>Disabled link</Link>
    </div>
  )
}

export function AsButton() {
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
