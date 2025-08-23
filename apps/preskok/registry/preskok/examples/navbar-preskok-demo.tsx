"use client"

import { ChevronDownIcon, SearchIcon, ShoppingBagIcon } from "lucide-react"

import { UserMenu } from "@/registry/preskok/examples/user-menu"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { Link } from "@/registry/preskok/ui/preskok-ui/link"
import { Menu } from "@/registry/preskok/ui/preskok-ui/menu"
import {
  Navbar,
  NavbarGap,
  NavbarItem,
  NavbarMobile,
  NavbarProvider,
  NavbarSection,
  NavbarSeparator,
  NavbarSpacer,
  NavbarStart,
  NavbarTrigger,
  type NavbarProps,
} from "@/registry/preskok/ui/preskok-ui/navbar"
import { PreskokIcon } from "@/registry/preskok/ui/preskok-ui/preskok-icon"
import { Separator } from "@/registry/preskok/ui/preskok-ui/separator"

const categories = [
  {
    id: 1,
    label: "Electronics",
    url: "#",
  },
  {
    id: 2,
    label: "Fashion",
    url: "#",
  },
  {
    id: 3,
    label: "Home & Kitchen",
    url: "#",
  },
  {
    id: 4,
    label: "Sports",
    url: "#",
  },
  {
    id: 5,
    label: "Books",
    url: "#",
  },
  {
    id: 6,
    label: "Beauty & Personal Care",
    url: "#",
  },
  {
    id: 7,
    label: "Grocery",
    url: "#",
  },
  {
    id: 8,
    label: "Toys & Games",
    url: "#",
  },
  {
    id: 9,
    label: "Automotive",
    url: "#",
  },
  {
    id: 10,
    label: "Health & Wellness",
    url: "#",
  },
]

export default function AppNavbar(props: NavbarProps) {
  return (
    <NavbarProvider>
      <Navbar {...props} className="max-w-[100cqi]">
        <NavbarStart>
          <Link
            className="flex items-center gap-x-2 font-medium"
            aria-label="Goto documentation of Navbar"
            href="/docs/components/layouts/navbar"
          >
            <PreskokIcon className="size-6 sm:size-5" />
          </Link>
        </NavbarStart>
        <NavbarGap />
        <NavbarSection>
          <NavbarItem href="#" isCurrent>
            Home
          </NavbarItem>
          <NavbarItem href="#">Shop</NavbarItem>
          <NavbarItem href="#">Offers</NavbarItem>
          <NavbarItem href="#">Orders</NavbarItem>
          <Menu>
            <NavbarItem>
              Categories
              <ChevronDownIcon className="col-start-3" />
            </NavbarItem>
            <Menu.Content
              className="min-w-(--trigger-width) sm:min-w-56"
              items={categories}
            >
              {(item) => (
                <Menu.Item id={item.id} textValue={item.label} href={item.url}>
                  {item.label}
                </Menu.Item>
              )}
            </Menu.Content>
          </Menu>
        </NavbarSection>
        <NavbarSpacer />
        <NavbarSection className="max-md:hidden">
          <Button intent="plain" size="sq-sm" aria-label="Search for products">
            <SearchIcon />
          </Button>
          <Button intent="plain" size="sq-sm" aria-label="Your Bag">
            <ShoppingBagIcon />
          </Button>
          <Separator orientation="vertical" className="mr-3 ml-1 h-5" />
          <UserMenu />
        </NavbarSection>
      </Navbar>
      <NavbarMobile>
        <NavbarTrigger />
        <NavbarSpacer />
        <Button intent="plain" size="sq-sm" aria-label="Search for products">
          <SearchIcon />
        </Button>
        <Button intent="plain" size="sq-sm" aria-label="Your Bag">
          <ShoppingBagIcon />
        </Button>
        <NavbarSeparator className="mr-2.5" />
        <UserMenu />
      </NavbarMobile>
    </NavbarProvider>
  )
}
