import { ArrowUpRightIcon } from "lucide-react"

import { Link } from "@/registry/preskok/ui/preskok-ui/link"

export default function LinkPreskokDemo() {
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
