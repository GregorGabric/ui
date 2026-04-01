"use client"

import React from "react"
import { twMerge } from "tailwind-merge"

interface HeadingProps extends React.ComponentProps<
  "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
> {
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

const win2kFontStyle: React.CSSProperties = {
  fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
  color: "#000000",
}

const Heading = ({ className, level = 1, style, ...props }: HeadingProps) => {
  const Element: `h${typeof level}` = `h${level}`
  return (
    <Element
      className={twMerge(
        "font-sans",
        level === 1 && "text-lg font-bold",
        level === 2 && "text-base font-bold",
        level === 3 && "text-sm font-bold",
        level === 4 && "text-sm font-normal",
        className
      )}
      style={{ ...win2kFontStyle, ...style }}
      {...props}
    />
  )
}

export { Heading }
export type { HeadingProps }
