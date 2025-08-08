import { Keyboard } from "@/registry/preskok/ui/preskok-ui/keyboard"

export default function KeyboardPreskokDemo() {
  return (
    <div className="space-x-4">
      <Keyboard keys={["⌘", "K"]} />
      <Keyboard keys={["⇧", "⌘", "P"]} />
    </div>
  )
}
