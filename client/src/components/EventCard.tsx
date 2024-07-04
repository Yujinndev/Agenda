import { format } from 'date-fns'
import { Event } from './Calendar'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'

const EventCard = ({
  event,
  className,
}: {
  event: Event
  className?: string
}) => {
  return (
    <Card
      className={cn('relative p-4 bg-slate-300 rounded-sm border-0', className)}
    >
      <div className="flex justify-between gap-1 items-start">
        <h2 className="font-bold text-lg">{event.title}</h2>
        <Badge variant="secondary" className="text-[10px]">
          {event.category}
        </Badge>
      </div>
      <p className="text-sm">{event.purpose}</p>
      <div className="mt-2 text-[12px] bg-black/75 text-white rounded-sm px-2 p-1 gap-2 w-max">
        <small>{format(new Date(event.startDateTime), 'PP')}</small>{' '}
        <small>
          {format(new Date(event.startDateTime), 'p')}
          {' - '}
          {format(new Date(event.endDateTime), 'p')}
        </small>
      </div>
    </Card>
  )
}

export default EventCard
