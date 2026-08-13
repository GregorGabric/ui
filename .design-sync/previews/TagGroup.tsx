import { Description, Label, Tag, TagGroup, TagList } from "preskok"

const filters = [
  { id: "finance", name: "Finance" },
  { id: "security", name: "Security" },
  { id: "renewal", name: "Renewal" },
  { id: "blocked", name: "Blocked", isDisabled: true },
]

export function Default() {
  return (
    <TagGroup
      selectionMode="multiple"
      defaultSelectedKeys={["finance", "renewal"]}
      className="max-w-md"
    >
      <Label>Report filters</Label>
      <Description>Selected tags are included in the saved report view.</Description>
      <TagList items={filters}>
        {(item) => (
          <Tag id={item.id} isDisabled={item.isDisabled}>
            {item.name}
          </Tag>
        )}
      </TagList>
    </TagGroup>
  )
}
