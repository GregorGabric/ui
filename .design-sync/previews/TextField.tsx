import { SearchIcon } from "lucide-react"

import {
  Description,
  FieldError,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  Label,
  TextField,
} from "preskok"

export function Basic() {
  return (
    <TextField name="workspace" isRequired className="grid w-full max-w-md gap-2">
      <Label>Workspace name</Label>
      <Input placeholder="Acme operations" />
      <Description>Used in invoices, exports, and admin emails.</Description>
      <FieldError />
    </TextField>
  )
}

export function WithIconGroup() {
  return (
    <TextField aria-label="Search customers" className="grid w-full max-w-md gap-2">
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
  )
}

export function Invalid() {
  return (
    <TextField isInvalid defaultValue="sk_live_4f9" className="grid w-full max-w-md gap-2">
      <Label>API token</Label>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>Bearer</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput type="password" />
      </InputGroup>
      <FieldError>Tokens must be at least 12 characters.</FieldError>
    </TextField>
  )
}
