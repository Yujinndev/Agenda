import useEventFormStore from '@/services/state/useEventFormStore'
import { format, formatDistance, subDays } from 'date-fns'
import { Card, CardContent, CardDescription, CardTitle } from '../ui/card'
import { EVENT_CATEGORIES } from '@/constants/choices'

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
  } = formData

  const getStatus = EVENT_CATEGORIES.find((el) => el.value === status)

  return (
    <Card className="border-0 grid gap-2 py-4 shadow-none bg-transparent">
      <CardContent className="border-b-[1px] px-0">
        <CardDescription>Title:</CardDescription>
        <CardTitle>{title}</CardTitle>
      </CardContent>
      <CardContent className="border-b-[1px] px-0">
        <CardDescription>Details:</CardDescription>
        <CardTitle>{details}</CardTitle>
      </CardContent>
      <CardContent className="border-b-[1px] px-0">
        <CardDescription>Purpose:</CardDescription>
        <CardTitle>{purpose}</CardTitle>
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
          <CardTitle>{audience}</CardTitle>
        </CardContent>
      </div>

      <CardContent className="border-b-[1px] px-0">
        <CardDescription>Committee/s:</CardDescription>
        <CardTitle>
          <ol>
            {committees.length > 0
              ? committees.map((item) => (
                  <li key={item.email}>* {item.email}</li>
                ))
              : 'No worries, You can invite in the event dashboard later!'}
          </ol>
        </CardTitle>
      </CardContent>

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
            {new Intl.NumberFormat('fil-PH', {
              style: 'currency',
              currency: 'PHP',
              maximumFractionDigits: 2,
            }).format(parseFloat(price))}
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
