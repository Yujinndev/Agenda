import { Event } from '@/components/Calendar'
import { Link } from 'react-router-dom'
import { useGetGroupById } from '@/hooks/api/useGetGroupById'
import ResultMessage from '@/components/ui/resultMessage'
import EventCard from '@/components/EventCard'
import Loading from '@/components/Loading'
import useAuth from '@/hooks/useAuth'

const GroupEvents = ({ id }: { id: string }) => {
  const { auth } = useAuth()
  const { data, isPending, isSuccess } = useGetGroupById(id as string)

  if (isPending) {
    return <Loading />
  }

  const groupEvents = isSuccess && data.event

  return (
    <section className="relative w-full py-4 lg:px-0 gap-4">
      {groupEvents && groupEvents.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {groupEvents.map(({ event }: { event: Event }) => {
            const isOrganizer = event.organizerId === auth.userId
            const isUserAlreadyJoined = event.participants?.some(
              ({ userId }: { userId: string }) => userId === auth?.userId
            )

            const redirectLink =
              isUserAlreadyJoined || isOrganizer
                ? `/events/detail/${event.id}`
                : `/events/browse/p/${event.id}`
            return (
              <Link to={redirectLink} key={event.id}>
                <EventCard event={event} extendedVariant={true} />
              </Link>
            )
          })}
        </div>
      ) : (
        <ResultMessage label="No events to show for this group." />
      )}
    </section>
  )
}

export default GroupEvents
