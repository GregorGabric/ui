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

import { InputGroup, InputGroupAddon, InputGroupInput } from "./input"

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
    <InputGroup>
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput {...props} />
      <InputGroupAddon align="inline-end">
        <Button
          className={twJoin(
            "touch-target pressed:text-foreground text-muted-foreground hover:text-foreground grid place-content-center rounded-[calc(var(--radius-lg)-3px)] group-empty/search-field:invisible",
            "size-6 p-0"
          )}
        >
          <XIcon className="size-4" />
        </Button>
      </InputGroupAddon>
    </InputGroup>
  )
}
