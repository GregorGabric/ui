"use client"

import { Breadcrumbs } from "@/registry/preskok/ui/preskok-ui/breadcrumbs"

export default function BreadcrumbDemo() {
  return (
    <div className="space-y-4">
      <Breadcrumbs>
        <Breadcrumbs.Item href="/">Dealership</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/inventory">Inventory</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/inventory/sedans">Sedans</Breadcrumbs.Item>
        <Breadcrumbs.Item>2024 Toyota Camry</Breadcrumbs.Item>
      </Breadcrumbs>

      <Breadcrumbs separator="slash">
        <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/services">Services</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/services/maintenance">
          Maintenance
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Oil Change</Breadcrumbs.Item>
      </Breadcrumbs>
    </div>
  )
}
