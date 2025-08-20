import * as React from "react"
import { Plus } from "lucide-react"

import { Calendars } from "@/registry/preskok/blocks/sidebar-12/components/calendars"
import { DatePicker } from "@/registry/preskok/blocks/sidebar-12/components/date-picker"
import { NavUser } from "@/registry/preskok/blocks/sidebar-12/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarLink,
  SidebarRail,
  SidebarSection,
  SidebarSectionGroup,
  SidebarSeparator,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  calendars: [
    {
      name: "My Calendars",
      items: ["Personal", "Work", "Family"],
    },
    {
      name: "Favorites",
      items: ["Holidays", "Birthdays"],
    },
    {
      name: "Other",
      items: ["Travel", "Reminders", "Deadlines"],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker />
        <SidebarSeparator className="mx-0" />
        <Calendars calendars={data.calendars} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarSectionGroup>
          <SidebarSection>
            <SidebarItem>
              <SidebarLink href="#">
                <Plus />
                <SidebarLabel>New Calendar</SidebarLabel>
              </SidebarLink>
            </SidebarItem>
          </SidebarSection>
        </SidebarSectionGroup>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
