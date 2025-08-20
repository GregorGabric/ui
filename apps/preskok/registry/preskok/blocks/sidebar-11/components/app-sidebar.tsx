import * as React from "react"
import { ChevronRight, File, Folder } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarDisclosure,
  SidebarDisclosureGroup,
  SidebarDisclosurePanel,
  SidebarDisclosureTrigger,
  SidebarItem,
  SidebarLabel,
  SidebarLink,
  SidebarRail,
  SidebarSection,
  SidebarSectionGroup,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

// This is sample data.
const data = {
  changes: [
    {
      file: "README.md",
      state: "M",
    },
    {
      file: "api/hello/route.ts",
      state: "U",
    },
    {
      file: "app/layout.tsx",
      state: "M",
    },
  ],
  tree: [
    [
      "app",
      [
        "api",
        ["hello", ["route.ts"]],
        "page.tsx",
        "layout.tsx",
        ["blog", ["page.tsx"]],
      ],
    ],
    [
      "components",
      ["ui", "button.tsx", "card.tsx"],
      "header.tsx",
      "footer.tsx",
    ],
    ["lib", ["util.ts"]],
    ["public", "favicon.ico", "vercel.svg"],
    ".eslintrc.json",
    ".gitignore",
    "next.config.js",
    "tailwind.config.js",
    "package.json",
    "README.md",
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarSectionGroup>
          <SidebarSection label="Changes">
            {data.changes.map((item, index) => (
              <SidebarItem key={index}>
                <SidebarLink>
                  <File />
                  <SidebarLabel>{item.file}</SidebarLabel>
                </SidebarLink>
                <span className="ml-auto text-xs">{item.state}</span>
              </SidebarItem>
            ))}
          </SidebarSection>
          <SidebarSection label="Files">
            <SidebarDisclosureGroup>
              {data.tree.map((item, index) => (
                <Tree key={index} item={item} />
              ))}
            </SidebarDisclosureGroup>
          </SidebarSection>
        </SidebarSectionGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

function Tree({ item }: { item: string | any[] }) {
  const [name, ...items] = Array.isArray(item) ? item : [item]

  if (!items.length) {
    return (
      <SidebarItem isCurrent={name === "button.tsx"}>
        <SidebarLink>
          <File />
          <SidebarLabel>{name}</SidebarLabel>
        </SidebarLink>
      </SidebarItem>
    )
  }

  return (
    <SidebarDisclosure defaultExpanded={name === "components" || name === "ui"}>
      <SidebarDisclosureTrigger>
        <ChevronRight className="transition-transform" />
        <Folder />
        <SidebarLabel>{name}</SidebarLabel>
      </SidebarDisclosureTrigger>
      <SidebarDisclosurePanel>
        {items.map((subItem, index) => (
          <Tree key={index} item={subItem} />
        ))}
      </SidebarDisclosurePanel>
    </SidebarDisclosure>
  )
}
