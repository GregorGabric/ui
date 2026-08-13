import { SearchIcon, ShoppingBagIcon } from "lucide-react"

import {
  Avatar,
  Button,
  Navbar,
  NavbarGap,
  NavbarItem,
  NavbarProvider,
  NavbarSection,
  NavbarSeparator,
  NavbarSpacer,
  NavbarStart,
  PreskokIcon,
  Separator,
} from "preskok"

export function Default() {
  return (
    <NavbarProvider>
      <Navbar className="max-w-full">
        <NavbarStart>
          <span className="flex items-center gap-x-2 font-medium">
            <PreskokIcon className="size-5" />
          </span>
        </NavbarStart>
        <NavbarGap />
        <NavbarSection>
          <NavbarItem href="#" isCurrent>
            Home
          </NavbarItem>
          <NavbarItem href="#">Orders</NavbarItem>
          <NavbarItem href="#">Categories</NavbarItem>
        </NavbarSection>
        <NavbarSpacer />
        <NavbarSection>
          <Button intent="plain" size="sq-sm" aria-label="Search for products">
            <SearchIcon data-slot="icon" />
          </Button>
          <Button intent="plain" size="sq-sm" aria-label="Your Bag">
            <ShoppingBagIcon data-slot="icon" />
          </Button>
          <Separator orientation="vertical" className="mr-3 ml-1 h-5" />
          <Avatar isSquare initials="MC" alt="Maya Chen" size="sm" />
        </NavbarSection>
      </Navbar>
    </NavbarProvider>
  )
}

export function Float() {
  return (
    <NavbarProvider>
      <Navbar intent="float" className="max-w-full">
        <NavbarStart>
          <span className="flex items-center gap-x-2 font-medium">
            <PreskokIcon className="size-5" />
          </span>
        </NavbarStart>
        <NavbarGap />
        <NavbarSection>
          <NavbarItem href="#" isCurrent>
            Dashboard
          </NavbarItem>
          <NavbarItem href="#">Billing</NavbarItem>
        </NavbarSection>
        <NavbarSpacer />
        <NavbarSection>
          <Button intent="primary" size="sm">
            Upgrade
          </Button>
        </NavbarSection>
      </Navbar>
    </NavbarProvider>
  )
}
