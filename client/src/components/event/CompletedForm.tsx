import { format, formatDistance, subDays } from 'date-fns'
import useEventFormStore from '@/services/state/useEventFormStore'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EVENT_AUDIENCE, EVENT_CATEGORIES } from '@/constants/choices'
import MarkdownFormat from '@/utils/MarkdownFormat'

const CompletedForm = () => {
  const { formData } = useEventFormStore()
  const {
    title,
    details,
    purpose,
    startDateTime,
    endDateTime,
    location,
    estimatedAttendees,
    committees,
    category,
    price,
    audience,
    estimatedExpense,
    status,
    finances,
  } = formData

  const getStatus = EVENT_CATEGORIES.find((el) => el.value === status)
  const getAudience = EVENT_AUDIENCE.find((el) => el.value === audience)

  return (
    <Card className="border-0 grid gap-2 py-4 shadow-none bg-transparent">
      <CardContent className="border-b-[1px] px-0">
        <CardDescription>Title:</CardDescription>
        <CardTitle>{title}</CardTitle>
      </CardContent>
      <CardContent className="border-b-[1px] px-0">
        <CardDescription>Details:</CardDescription>
        <CardTitle>
          <MarkdownFormat details={details} />
        </CardTitle>
      </CardContent>
      <CardContent className="border-b-[1px] px-0">
        <CardDescription>Purpose:</CardDescription>
        <CardTitle>
          <MarkdownFormat details={purpose} />
        </CardTitle>
      </CardContent>
      <CardContent className="border-b-[1px] px-0">
        <CardDescription>Location:</CardDescription>
        <CardTitle>{location}</CardTitle>
      </CardContent>

      <div className="grid lg:grid-cols-3 border-b-[1px]">
        <CardContent className="border-b-[1px] lg:border-0 px-0">
          <CardDescription>Start of Event:</CardDescription>
          <CardTitle>{format(new Date(startDateTime), 'PPp')}</CardTitle>
        </CardContent>
        <CardContent className="border-b-[1px] lg:border-0 px-0">
          <CardDescription>End of Event:</CardDescription>
          <CardTitle>{format(new Date(endDateTime), 'PPp')}</CardTitle>
        </CardContent>
        <CardContent className="border-b-[1px] lg:border-0 px-0">
          <CardDescription>Duration:</CardDescription>
          <CardTitle>
            <span className="capitalize">
              {formatDistance(
                subDays(new Date(endDateTime), 0),
                new Date(startDateTime)
              )}
            </span>
          </CardTitle>
        </CardContent>
      </div>

      <div className="grid lg:grid-cols-3 border-b-[1px]">
        <CardContent className="border-b-[1px] lg:border-0 px-0">
          <CardDescription>Estimated Attendee/s:</CardDescription>
          <CardTitle>{estimatedAttendees} persons</CardTitle>
        </CardContent>
        <CardContent className="border-b-[1px] lg:border-0 px-0">
          <CardDescription>Event Category:</CardDescription>
          <CardTitle>{category}</CardTitle>
        </CardContent>
        <CardContent className="border-b-[1px] lg:border-0 px-0">
          <CardDescription>Published/Shared to:</CardDescription>
          <CardTitle>{getAudience?.label}</CardTitle>
        </CardContent>
      </div>

      {committees.length > 0 && (
        <CardContent className="border-b-[1px] px-0 space-y-2">
          <CardDescription>Committee/s:</CardDescription>
          <div className="space-y-2">
            {committees.map((item, index) => (
              <div key={index} className="relative space-x-7">
                <Badge className="absolute -top-1 -left-2" variant="secondary">
                  {index + 1}
                </Badge>
                <CardTitle className="p">{item.email}</CardTitle>
              </div>
            ))}
          </div>
        </CardContent>
      )}

      {finances.length > 0 && (
        <CardContent className="border-b-[1px] px-0 space-y-2 w-full">
          <CardDescription>Finance/s:</CardDescription>
          <div>
            {finances.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-2 lg:grid-cols-6 lg:grid-flow-row-dense gap-x-2 gap-y-1 bg-slate-50/75 relative rounded-md px-6 py-4 border-[1px]"
              >
                <Badge className="absolute -top-2 -left-2" variant="secondary">
                  {index + 1}
                </Badge>
                <div>
                  <CardDescription>Category:</CardDescription>
                  <CardTitle>{item.financeCategory}</CardTitle>
                </div>
                <div>
                  <CardDescription>Type:</CardDescription>
                  <CardTitle>{item.transactionType}</CardTitle>
                </div>
                <div>
                  <CardDescription>Description:</CardDescription>
                  <CardTitle>{item.transactionDescription}</CardTitle>
                </div>
                <div>
                  <CardDescription>Service Provider:</CardDescription>
                  <CardTitle>{item.serviceProvider}</CardTitle>
                </div>
                <div>
                  <CardDescription>Estimated Amount:</CardDescription>
                  <CardTitle>{item.estimatedAmount}</CardTitle>
                </div>
                <div>
                  <CardDescription>Actual Amount:</CardDescription>
                  <CardTitle>{item.actualAmount || 'None'}</CardTitle>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}

      <div className="grid lg:grid-cols-2 border-b-[1px]">
        <CardContent className="border-b-[1px] lg:border-0 px-0">
          <CardDescription>Estimated Expenses:</CardDescription>
          <CardTitle>
            {new Intl.NumberFormat('fil-PH', {
              style: 'currency',
              currency: 'PHP',
              maximumFractionDigits: 2,
            }).format(parseFloat(estimatedExpense))}
          </CardTitle>
        </CardContent>
        <CardContent className="border-b-[1px] lg:border-0 px-0">
          <CardDescription>Joining Fee / Ticket Price:</CardDescription>
          <CardTitle>
            {price !== '0'
              ? new Intl.NumberFormat('fil-PH', {
                  style: 'currency',
                  currency: 'PHP',
                  maximumFractionDigits: 2,
                }).format(parseFloat(price))
              : 'Free'}
          </CardTitle>
        </CardContent>
      </div>

      <CardContent className="px-0">
        <CardDescription>Status:</CardDescription>
        <CardTitle>{getStatus?.label}</CardTitle>
      </CardContent>
    </Card>
  )
}

export default CompletedForm
