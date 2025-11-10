"use client"

import {
  Archive,
  Box,
  Building,
  CheckCircle,
  ChevronsUpDown,
  Clock,
  CreditCard,
  Download,
  FileText,
  Hash,
  HelpCircle,
  Home,
  LifeBuoy,
  List,
  LogOut,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Ticket,
  Upload,
} from "lucide-react"

import { Avatar } from "@/registry/preskok/ui/preskok-ui/avatar"
import { Link } from "@/registry/preskok/ui/preskok-ui/link"
import {
  Menu,
  MenuContent,
  MenuHeader,
  MenuItem,
  MenuSection,
  MenuSeparator,
  MenuTrigger,
} from "@/registry/preskok/ui/preskok-ui/menu"
import { PreskokIcon } from "@/registry/preskok/ui/preskok-ui/preskok-icon"
import {
  Sidebar,
  SidebarContent,
  SidebarDisclosure,
  SidebarDisclosureGroup,
  SidebarDisclosurePanel,
  SidebarDisclosureTrigger,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarLink,
  SidebarMenuTrigger,
  SidebarRail,
  SidebarSection,
  SidebarSectionGroup,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

export default function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link
          href="/docs/components/layouts/sidebar"
          className="flex items-center gap-x-2"
        >
          <PreskokIcon className="size-6" />
          <SidebarLabel className="font-medium">
            Preskok <span className="text-muted-foreground">UI</span>
          </SidebarLabel>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarSectionGroup>
          <SidebarSection label="Overview">
            <SidebarItem tooltip="Overview" isCurrent href="#">
              <Home data-slot="icon" />
              <SidebarLabel>Overview</SidebarLabel>
            </SidebarItem>
            <SidebarItem tooltip="Orders">
              {({ isCollapsed, isFocused }) => (
                <>
                  <SidebarLink href="#">
                    <ShoppingBag data-slot="icon" />
                    <SidebarLabel>Orders</SidebarLabel>
                  </SidebarLink>
                  {(!isCollapsed || isFocused) && (
                    <Menu>
                      <SidebarMenuTrigger aria-label="Manage">
                        <MoreHorizontal data-slot="icon" />
                      </SidebarMenuTrigger>
                      <MenuContent
                        popover={{
                          offset: 0,
                          placement: "right top",
                        }}
                      >
                        <MenuItem href="#new-order">
                          <Plus data-slot="icon" />
                          Create New Order
                        </MenuItem>
                        <MenuItem href="#view-all">
                          <List data-slot="icon" />
                          View All Orders
                        </MenuItem>
                        <MenuItem href="#pending-orders">
                          <Clock data-slot="icon" />
                          Pending Orders
                        </MenuItem>
                        <MenuItem href="#completed-orders">
                          <CheckCircle data-slot="icon" />
                          Completed Orders
                        </MenuItem>
                        <MenuItem href="#export-orders">
                          <Upload data-slot="icon" />
                          Export Orders
                        </MenuItem>
                      </MenuContent>
                    </Menu>
                  )}
                </>
              )}
            </SidebarItem>
            <SidebarItem tooltip="Products">
              {({ isCollapsed, isFocused }) => (
                <>
                  <SidebarLink href="#">
                    <Box data-slot="icon" />
                    <SidebarLabel>Products</SidebarLabel>
                  </SidebarLink>
                  {(!isCollapsed || isFocused) && (
                    <Menu>
                      <SidebarMenuTrigger aria-label="Manage">
                        <MoreHorizontal data-slot="icon" />
                      </SidebarMenuTrigger>
                      <MenuContent
                        popover={{
                          offset: 0,
                          placement: "right top",
                        }}
                      >
                        <MenuItem href="#new-product">
                          <Plus data-slot="icon" />
                          Add New Product
                        </MenuItem>
                        <MenuItem href="#archive">
                          <Archive data-slot="icon" />
                          Archive Product
                        </MenuItem>
                        <MenuItem href="#manage-categories">
                          <Hash data-slot="icon" />
                          Manage Categories
                        </MenuItem>
                        <MenuItem href="#import">
                          <Download data-slot="icon" />
                          Import Products
                        </MenuItem>
                        <MenuItem href="#export">
                          <Upload data-slot="icon" />
                          Export Products
                        </MenuItem>
                      </MenuContent>
                    </Menu>
                  )}
                </>
              )}
            </SidebarItem>
            <SidebarItem href="#" badge="4 Pending" tooltip="Payments">
              <CreditCard data-slot="icon" />
              <SidebarLabel>Payments</SidebarLabel>
            </SidebarItem>
          </SidebarSection>

          <SidebarDisclosureGroup defaultExpandedKeys={[1]}>
            <SidebarDisclosure id={1}>
              <SidebarDisclosureTrigger>
                <MoreHorizontal data-slot="icon" />
                <SidebarLabel>Support</SidebarLabel>
              </SidebarDisclosureTrigger>
              <SidebarDisclosurePanel>
                <SidebarItem href="#" tooltip="Tickets">
                  <Ticket data-slot="icon" />
                  <SidebarLabel>Tickets</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="#" tooltip="Chat Support">
                  <MessageSquare data-slot="icon" />
                  <SidebarLabel>Chat Support</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="#" tooltip="FAQ">
                  <HelpCircle data-slot="icon" />
                  <SidebarLabel>FAQ</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="#" tooltip="Documentation">
                  <FileText data-slot="icon" />
                  <SidebarLabel>Documentation</SidebarLabel>
                </SidebarItem>
              </SidebarDisclosurePanel>
            </SidebarDisclosure>

            <SidebarDisclosure id={2}>
              <SidebarDisclosureTrigger>
                <Archive data-slot="icon" />
                <SidebarLabel>Inventory</SidebarLabel>
              </SidebarDisclosureTrigger>
              <SidebarDisclosurePanel>
                <SidebarItem href="#" tooltip="Warehouse">
                  <Building data-slot="icon" />
                  <SidebarLabel>Warehouse</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="#" tooltip="Stock Levels">
                  <SidebarLabel>Stock Levels</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="#" tooltip="Shipping">
                  <SidebarLabel>Shipping</SidebarLabel>
                </SidebarItem>
              </SidebarDisclosurePanel>
            </SidebarDisclosure>
          </SidebarDisclosureGroup>
        </SidebarSectionGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-row justify-between gap-4 group-data-[state=collapsed]:flex-col">
        <Menu>
          <MenuTrigger
            className="flex w-full items-center justify-between"
            aria-label="Profile"
          >
            <div className="flex items-center gap-x-2">
              <Avatar
                className="size-8 *:size-8 group-data-[state=collapsed]:size-6 group-data-[state=collapsed]:*:size-6"
                isSquare
                src="https://intentui.com/images/avatar/cobain.jpg"
              />
              <div className="text-sm in-data-[collapsible=dock]:hidden">
                <SidebarLabel>Kurt Cobain</SidebarLabel>
                <span className="text-muted-foreground -mt-0.5 block">
                  kurt@domain.com
                </span>
              </div>
            </div>
            <ChevronsUpDown data-slot="chevron" />
          </MenuTrigger>
          <MenuContent
            className="min-w-(--trigger-width) in-data-[sidebar-collapsible=collapsed]:min-w-56"
            placement="bottom right"
          >
            <MenuSection>
              <MenuHeader separator>
                <span className="block">Kurt Cobain</span>
                <span className="text-muted-foreground font-normal">
                  @cobain
                </span>
              </MenuHeader>
            </MenuSection>
            <MenuItem href="#dashboard">
              <Home data-slot="icon" />
              Dashboard
            </MenuItem>
            <MenuItem href="#settings">
              <Settings data-slot="icon" />
              Settings
            </MenuItem>
            <MenuItem href="#security">
              <ShieldCheck data-slot="icon" />
              Security
            </MenuItem>
            <MenuSeparator />
            <MenuItem href="#contact">
              <LifeBuoy data-slot="icon" />
              Customer Support
            </MenuItem>
            <MenuSeparator />
            <MenuItem href="#logout">
              <LogOut data-slot="icon" />
              Log out
            </MenuItem>
          </MenuContent>
        </Menu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
