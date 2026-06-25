"use client"

import { useState } from "react"

import {
  Description,
  FieldError,
  Label,
} from "@/registry/preskok/ui/preskok-ui/field"
import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"
import { Textarea } from "@/registry/preskok/ui/preskok-ui/textarea"

export default function TextareaDemo() {
  const maxLength = 140
  const [summary, setSummary] = useState(
    "Enterprise workspace renewal is ready for review."
  )
  const summaryIsTooLong = summary.length > maxLength

  return (
    <div className="grid w-full max-w-xl gap-5">
      <TextField
        isInvalid={summaryIsTooLong}
        value={summary}
        onChange={setSummary}
      >
        <Label>Renewal summary</Label>
        <Textarea
          placeholder="Summarize the account state before the renewal call"
          maxLength={180}
        />
        <Description>
          {summary.length}/{maxLength} characters recommended.
        </Description>
        <FieldError>
          Keep the summary short enough for the account header.
        </FieldError>
      </TextField>

      <TextField defaultValue="Procurement prefers annual billing. Legal has already approved the latest DPA.">
        <Label>Internal notes</Label>
        <Textarea placeholder="Add handoff notes, risk signals, or next steps" />
        <Description>Visible to the customer success team only.</Description>
      </TextField>
    </div>
  )
}
