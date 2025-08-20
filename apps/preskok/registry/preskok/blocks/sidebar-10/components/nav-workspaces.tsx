import { MoreHorizontal } from "lucide-react"

import {
  SidebarDisclosure,
  SidebarDisclosureGroup,
  SidebarDisclosurePanel,
  SidebarDisclosureTrigger,
  SidebarItem,
  SidebarLabel,
  SidebarLink,
  SidebarSection,
  SidebarSectionGroup,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

export function NavWorkspaces({
  workspaces,
}: {
  workspaces: {
    name: string
    emoji: React.ReactNode
    pages: {
      name: string
      emoji: React.ReactNode
    }[]
  }[]
}) {
  return (
    <SidebarSectionGroup>
      <SidebarSection label="Workspaces">
        <SidebarDisclosureGroup>
          {workspaces.map((workspace) => (
            <SidebarDisclosure key={workspace.name}>
              <SidebarDisclosureTrigger>
                <span>{workspace.emoji}</span>
                <SidebarLabel>{workspace.name}</SidebarLabel>
              </SidebarDisclosureTrigger>
              <SidebarDisclosurePanel>
                {workspace.pages.map((page) => (
                  <SidebarItem key={page.name}>
                    <SidebarLink href="#">
                      <span>{page.emoji}</span>
                      <SidebarLabel>{page.name}</SidebarLabel>
                    </SidebarLink>
                  </SidebarItem>
                ))}
              </SidebarDisclosurePanel>
            </SidebarDisclosure>
          ))}
          <SidebarItem>
            <SidebarLink className="text-sidebar-foreground/70">
              <MoreHorizontal />
              <SidebarLabel>More</SidebarLabel>
            </SidebarLink>
          </SidebarItem>
        </SidebarDisclosureGroup>
      </SidebarSection>
    </SidebarSectionGroup>
  )
}
