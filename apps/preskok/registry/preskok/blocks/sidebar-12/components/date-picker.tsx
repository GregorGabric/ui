import { Calendar } from "@/registry/preskok/ui/calendar"
import {
  SidebarSection,
  SidebarSectionGroup,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

export function DatePicker() {
  return (
    <SidebarSectionGroup>
      <SidebarSection className="px-0">
        <Calendar className="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[33px]" />
      </SidebarSection>
    </SidebarSectionGroup>
  )
}
