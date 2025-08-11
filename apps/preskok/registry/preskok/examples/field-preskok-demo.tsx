"use client"

import {
  Description,
  FieldError,
  FieldGroup,
  Input,
  Label,
} from "@/registry/preskok/ui/preskok-ui/field"

export default function FieldPreskokDemo() {
  return (
    <div className="max-w-sm space-y-2">
      <Label htmlFor="email">Dealer Email</Label>
      <FieldGroup>
        <Input id="email" placeholder="you@example.com" />
      </FieldGroup>
      <Description>We will never share your email.</Description>
      <FieldError>Invalid email</FieldError>
    </div>
  )
}
