import { Heading } from "@/registry/preskok/ui/preskok-ui/heading"
import {
  SidebarInset,
  SidebarProvider,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

import AppSidebar from "./sidebar/app-sidebar"
import AppSidebarNav from "./sidebar/app-sidebar-nav"

export default function SidebarPreskokDemo() {
  return (
    <SidebarProvider>
      <AppSidebar collapsible="dock" />
      <SidebarInset>
        <AppSidebarNav />
        <div className="p-4 lg:p-6">
          <Heading>Basic</Heading>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
