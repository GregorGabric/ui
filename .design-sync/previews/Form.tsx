import { Button, Description, FieldError, Form, Input, Label, TextField } from "preskok"

export function SignupForm() {
  return (
    <Form className="w-full max-w-sm space-y-4" onSubmit={(e) => e.preventDefault()}>
      <TextField isRequired name="name">
        <Label>Name</Label>
        <Input />
        <FieldError />
      </TextField>
      <TextField isRequired type="password" name="password">
        <Label>Password</Label>
        <Description>This is your password.</Description>
        <Input type="password" />
        <FieldError />
      </TextField>
      <TextField isRequired name="email">
        <Label>Email</Label>
        <Description>This is your public display name.</Description>
        <Input type="email" />
        <FieldError />
      </TextField>
      <Button type="submit">Submit</Button>
    </Form>
  )
}
