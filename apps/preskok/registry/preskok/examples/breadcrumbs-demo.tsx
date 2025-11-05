"use client"

import {
  Breadcrumbs,
  BreadcrumbsItem,
} from "@/registry/preskok/ui/preskok-ui/breadcrumbs"

export default function BreadcrumbsDemo() {
  return (
    <Breadcrumbs>
      <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
      <BreadcrumbsItem href="/products">Products</BreadcrumbsItem>
      <BreadcrumbsItem href="/products/electronics">
        Electronics
      </BreadcrumbsItem>
      <BreadcrumbsItem>Laptop</BreadcrumbsItem>
    </Breadcrumbs>
  )
}
