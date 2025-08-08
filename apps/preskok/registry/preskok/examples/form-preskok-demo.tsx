"use client"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { Form } from "@/registry/preskok/ui/preskok-ui/form"
import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"

export default function FormPreskokDemo() {
  return (
    <Form
      className="w-full max-w-sm space-y-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <TextField label="Name" name="name" isRequired placeholder="Jane Doe" />
      <TextField
        label="Email"
        name="email"
        type="email"
        isRequired
        placeholder="jane@example.com"
      />
      <Button type="submit">Submit</Button>
    </Form>
  )
}
