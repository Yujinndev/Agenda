import EventCard from '@/components/EventCard'
import { Event } from '@/components/Calendar'
import { useGetAllPublicEvents } from '@/hooks/api/useGetAllPublicEvents'
import Loading from '@/components/Loading'
import { Link } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import ResultMessage from '@/components/ui/resultMessage'

const EventPage = () => {
  const { data: allEvents, isLoading } = useGetAllPublicEvents()
  const { auth } = useAuth()

  if (isLoading) {
    return <Loading />
  }

  // TODO: just display events that are not organized and not joined by the logged user

  return (
    <section className="relative w-full py-4 lg:px-0 gap-4 lg:pt-10">
      <div className="bg-green-900 lg:px-8 p-4 lg:pb-4 rounded-md sticky">
        <div className="md:w-2/3 py-2 lg:w-1/2 text-white">
          <h1 className="text-3xl">Explore and Join Events</h1>
          <p>Events are happening every day— join the fun.</p>
        </div>
      </div>

      {allEvents.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-8">
          {allEvents.map((event: Event) => (
            <Link to={`/events/browse/p/${event.id}`} key={event.id}>
              <EventCard event={event} extendedVariant={true} />
            </Link>
          ))}
        </div>
      ) : (
        <ResultMessage label="No events to show." />
      )}
    </section>
  )
}

export default EventPage
