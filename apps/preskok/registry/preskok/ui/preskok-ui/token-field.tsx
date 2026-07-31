"use client"

import type {
  TokenFieldProps as TokenFieldPrimitiveProps,
  TokenFieldValue,
  TokenInputProps,
  TokenProps,
} from "react-aria-components/TokenField"
import {
  TokenField as TokenFieldPrimitive,
  TokenInput as TokenInputPrimitive,
  Token as TokenPrimitive,
} from "react-aria-components/TokenField"

import { cx } from "@/registry/preskok/lib/primitive"

import { Description, fieldStyles, Label } from "./field"

interface TokenFieldProps<
  T extends TokenFieldValue = TokenFieldValue,
> extends Omit<TokenFieldPrimitiveProps<T>, "children"> {
  children: TokenInputProps<T>["children"]
  description?: React.ReactNode
  inputClassName?: string
  inputRef?: React.Ref<HTMLDivElement>
  label?: React.ReactNode
  placeholder?: string
}

const TokenField = <T extends TokenFieldValue = TokenFieldValue>({
  children,
  className,
  description,
  inputClassName,
  inputRef,
  label,
  placeholder,
  ...props
}: TokenFieldProps<T>) => {
  return (
    <TokenFieldPrimitive className={cx(fieldStyles(), className)} {...props}>
      {label != null && <Label>{label}</Label>}
      <TokenInputPrimitive
        ref={inputRef}
        data-slot="control"
        data-placeholder={placeholder}
        className={cx(
          [
            "border-input bg-background text-foreground block min-h-10 w-full rounded-lg border px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] text-base/6 outline-hidden sm:min-h-9 sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)] sm:text-sm/6",
            "empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]",
            "focus:border-ring/70 focus:ring-ring/20 hover:border-muted-foreground/30 focus:ring-3",
            "aria-[multiline=true]:min-h-24 aria-[multiline=true]:whitespace-pre-wrap",
            "disabled:bg-muted data-readonly:bg-muted/50 disabled:opacity-50",
          ],
          inputClassName
        )}
      >
        {children}
      </TokenInputPrimitive>
      {description != null && <Description>{description}</Description>}
    </TokenFieldPrimitive>
  )
}

const Token = ({ className, ...props }: TokenProps) => (
  <TokenPrimitive
    data-slot="token"
    className={cx(
      [
        "bg-primary/10 text-primary dark:bg-primary/15 mx-0.5 inline-flex h-5 cursor-default items-center rounded-full px-2 text-xs/4 font-medium whitespace-nowrap outline-hidden",
        "selected:bg-primary selected:text-primary-foreground",
        "disabled:bg-muted disabled:text-muted-foreground disabled:opacity-50",
        "selection:bg-transparent",
      ],
      className
    )}
    {...props}
  />
)

export { Token, TokenField }
export type { TokenFieldProps, TokenProps }
