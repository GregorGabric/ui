"use client"

import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"

export default function TextFieldPreskokDemo() {
  return (
    <div className="space-y-4">
      <TextField label="Dealer Email" placeholder="you@example.com" />
      <TextField label="With prefix" prefix="https://" placeholder="mysite" />
      <TextField label="Password" isRevealable placeholder="••••••" />
    </div>
  )
}
