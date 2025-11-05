"use client"

import {
  Breadcrumbs,
  BreadcrumbsItem,
} from "@/registry/preskok/ui/preskok-ui/breadcrumbs"

export default function BreadcrumbDemo() {
  return (
    <div className="space-y-4">
      <Breadcrumbs>
        <BreadcrumbsItem href="/">Dealership</BreadcrumbsItem>
        <BreadcrumbsItem href="/inventory">Inventory</BreadcrumbsItem>
        <BreadcrumbsItem href="/inventory/sedans">Sedans</BreadcrumbsItem>
        <BreadcrumbsItem>2024 Toyota Camry</BreadcrumbsItem>
      </Breadcrumbs>

      <Breadcrumbs separator="slash">
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem href="/services">Services</BreadcrumbsItem>
        <BreadcrumbsItem href="/services/maintenance">
          Maintenance
        </BreadcrumbsItem>
        <BreadcrumbsItem>Oil Change</BreadcrumbsItem>
      </Breadcrumbs>
    </div>
  )
}
