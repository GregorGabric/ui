import * as React from "react"

import { cn } from "@/lib/utils"
import type { ButtonProps } from "@/registry/preskok/ui/preskok-ui/button"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { Fieldset, Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Input } from "@/registry/preskok/ui/preskok-ui/input"
import { Switch } from "@/registry/preskok/ui/preskok-ui/switch"
import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"

export interface LinkEditorProps extends React.ComponentProps<"div"> {
  defaultUrl?: string
  defaultText?: string
  defaultIsNewTab?: boolean
  onSave: (url: string, text?: string, isNewTab?: boolean) => void
}

export const LinkEditBlock = ({
  onSave,
  defaultIsNewTab,
  defaultUrl,
  defaultText,
  className,
}: LinkEditorProps) => {
  const formRef = React.useRef<HTMLDivElement>(null)
  const [url, setUrl] = React.useState(defaultUrl || "")
  const [text, setText] = React.useState(defaultText || "")
  const [isNewTab, setIsNewTab] = React.useState(defaultIsNewTab ?? false)

  const handleSave: ButtonProps["onClick"] = (e) => {
    e.preventDefault()
    if (formRef.current) {
      const isValid = Array.from(
        formRef.current.querySelectorAll("input")
      ).every((input) => input.checkValidity())

      if (isValid) {
        onSave(url, text, isNewTab)
      } else {
        formRef.current.querySelectorAll("input").forEach((input) => {
          if (!input.checkValidity()) {
            input.reportValidity()
          }
        })
      }
    }
  }

  return (
    <div ref={formRef}>
      <Fieldset className={cn("w-full space-y-4 p-4", className)}>
        <TextField>
          <Label>URL</Label>
          <Input
            type="url"
            required
            placeholder="Enter URL"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
            }}
          />
        </TextField>

        <TextField>
          <Label>Display Text (optional)</Label>
          <Input
            type="text"
            placeholder="Enter display text"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
            }}
          />
        </TextField>

        <TextField>
          <Switch isSelected={isNewTab} onChange={setIsNewTab}>
            <Label>Open in New Tab</Label>
          </Switch>
        </TextField>

        <div className="flex justify-end space-x-2">
          <Button type="submit" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Fieldset>
    </div>
  )
}
