"use client"

import { Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Input } from "@/registry/preskok/ui/preskok-ui/input"
import { TagField } from "@/registry/preskok/ui/preskok-ui/tag-field"

export function Component() {
  return (
    <TagField>
      <Label>Coupon codes</Label>
      <Input placeholder="Add codes, press Enter" />
    </TagField>
  )
}
