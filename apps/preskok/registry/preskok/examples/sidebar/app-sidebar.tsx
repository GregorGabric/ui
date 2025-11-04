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
  SquareTerminalIcon,
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
          href="/docs/components/layouts/sidebar"
        >
          <SquareTerminalIcon className="size-7" />
          <SidebarLabel className="font-medium">
            Intent <span className="text-muted-foreground">UI</span>
          </SidebarLabel>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarSectionGroup>
          <SidebarSection label="Overview">
            <SidebarItem tooltip="Overview" isCurrent href="#">
              <LayoutDashboardIcon />
              <SidebarLabel>Overview</SidebarLabel>
            </SidebarItem>

            <SidebarItem tooltip="Orders">
              {({ isCollapsed, isFocused }) => (
                <>
                  <SidebarLink href="#">
                    <ShoppingBagIcon />
                    <SidebarLabel>Orders</SidebarLabel>
                  </SidebarLink>
                  {(!isCollapsed || isFocused) && (
                    <Menu>
                      <MenuTrigger data-slot="menu-trigger" aria-label="Manage">
                        <MoreHorizontalIcon />
                      </MenuTrigger>
                      <MenuContent
                        popover={{ offset: 0, placement: "right top" }}
                      >
                        <MenuItem href="#new-order">
                          <PlusIcon />
                          Create New Order
                        </MenuItem>
                        <MenuItem href="#view-all">
                          <ListIcon />
                          View All Orders
                        </MenuItem>
                        <MenuItem href="#pending-orders">
                          <ClockIcon />
                          Pending Orders
                        </MenuItem>
                        <MenuItem href="#completed-orders">
                          <CircleCheckIcon />
                          Completed Orders
                        </MenuItem>
                        <MenuItem href="#export-orders">
                          <ArrowUpIcon />
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
                      <MenuTrigger aria-label="Manage">
                        <MoreHorizontalIcon />
                      </MenuTrigger>
                      <MenuContent
                        popover={{ offset: 0, placement: "right top" }}
                      >
                        <MenuItem href="#new-product">
                          <PlusIcon />
                          Add New Product
                        </MenuItem>
                        <MenuItem href="#archive">
                          <ArchiveIcon />
                          Archive Product
                        </MenuItem>
                        <MenuItem href="#manage-categories">
                          <HashIcon />
                          Manage Categories
                        </MenuItem>
                        <MenuItem href="#import">
                          <ArrowDownIcon />
                          Import Products
                        </MenuItem>
                        <MenuItem href="#export">
                          <ArrowUpIcon />
                          Export Products
                        </MenuItem>
                      </MenuContent>
                    </Menu>
                  )}
                </>
              )}
            </SidebarItem>
            <SidebarItem href="#" badge="4 Pending" tooltip="Payments">
              <CreditCardIcon />
              <SidebarLabel>Payments</SidebarLabel>
            </SidebarItem>
          </SidebarSection>

          <SidebarDisclosureGroup defaultExpandedKeys={[1]}>
            <SidebarDisclosure id={1}>
              <SidebarDisclosureTrigger>
                <MoreHorizontalIcon />
                <SidebarLabel>Support</SidebarLabel>
              </SidebarDisclosureTrigger>
              <SidebarDisclosurePanel>
                <SidebarItem href="#" tooltip="Tickets">
                  <TicketIcon />
                  <SidebarLabel>Tickets</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="#" tooltip="Chat Support">
                  <MessageSquareIcon />
                  <SidebarLabel>Chat Support</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="#" tooltip="FAQ">
                  <CircleHelpIcon />
                  <SidebarLabel>FAQ</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="#" tooltip="Sales Docs">
                  <FileTextIcon />
                  <SidebarLabel>Sales Docs</SidebarLabel>
                </SidebarItem>
              </SidebarDisclosurePanel>
            </SidebarDisclosure>
            <SidebarDisclosure id={2}>
              <SidebarDisclosureTrigger>
                <PackageIcon />
                <SidebarLabel>Inventory</SidebarLabel>
              </SidebarDisclosureTrigger>
              <SidebarDisclosurePanel>
                <SidebarItem href="#" tooltip="Warehouse">
                  <BuildingIcon />
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
          <MenuTrigger className="group" aria-label="Profile">
            <Avatar
              isSquare
              src="https://intentui.com/images/avatar/cobain.jpg"
            />
            <div className="text-sm in-data-[sidebar-collapsible=dock]:hidden">
              <SidebarLabel>Kurt Cobain</SidebarLabel>
              <span className="text-muted-foreground -mt-0.5 block">
                kurt@cobain.com
              </span>
            </div>
            <ChevronsUpDownIcon data-slot="chevron" />
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
              <LayoutDashboardIcon />
              Dashboard
            </MenuItem>
            <MenuItem href="#settings">
              <SettingsIcon />
              Settings
            </MenuItem>
            <MenuItem href="#security">
              <ShieldIcon />
              Security
            </MenuItem>
            <MenuSeparator />

            <MenuItem href="#contact">
              <HeadphonesIcon />
              Customer Support
            </MenuItem>
            <MenuSeparator />
            <MenuItem href="#logout">
              <LogOutIcon />
              Log out
            </MenuItem>
          </MenuContent>
        </Menu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
