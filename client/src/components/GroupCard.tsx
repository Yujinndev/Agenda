import { format } from 'date-fns'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'
import { Calendar, CheckCheckIcon, Ticket } from 'lucide-react'
import { EventGroup } from '@/types/group'

const GroupCard = ({
  group,
  className,
  extendedVariant = false,
}: {
  group: EventGroup
  extendedVariant?: boolean
  className?: string
}) => {
  const currentParticipantsCount = group?.numberOfMembers?.length

  return (
    <Card
      className={cn(
        'relative rounded-lg flex flex-col gap-4 border-0 p-4 shadow-none group',
        className,
        { 'p-0': extendedVariant }
      )}
    >
      <img
        src="https://sb.ecobnb.net/app/uploads/sites/3/2021/09/event-plan.jpg"
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
          <h2 className="font-bold text-lg line-clamp-1">{group.groupName}</h2>

          <Badge className="lg:text-[10px]">{group.groupCategory}</Badge>
        </div>
        {extendedVariant && (
          <div className="flex items-center gap-2 text-gray-600">
            <p className="font-bold">Organized by:</p>
            <p>
              {/* {group?.organizer?.firstName} {event?.organizer?.lastName} */}
            </p>
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
