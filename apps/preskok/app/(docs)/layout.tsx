import * as React from "react"
import { GlassLayout } from "fumadocs-ui/layouts/glass"
import { RootProvider } from "fumadocs-ui/provider/next"

import { ClientProviders } from "@/components/router-provider"
import { SidebarActiveItemAutoScroll } from "@/components/sidebar-active-item-auto-scroll"
import { baseOptions } from "@/lib/layout.shared"
import { source } from "@/lib/source"

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
        <GlassLayout {...baseOptions()} tree={source.getPageTree()}>
          <SidebarActiveItemAutoScroll />
          {children}
        </GlassLayout>
      </ClientProviders>
    </RootProvider>
  )
}
