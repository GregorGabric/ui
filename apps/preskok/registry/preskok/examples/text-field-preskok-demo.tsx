"use client"

import { useState } from "react"
import { EyeIcon, EyeOffIcon, SearchIcon } from "lucide-react"

import {
  Description,
  FieldError,
  Label,
} from "@/registry/preskok/ui/preskok-ui/field"
import {
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/registry/preskok/ui/preskok-ui/input"
import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"

export function Component() {
  const [token, setToken] = useState("sk_live_4f9a")
  const [isVisible, setIsVisible] = useState(false)
  const tokenIsTooShort = token.length < 12

  return (
    <div className="grid w-full max-w-md gap-5">
      <TextField name="workspace" isRequired>
        <Label>Workspace name</Label>
        <Input placeholder="Acme operations" />
        <Description>Used in invoices, exports, and admin emails.</Description>
        <FieldError />
      </TextField>

      <TextField aria-label="Search customers">
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search by company, owner, or email" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>⌘K</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </TextField>

      <TextField isInvalid={tokenIsTooShort} value={token} onChange={setToken}>
        <Label>API token</Label>
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>Bearer</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput type={isVisible ? "text" : "password"} />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              aria-label={isVisible ? "Hide token" : "Show token"}
              onPress={() => setIsVisible((value) => !value)}
            >
              {isVisible ? <EyeOffIcon /> : <EyeIcon />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <FieldError>Tokens must be at least 12 characters.</FieldError>
      </TextField>
    </div>
  )
}
