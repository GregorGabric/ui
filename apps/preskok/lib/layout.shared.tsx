import Image from "next/image"
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"
import { DatabaseIcon } from "lucide-react"

import { siteConfig } from "@/lib/config"

export function baseOptions(): BaseLayoutProps {
  return {
    githubUrl: siteConfig.links.github,
    nav: {
      title: (
        <span
          className="inline-flex h-6 items-center"
          aria-label={siteConfig.name}
        >
          <Image
            src="/preskok.svg"
            alt=""
            width={142}
            height={15}
            className="h-4 w-auto"
            aria-hidden="true"
            priority
          />
        </span>
      ),
      url: "/",
    },
    links: [
      {
        type: "icon",
        text: "Registry",
        label: "Open registry index",
        url: siteConfig.links.registry,
        icon: <DatabaseIcon />,
        on: "menu",
      },
    ],
    searchToggle: {
      enabled: true,
    },
    themeSwitch: {
      enabled: true,
      mode: "light-dark-system",
    },
  }
}
