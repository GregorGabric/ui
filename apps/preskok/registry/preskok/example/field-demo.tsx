"use client"

import { Form } from "react-aria-components"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Description,
  FieldError,
  Fieldset,
  Label,
  Legend,
} from "@/registry/preskok/ui/preskok-ui/field"
import { Input } from "@/registry/preskok/ui/preskok-ui/input"
import { Text } from "@/registry/preskok/ui/preskok-ui/text"
import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"

export default function FieldDemo() {
  return (
    <Form>
      <Fieldset>
        <Legend>Profile information</Legend>
        <Text>
          Update your account's profile information and email address.
        </Text>

        <TextField isRequired name="firstName">
          <Label>First Name</Label>
          <Input placeholder="Your first name" />
          <FieldError />
          <Description>This is your public display name.</Description>
        </TextField>

        <TextField isRequired name="email">
          <Label>Email</Label>
          <Description>This is your email address.</Description>
          <Input type="email" placeholder="Your email" />
          <FieldError />
        </TextField>
        <TextField isRequired name="password">
          <Label>Password</Label>
          <Input type="password" placeholder="Your password" />
          <FieldError />
        </TextField>
        <div data-slot="control">
          <Button type="submit">Register</Button>
        </div>
      </Fieldset>
    </Form>
  )
}
