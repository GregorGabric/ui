import * as React from "react"
import { DocsLayout } from "fumadocs-ui/layouts/docs"
import { RootProvider } from "fumadocs-ui/provider/next"

import { baseOptions } from "@/lib/layout.shared"
import { source } from "@/lib/source"
import { DocsSidebarFooter } from "@/components/docs-sidebar-footer"
import { ClientProviders } from "@/components/router-provider"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootProvider
      theme={{ enabled: false }}
      search={{
        options: {
          api: "/api/search",
        },
      }}
    >
      <ClientProviders>
        <DocsLayout
          {...baseOptions()}
          tree={source.getPageTree()}
          sidebar={{
            footer: (
              <React.Fragment key="docs-sidebar-footer">
                <DocsSidebarFooter />
              </React.Fragment>
            ),
          }}
        >
          {children}
        </DocsLayout>
      </ClientProviders>
    </RootProvider>
  )
}
