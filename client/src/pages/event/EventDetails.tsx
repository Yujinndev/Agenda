import EventOverview from '@/components/event/EventOverview'
import EventParticipantsList from '@/components/event/EventParticipantsList'
import Loading from '@/components/Loading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs } from '@/components/ui/Tabs'
import { EVENT_CATEGORIES } from '@/constants/choices'
import { useGetEventById } from '@/hooks/api/useGetEventById'
import { ArrowUpRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

const EventDetails = () => {
  const { id } = useParams()
  const { data, isLoading } = useGetEventById(id as string)

  const tabs = [
    {
      title: 'Overview',
      value: 'overview',
      content: <EventOverview id={id as string} />,
    },
    {
      title: 'Participants',
      value: 'participants',
      content: <EventParticipantsList id={id as string} />,
    },
    {
      title: 'Finance',
      value: 'finance',
      content: <h1>Finance</h1>,
    },
  ]

  if (isLoading) {
    return <Loading />
  }

  const eventStatus = EVENT_CATEGORIES.find((el) => el.value === data.status)

  return (
    <div className="w-full pt-8">
      <div className="bg-green-900 px-8 mb-8 rounded-md text-white flex flex-col-reverse justify-between md:flex-row md:items-center">
        <div className="flex flex-1 flex-col items-start gap-1 py-4 pt-8 md:w-2/3 lg:w-1/2">
          <div className="space-x-1 mb-2">
            <Badge
              variant="secondary"
              className="pt-1 bg-yellow-300 text-black"
            >
              {data.category}
            </Badge>

            <Badge variant="secondary" className="pt-1 uppercase">
              {eventStatus?.label}
            </Badge>
          </div>
          <h1 className="text-4xl dark:text-white md:text-4xl lg:text-5xl">
            {data.title}
          </h1>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="w-max rounded-full px-6 p-5"
          asChild
        >
          <Link to="/events/my-events" className="text-black">
            My Events <ArrowUpRight size={18} className="ms-2 -mt-1" />
          </Link>
        </Button>
      </div>

      <Tabs tabs={tabs} activeTabClassName={'bg-green-700'} />
    </div>
  )
}

export default EventDetails
