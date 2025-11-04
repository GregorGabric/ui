import type { Metadata } from "next"

import { siteConfig } from "@/lib/config"
import { Header } from "@/app/(app)/theme/partials/header"

import { ThemeContainer } from "./partials/theme-container"

export default function Page() {
  return (
    <div>
      <Header>
        <span className="text-foreground">Theme</span>
      </Header>
      <ThemeContainer />
    </div>
  )
}

export const metadata: Metadata = {
  title: "Themes",
  description:
    "Curated themes, selected for you, ready to copy, paste, and integrate into your apps for a polished, custom look without the hassle.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  applicationName: siteConfig.name,
  category: "Themes",
}
