import { Avatar } from "preskok"

export function Sizes() {
  return (
    <div className="flex flex-row flex-wrap items-center gap-4">
      <Avatar src="https://picsum.photos/id/64/64/64" alt="Alex Johnson" size="xs" />
      <Avatar src="https://picsum.photos/id/91/64/64" alt="Jamie Rivera" size="sm" />
      <Avatar initials="MC" alt="Maya Chen" />
      <Avatar initials="NR" alt="Noah Reed" size="lg" />
      <Avatar initials="IP" alt="Iris Patel" size="xl" isSquare />
    </div>
  )
}

export function OverlappingStack() {
  return (
    <div className="flex -space-x-2">
      <Avatar src="https://picsum.photos/id/64/64/64" alt="Alex Johnson" />
      <Avatar src="https://picsum.photos/id/91/64/64" alt="Jamie Rivera" />
      <Avatar initials="MC" alt="Maya Chen" />
      <Avatar initials="+3" alt="Three more reviewers" />
    </div>
  )
}
