import { Description, FieldError, Label, TextField, Textarea } from "preskok"

export function WithCounter() {
  return (
    <TextField
      isInvalid
      defaultValue="Enterprise workspace renewal is ready for review and needs sign-off from legal before it can move forward with procurement."
      className="grid w-full max-w-xl gap-2"
    >
      <Label>Renewal summary</Label>
      <Textarea
        placeholder="Summarize the account state before the renewal call"
        maxLength={180}
      />
      <Description>Keep this under 140 characters for the account header.</Description>
      <FieldError>Keep the summary short enough for the account header.</FieldError>
    </TextField>
  )
}

export function Notes() {
  return (
    <TextField
      defaultValue="Procurement prefers annual billing. Legal has already approved the latest DPA."
      className="grid w-full max-w-xl gap-2"
    >
      <Label>Internal notes</Label>
      <Textarea placeholder="Add handoff notes, risk signals, or next steps" />
      <Description>Visible to the customer success team only.</Description>
    </TextField>
  )
}
