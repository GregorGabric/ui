"use client"

import React, { use } from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { DotIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"

type InputOTOPProps = React.ComponentProps<typeof OTPInput>
const InputOTP = ({
  className,
  autoFocus = true,
  containerClassName,
  ref,
  ...props
}: InputOTOPProps) => (
  <OTPInput
    data-1p-ignore
    ref={ref}
    autoFocus={autoFocus}
    containerClassName={twMerge(
      "flex items-center gap-2 has-disabled:opacity-50",
      containerClassName
    )}
    className={twMerge(
      "bg-danger mt-auto h-[2.5rem] disabled:cursor-not-allowed",
      className
    )}
    {...props}
  />
)

type InputOTPGroupProps = React.ComponentProps<"div">
const InputOTPGroup = ({ className, ref, ...props }: InputOTPGroupProps) => (
  <div
    ref={ref}
    className={twMerge("flex items-center gap-x-1.5", className)}
    {...props}
  />
)

interface InputOTPSlotProps extends React.ComponentProps<"div"> {
  index: number
}

const InputOTPSlot = ({
  index,
  className,
  ref,
  ...props
}: InputOTPSlotProps) => {
  const inputOTPContext = use(OTPInputContext)
  const slot = inputOTPContext.slots[index] as
    | (typeof inputOTPContext.slots)[number]
    | undefined

  if (!slot) {
    throw new Error("Slot not found")
  }

  const { char, hasFakeCaret, isActive } = slot

  return (
    <div
      ref={ref}
      className={twMerge(
        "border-input relative flex size-10 items-center justify-center rounded-md border text-sm tabular-nums transition-all",
        isActive && "border-ring/70 ring-ring/20 z-10 ring-3",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  )
}

type InputOTPSeparatorProps = React.ComponentProps<"div">
const InputOTPSeparator = ({ ref, ...props }: InputOTPSeparatorProps) => (
  <div ref={ref} {...props}>
    <DotIcon className="size-2" />
  </div>
)

InputOTP.Group = InputOTPGroup
InputOTP.Slot = InputOTPSlot
InputOTP.Separator = InputOTPSeparator

export { InputOTP }
export type {
  InputOTOPProps,
  InputOTPGroupProps,
  InputOTPSeparatorProps,
  InputOTPSlotProps,
}
