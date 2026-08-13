import { MailIcon, SearchIcon } from "lucide-react"

import {
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "preskok"

export function Basic() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Email address</label>
        <Input placeholder="Enter your email" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Contact email</label>
        <InputGroup>
          <InputGroupAddon>
            <MailIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="you@example.com" />
        </InputGroup>
      </div>
    </div>
  )
}

export function WithAddons() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Search term</label>
        <InputGroup>
          <InputGroupInput placeholder="Enter search term" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton intent="primary" size="icon-sm" aria-label="Search">
              <SearchIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Custom domain</label>
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="acme" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>.com</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  )
}
