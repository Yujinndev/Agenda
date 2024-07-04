import Calendar, { Event } from '@/components/Calendar'
import EventCard from '@/components/EventCard'
import Loading from '@/components/Loading'
import { useUserEvents } from '@/hooks/api/useGetUserEvents'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { data: events, isLoading, isSuccess } = useUserEvents()

  const upcomingEvents =
    isSuccess &&
    events.filter((el: Event) => el.status === 'UPCOMING').slice(0, 3)

  const requestedEvents =
    isSuccess &&
    events.filter((el: Event) => el.status === 'FOR_APPROVAL').slice(0, 3)

  if (isLoading) {
    return <Loading />
  }

  return (
    <section className="relative w-full grid lg:grid-cols-5 p-4 lg:px-0 gap-4 lg:pt-10">
      <Calendar events={events} />

      <div className="grid">
        <div className="p-4 px-2 flex flex-col gap-2 lg:-m-1 rounded-md min-h-40 max-h-full">
          <div className="text-xl font-bold flex gap-2">
            <h2>Upcoming Events</h2>
            <Link to="/events/my-events" className="-mt-1">
              <ArrowUpRight />
            </Link>
          </div>
          <div className="h-[1px] w-full bg-gray-400" />

          {upcomingEvents.map((event: Event) => (
            <Link to={`/events/detail/${event.id}`} key={event.id}>
              <EventCard
                event={event}
                className="bg-green-900 text-white hover:bg-green-900/80"
              />
            </Link>
          ))}
        </div>
        <div className="p-4 px-2 flex flex-col gap-2 lg:-m-1 rounded-md min-h-40">
          <h2 className="text-xl font-bold">Requested Events</h2>
          <div className="h-[1px] w-full bg-gray-400" />

          {requestedEvents.map((event: Event) => (
            <Link to={`/events/detail/${event.id}`} key={event.id}>
              <EventCard
                event={event}
                className="bg-amber-300 hover:bg-amber-300/80"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Dashboard
