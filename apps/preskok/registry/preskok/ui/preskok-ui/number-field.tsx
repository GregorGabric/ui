"use client"

import { MinusIcon, PlusIcon } from "lucide-react"
import {
  Button,
  NumberField as NumberFieldPrimitive,
  type ButtonProps,
  type NumberFieldProps,
} from "react-aria-components/NumberField"

import { cx } from "@/registry/preskok/lib/primitive"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/preskok/ui/preskok-ui/input"

import { fieldStyles } from "./field"

const NumberField = ({ className, ...props }: NumberFieldProps) => {
  return (
    <NumberFieldPrimitive
      {...props}
      data-slot="control"
      className={cx(fieldStyles(), className)}
    />
  )
}

function NumberInput(props: React.ComponentProps<typeof InputGroupInput>) {
  return (
    <InputGroup>
      <InputGroupInput className="tabular-nums" {...props} />
      <InputGroupAddon align="inline-end" className="py-0">
        <div className="flex h-7 items-center divide-x overflow-hidden rounded-[calc(var(--radius-lg)-3px)] border sm:h-6">
          <StepperButton slot="decrement" />
          <StepperButton slot="increment" />
        </div>
      </InputGroupAddon>
    </InputGroup>
  )
}

interface StepperButtonProps extends ButtonProps {
  slot: "increment" | "decrement"
  emblemType?: "chevron" | "default"
  className?: string
}

const StepperButton = ({
  slot,
  className,
  emblemType = "default",
  ...props
}: StepperButtonProps) => {
  return (
    <Button
      className={cx(
        "pressed:text-foreground text-muted-foreground hover:text-foreground grid place-content-center disabled:opacity-50",
        "bg-input/20 pressed:bg-input/60 size-full min-w-11 grow sm:min-w-8.5",
        "*:data-[slot=stepper-icon]:size-5 sm:*:data-[slot=stepper-icon]:size-4",
        className
      )}
      slot={slot}
      {...props}
    >
      {slot === "increment" ? (
        <PlusIcon data-slot="stepper-icon" />
      ) : (
        <MinusIcon data-slot="stepper-icon" />
      )}
    </Button>
  )
}

export { NumberField, NumberInput }
export type { NumberFieldProps }
