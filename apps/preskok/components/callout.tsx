import { cn } from "@/lib/utils"
import { Note } from "@/registry/preskok/ui/preskok-ui/note"

export function Callout({
  title,
  children,
  icon,
  className,
  ...props
}: React.ComponentProps<typeof Note> & { icon?: React.ReactNode }) {
  return (
    <Note
      className={cn(
        "bg-surface text-surface-foreground mt-6 w-auto border-none md:-mx-4",
        className
      )}
      indicator={false}
      {...props}
    >
      {icon}
      <div>
        {title && <div className="mb-1 font-medium">{title}</div>}
        <div className="text-card-foreground/80">{children}</div>
      </div>
    </Note>
  )
}
