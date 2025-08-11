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
import { Menu } from "@/registry/preskok/ui/preskok-ui/menu"
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
                      <Menu.Trigger
                        data-slot="menu-trigger"
                        aria-label="Manage"
                      >
                        <MoreHorizontalIcon />
                      </Menu.Trigger>
                      <Menu.Content
                        popover={{ offset: 0, placement: "right top" }}
                      >
                        <Menu.Item href="#new-order">
                          <PlusIcon />
                          Create New Order
                        </Menu.Item>
                        <Menu.Item href="#view-all">
                          <ListIcon />
                          View All Orders
                        </Menu.Item>
                        <Menu.Item href="#pending-orders">
                          <ClockIcon />
                          Pending Orders
                        </Menu.Item>
                        <Menu.Item href="#completed-orders">
                          <CircleCheckIcon />
                          Completed Orders
                        </Menu.Item>
                        <Menu.Item href="#export-orders">
                          <ArrowUpIcon />
                          Export Orders
                        </Menu.Item>
                      </Menu.Content>
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
                      <Menu.Trigger aria-label="Manage">
                        <MoreHorizontalIcon />
                      </Menu.Trigger>
                      <Menu.Content
                        popover={{ offset: 0, placement: "right top" }}
                      >
                        <Menu.Item href="#new-product">
                          <PlusIcon />
                          Add New Product
                        </Menu.Item>
                        <Menu.Item href="#archive">
                          <ArchiveIcon />
                          Archive Product
                        </Menu.Item>
                        <Menu.Item href="#manage-categories">
                          <HashIcon />
                          Manage Categories
                        </Menu.Item>
                        <Menu.Item href="#import">
                          <ArrowDownIcon />
                          Import Products
                        </Menu.Item>
                        <Menu.Item href="#export">
                          <ArrowUpIcon />
                          Export Products
                        </Menu.Item>
                      </Menu.Content>
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
                <SidebarItem href="#" tooltip="Documentation">
                  <FileTextIcon />
                  <SidebarLabel>Documentation</SidebarLabel>
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
                <SidebarItem href="#" tooltip="Shipping">
                  <SidebarLabel>Shipping</SidebarLabel>
                </SidebarItem>
              </SidebarDisclosurePanel>
            </SidebarDisclosure>
          </SidebarDisclosureGroup>
        </SidebarSectionGroup>
      </SidebarContent>

      <SidebarFooter>
        <Menu>
          <Menu.Trigger className="group" aria-label="Profile">
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
          </Menu.Trigger>
          <Menu.Content
            className="min-w-(--trigger-width) in-data-[sidebar-collapsible=collapsed]:min-w-56"
            placement="bottom right"
          >
            <Menu.Section>
              <Menu.Header separator>
                <span className="block">Kurt Cobain</span>
                <span className="text-muted-foreground font-normal">
                  @cobain
                </span>
              </Menu.Header>
            </Menu.Section>

            <Menu.Item href="#dashboard">
              <LayoutDashboardIcon />
              Dashboard
            </Menu.Item>
            <Menu.Item href="#settings">
              <SettingsIcon />
              Settings
            </Menu.Item>
            <Menu.Item href="#security">
              <ShieldIcon />
              Security
            </Menu.Item>
            <Menu.Separator />

            <Menu.Item href="#contact">
              <HeadphonesIcon />
              Customer Support
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item href="#logout">
              <LogOutIcon />
              Log out
            </Menu.Item>
          </Menu.Content>
        </Menu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
