import type {
  ComponentProps,
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@/lib/utils"

type RenderProp<TProps> = ReactElement | ((props: TProps) => ReactElement)

type FileUploadProps = ComponentProps<"label"> & {
  render?: RenderProp<ComponentProps<"label">>
}

const FileUpload = ({ className, render, ref, ...props }: FileUploadProps) => {
  return useRender({
    defaultTagName: "label",
    render,
    ref,
    props: mergeProps<"label">(
      {
        className: cn(
          "border-stroke-sub-300 bg-background-white-0 flex w-full cursor-pointer flex-col items-center gap-5 rounded-xl border border-dashed p-8 text-center",
          "transition duration-200 ease-out",
          // hover
          "hover:bg-background-weak-50"
        ),
      },
      {
        className,
        ...props,
      }
    ),
  })
}

type FileUploadButtonProps = ComponentProps<"div"> & {
  render?: RenderProp<ComponentProps<"div">>
}

const FileUploadButton = ({
  className,
  render,
  ref,
  ...props
}: FileUploadButtonProps) => {
  return useRender({
    defaultTagName: "div",
    render,
    ref,
    props: mergeProps<"div">(
      {
        className: cn(
          "bg-background-white-0 text-label-sm text-text-sub-600 inline-flex h-8 items-center justify-center gap-2.5 rounded-lg px-2.5 whitespace-nowrap",
          "ring-stroke-soft-200 pointer-events-none ring-1 ring-inset"
        ),
      },
      {
        className,
        ...props,
      }
    ),
  })
}

type AsProp<T extends ElementType> = {
  as?: T
}

type PropsToOmit<T extends ElementType, P> = keyof (AsProp<T> & P)

type PolymorphicComponentProp<
  T extends ElementType,
  Props = object,
> = PropsWithChildren<Props & AsProp<T>> &
  Omit<ComponentPropsWithoutRef<T>, PropsToOmit<T, Props>>

export type PolymorphicRef<T extends ElementType> =
  ComponentPropsWithRef<T>["ref"]

type PolymorphicComponentPropWithRef<
  T extends ElementType,
  Props = object,
> = PolymorphicComponentProp<T, Props> & { ref?: PolymorphicRef<T> }

export type PolymorphicComponentPropsWithRef<
  T extends ElementType,
  P = object,
> = PolymorphicComponentPropWithRef<T, P>

export type PolymorphicComponentProps<
  T extends ElementType,
  P = object,
> = PolymorphicComponentProp<T, P>

export type PolymorphicComponent<P> = <T extends ElementType>(
  props: PolymorphicComponentPropsWithRef<T, P>
) => ReactNode

function FileUploadIcon<T extends ElementType>({
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
