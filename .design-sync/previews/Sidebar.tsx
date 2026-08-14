import {
  CreditCardIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  ShoppingBagIcon,
} from "lucide-react"

import {
  Avatar,
  PreskokIcon,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarItem,
  SidebarLabel,
  SidebarProvider,
  SidebarSection,
  SidebarSectionGroup,
} from "preskok"

export function Default() {
  return (
    <SidebarProvider className="h-[420px] overflow-hidden">
      <Sidebar>
        <SidebarHeader>
          <span className="flex items-center gap-x-2">
            <PreskokIcon className="size-6" />
            <SidebarLabel className="font-medium">
              Preskok <span className="text-muted-foreground">UI</span>
            </SidebarLabel>
          </span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarSectionGroup>
            <SidebarSection label="Overview">
              <SidebarItem isCurrent href="#">
                <LayoutDashboardIcon data-slot="icon" />
                <SidebarLabel>Overview</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="#">
                <ShoppingBagIcon data-slot="icon" />
                <SidebarLabel>Orders</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="#" badge="4 Pending">
                <CreditCardIcon data-slot="icon" />
                <SidebarLabel>Payments</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="#">
                <MessageSquareIcon data-slot="icon" />
                <SidebarLabel>Support</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarSectionGroup>
        </SidebarContent>
        <SidebarFooter>
          <span className="flex items-center gap-2">
            <Avatar className="size-8 *:size-8" isSquare initials="MC" alt="Maya Chen" />
            <div className="min-w-0 text-sm">
              <SidebarLabel className="truncate">Maya Chen</SidebarLabel>
              <span className="-mt-0.5 block truncate text-muted-foreground">
                maya@preskok.example
              </span>
            </div>
          </span>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">Main content area</p>
      </SidebarInset>
    </SidebarProvider>
  )
}

export function Collapsed() {
  return (
    <SidebarProvider defaultOpen={false} className="h-[420px] overflow-hidden">
      <Sidebar collapsible="dock">
        <SidebarHeader>
          <PreskokIcon className="size-6" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarSectionGroup>
            <SidebarSection>
              <SidebarItem isCurrent href="#" tooltip="Overview">
                <LayoutDashboardIcon data-slot="icon" />
                <SidebarLabel>Overview</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="#" tooltip="Orders">
                <ShoppingBagIcon data-slot="icon" />
                <SidebarLabel>Orders</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="#" tooltip="Support">
                <MessageSquareIcon data-slot="icon" />
                <SidebarLabel>Support</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarSectionGroup>
        </SidebarContent>
        <SidebarFooter>
          <Avatar isSquare initials="MC" alt="Maya Chen" size="sm" />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">Main content area</p>
      </SidebarInset>
    </SidebarProvider>
  )
}
