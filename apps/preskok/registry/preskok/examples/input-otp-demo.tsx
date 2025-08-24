"use client"

import { useState } from "react"

import { InputOTP } from "@/registry/preskok/ui/preskok-ui/input-otp"

export default function InputOTPDemo() {
  const [value, setValue] = useState("")

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Vehicle Security Code</label>
        <p className="text-muted-foreground text-xs">
          Enter the 6-digit security code from your key fob
        </p>
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
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Dealer Access Code</label>
        <InputOTP maxLength={4} pattern="^[0-9]+$">
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
            <InputOTP.Slot index={1} />
            <InputOTP.Slot index={2} />
            <InputOTP.Slot index={3} />
          </InputOTP.Group>
        </InputOTP>
      </div>
    </div>
  )
}
