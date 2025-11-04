"use client"

import { MailIcon } from "lucide-react"

import { Input, InputGroup } from "@/registry/preskok/ui/preskok-ui/input"
import { Text } from "@/registry/preskok/ui/preskok-ui/text"

export default function InputGroupDemo() {
  return (
    <div className="space-y-6">
      <InputGroup>
        <MailIcon />
        <Input type="email" />
      </InputGroup>
      <InputGroup className="[--input-gutter-end:--spacing(12)] [--input-gutter-start:--spacing(16)]">
        <Text>https://</Text>
        <Input />
        <Text>.com</Text>
      </InputGroup>
    </div>
  )
}
