import { Avatar } from "@/registry/preskok/ui/preskok-ui/avatar"

export default function AvatarPreskokDemo() {
  return (
    <div className="flex flex-row flex-wrap items-center gap-6">
      <Avatar src="/avatars/01.png" alt="Alex Johnson" />
      <Avatar src="/avatars/02.png" alt="Jamie Rivera" size="lg" />
      <Avatar initials="AJ" alt="Alex Johnson" isSquare />
      <Avatar initials="JR" alt="Jamie Rivera" size="xl" />
    </div>
  )
}
