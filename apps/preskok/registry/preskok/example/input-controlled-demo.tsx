"use client"

import { useState } from "react"

import { Input } from "@/registry/preskok/ui/preskok-ui/input"
import { Text } from "@/registry/preskok/ui/preskok-ui/text"

export default function InputControlledDemo() {
  const [text, setText] = useState("")
  return (
    <div>
      <Input
        aria-label="Name"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {text && <Text className="mt-6">{text}</Text>}
    </div>
  )
}
