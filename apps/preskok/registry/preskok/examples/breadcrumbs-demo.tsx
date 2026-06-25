"use client"

import {
  Breadcrumbs,
  BreadcrumbsItem,
} from "@/registry/preskok/ui/preskok-ui/breadcrumbs"

export default function BreadcrumbsDemo() {
  return (
    <div className="grid gap-4">
      <Breadcrumbs>
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem href="/docs">Docs</BreadcrumbsItem>
        <BreadcrumbsItem href="/docs/components">Components</BreadcrumbsItem>
        <BreadcrumbsItem>Breadcrumbs</BreadcrumbsItem>
      </Breadcrumbs>
      <Breadcrumbs separator="slash">
        <BreadcrumbsItem href="/">Workspace</BreadcrumbsItem>
        <BreadcrumbsItem href="/projects">Projects</BreadcrumbsItem>
        <BreadcrumbsItem>Release checklist</BreadcrumbsItem>
      </Breadcrumbs>
      <Breadcrumbs>
        <BreadcrumbsItem href="/" separator={false}>
          Home
        </BreadcrumbsItem>
        <BreadcrumbsItem>Current page</BreadcrumbsItem>
      </Breadcrumbs>
    </div>
  )
}
