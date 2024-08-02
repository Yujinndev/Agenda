import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import useAuth from '@/hooks/useAuth'
import Loading from '@/components/Loading'
import EventCard from '@/components/EventCard'
import Calendar, { Event } from '@/components/Calendar'
import ResultMessage from '@/components/ui/resultMessage'
import { useGetUserEvents } from '@/hooks/api/useGetUserEvents'
import { isCommitteeNextToApprove } from '@/utils/helpers/checkCommitteeIfNextToApprove'
import { useGetRequestedEventsForCommitteeUser } from '@/hooks/api/useGetRequestedEventsForCommitteeUser'

const Dashboard = () => {
  const {
    data: events,
    isLoading,
    isSuccess: isUserEventsSuccess,
  } = useGetUserEvents()
  const { data: eventsToApprove, isSuccess: isRequestedEventsSuccess } =
    useGetRequestedEventsForCommitteeUser()
  const { auth } = useAuth()

  const upcomingEvents =
    isUserEventsSuccess &&
    events
      .filter(
        (el: Event) =>
          el.status === 'UPCOMING' && new Date(el.endDateTime) >= new Date()
      )
      .slice(0, 3)

  if (isLoading) {
    return <Loading />
  }

  const user = auth!.user as string

  return (
    <section className="relative w-full grid lg:grid-cols-5 p-4 lg:px-0 gap-4 lg:pt-10">
      <Calendar events={events} />

      <div className="grid h-[70vh]">
        <div className="p-4 px-2 flex flex-col gap-2 lg:-m-1 rounded-md lg:h-96 max-h-96">
          <div className="group text-xl font-bold flex gap-2">
            <h2 className="line-clamp-1">Upcoming Events</h2>
            <Link
              to="/events/my-events"
              className="-mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <ArrowUpRight />
            </Link>
          </div>
          <div className="h-[1px] w-full bg-gray-400" />
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event: Event) => (
              <Link to={`/events/detail/${event.id}`} key={event.id}>
                <EventCard
                  event={event}
                  className="bg-green-900 text-white hover:bg-green-900/80"
                />
              </Link>
            ))
          ) : (
            <ResultMessage label="No upcoming events to show." />
          )}
        </div>
        {isRequestedEventsSuccess && eventsToApprove.length > 0 && (
          <div className="p-4 px-2 lg:-m-1 rounded-md space-y-2">
            <h2 className="text-xl font-bold">For your approval</h2>
            <div className="h-[1px] w-full bg-gray-400" />

            <div className="overflow-y-auto h-96 min-h-96 flex flex-col gap-2">
              {eventsToApprove.map((event: Event) => {
                const isNextToApprove = isCommitteeNextToApprove({
                  committees: event?.committees,
                  currentUser: user,
                })

                return (
                  isNextToApprove.isNext && (
                    <Link to={`/events/detail/${event.id}`} key={event.id}>
                      <EventCard
                        event={event}
                        className="bg-gray-400 hover:bg-gray-400/80"
                      />
                    </Link>
                  )
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Dashboard
