"use client"

import { PreskokAuthButton } from "@/registry/preskok/ui/preskok-ui/preskok-auth-button"

export default function PreskokAuthButtonPreskokDemo() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-3 text-sm font-medium">Default (Outline)</h3>
        <PreskokAuthButton />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium">Primary Intent</h3>
        <PreskokAuthButton intent="primary" />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium">Secondary Intent</h3>
        <PreskokAuthButton intent="secondary" />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium">Custom Label</h3>
        <PreskokAuthButton label="Sign in with Preskok" />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium">With onPress Handler</h3>
        <PreskokAuthButton
          onPress={() => {
            console.log("Authenticate with Preskok")
          }}
        />
      </div>
    </div>
  )
}
