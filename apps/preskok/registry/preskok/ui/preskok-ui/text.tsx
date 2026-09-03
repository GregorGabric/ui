"use client"

import { twMerge } from "cn"

const Text = ({ className, ...props }: React.ComponentProps<"p">) => {
  return (
    <p
      data-slot="text"
      {...props}
      className={twMerge(
        "text-muted-foreground text-base/6 sm:text-sm/6",
        className
      )}
    />
  )
}

export { Text }
