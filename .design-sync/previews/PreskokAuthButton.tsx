import { PreskokAuthButton } from "preskok"

export function Default() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <PreskokAuthButton />
      <PreskokAuthButton intent="primary" />
      <PreskokAuthButton intent="secondary" />
    </div>
  )
}

export function CustomLabel() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <PreskokAuthButton label="Sign in with Preskok" />
      <PreskokAuthButton label="Connect workspace" intent="outline" />
    </div>
  )
}
