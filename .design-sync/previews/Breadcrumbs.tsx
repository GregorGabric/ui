import { Breadcrumbs, BreadcrumbsItem } from "preskok"

export function Chevron() {
  return (
    <Breadcrumbs>
      <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
      <BreadcrumbsItem href="/docs">Docs</BreadcrumbsItem>
      <BreadcrumbsItem href="/docs/components">Components</BreadcrumbsItem>
      <BreadcrumbsItem>Breadcrumbs</BreadcrumbsItem>
    </Breadcrumbs>
  )
}

export function Slash() {
  return (
    <Breadcrumbs separator="slash">
      <BreadcrumbsItem href="/">Workspace</BreadcrumbsItem>
      <BreadcrumbsItem href="/projects">Projects</BreadcrumbsItem>
      <BreadcrumbsItem>Release checklist</BreadcrumbsItem>
    </Breadcrumbs>
  )
}
