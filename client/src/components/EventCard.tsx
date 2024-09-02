import { format, isSameDay } from 'date-fns'
import { Event } from './Calendar'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'
import { Calendar, CheckCheckIcon, Ticket } from 'lucide-react'
import useAuth from '@/hooks/useAuth'

const EventCard = ({
  event,
  className,
  extendedVariant = false,
}: {
  event: Event
  extendedVariant?: boolean
  className?: string
}) => {
  const { auth } = useAuth()
  const currentParticipantsCount = event.participants?.length

  const startDate = new Date(event.startDateTime)
  const endDate = new Date(event.endDateTime)
  const isSameDate = isSameDay(startDate, endDate)

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
      <div className="space-y-2">
        <div className="flex justify-between gap-1 items-start">
          <h2 className="font-bold text-lg line-clamp-2">{event.title}</h2>
          <Badge className="rounded-md">{event.category}</Badge>
        </div>
        {extendedVariant && (
          <div className="flex gap-x-2 text-gray-600 items-start flex-col xl:flex-row">
            <p className="font-bold">Organized by:</p>
            <div className="flex gap-1">
              <p>
                {event?.organizer?.firstName} {event?.organizer?.lastName}
              </p>
              <p>{event?.organizer?.email === auth.user && '(You)'}</p>
            </div>
          </div>
        )}
        <div className={cn('flex items-center gap-2')}>
          <Calendar size={20} className="mb-1" />
          <div
            className={cn('flex flex-col items-center gap-2', {
              'flex-row': extendedVariant,
            })}
          >
            <p className="line-clamp-2 text-balance">
              {format(startDate, 'PPp')} - &nbsp;
              {isSameDate ? format(endDate, 'p') : format(endDate, 'PPp')}
            </p>
          </div>
        </div>

        {extendedVariant && (
          <div className="flex gap-8 items-center py-1">
            <div className="flex items-center gap-2">
              <CheckCheckIcon size={20} className="mb-1" />
              <p>
                {currentParticipantsCount} / {event.estimatedAttendees} People
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Ticket size={20} className="mb-1" />
              <p>
                {event.price !== '0'
                  ? new Intl.NumberFormat('fil-PH', {
                      style: 'currency',
                      currency: 'PHP',
                      maximumFractionDigits: 2,
                    }).format(parseFloat(event.price))
                  : 'Free'}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default EventCard
