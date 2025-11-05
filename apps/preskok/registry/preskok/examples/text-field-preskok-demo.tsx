"use client"

import { Input } from "@/registry/preskok/ui/preskok-ui/input"
import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"

export function Component() {
  return (
    <TextField aria-label="Name">
      <Input placeholder="Some Name Here" />
    </TextField>
  )
}
