import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const awesomeCardVariants = cva(
  "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800",
        success:
          "bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800",
        warning:
          "bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-950/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800",
        danger:
          "bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-950/20 dark:to-pink-900/20 border-red-200 dark:border-red-800",
      },
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface AwesomeCardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof awesomeCardVariants> {
  icon?: React.ReactNode
  badge?: string
}

function AwesomeCard({
  className,
  variant,
  size,
  icon,
  badge,
  children,
  ...props
}: AwesomeCardProps) {
  return (
    <div
      data-slot="awesome-card"
      className={cn(awesomeCardVariants({ variant, size, className }))}
      {...props}
    >
      {/* Header with icon and badge */}
      {(icon || badge) && (
        <div className="mb-2 flex items-center justify-between">
          {icon && <div className="text-2xl opacity-70">{icon}</div>}
          {badge && (
            <span className="rounded-full bg-white/50 px-2 py-1 text-xs font-medium dark:bg-black/20">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1">{children}</div>

      {/* Awesome bottom accent */}
      <div className="h-1 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-60" />
    </div>
  )
}

function AwesomeCardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="awesome-card-header"
      className={cn("space-y-1.5", className)}
      {...props}
    />
  )
}

function AwesomeCardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="awesome-card-title"
      className={cn("text-2xl font-bold tracking-tight", className)}
      {...props}
    />
  )
}

function AwesomeCardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="awesome-card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function AwesomeCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="awesome-card-content"
      className={cn("pt-2", className)}
      {...props}
    />
  )
}

function AwesomeCardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="awesome-card-footer"
      className={cn("flex items-center pt-2", className)}
      {...props}
    />
  )
}

export {
  AwesomeCard,
  AwesomeCardContent,
  AwesomeCardDescription,
  AwesomeCardFooter,
  AwesomeCardHeader,
  AwesomeCardTitle,
  awesomeCardVariants,
}
