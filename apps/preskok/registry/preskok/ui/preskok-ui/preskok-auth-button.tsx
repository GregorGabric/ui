import type { PropsWithChildren } from "react"

import { Icons } from "@/components/icons"
import type { ButtonProps } from "@/registry/preskok/ui/preskok-ui/button"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"

interface PreskokAuthButtonProps extends Omit<ButtonProps, "children"> {
  label?: string
}

const PreskokAuthButton = ({
  label = "Continue with Preskok",
  children,
  ...props
}: PropsWithChildren<PreskokAuthButtonProps>) => {
  return (
    <Button
      intent={props.intent ?? "outline"}
      aria-label={props["aria-label"] ?? label}
      {...props}
    >
      {children}
      <span>Continue with</span>

      <Icons.logo className="!h-3 min-w-fit" />

      <span className="sr-only">Preskok</span>
    </Button>
  )
}

export { PreskokAuthButton }
export type { PreskokAuthButtonProps }
