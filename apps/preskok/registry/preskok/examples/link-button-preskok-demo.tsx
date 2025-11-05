"use client"

import { buttonStyles } from "@/registry/preskok/ui/preskok-ui/button"
import { Link } from "@/registry/preskok/ui/preskok-ui/link"

export default function LinkButtonPreskokDemo() {
  return (
    <div className="flex gap-2">
      <Link className={buttonStyles()} href="#use-as-button">
        Link
      </Link>
      <Link
        className={buttonStyles({ intent: "outline" })}
        href="#use-as-button"
      >
        Link
      </Link>
      <Link
        className={buttonStyles({ intent: "plain", isCircle: true })}
        href="#use-as-button"
      >
        Link
      </Link>
    </div>
  )
}
