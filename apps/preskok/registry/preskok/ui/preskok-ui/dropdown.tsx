"use client"

import { CheckIcon } from "lucide-react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import type {
  ListBoxItemProps,
  ListBoxSectionProps,
  TextProps,
} from "react-aria-components/ListBox"
import {
  Collection,
  Header,
  ListBoxItem as ListBoxItemPrimitive,
  ListBoxSection,
  Text,
} from "react-aria-components/ListBox"
import type { SeparatorProps } from "react-aria-components/Separator"
import { Separator } from "react-aria-components/Separator"
import { twJoin, twMerge } from "tailwind-merge"
import { tv } from "tailwind-variants"

import { Keyboard } from "./keyboard"

const dropdownSectionStyles = tv({
  slots: {
    section: "col-span-full grid grid-cols-[auto_1fr]",
    header:
      "col-span-full px-3 py-2 text-sm/6 font-medium text-muted-foreground sm:px-2.5 sm:py-1.5 sm:text-xs/3",
  },
})

const { section, header } = dropdownSectionStyles()

interface DropdownSectionProps<T> extends ListBoxSectionProps<T> {
  title?: string
}

const DropdownSection = <T extends object>({
  className,
  children,
  ...props
}: DropdownSectionProps<T>) => {
  return (
    <ListBoxSection className={section({ className })}>
      {"title" in props && <Header className={header()}>{props.title}</Header>}
      <Collection items={props.items}>{children}</Collection>
    </ListBoxSection>
  )
}

const dropdownItemStyles = tv({
  base: [
    "min-w-0 [--mr-icon:--spacing(2.5)] sm:[--mr-icon:--spacing(2)]",
    "col-span-full grid grid-cols-[auto_1fr_1.5rem_0.5rem_auto] px-3 py-2 supports-[grid-template-columns:subgrid]:grid-cols-subgrid sm:px-2.5 sm:py-1.5",
    "not-has-[[slot=description]]:items-center",
    "group relative cursor-default rounded-[calc(var(--radius-xl)-(--spacing(1)))] text-base/6 text-foreground outline-0 select-none sm:text-sm/6",
    "**:data-[slot=avatar]:mr-(--mr-icon) **:data-[slot=avatar]:[--avatar-size:--spacing(6)] **:data-[slot=avatar]:*:mr-(--mr-icon) sm:**:data-[slot=avatar]:[--avatar-size:--spacing(5)]",
    "*:data-[slot=icon]:mr-(--mr-icon) **:data-[slot=icon]:h-5 **:data-[slot=icon]:w-5 **:data-[slot=icon]:shrink-0 has-[[slot=description]]:**:data-[slot=icon]:h-[1lh] sm:**:data-[slot=icon]:h-4 sm:**:data-[slot=icon]:w-4 [&_[data-slot='icon']:not([class*='text-'])]:text-muted-foreground",
    "[&>[slot=label]+[data-slot=icon]]:absolute [&>[slot=label]+[data-slot=icon]]:right-1",
    "forced-color-adjust-none forced-colors:text-[CanvasText] forced-colors:**:data-[slot=icon]:text-[CanvasText] forced-colors:group-focus:**:data-[slot=icon]:text-[CanvasText]",
  ],
  variants: {
    intent: {
      danger: [
        "text-destructive focus:text-destructive [&_[data-slot='icon']:not([class*='text-'])]:text-destructive/70",
        "*:[[slot=description]]:text-destructive/80 focus:*:[[slot=description]]:text-destructive focus:*:[[slot=label]]:text-destructive",
        "focus:bg-destructive/10 focus:text-destructive forced-colors:focus:text-[Mark] focus:[&_[data-slot='icon']:not([class*='text-'])]:text-destructive",
      ],
      warning: [
        "text-warning focus:text-warning [&_[data-slot='icon']:not([class*='text-'])]:text-warning/70",
        "*:[[slot=description]]:text-warning/80 focus:*:[[slot=description]]:text-warning focus:*:[[slot=label]]:text-warning",
        "focus:bg-warning/10 focus:text-warning focus:[&_[data-slot='icon']:not([class*='text-'])]:text-warning",
      ],
    },
    isDisabled: {
      true: "opacity-50 forced-colors:text-[GrayText]",
    },
    isSelected: {
      true: "**:data-[slot=icon]:text-foreground",
    },
    isFocused: {
      true: "bg-accent text-accent-foreground forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]",
    },
    isHovered: {
      true: "bg-accent text-accent-foreground forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]",
    },
  },
})

interface DropdownItemProps extends ListBoxItemProps {
  intent?: "danger" | "warning"
}

const DropdownItem = ({
  className,
  children,
  intent,
  ...props
}: DropdownItemProps) => {
  const textValue = typeof children === "string" ? children : undefined
  return (
    <ListBoxItemPrimitive
      textValue={textValue}
      className={composeRenderProps(className, (className, renderProps) =>
        dropdownItemStyles({ ...renderProps, intent, className })
      )}
      {...props}
    >
      {composeRenderProps(children, (children, { isSelected }) => (
        <>
          {isSelected && (
            <CheckIcon
              className={twJoin(
                "mr-1.5 -ml-0.5 h-[1lh] w-4 shrink-0",
                "group-has-data-[slot=icon]:absolute group-has-data-[slot=icon]:top-1/2 group-has-data-[slot=icon]:right-0.5 group-has-data-[slot=icon]:-translate-y-1/2",
                "group-has-data-[slot=avatar]:absolute group-has-data-[slot=avatar]:top-1/2 group-has-data-[slot=avatar]:right-0.5 group-has-data-[slot=avatar]:-translate-y-1/2"
              )}
              data-slot="check-indicator"
            />
          )}
          {typeof children === "string" ? (
            <DropdownLabel>{children}</DropdownLabel>
          ) : (
            children
          )}
        </>
      ))}
    </ListBoxItemPrimitive>
  )
}

interface DropdownLabelProps extends TextProps {
  ref?: React.Ref<HTMLDivElement>
}

const DropdownLabel = ({ className, ref, ...props }: DropdownLabelProps) => (
  <Text
    slot="label"
    ref={ref}
    className={twMerge("col-start-2", className)}
    {...props}
  />
)

interface DropdownDescriptionProps extends TextProps {
  ref?: React.Ref<HTMLDivElement>
}

const DropdownDescription = ({
  className,
  ref,
  ...props
}: DropdownDescriptionProps) => (
  <Text
    slot="description"
    ref={ref}
    className={twMerge(
      "text-muted-foreground col-start-2 text-sm font-normal",
      className
    )}
    {...props}
  />
)

const DropdownSeparator = ({ className, ...props }: SeparatorProps) => (
  <Separator
    orientation="horizontal"
    className={twMerge(
      "bg-foreground/10 col-span-full -mx-1 my-0 h-px",
      className
    )}
    {...props}
  />
)

type DropdownKeyboardProps = React.ComponentProps<typeof Keyboard> & {
  keys?: React.ReactNode
}

const DropdownKeyboard = ({ className, ...props }: DropdownKeyboardProps) => {
  return (
    <Keyboard
      className={twMerge("absolute right-2 pl-2", className)}
      {...props}
    />
  )
}

/**
 * Note: This is not exposed component, but it's used in other components to render dropdowns.
 * @internal
 */
export {
  DropdownDescription,
  DropdownItem,
  dropdownItemStyles,
  DropdownKeyboard,
  DropdownLabel,
  DropdownSection,
  dropdownSectionStyles,
  DropdownSeparator,
}
export type {
  DropdownDescriptionProps,
  DropdownItemProps,
  DropdownLabelProps,
  DropdownSectionProps,
}
