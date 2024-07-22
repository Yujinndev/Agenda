import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowUpLeft,
  ArrowUpRight,
  Check,
  Ellipsis,
  MessageCircleQuestion,
  X,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useAuth from '@/hooks/useAuth'
import { useGetEventById } from '@/hooks/api/useGetEventById'
import {
  EVENT_CATEGORIES,
  EVENT_COMMITTEE_INQUIRIES,
} from '@/constants/choices'
import { isCommitteeNextToApprove } from '@/utils/helpers/checkCommitteeIfNextToApprove'
import EventOverview from '@/components/event/EventOverview'
import EventParticipantsList from '@/components/event/EventParticipantsList'
import EventHistoryTimeline from '@/components/event/EventHistoryTimeline'
import Loading from '@/components/Loading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs } from '@/components/ui/Tabs'
import UpdateFormDialog from '@/components/event/UpdateForm'
import EventCommitteesList from '@/components/event/EventCommiteesList'
import EventFinances from '@/components/event/EventFinance'

const EventDetails = () => {
  const { id } = useParams()
  const { auth } = useAuth()
  const { data, isLoading } = useGetEventById(id as string)

  const navigate = useNavigate()

  const tabs = [
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
  ]

  if (isLoading) {
    return <Loading />
  }

  const user = auth!.user as string
  const isNextToApprove = isCommitteeNextToApprove({
    committees: data.committees,
    currentUser: user,
  })
  const isOrganizer = data?.organizer?.email === auth.user
  const isUserAlreadyJoined = data?.participants?.find(
    (el: any) => el.email === auth.user
  )

  const eventStatus = EVENT_CATEGORIES.find((el) => el.value === data.status)
  const approvalStatus = EVENT_COMMITTEE_INQUIRIES.find(
    (el) => el.value === isNextToApprove?.status
  )

  const tabsToShow = isOrganizer
    ? tabs.length
    : isNextToApprove.isNext
    ? tabs.length - 1
    : 1
  const visibleTabs = tabs.slice(0, tabsToShow)

  const handleEventCommitteeStep = (status: string) => {
    navigate(`/response-form/?id=${id}&status=${status}`)
  }

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
        </div>
        <div className="py-2">
          <div className="flex gap-2">
            {!isNextToApprove.isNext && (
              <Button
                size="sm"
                variant="outline"
                className="relative w-max rounded-full lg:px-6 lg:p-5 lg:flex hidden"
                asChild
              >
                <Link to="/events/my-events" className="text-black">
                  My Events <ArrowUpRight size={18} className="-mt-1 ms-2" />
                </Link>
              </Button>
            )}
            {isOrganizer && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                  >
                    <Ellipsis className="flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="m-2 space-y-1">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <UpdateFormDialog id={id as string} />
                  <DropdownMenuItem>Send Approval</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {isNextToApprove.isNext ? (
            isNextToApprove?.status === 'WAITING' ? (
              <div className="flex items-center gap-3 justify-center pb-6 lg:pb-0">
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full"
                  onClick={() =>
                    handleEventCommitteeStep('REQUESTING_REVISION')
                  }
                >
                  <MessageCircleQuestion className="flex-shrink-0" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full"
                  onClick={() => handleEventCommitteeStep('APPROVED')}
                >
                  <Check className="flex-shrink-0" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="rounded-full"
                  onClick={() => handleEventCommitteeStep('REJECTED')}
                >
                  <X className="flex-shrink-0" />
                </Button>
              </div>
            ) : (
              <Badge
                variant="outline"
                className="text-white flex items-center gap-3 py-2 text-sm justify-center"
              >
                {approvalStatus?.label}
                {isUserAlreadyJoined && <li>Joined</li>}
              </Badge>
            )
          ) : null}
        </div>
      </div>

      <Tabs tabs={visibleTabs} activeTabClassName={'bg-green-700'} />
    </div>
  )
}

export default EventDetails
