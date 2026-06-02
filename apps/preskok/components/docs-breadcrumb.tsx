"use client"

import { Fragment } from "react"
import { usePathname } from "next/navigation"
import { useBreadcrumb } from "fumadocs-core/breadcrumb"
import type { Root as PageTreeRoot } from "fumadocs-core/page-tree"

import {
  Breadcrumbs,
  BreadcrumbsItem,
} from "@/registry/preskok/ui/preskok-ui/breadcrumbs"

export function DocsBreadcrumb({
  tree,
  className,
}: {
  tree: PageTreeRoot
  className?: string
}) {
  const pathname = usePathname()
  const items = useBreadcrumb(pathname, tree)

  if (items.length === 0) return null

  return (
    <Breadcrumbs className={className}>
      <BreadcrumbsItem href="/docs">Docs</BreadcrumbsItem>
      {items.map((item, i) => (
        <Fragment key={i}>
          {item.url ? (
            <BreadcrumbsItem href={item.url}>{item.name}</BreadcrumbsItem>
          ) : (
            <BreadcrumbsItem>{item.name}</BreadcrumbsItem>
          )}
        </Fragment>
      ))}
    </Breadcrumbs>
  )
}
