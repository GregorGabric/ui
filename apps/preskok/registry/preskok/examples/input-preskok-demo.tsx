"use client"

import { MailIcon, SearchIcon } from "lucide-react"

import {
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/registry/preskok/ui/preskok-ui/input"
import { Loader } from "@/registry/preskok/ui/preskok-ui/loader"

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
          <InputGroupAddon>
            <MailIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="you@example.com" />
        </InputGroup>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Input with Loading State
        </label>
        <InputGroup>
          <InputGroupInput placeholder="Searching..." />
          <InputGroupAddon align="inline-end">
            <Loader variant="spin" />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Input with Button
        </label>
        <InputGroup>
          <InputGroupInput placeholder="Enter search term" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              intent="primary"
              size="icon-sm"
              aria-label="Search"
            >
              <SearchIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Input with Text Prefix
        </label>
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput />
          <InputGroupAddon align="inline-end">
            <InputGroupText>.com</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  )
}
