"use client"

import { Description, Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Input } from "@/registry/preskok/ui/preskok-ui/input"
import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"

export default function InputTextFieldDemo() {
  return (
    <TextField>
      <Label htmlFor="name">Name</Label>
      <Input id="name" aria-label="Name" placeholder="Your name" />
      <Description>Please enter your full name.</Description>
    </TextField>
  )
}
