"use client"

import { useState } from "react"

import {
  ComboBox,
  ComboBoxContent,
  ComboBoxDescription,
  ComboBoxInput,
  ComboBoxItem,
  ComboBoxLabel,
  ComboBoxSection,
} from "@/registry/preskok/ui/preskok-ui/combo-box"
import { Description, Label } from "@/registry/preskok/ui/preskok-ui/field"

export function Component() {
  const [inputValue, setInputValue] = useState("")
  const [createdTeam, setCreatedTeam] = useState("")

  return (
    <div className="grid w-full max-w-sm gap-3">
      <ComboBox
        name="team"
        allowsCustomValue
        allowsEmptyCollection
        inputValue={inputValue}
        onInputChange={setInputValue}
        aria-label="Team"
      >
        <Label>Team</Label>
        <Description>Filter existing teams or create a new one.</Description>
        <ComboBoxInput placeholder="Search teams" />
        <ComboBoxContent>
          {inputValue.length > 0 && (
            <ComboBoxItem
              id="create-team"
              textValue={`Create ${inputValue}`}
              onAction={() => setCreatedTeam(inputValue)}
            >
              <ComboBoxLabel>Create {inputValue}</ComboBoxLabel>
              <ComboBoxDescription>Add a custom team</ComboBoxDescription>
            </ComboBoxItem>
          )}
          <ComboBoxSection items={teams}>
            {(item) => (
              <ComboBoxItem
                id={item.id}
                textValue={item.name}
                isDisabled={item.isDisabled}
              >
                <ComboBoxLabel>{item.name}</ComboBoxLabel>
                <ComboBoxDescription>{item.description}</ComboBoxDescription>
              </ComboBoxItem>
            )}
          </ComboBoxSection>
        </ComboBoxContent>
      </ComboBox>
      {createdTeam && (
        <p className="text-muted-foreground text-sm">
          Created team: {createdTeam}
        </p>
      )}
    </div>
  )
}

const teams = [
  {
    id: "design",
    name: "Design systems",
    description: "Components, tokens, and accessibility reviews",
  },
  {
    id: "infra",
    name: "Infrastructure",
    description: "Cloud, deployments, observability, and incidents",
  },
  {
    id: "growth",
    name: "Growth",
    description: "Experiments, lifecycle, and activation metrics",
  },
  {
    id: "finance",
    name: "Finance",
    description: "Locked by workspace policy",
    isDisabled: true,
  },
]
