import useEventFormStore from '@/services/state/useEventFormStore'
import { format, formatDistance, subDays } from 'date-fns'
import { Card, CardContent, CardDescription, CardTitle } from '../ui/card'

const CompletedForm = () => {
  const { formData } = useEventFormStore()
  const {
    title,
    purpose,
    startDateTime,
    endDateTime,
    location,
    maxAttendees,
    guests,
    category,
    maxBudget,
    status,
  } = formData

  return (
    <Card className="border-0 grid gap-2 py-4 shadow-none bg-transparent">
      <CardContent className="border-b-[1px] px-0">
        <CardDescription>Title:</CardDescription>
        <CardTitle>{title}</CardTitle>
      </CardContent>
      <CardContent className="border-b-[1px] px-0">
        <CardDescription>Purpose:</CardDescription>
        <CardTitle>{purpose}</CardTitle>
      </CardContent>
      <CardContent className="border-b-[1px] px-0">
        <CardDescription>Location:</CardDescription>
        <CardTitle>{location}</CardTitle>
      </CardContent>

      <div className="flex flex-col lg:flex-row justify-between pe-8 border-b-[1px]">
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

      <CardContent className="border-b-[1px] px-0">
        <CardDescription>Maximum Attendee/s:</CardDescription>
        <CardTitle>{maxAttendees} persons</CardTitle>
      </CardContent>
      <CardContent className="border-b-[1px] px-0">
        <CardDescription>Event Category:</CardDescription>
        <CardTitle>{category}</CardTitle>
      </CardContent>
      <CardContent className="border-b-[1px] px-0">
        <CardDescription>Invited Guest/s:</CardDescription>
        <CardTitle>
          <ol>
            {guests.map((guest) => (
              <li>* {guest.email}</li>
            ))}
          </ol>
        </CardTitle>
      </CardContent>
      <CardContent className="border-b-[1px] px-0">
        <CardDescription>Max Budget:</CardDescription>
        <CardTitle>
          {new Intl.NumberFormat('fil-PH', {
            style: 'currency',
            currency: 'PHP',
            maximumFractionDigits: 2,
          }).format(parseInt(maxBudget))}
        </CardTitle>
      </CardContent>
      <CardContent className="px-0">
        <CardDescription>Status:</CardDescription>
        <CardTitle>{status}</CardTitle>
      </CardContent>
    </Card>
  )
}

export default CompletedForm
