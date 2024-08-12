import ResultMessage from '@/components/ui/resultMessage'
import { Event } from '@/components/Calendar'
import { Link } from 'react-router-dom'
import EventCard from '../EventCard'
import { useGetGroupEvents } from '@/hooks/api/useGetGroupEvents'

const GroupEvents = ({ id }: { id: string }) => {
  const { data, isSuccess } = useGetGroupEvents(id as string)

  const groupEvents = isSuccess && data

  return (
    <section className="relative w-full py-4 lg:px-0 gap-4">
      {groupEvents && groupEvents.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {groupEvents.map((event: Event) => (
            <Link to={`/events/browse/p/event/${event.id}`} key={event.id}>
              <EventCard event={event} extendedVariant={true} />
            </Link>
          ))}
        </div>
      ) : (
        <ResultMessage label="No events to show for this group." />
      )}
    </section>
  )
}

export default GroupEvents
