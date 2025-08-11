import type { ComponentProps } from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

interface FileUploadProps extends ComponentProps<"label"> {
  asChild?: boolean
}

const FileUpload = ({ className, asChild, ref, ...rest }: FileUploadProps) => {
  const Component = asChild ? Slot : "label"

  return (
    <Component
      ref={ref}
      className={cn(
        "border-stroke-sub-300 bg-background-white-0 flex w-full cursor-pointer flex-col items-center gap-5 rounded-xl border border-dashed p-8 text-center",
        "transition duration-200 ease-out",
        // hover
        "hover:bg-background-weak-50",
        className
      )}
      {...rest}
    />
  )
}

interface FileUploadButtonProps extends ComponentProps<"div"> {
  asChild?: boolean
}

const FileUploadButton = ({
  className,
  asChild,
  ref,
  ...rest
}: FileUploadButtonProps) => {
  const Component = asChild ? Slot : "div"

  return (
    <Component
      ref={ref}
      className={cn(
        "bg-background-white-0 text-label-sm text-text-sub-600 inline-flex h-8 items-center justify-center gap-2.5 rounded-lg px-2.5 whitespace-nowrap",
        "ring-stroke-soft-200 pointer-events-none ring-1 ring-inset",
        className
      )}
      {...rest}
    />
  )
}

type AsProp<T extends React.ElementType> = {
  as?: T
}

type PropsToOmit<T extends React.ElementType, P> = keyof (AsProp<T> & P)

type PolymorphicComponentProp<
  T extends React.ElementType,
  Props = object,
> = React.PropsWithChildren<Props & AsProp<T>> &
  Omit<React.ComponentPropsWithoutRef<T>, PropsToOmit<T, Props>>

export type PolymorphicRef<T extends React.ElementType> =
  React.ComponentPropsWithRef<T>["ref"]

type PolymorphicComponentPropWithRef<
  T extends React.ElementType,
  Props = object,
> = PolymorphicComponentProp<T, Props> & { ref?: PolymorphicRef<T> }

export type PolymorphicComponentPropsWithRef<
  T extends React.ElementType,
  P = object,
> = PolymorphicComponentPropWithRef<T, P>

export type PolymorphicComponentProps<
  T extends React.ElementType,
  P = object,
> = PolymorphicComponentProp<T, P>

export type PolymorphicComponent<P> = <T extends React.ElementType>(
  props: PolymorphicComponentPropsWithRef<T, P>
) => React.ReactNode

function FileUploadIcon<T extends React.ElementType>({
  className,
  as,
  ...rest
}: PolymorphicComponentProps<T>) {
  const Component = as ?? "div"

  return (
    <Component
      className={cn("text-text-sub-600 size-6", className)}
      {...rest}
    />
  )
}

export {
  FileUploadButton as Button,
  FileUploadIcon as Icon,
  FileUpload as Root,
}
