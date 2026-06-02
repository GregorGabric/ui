"use client"

import type { TextFieldProps } from "react-aria-components/TextField"
import { TextField as TextFieldPrimitive } from "react-aria-components/TextField"

import { cx } from "@/registry/preskok/lib/primitive"

import { fieldStyles } from "./field"

const TextField = ({ className, ...props }: TextFieldProps) => {
  return (
    <TextFieldPrimitive
      data-slot="control"
      className={cx(fieldStyles(), className)}
      {...props}
    />
  )
}

export { TextField }
