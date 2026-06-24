"use client"

import { MailIcon, SearchIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/registry/preskok/ui/preskok-ui/input"

const buttonIntents = [
  ["Primary action", "Publish", "primary"],
  ["Secondary action", "Sync", "secondary"],
  ["Warning action", "Retry", "warning"],
  ["Danger action", "Delete", "danger"],
  ["Outline action", "Export", "outline"],
  ["Plain action", "Clear", "plain"],
] as const

export default function InputGroupDemo() {
  return (
    <div className="w-full max-w-2xl space-y-8">
      <InputGroup>
        <InputGroupAddon>
          <MailIcon />
        </InputGroupAddon>
        <InputGroupInput type="email" placeholder="you@example.com" />
      </InputGroup>

      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="preskok" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>

      <div className="space-y-3">
        <h3 className="text-sm font-medium">Button intents</h3>
        {buttonIntents.map(([placeholder, label, intent]) => (
          <InputGroup key={intent}>
            <InputGroupInput placeholder={placeholder} />
            <InputGroupAddon align="inline-end">
              <InputGroupButton intent={intent} size="sm">
                {label}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        ))}
      </div>

      <InputGroup>
        <InputGroupInput placeholder="Customer, order, or route" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton intent="primary" size="icon-sm" aria-label="Search">
            <SearchIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
