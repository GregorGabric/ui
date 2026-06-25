"use client"

import {
  ArchiveIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  BuildingIcon,
  ChevronsUpDownIcon,
  CircleCheckIcon,
  CircleHelpIcon,
  ClockIcon,
  CreditCardIcon,
  FileTextIcon,
  HashIcon,
  HeadphonesIcon,
  LayoutDashboardIcon,
  ListIcon,
  LogOutIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  PackageIcon,
  PlusIcon,
  SettingsIcon,
  ShieldIcon,
  ShoppingBagIcon,
  TicketIcon,
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
          className="flex items-center gap-x-2 group-data-[collapsible=dock]:size-10 group-data-[collapsible=dock]:justify-center"
          href="/navigation/sidebar"
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
              <LayoutDashboardIcon data-slot="icon" />
              <SidebarLabel>Overview</SidebarLabel>
            </SidebarItem>

            <SidebarItem tooltip="Orders">
              {({ isCollapsed, isFocused }) => (
                <>
                  <SidebarLink href="#">
                    <ShoppingBagIcon data-slot="icon" />
                    <SidebarLabel>Orders</SidebarLabel>
                  </SidebarLink>
                  {(!isCollapsed || isFocused) && (
                    <Menu>
                      <SidebarMenuTrigger aria-label="Manage">
                        <MoreHorizontalIcon data-slot="icon" />
                      </SidebarMenuTrigger>
                      <MenuContent
                        popover={{ offset: 0, placement: "right top" }}
                      >
                        <MenuItem href="#new-order">
                          <PlusIcon data-slot="icon" />
                          Create New Order
                        </MenuItem>
                        <MenuItem href="#view-all">
                          <ListIcon data-slot="icon" />
                          View All Orders
                        </MenuItem>
                        <MenuItem href="#pending-orders">
                          <ClockIcon data-slot="icon" />
                          Pending Orders
                        </MenuItem>
                        <MenuItem href="#completed-orders">
                          <CircleCheckIcon data-slot="icon" />
                          Completed Orders
                        </MenuItem>
                        <MenuItem href="#export-orders">
                          <ArrowUpIcon data-slot="icon" />
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
                    <SidebarLabel>Products</SidebarLabel>
                  </SidebarLink>
                  {(!isCollapsed || isFocused) && (
                    <Menu>
                      <SidebarMenuTrigger aria-label="Manage">
                        <MoreHorizontalIcon data-slot="icon" />
                      </SidebarMenuTrigger>
                      <MenuContent
                        popover={{ offset: 0, placement: "right top" }}
                      >
                        <MenuItem href="#new-product">
                          <PlusIcon data-slot="icon" />
                          Add New Product
                        </MenuItem>
                        <MenuItem href="#archive">
                          <ArchiveIcon data-slot="icon" />
                          Archive Product
                        </MenuItem>
                        <MenuItem href="#manage-categories">
                          <HashIcon data-slot="icon" />
                          Manage Categories
                        </MenuItem>
                        <MenuItem href="#import">
                          <ArrowDownIcon data-slot="icon" />
                          Import Products
                        </MenuItem>
                        <MenuItem href="#export">
                          <ArrowUpIcon data-slot="icon" />
                          Export Products
                        </MenuItem>
                      </MenuContent>
                    </Menu>
                  )}
                </>
              )}
            </SidebarItem>
            <SidebarItem href="#" badge="4 Pending" tooltip="Payments">
              <CreditCardIcon data-slot="icon" />
              <SidebarLabel>Payments</SidebarLabel>
            </SidebarItem>
          </SidebarSection>

          <SidebarDisclosureGroup defaultExpandedKeys={[1]}>
            <SidebarDisclosure id={1}>
              <SidebarDisclosureTrigger>
                <MoreHorizontalIcon data-slot="icon" />
                <SidebarLabel>Support</SidebarLabel>
              </SidebarDisclosureTrigger>

              <SidebarDisclosurePanel>
                <SidebarItem href="#" tooltip="Tickets">
                  <TicketIcon data-slot="icon" />
                  <SidebarLabel>Tickets</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="#" tooltip="Chat Support">
                  <MessageSquareIcon data-slot="icon" />
                  <SidebarLabel>Chat Support</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="#" tooltip="FAQ">
                  <CircleHelpIcon data-slot="icon" />
                  <SidebarLabel>FAQ</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="#" tooltip="Sales Docs">
                  <FileTextIcon data-slot="icon" />
                  <SidebarLabel>Sales Docs</SidebarLabel>
                </SidebarItem>
              </SidebarDisclosurePanel>
            </SidebarDisclosure>
            <SidebarDisclosure id={2}>
              <SidebarDisclosureTrigger>
                <PackageIcon data-slot="icon" />
                <SidebarLabel>Inventory</SidebarLabel>
              </SidebarDisclosureTrigger>
              <SidebarDisclosurePanel>
                <SidebarItem href="#" tooltip="Warehouse">
                  <BuildingIcon data-slot="icon" />
                  <SidebarLabel>Warehouse</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="#" tooltip="Stock Levels">
                  <SidebarLabel>Stock Levels</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="#" tooltip="Delivery">
                  <SidebarLabel>Delivery</SidebarLabel>
                </SidebarItem>
              </SidebarDisclosurePanel>
            </SidebarDisclosure>
          </SidebarDisclosureGroup>
        </SidebarSectionGroup>
      </SidebarContent>

      <SidebarFooter>
        <Menu>
          <MenuTrigger aria-label="Profile">
            <Avatar
              className="size-8 *:size-8"
              isSquare
              initials="MC"
              alt="Maya Chen"
            />
            <div className="min-w-0 text-sm">
              <SidebarLabel className="truncate">Maya Chen</SidebarLabel>
              <span className="text-muted-foreground -mt-0.5 block truncate">
                maya@preskok.example
              </span>
            </div>
            <ChevronsUpDownIcon data-slot="chevron" />
          </MenuTrigger>
          <MenuContent
            className="min-w-(--trigger-width) in-data-[state=collapsed]:min-w-56"
            placement="bottom right"
          >
            <MenuSection>
              <MenuHeader separator>
                <span className="block">Maya Chen</span>
                <span className="text-muted-foreground font-normal">@maya</span>
              </MenuHeader>
            </MenuSection>

            <MenuItem href="#dashboard">
              <LayoutDashboardIcon data-slot="icon" />
              Dashboard
            </MenuItem>
            <MenuItem href="#settings">
              <SettingsIcon data-slot="icon" />
              Settings
            </MenuItem>
            <MenuItem href="#security">
              <ShieldIcon data-slot="icon" />
              Security
            </MenuItem>
            <MenuSeparator />

            <MenuItem href="#contact">
              <HeadphonesIcon data-slot="icon" />
              Customer Support
            </MenuItem>
            <MenuSeparator />
            <MenuItem href="#logout">
              <LogOutIcon data-slot="icon" />
              Log out
            </MenuItem>
          </MenuContent>
        </Menu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
