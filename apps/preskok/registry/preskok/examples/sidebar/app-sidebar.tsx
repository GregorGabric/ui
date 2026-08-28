"use client"

import {
  CircleHelpIcon,
  CreditCardIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingBagIcon,
  TicketIcon,
} from "lucide-react"

import { Avatar } from "@/registry/preskok/ui/preskok-ui/avatar"
import { PreskokIcon } from "@/registry/preskok/ui/preskok-ui/preskok-icon"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

const overviewItems = [
  {
    title: "Overview",
    href: "#overview",
    icon: LayoutDashboardIcon,
    isActive: true,
  },
  {
    title: "Orders",
    href: "#orders",
    icon: ShoppingBagIcon,
  },
  {
    title: "Products",
    href: "#products",
    icon: PackageIcon,
  },
  {
    title: "Payments",
    href: "#payments",
    icon: CreditCardIcon,
    badge: "4",
  },
]

const supportItems = [
  { title: "Tickets", href: "#tickets", icon: TicketIcon },
  { title: "Chat Support", href: "#chat", icon: MessageSquareIcon },
  { title: "FAQ", href: "#faq", icon: CircleHelpIcon },
  { title: "Sales Docs", href: "#sales-docs", icon: FileTextIcon },
]

export default function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton href="/navigation/sidebar" size="lg">
              <span className="flex size-8 shrink-0 items-center justify-center">
                <PreskokIcon className="size-5!" />
              </span>
              <span className="grid flex-1 text-left leading-tight">
                <span className="truncate font-medium">Preskok UI</span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  Operations
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {overviewItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    href={item.href}
                    isActive={item.isActive}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Support">
                  <SettingsIcon />
                  <span>Support</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {supportItems.map((item) => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Avatar isSquare initials="MC" alt="Maya Chen" />
              <span className="grid flex-1 text-left leading-tight">
                <span className="truncate font-medium">Maya Chen</span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  maya@preskok.example
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
