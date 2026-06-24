import { Geist_Mono as FontMono, Geist as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["400"],
})

export const fontVariables = cn(fontSans.variable, fontMono.variable)
