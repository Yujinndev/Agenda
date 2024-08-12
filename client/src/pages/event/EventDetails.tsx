import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ArrowUpLeft } from 'lucide-react'
import { EVENT_CATEGORIES } from '@/constants/choices'
import { isCommitteeNextToApprove } from '@/utils/helpers/checkCommitteeIfNextToApprove'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs } from '@/components/ui/Tabs'
import { useGetEventById } from '@/hooks/api/useGetEventById'
import useAuth from '@/hooks/useAuth'
import Loading from '@/components/Loading'
import EventFinances from '@/components/event/EventFinance'
import EventOverview from '@/components/event/EventOverview'
import EventParticipantsList from '@/components/event/EventParticipantsList'
import EventHistoryTimeline from '@/components/event/EventHistoryTimeline'
import EventCommitteesList from '@/components/event/EventCommiteesList'
import EventActions from '@/components/event/EventActions'
import { useToast } from '@/components/ui/use-toast'
import { DecimalStarRating } from '@/pages/event/FeedbackForm'

const EventDetails = () => {
  const { id } = useParams()
  const { toast } = useToast()
  const location = useLocation()

  useEffect(() => {
    if (location.state === 'redirected') {
      toast({
        title: 'Redirected!',
        description: 'You already joined the public event.',
        variant: 'success',
      })
    }
  }, [location.state])

  const { auth } = useAuth()
  const { data, isLoading, isSuccess } = useGetEventById(id as string)

  const [tabs] = useState([
    {
      title: 'Overview',
      value: 'overview',
      content: <EventOverview id={id as string} />,
    },
    {
      title: 'Finance',
      value: 'finance',
      content: <EventFinances id={id as string} />,
    },
    {
      title: 'Participants',
      value: 'participants',
      content: <EventParticipantsList id={id as string} />,
    },
    {
      title: 'Committees',
      value: 'committees',
      content: <EventCommitteesList id={id as string} />,
    },
    {
      title: 'History Timeline',
      value: 'timeline',
      content: <EventHistoryTimeline id={id as string} />,
    },
  ])

  if (isLoading) {
    return <Loading />
  }

  if (isSuccess) {
    const user = auth!.user as string
    const ratings =
      data.feedbacks?.length > 0 &&
      data.feedbacks
        .reduce((sum: number, item: any) => sum + Number(item.rating), 0)
        .toFixed(2)

    const isOrganizer = data.organizer?.email === auth.user
    const isUserAlreadyJoined = data.participants?.find(
      (el: any) => el.email === auth.user
    )

    const isNextToApprove = isCommitteeNextToApprove({
      committees: data.committees,
      currentUser: user,
    })

    const hasAlreadySentFeedback = data.eventFeedbacks?.some(
      (el: any) => el.userId === auth.userId
    )

    const eventStatus = EVENT_CATEGORIES.find((el) => el.value === data.status)

    const showTabsOnPermission = isOrganizer
      ? tabs.length
      : isNextToApprove.isNext
      ? tabs.length - 1
      : 1
    const visibleTabs = tabs.slice(0, showTabsOnPermission)

    return (
      <div className="w-full pt-8">
        <div className="relative bg-green-900 px-8 mb-8 py-6 rounded-md text-white flex flex-col items-start justify-between md:flex-row md:items-center">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full absolute -top-2 -left-2 h-10 w-10 lg:hidden"
            asChild
          >
            <Link to="/events/my-events" className="text-black">
              <ArrowUpLeft size={18} />
            </Link>
          </Button>

          <div className="flex flex-1 flex-col items-start gap-1 md:w-2/3 lg:w-1/2">
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
            {ratings > 0 && (
              <div className="flex items-center justify-center gap-2 -mt-2">
                <small className="mt-4">Ratings: </small>
                <DecimalStarRating
                  value={Number(ratings)}
                  onChange={() => {}}
                />
                <small className="mt-4">{`(${ratings})`}</small>
              </div>
            )}
          </div>

          <EventActions
            data={data}
            isOrganizer={isOrganizer}
            isNextToApprove={isNextToApprove}
            isUserAlreadyJoined={isUserAlreadyJoined}
            hasAlreadySentFeedback={hasAlreadySentFeedback}
          />
        </div>

        <Tabs tabs={visibleTabs} activeTabClassName={'bg-green-700'} />
      </div>
    )
  }
  console.log(
    '🚀 ~ EventDetails ~ data.eventFeedbacks?.length :',
    data.eventFeedbacks?.length
  )
}

export default EventDetails
