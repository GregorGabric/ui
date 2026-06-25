import { Avatar } from "@/registry/preskok/ui/preskok-ui/avatar"

export default function AvatarPreskokDemo() {
  return (
    <div className="grid gap-5">
      <div className="flex flex-row flex-wrap items-center gap-4">
        <Avatar src="/avatars/01.png" alt="Alex Johnson" size="xs" />
        <Avatar src="/avatars/02.png" alt="Jamie Rivera" size="sm" />
        <Avatar initials="MC" alt="Maya Chen" />
        <Avatar initials="NR" alt="Noah Reed" size="lg" />
        <Avatar initials="IP" alt="Iris Patel" size="xl" isSquare />
      </div>
      <div className="flex -space-x-2">
        <Avatar src="/avatars/01.png" alt="Alex Johnson" />
        <Avatar src="/avatars/02.png" alt="Jamie Rivera" />
        <Avatar initials="MC" alt="Maya Chen" />
        <Avatar initials="+3" alt="Three more reviewers" />
      </div>
    </div>
  )
}
