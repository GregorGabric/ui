"use client"

import React from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import { Text } from "react-aria-components/Text"
import { ToggleButton } from "react-aria-components/ToggleButton"
import { tv } from "tailwind-variants"

import { buttonStyles } from "./button"

const showMoreStyles = tv({
  base: "text-sm leading-6 before:border-border after:border-border",
  variants: {
    orientation: {
      vertical: "mx-1 h-auto self-stretch",
      horizontal: "my-0.5 h-px w-full self-stretch",
    },
  },
  compoundVariants: [
    {
      orientation: "vertical",
      className:
        "mx-2 flex flex-col items-center before:mb-2 before:flex-1 before:border-l after:mt-2 after:flex-1 after:border-r",
    },
    {
      orientation: "horizontal",
      className:
        "my-2 flex items-center self-stretch before:mr-2 before:flex-1 before:border-t after:ml-2 after:flex-1 after:border-t",
    },
  ],
  defaultVariants: {
    orientation: "horizontal",
  },
})

interface ShowMoreProps extends React.ComponentProps<typeof ToggleButton> {
  className?: string
  orientation?: "horizontal" | "vertical"
  as?: "text" | "button"
  text?: string
}

const ShowMore = ({
  as = "button",
  children,
  orientation = "horizontal",
  className,
  ...props
}: ShowMoreProps) => {
  return (
    <div className={showMoreStyles({ orientation, className })}>
      {as === "button" ? (
        <ToggleButton
          {...props}
          className={buttonStyles({
            isCircle: true,
            intent: "outline",
            size: "sm",
          })}
        >
          {composeRenderProps(children, (children) => children)}
        </ToggleButton>
      ) : (
        <Text slot="description">{props.text}</Text>
      )}
    </div>
  )
}

export { ShowMore }
export type { ShowMoreProps }
