"use client"

import { MailIcon, SearchIcon } from "lucide-react"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { Input, InputGroup } from "@/registry/preskok/ui/preskok-ui/input"
import { Loader } from "@/registry/preskok/ui/preskok-ui/loader"
import { Text } from "@/registry/preskok/ui/preskok-ui/text"

export default function InputPreskokDemo() {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Basic Input</label>
        <Input placeholder="Enter your email" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Input with Icon
        </label>
        <InputGroup>
          <MailIcon data-slot="icon" />
          <Input placeholder="you@example.com" />
        </InputGroup>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Input with Loading State
        </label>
        <InputGroup>
          <Input placeholder="Searching..." />
          <Loader data-slot="loader" variant="spin" />
        </InputGroup>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Input with Button
        </label>
        <InputGroup>
          <Input placeholder="Enter search term" />
          <Button intent="primary">
            <SearchIcon className="size-4" />
          </Button>
        </InputGroup>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Input with Text Prefix
        </label>
        <InputGroup className="[--input-gutter-end:--spacing(12)] [--input-gutter-start:--spacing(16)]">
          <Text>https://</Text>
          <Input />
          <Text>.com</Text>
        </InputGroup>
      </div>
    </div>
  )
}
