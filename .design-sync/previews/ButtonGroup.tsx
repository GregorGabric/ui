import { Button, ButtonGroup, ButtonGroupText } from "preskok"

export function Horizontal() {
  return (
    <ButtonGroup>
      <Button intent="outline">First</Button>
      <Button intent="outline">Second</Button>
      <Button intent="outline">Third</Button>
    </ButtonGroup>
  )
}

export function Vertical() {
  return (
    <ButtonGroup orientation="vertical">
      <Button intent="outline">Top</Button>
      <Button intent="outline">Middle</Button>
      <Button intent="outline">Bottom</Button>
    </ButtonGroup>
  )
}

export function WithTextAndMixedIntents() {
  return (
    <div className="flex flex-col gap-4">
      <ButtonGroup>
        <ButtonGroupText>Actions:</ButtonGroupText>
        <Button intent="outline">Save</Button>
        <Button intent="outline">Cancel</Button>
        <Button intent="primary">Submit</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button intent="outline">Cancel</Button>
        <Button intent="secondary">Draft</Button>
        <Button intent="primary">Publish</Button>
      </ButtonGroup>
    </div>
  )
}
