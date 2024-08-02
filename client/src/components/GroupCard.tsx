import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'
import { UserGroup } from '@/types/group'
import useAuth from '@/hooks/useAuth'
import { JOIN_PERMISSION } from '@/constants/choices'
import useGroupFormStore from '@/services/state/useGroupFormStore'

const GroupCard = ({
  group,
  className,
  extendedVariant = false,
}: {
  group: UserGroup
  extendedVariant?: boolean
  className?: string
}) => {
  const { auth } = useAuth()
  const creatorEmail = group?.members[0].user?.email
  const isUserTheCreator = creatorEmail === auth.user
  const getJoinPermission = JOIN_PERMISSION.find(
    (el) => el.value === group.joinPermission
  )
  return (
    <Card
      className={cn(
        'relative rounded-lg flex flex-col gap-4 border-0 p-4 shadow-none group',
        className,
        { 'p-0': extendedVariant }
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
      <div className="grid gap-[2px]">
        <div className="flex justify-between gap-1 items-start">
          <h2 className="font-bold text-lg line-clamp-1 ">{group.name}</h2>
          <div className="flex justify-end gap-1 items-start">
            <Badge className="lg:text-[10px]">{getJoinPermission?.label}</Badge>
          </div>
        </div>
        {extendedVariant && (
          <div className="flex gap-8 items-center py-1">
            <div className="flex items-center gap-2">
              {isUserTheCreator ? (
                <p>
                  Members: {group.members.length} |{' '}
                  <span className="font-bold">ADMIN</span>
                </p>
              ) : (
                <p>Members: {group.members.length}</p>
              )}
            </div>
          </div>
        )}

        {extendedVariant && (
          <div className="flex gap-8 items-center py-1">
            <div className="flex items-center gap-2">
              <p>
                {/* {currentParticipantsCount} / {event.estimatedAttendees} Person */}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default GroupCard
