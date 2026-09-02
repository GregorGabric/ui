"use client"

import { createContext, use } from "react"
import { twMerge } from "cn"
import { ChevronRightIcon } from "lucide-react"
import type {
  BreadcrumbProps,
  BreadcrumbRenderProps,
  BreadcrumbsProps,
  LinkProps,
} from "react-aria-components/Breadcrumbs"
import {
  Breadcrumb,
  Breadcrumbs as BreadcrumbsPrimitive,
} from "react-aria-components/Breadcrumbs"

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
  children,
  ...props
}: BreadcrumbsItemProps & Partial<Omit<LinkProps, "className">>) => {
  const { separator: contextSeparator } = use(BreadcrumbsProvider)
  separator = contextSeparator ?? separator
  const separatorValue = separator === true ? "chevron" : separator
  const renderContent = (
    values: BreadcrumbRenderProps & { defaultChildren: React.ReactNode }
  ) => {
    if (typeof children !== "function") {
      return children
    }

    const render = children as (
      values: BreadcrumbRenderProps & { defaultChildren: React.ReactNode }
    ) => React.ReactNode
    return render(values)
  }

  return (
    <Breadcrumb
      className={cx("flex items-center gap-2 text-sm", className)}
      data-slot="breadcrumb-item"
      {...props}
    >
      {(values) => {
        const content = renderContent(values)

        return (
          <>
            {href ? (
              <Link href={href}>{content}</Link>
            ) : (
              <span className="font-medium text-muted-foreground">
                {content}
              </span>
            )}
            {!values.isCurrent && separator !== false && (
              <Separator separator={separatorValue} />
            )}
          </>
        )
      }}
    </Breadcrumb>
  )
}

const Separator = ({
  separator = "chevron",
}: {
  separator?: BreadcrumbsItemProps["separator"]
}) => {
  return (
    <span className="*:shrink-0 *:text-muted-foreground *:data-[slot=icon]:size-3.5">
      {separator === "chevron" && <ChevronRightIcon data-slot="icon" />}
      {separator === "slash" && (
        <span className="text-muted-foreground">/</span>
      )}
    </span>
  )
}

export { Breadcrumbs, BreadcrumbsItem }
export type { BreadcrumbsItemProps, BreadcrumbsProps }
