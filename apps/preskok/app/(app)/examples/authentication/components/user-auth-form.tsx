"use client"

import * as React from "react"

import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { PreskokAuthButton } from "@/registry/preskok/ui/preskok-ui/preskok-auth-button"
import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"

export function UserAuthForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <TextField aria-label="Email" type="email" isDisabled={isLoading} />
            <TextField
              aria-label="password"
              type="password"
              isDisabled={isLoading}
            />
          </div>
          <Button isDisabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <PreskokAuthButton type="button" isDisabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
      </PreskokAuthButton>
    </div>
  )
}
