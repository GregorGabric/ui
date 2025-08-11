import { twMerge } from "tailwind-merge"

const DescriptionList = ({
  className,
  ref,
  ...props
}: React.ComponentProps<"dl">) => {
  return (
    <dl
      ref={ref}
      className={twMerge(
        "grid grid-cols-1 text-base/6 sm:grid-cols-[min(50%,calc(var(--spacing)*80))_auto] sm:text-sm/6",
        className
      )}
      {...props}
    />
  )
}

const DescriptionTerm = ({
  className,
  ref,
  ...props
}: React.ComponentProps<"dt">) => {
  return (
    <dt
      ref={ref}
      className={twMerge(
        "text-muted-foreground col-start-1 border-t pt-3 first:border-none sm:py-3",
        className
      )}
      {...props}
    />
  )
}

const DescriptionDetails = ({
  className,
  ...props
}: React.ComponentProps<"dd">) => {
  return (
    <dd
      {...props}
      className={twMerge(
        "text-foreground pt-1 pb-3 sm:border-t sm:py-3 sm:nth-2:border-none",
        className
      )}
    />
  )
}

DescriptionList.Term = DescriptionTerm
DescriptionList.Details = DescriptionDetails
export { DescriptionList }
