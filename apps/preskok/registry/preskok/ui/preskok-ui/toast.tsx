"use client"

import React from "react"
import { Toaster as ToasterPrimitive, type ToasterProps } from "sonner"

const Toast = ({ ...props }: ToasterProps) => {
  return (
    <ToasterPrimitive
      theme={"system"}
      className="toaster group"
      richColors
      expand={false}
      toastOptions={{
        className:
          "*:data-icon:self-start font-sans has-data-description:*:data-icon:mt-1 *:data-icon:mt-0.5 backdrop-blur-2xl",
      }}
      style={
        {
          "--normal-background": "var(--color-overlay)",
          "--normal-text": "var(--color-overlay-foreground)",
          "--normal-border": "var(--color-border)",

          "--success-background": "var(--color-success-background)",
          "--success-border": "var(--color-success-border)",
          "--success-text": "var(--color-success-text)",

          "--error-background": "var(--color-error-background)",
          "--error-border": "var(--color-error-border)",
          "--error-text": "var(--color-error-text)",

          "--warning-background": "var(--color-warning-background)",
          "--warning-border": "var(--color-warning-border)",
          "--warning-text": "var(--color-warning-text)",

          "--info-background": "var(--color-info-background)",
          "--info-border": "var(--color-info-border)",
          "--info-text": "var(--color-info-text)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toast }
export type { ToasterProps }
