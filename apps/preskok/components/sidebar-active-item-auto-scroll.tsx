"use client"

import { useLayoutEffect } from "react"

export function SidebarActiveItemAutoScroll() {
  useLayoutEffect(() => {
    const sidebar = document.getElementById("nd-sidebar")
    const links = sidebar?.querySelectorAll<HTMLAnchorElement>("a[href]")
    const activeLink = Array.from(links ?? []).find(
      (link) => new URL(link.href).pathname === window.location.pathname
    )
    const viewport = activeLink?.closest<HTMLElement>(
      "[data-radix-scroll-area-viewport]"
    )

    if (!activeLink || !viewport) {
      return
    }

    const activeLinkRect = activeLink.getBoundingClientRect()
    const viewportRect = viewport.getBoundingClientRect()
    const isVisible =
      activeLinkRect.top >= viewportRect.top &&
      activeLinkRect.bottom <= viewportRect.bottom

    if (!isVisible) {
      viewport.scrollBy({
        top:
          activeLinkRect.top -
          viewportRect.top -
          (viewportRect.height - activeLinkRect.height) / 2,
      })
    }
  }, [])

  return null
}
