import {
  ArrowUpRight,
  Ellipsis,
  MessageCircleQuestion,
  Check,
  X,
  LucideNotepadText,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Link, useNavigate } from 'react-router-dom'
import { EVENT_COMMITTEE_INQUIRIES } from '@/constants/choices'
import { Event } from '@/components/Calendar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import UpdateFormDialog from '@/components/event/UpdateFormDialog'
import SendApprovalDialog from '@/components/event/SendApprovalDialog'
import UpdateFinanceDialog from '@/components/event/UpdateFinanceDialog'
import MarkAsDoneDialog from '@/components/event/MarkAsDoneDialog'
import { type isNextToApprove } from '@/utils/helpers/checkCommitteeIfNextToApprove'

const useEventActionState = (data: Event, isNextToApprove: isNextToApprove) => {
  const isEventPast = new Date(data.endDateTime) < new Date()

  const canMarkAsDone = isEventPast && data.status === 'UPCOMING'
  const canTakeAction =
    data.status !== 'FOR_APPROVAL' && data.status !== 'CANCELLED'
  const isWaitingForApproval =
    isNextToApprove.isNext && isNextToApprove.status === 'WAITING'

  return { isEventPast, canMarkAsDone, canTakeAction, isWaitingForApproval }
}

const OrganizerActions = ({
  data,
  canMarkAsDone,
}: {
  data: Event
  canMarkAsDone: boolean
}) => {
  return (
    <>
      {canMarkAsDone ? (
        <MarkAsDoneDialog id={data.id} />
      ) : (
        <>
          {data.status !== 'DONE' && <UpdateFormDialog id={data.id} />}
          <UpdateFinanceDialog id={data.id} />
          {data.status === 'ON_HOLD' && data.committees.length > 0 && (
            <SendApprovalDialog id={data.id} committees={data.committees} />
          )}
        </>
      )}
    </>
  )
}

const CommitteeActions = ({
  handleEventCommitteeStep,
}: {
  handleEventCommitteeStep: (type: string) => void
}) => {
  const RESPONSE_CHOICES = [
    {
      type: 'REQUESTING_REVISION',
      icon: <MessageCircleQuestion className="flex-shrink-0" />,
    },
    {
      type: 'APPROVED',
      icon: <Check className="flex-shrink-0" />,
    },
    {
      type: 'REJECTED',
      icon: <X className="flex-shrink-0" />,
      className:
        'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    },
  ]

  return (
    <div className="flex items-center gap-3">
      {RESPONSE_CHOICES.map((choice) => (
        <Button
          key={choice.type}
          size="icon"
          variant="secondary"
          className={cn('rounded-full', choice.className)}
          onClick={() => handleEventCommitteeStep(choice.type)}
        >
          {choice.icon}
        </Button>
      ))}
    </div>
  )
}

type EventActionsProp = {
  data: Event
  isOrganizer: boolean
  isNextToApprove: isNextToApprove
  isUserAlreadyJoined: boolean
  hasAlreadySentFeedback: boolean
}
const EventActions = ({
  isOrganizer,
  data,
  isNextToApprove,
  isUserAlreadyJoined,
  hasAlreadySentFeedback,
}: EventActionsProp) => {
  const navigate = useNavigate()

  const { canMarkAsDone, canTakeAction, isWaitingForApproval } =
    useEventActionState(data, isNextToApprove)

  const approvalStatus = EVENT_COMMITTEE_INQUIRIES.find(
    (el) => el.value === isNextToApprove?.status
  )

  const handleEventCommitteeStep = (status: string) => {
    navigate(`/response-form/?id=${data.id}&status=${status}`)
  }

  return (
    <div className="py-2">
      <div className="flex gap-2 items-center">
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

        {canTakeAction && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Ellipsis className="flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="m-2 space-y-1 w-44">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isOrganizer ? (
                <OrganizerActions data={data} canMarkAsDone={canMarkAsDone} />
              ) : (
                <Button
                  className="relative grid grid-cols-4 gap-4 bg-green-900"
                  onClick={() => navigate(`/events/feedback/${data.id}`)}
                  disabled={data.status !== 'DONE' || hasAlreadySentFeedback}
                >
                  <LucideNotepadText size={20} />
                  <span>
                    {hasAlreadySentFeedback ? 'Feedback sent' : 'Send Feedback'}
                  </span>
                </Button>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {isNextToApprove.isNext &&
          (isWaitingForApproval ? (
            <CommitteeActions
              handleEventCommitteeStep={handleEventCommitteeStep}
            />
          ) : (
            <Badge
              variant="outline"
              className="text-white flex items-center gap-3 py-2 text-sm"
            >
              {approvalStatus?.label}
              {isUserAlreadyJoined && <li>Joined</li>}
            </Badge>
          ))}
      </div>
    </div>
  )
}

export default EventActions
