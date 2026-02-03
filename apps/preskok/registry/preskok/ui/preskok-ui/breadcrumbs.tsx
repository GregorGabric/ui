"use client"

import { createContext, use } from "react"
import { ChevronRightIcon } from "lucide-react"
import type {
  BreadcrumbProps,
  BreadcrumbsProps,
  LinkProps,
} from "react-aria-components"
import {
  Breadcrumb,
  Breadcrumbs as BreadcrumbsPrimitive,
} from "react-aria-components"
import { twMerge } from "tailwind-merge"

import { cx } from "@/registry/preskok/lib/primitive"

import { Link } from "./link"

type BreadcrumbsContextProps = { separator?: "chevron" | "slash" | boolean }
const BreadcrumbsProvider = createContext<BreadcrumbsContextProps>({
  separator: "chevron",
})

const Breadcrumbs = <T extends object>({
  className,
  ...props
}: BreadcrumbsProps<T> & BreadcrumbsContextProps) => {
  return (
    <BreadcrumbsProvider value={{ separator: props.separator }}>
      <BreadcrumbsPrimitive
        {...props}
        className={twMerge("flex items-center gap-2", className)}
      />
    </BreadcrumbsProvider>
  )
}

interface BreadcrumbsItemProps
  extends BreadcrumbProps, BreadcrumbsContextProps {
  href?: string
}

const BreadcrumbsItem = ({
  href,
  separator = true,
  className,
  ...props
}: BreadcrumbsItemProps & Partial<Omit<LinkProps, "className">>) => {
  const { separator: contextSeparator } = use(BreadcrumbsProvider)
  separator = contextSeparator ?? separator
  const separatorValue = separator === true ? "chevron" : separator

  return (
    <Breadcrumb
      className={cx("flex items-center gap-2 text-sm", className)}
      data-slot="breadcrumb-item"
      {...props}
    >
      {({ isCurrent }) => (
        <>
          <Link href={href} {...props} />
          {!isCurrent && separator !== false && (
            <Separator separator={separatorValue} />
          )}
        </>
      )}
    </Breadcrumb>
  )
}

const Separator = ({
  separator = "chevron",
}: {
  separator?: BreadcrumbsItemProps["separator"]
}) => {
  return (
    <span className="*:text-muted-foreground *:shrink-0 *:data-[slot=icon]:size-3.5">
      {separator === "chevron" && <ChevronRightIcon data-slot="icon" />}
      {separator === "slash" && (
        <span className="text-muted-foreground">/</span>
      )}
    </span>
  )
}

export { Breadcrumbs, BreadcrumbsItem }
export type { BreadcrumbsItemProps, BreadcrumbsProps }
