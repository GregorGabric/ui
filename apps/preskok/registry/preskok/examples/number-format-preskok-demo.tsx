"use client"

import {
  NumberFormatProvider,
  NumberText,
} from "@/registry/preskok/ui/preskok-ui/number-format/number-format"

export default function NumberFormatPreskokDemo() {
  return (
    <NumberFormatProvider>
      <div className="space-y-2">
        <NumberText value={12345.67} />
        <NumberText value={0.1234} intlOptions={{ style: "percent" }} />
      </div>
    </NumberFormatProvider>
  )
}






