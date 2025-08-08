"use client"

import { Breadcrumbs } from "@/registry/preskok/ui/preskok-ui/breadcrumbs"

export default function BreadcrumbsDemo() {
  return (
    <Breadcrumbs>
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/products/electronics">
        Electronics
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>Laptop</Breadcrumbs.Item>
    </Breadcrumbs>
  )
}
