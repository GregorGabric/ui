import { Heading } from "@/registry/preskok/ui/preskok-ui/heading"
import {
  SidebarInset,
  SidebarProvider,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

import AppSidebar from "./sidebar/app-sidebar"
import AppSidebarNav from "./sidebar/app-sidebar-nav"

export default function SidebarPreskokDemo() {
  return (
    <SidebarProvider className="overflow-auto">
      <AppSidebar collapsible="dock" />
      <SidebarInset className="bg-muted/30">
        <AppSidebarNav />
        <section className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <Heading>Operations Overview</Heading>
              <p className="text-muted-foreground text-sm">
                Keep fulfillment, payments, and support in sync.
              </p>
            </div>
            <span className="text-muted-foreground bg-background rounded-md border px-2.5 py-1 text-xs font-medium">
              Updated 2 minutes ago
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-background space-y-2 rounded-xl border p-4">
              <p className="text-muted-foreground text-xs">Orders Today</p>
              <p className="text-2xl font-semibold">148</p>
              <p className="text-muted-foreground text-xs">+12% vs yesterday</p>
            </div>
            <div className="bg-background space-y-2 rounded-xl border p-4">
              <p className="text-muted-foreground text-xs">Pending Tickets</p>
              <p className="text-2xl font-semibold">9</p>
              <p className="text-muted-foreground text-xs">
                3 need priority response
              </p>
            </div>
            <div className="bg-background space-y-2 rounded-xl border p-4">
              <p className="text-muted-foreground text-xs">Failed Payments</p>
              <p className="text-2xl font-semibold">4</p>
              <p className="text-muted-foreground text-xs">
                All from one billing region
              </p>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="bg-background rounded-xl border p-4 lg:p-5">
              <Heading level={3}>Recent Activity</Heading>
              <div className="mt-4 space-y-3">
                <div className="flex items-start justify-between gap-3 border-b pb-3">
                  <div>
                    <p className="text-sm font-medium">Order #3921 packed</p>
                    <p className="text-muted-foreground text-xs">Warehouse A</p>
                  </div>
                  <span className="text-muted-foreground text-xs">2m ago</span>
                </div>
                <div className="flex items-start justify-between gap-3 border-b pb-3">
                  <div>
                    <p className="text-sm font-medium">Ticket #188 escalated</p>
                    <p className="text-muted-foreground text-xs">
                      Shipping delay complaint
                    </p>
                  </div>
                  <span className="text-muted-foreground text-xs">11m ago</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">
                      Payout batch processed
                    </p>
                    <p className="text-muted-foreground text-xs">
                      $12,420 settled
                    </p>
                  </div>
                  <span className="text-muted-foreground text-xs">43m ago</span>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-xl border p-4 lg:p-5">
              <Heading level={3}>Team Focus</Heading>
              <ul className="text-muted-foreground mt-4 space-y-3 text-sm">
                <li className="border-b pb-2">Review failed payment retries</li>
                <li className="border-b pb-2">
                  Confirm tomorrow stock transfer
                </li>
                <li>Prepare weekly support report</li>
              </ul>
            </div>
          </div>
        </section>
      </SidebarInset>
    </SidebarProvider>
  )
}
