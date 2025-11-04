"use client"

import { Text } from "@/registry/preskok/ui/preskok-ui/text"

export default function TextPreskokDemo() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-lg font-semibold">Default Text</h3>
        <Text>
          This is a default text component with muted styling for secondary
          content.
        </Text>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold">Custom Styling</h3>
        <Text className="text-sm">
          You can customize the text styling using className prop.
        </Text>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold">Multiple Paragraphs</h3>
        <Text>
          The Text component is perfect for descriptive content that needs to be
          visually de-emphasized compared to primary text.
        </Text>
        <Text className="mt-2">
          It automatically applies muted foreground color and appropriate text
          sizing.
        </Text>
      </div>
    </div>
  )
}
