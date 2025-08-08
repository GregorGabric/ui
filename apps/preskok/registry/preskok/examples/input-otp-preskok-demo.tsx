"use client"

import { useState } from "react"

import { InputOTP } from "@/registry/preskok/ui/preskok-ui/input-otp"

export default function InputOTPPreskokDemo() {
  const [value, setValue] = useState("")
  return (
    <InputOTP value={value} onChange={setValue} maxLength={6}>
      <InputOTP.Group>
        <InputOTP.Slot index={0} />
        <InputOTP.Slot index={1} />
        <InputOTP.Slot index={2} />
      </InputOTP.Group>
      <InputOTP.Separator />
      <InputOTP.Group>
        <InputOTP.Slot index={3} />
        <InputOTP.Slot index={4} />
        <InputOTP.Slot index={5} />
      </InputOTP.Group>
    </InputOTP>
  )
}
