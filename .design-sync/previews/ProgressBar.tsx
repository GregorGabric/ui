import {
  Description,
  Label,
  ProgressBar,
  ProgressBarHeader,
  ProgressBarTrack,
  ProgressBarValue,
} from "preskok"

export function Basic() {
  return (
    <div className="grid w-full max-w-md gap-5">
      <ProgressBar value={35}>
        <ProgressBarHeader>
          <Label>Importing customers</Label>
          <ProgressBarValue />
        </ProgressBarHeader>
        <Description>Determinate progress with a visible value.</Description>
        <ProgressBarTrack />
      </ProgressBar>
      <ProgressBar isIndeterminate>
        <ProgressBarHeader>
          <Label>Syncing webhooks</Label>
        </ProgressBarHeader>
        <Description>Indeterminate progress for unknown durations.</Description>
        <ProgressBarTrack />
      </ProgressBar>
    </div>
  )
}
