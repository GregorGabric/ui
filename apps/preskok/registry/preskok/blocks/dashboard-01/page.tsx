import { ChartAreaInteractive } from "@/registry/preskok/blocks/dashboard-01/components/chart-area-interactive"
import { DataTable } from "@/registry/preskok/blocks/dashboard-01/components/data-table"
import { SectionCards } from "@/registry/preskok/blocks/dashboard-01/components/section-cards"
import AppSidebar from "@/registry/preskok/blocks/sidebar-01/components/app-sidebar"
import AppSidebarNav from "@/registry/preskok/blocks/sidebar-01/components/app-sidebar-nav"
import { Heading } from "@/registry/preskok/ui/preskok-ui/heading"
import {
  SidebarInset,
  SidebarProvider,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

import data from "./data.json"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar collapsible="dock" />
      <SidebarInset>
        <AppSidebarNav />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 lg:p-6">
              <Heading>Basic</Heading>
              <SectionCards />
              <ChartAreaInteractive />
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
