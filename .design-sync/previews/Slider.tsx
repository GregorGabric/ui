import { Label, Slider, SliderFill, SliderOutput, SliderThumb, SliderTrack } from "preskok"

export function Default() {
  return (
    <Slider defaultValue={42} minValue={0} maxValue={100} step={1} className="w-full max-w-md">
      <div className="flex items-center justify-between">
        <Label>Rollout percentage</Label>
        <SliderOutput />
      </div>
      <SliderTrack />
    </Slider>
  )
}

export function Range() {
  return (
    <Slider defaultValue={[20, 80]} minValue={0} maxValue={100} step={5} className="w-full max-w-md">
      <div className="flex items-center justify-between">
        <Label>Budget range</Label>
        <SliderOutput />
      </div>
      <SliderTrack>
        <SliderFill />
        <SliderThumb index={0} aria-label="Minimum budget" />
        <SliderThumb index={1} aria-label="Maximum budget" />
      </SliderTrack>
    </Slider>
  )
}
