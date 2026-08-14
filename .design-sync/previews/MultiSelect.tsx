import { MultiSelect, MultiSelectContent, MultiSelectItem } from "preskok"

const fruits = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" },
  { id: 3, name: "Cherry" },
  { id: 4, name: "Date" },
  { id: 5, name: "Elderberry" },
  { id: 6, name: "Fig" },
  { id: 7, name: "Grape" },
]

export function Selected() {
  return (
    <MultiSelect
      className="max-w-md"
      placeholder="Select fruits"
      defaultValue={[1, 3, 7]}
    >
      <MultiSelectContent items={fruits}>
        {(fruit) => (
          <MultiSelectItem id={fruit.id}>{fruit.name}</MultiSelectItem>
        )}
      </MultiSelectContent>
    </MultiSelect>
  )
}

export function Empty() {
  return (
    <MultiSelect className="max-w-md" placeholder="Select fruits">
      <MultiSelectContent items={fruits}>
        {(fruit) => (
          <MultiSelectItem id={fruit.id}>{fruit.name}</MultiSelectItem>
        )}
      </MultiSelectContent>
    </MultiSelect>
  )
}
