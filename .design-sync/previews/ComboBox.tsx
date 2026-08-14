import { useState } from "react"

import {
  ComboBox,
  ComboBoxContent,
  ComboBoxDescription,
  ComboBoxInput,
  ComboBoxItem,
  ComboBoxLabel,
  ComboBoxSection,
  Description,
  Label,
} from "preskok"

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

export function Filterable() {
  const [inputValue, setInputValue] = useState("Growth")

  return (
    <div className="grid w-full max-w-sm gap-3">
      <ComboBox
        name="team"
        inputValue={inputValue}
        onInputChange={setInputValue}
        aria-label="Team"
      >
        <Label>Team</Label>
        <Description>Filter existing teams or create a new one.</Description>
        <ComboBoxInput placeholder="Search teams" />
        <ComboBoxContent>
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
    </div>
  )
}
