import { Text } from "preskok"

export function Default() {
  return (
    <div className="max-w-md space-y-2">
      <h3 className="text-lg font-semibold text-foreground">Default text</h3>
      <Text>
        This is a default text component with muted styling for secondary
        content.
      </Text>
    </div>
  )
}

export function MultipleParagraphs() {
  return (
    <div className="max-w-md space-y-2">
      <h3 className="text-lg font-semibold text-foreground">
        Multiple paragraphs
      </h3>
      <Text>
        The Text component is perfect for descriptive content that needs to be
        visually de-emphasized compared to primary text.
      </Text>
      <Text className="mt-2">
        It automatically applies muted foreground color and appropriate text
        sizing.
      </Text>
    </div>
  )
}
