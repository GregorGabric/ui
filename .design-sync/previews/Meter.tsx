import { Description, Label, Meter, MeterHeader, MeterTrack, MeterValue } from "preskok"

export function Basic() {
  return (
    <div className="grid w-full max-w-md gap-5">
      <Meter value={41}>
        <MeterHeader>
          <Label>Storage space</Label>
          <MeterValue />
        </MeterHeader>
        <Description>Healthy usage renders with the success color.</Description>
        <MeterTrack />
      </Meter>
      <Meter value={78}>
        <MeterHeader>
          <Label>CPU load</Label>
          <MeterValue />
        </MeterHeader>
        <Description>Warning range as load approaches capacity.</Description>
        <MeterTrack />
      </Meter>
      <Meter value={92}>
        <MeterHeader>
          <Label>Error budget</Label>
          <MeterValue />
        </MeterHeader>
        <Description>High usage switches to the danger color.</Description>
        <MeterTrack />
      </Meter>
    </div>
  )
}
