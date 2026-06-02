"use client"

import { SearchIcon, XIcon } from "lucide-react"
import type {
  InputProps,
  SearchFieldProps,
} from "react-aria-components/SearchField"
import {
  Button,
  SearchField as SearchFieldPrimitive,
} from "react-aria-components/SearchField"
import { twJoin } from "tailwind-merge"

import { cx } from "@/registry/preskok/lib/primitive"
import { fieldStyles } from "@/registry/preskok/ui/preskok-ui/field"

import { Input, InputGroup } from "./input"

export function SearchField({ className, ...props }: SearchFieldProps) {
  return (
    <SearchFieldPrimitive
      {...props}
      aria-label={props["aria-label"] ?? "Search"}
      className={cx(
        fieldStyles({ className: "group/search-field" }),
        className
      )}
    />
  )
}

export function SearchInput(props: InputProps) {
  return (
    <InputGroup className="[--input-gutter-end:--spacing(8)]">
      <SearchIcon data-slot="icon" />
      <Input {...props} />
      <Button
        className={twJoin(
          "touch-target pressed:text-foreground text-muted-foreground hover:text-foreground grid place-content-center group-empty/search-field:invisible",
          "px-3 py-2 sm:px-2.5 sm:py-1.5 sm:text-sm/5"
        )}
      >
        <XIcon className="size-5 sm:size-4" data-slot="icon" />
      </Button>
    </InputGroup>
  )
}
