import * as React from "react"
import { Check } from "lucide-react"

import {
  SidebarDisclosure,
  SidebarDisclosureGroup,
  SidebarDisclosurePanel,
  SidebarDisclosureTrigger,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSectionGroup,
  SidebarSeparator,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

export function Calendars({
  calendars,
}: {
  calendars: {
    name: string
    items: string[]
  }[]
}) {
  return (
    <>
      <SidebarSectionGroup>
        <SidebarDisclosureGroup>
          {calendars.map((calendar, index) => (
            <React.Fragment key={calendar.name}>
              <SidebarSection className="py-0">
                <SidebarDisclosure defaultExpanded={index === 0}>
                  <SidebarDisclosureTrigger>
                    <SidebarLabel>{calendar.name}</SidebarLabel>
                  </SidebarDisclosureTrigger>
                  <SidebarDisclosurePanel>
                    {calendar.items.map((item, i) => (
                      <SidebarItem key={item}>
                        <div className="flex items-center gap-2">
                          <div
                            data-active={i < 2}
                            className="group/calendar-item border-sidebar-border text-sidebar-primary-foreground data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-primary flex aspect-square size-4 shrink-0 items-center justify-center rounded-sm border"
                          >
                            <Check className="hidden size-3 group-data-[active=true]/calendar-item:block" />
                          </div>
                          <SidebarLabel>{item}</SidebarLabel>
                        </div>
                      </SidebarItem>
                    ))}
                  </SidebarDisclosurePanel>
                </SidebarDisclosure>
              </SidebarSection>
              <SidebarSeparator className="mx-0" />
            </React.Fragment>
          ))}
        </SidebarDisclosureGroup>
      </SidebarSectionGroup>
    </>
  )
}
