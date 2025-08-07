"use client"

import { SearchIcon, XIcon } from "lucide-react"
import type { SearchFieldProps as SearchFieldPrimitiveProps } from "react-aria-components"
import {
  Button,
  SearchField as SearchFieldPrimitive,
} from "react-aria-components"

import { composeTailwindRenderProps } from "@/registry/new-york-v4/lib/primitive"

import {
  Description,
  FieldError,
  FieldGroup,
  Input,
  Label,
  type FieldProps,
} from "./field"
import { Loader } from "./loader"

interface SearchFieldProps extends SearchFieldPrimitiveProps, FieldProps {
  isPending?: boolean
}

const SearchField = ({
  children,
  className,
  placeholder,
  label,
  description,
  errorMessage,
  isPending,
  ...props
}: SearchFieldProps) => {
  return (
    <SearchFieldPrimitive
      aria-label={placeholder ?? props["aria-label"] ?? "Search..."}
      {...props}
      className={composeTailwindRenderProps(
        className,
        "group/search-field relative flex flex-col gap-y-1 *:data-[slot=label]:font-medium"
      )}
    >
      {(values) => (
        <>
          {label && <Label>{label}</Label>}
          {typeof children === "function" ? (
            children(values)
          ) : children ? (
            children
          ) : (
            <FieldGroup>
              {isPending ? <Loader variant="spin" /> : <SearchIcon />}
              <Input placeholder={placeholder ?? "Search..."} />

              <Button className="pressed:text-fg text-muted-fg hover:text-fg grid place-content-center group-empty/search-field:invisible">
                <XIcon />
              </Button>
            </FieldGroup>
          )}

          {description && <Description>{description}</Description>}
          <FieldError>{errorMessage}</FieldError>
        </>
      )}
    </SearchFieldPrimitive>
  )
}

export { SearchField }
export type { SearchFieldProps }
