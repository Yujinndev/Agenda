import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { JOIN_PERMISSION } from '@/constants/choices'
import useAuth from '@/hooks/useAuth'

const GroupCard = ({
  group,
  className,
  extendedVariant = false,
}: {
  group: any
  className?: string
  extendedVariant?: boolean
}) => {
  const { auth } = useAuth()

  const groupCreator = group.members[0].user?.email
  const isUserTheCreator = auth.user === groupCreator
  const getJoinPermission = JOIN_PERMISSION.find(
    (el) => el.value === group.joinPermission
  )

  return (
    <Card
      className={cn(
        'relative rounded-lg flex flex-col gap-4 border-[1px] p-4 shadow-none group',
        className,
        { 'p-0 border-0': extendedVariant }
      )}
    >
      <img
        src="https://st2.depositphotos.com/3591429/6312/i/450/depositphotos_63124153-Word-Group-on-a-Brick-wall.jpg"
        alt="Example Image"
        className={cn(
          'w-full hidden h-48 overflow-hidden rounded-lg group-hover:opacity-80',
          {
            block: extendedVariant,
          }
        )}
      />
      <div className="space-y-1">
        <div className="flex justify-between gap-1 items-start">
          <h2 className="font-bold text-lg line-clamp-1 ">{group.name}</h2>
          <div className="flex justify-end gap-1 items-start">
            <Badge className="rounded-md">{getJoinPermission?.label}</Badge>
          </div>
        </div>
        {extendedVariant && (
          <div className="flex gap-2">
            <p>Members: {group.members.length}</p>
            {isUserTheCreator && (
              <>
                <p className="font-extralight text-gray-300">|</p>
                <p className="font-light">Admin</p>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

export default GroupCard
