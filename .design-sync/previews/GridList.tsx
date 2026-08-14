import {
  GridList,
  GridListDescription,
  GridListHeader,
  GridListItem,
  GridListLabel,
  GridListSpacer,
  GridListStart,
} from "preskok"

const tasks = [
  {
    id: "sync",
    name: "Sync staging data",
    description: "Refresh anonymized customer records",
    owner: "Data",
  },
  {
    id: "review",
    name: "Review accessibility",
    description: "Keyboard pass for checkout overlays",
    owner: "Design",
  },
  {
    id: "flags",
    name: "Enable feature flags",
    description: "Ramp release cohort to 20%",
    owner: "Growth",
  },
  {
    id: "docs",
    name: "Publish changelog",
    description: "Update release notes before deploy",
    owner: "Docs",
  },
]

export function Basic() {
  return (
    <div className="w-full max-w-xl">
      <GridList
        selectionMode="multiple"
        selectionBehavior="toggle"
        defaultSelectedKeys={["sync", "review"]}
        aria-label="Release tasks"
      >
        <GridListHeader>Release checklist</GridListHeader>
        {tasks.map((item) => (
          <GridListItem key={item.id} id={item.id} textValue={item.name}>
            <GridListStart>
              <div>
                <GridListLabel>{item.name}</GridListLabel>
                <GridListDescription>{item.description}</GridListDescription>
              </div>
            </GridListStart>
            <GridListSpacer />
            <span className="text-sm text-muted-foreground">{item.owner}</span>
          </GridListItem>
        ))}
      </GridList>
    </div>
  )
}
