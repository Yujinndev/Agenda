import { Calendar, Clock8, MapPin } from 'lucide-react'
import { format, formatDistance, subDays } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { useGetEventById } from '@/hooks/api/useGetEventById'
import { EVENT_AUDIENCE } from '@/constants/choices'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import useAuth from '@/hooks/useAuth'
import MarkdownFormat from '@/utils/MarkdownFormat'

const EventOverview = ({ id }: { id: string }) => {
  const { data } = useGetEventById(id)
  const { auth } = useAuth()
  const convertDate = new Date(data.startDateTime)
  const startDateTime = format(convertDate, 'PPp')
  const endDateTime = format(new Date(data.endDateTime), 'PPp')
  const eventAudience = EVENT_AUDIENCE.find((el) => el.value === data.audience)
  const eventOrganizer = `${data?.organizer?.firstName} ${
    data?.organizer?.middleName ?? ''
  } ${data?.organizer?.lastName}`

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Card className="shadow-none rounded-lg relative p-4 max-h-96">
          <img
            src="https://sb.ecobnb.net/app/uploads/sites/3/2021/09/event-plan.jpg"
            alt="Example Image"
            className="w-full h-full rounded-lg"
            loading="lazy"
          />

          <CardContent className="absolute -mt-20 flex items-center gap-2">
            <div className="flex flex-col items-center justify-center rounded-sm border bg-white px-4 py-2">
              <p className="-mb-1 text-sm">{format(convertDate, 'MMM')}</p>
              <p className="mb-0 text-xl font-black">
                {format(convertDate, 'dd')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none rounded-lg">
          <CardContent className="flex flex-col gap-2 p-8">
            <h1 className="text-xl font-black">Timeline:</h1>
            <div className="ms-6 flex items-center gap-4 text-base lg:text-lg">
              <Clock8 size={24} className="flex-shrink-0" />
              <span className="capitalize">
                {formatDistance(
                  subDays(new Date(endDateTime), 0),
                  new Date(startDateTime)
                )}
              </span>
            </div>
            <div className="ms-6 flex items-center gap-4 text-base lg:text-lg">
              <Calendar size={24} className="flex-shrink-0" />
              <div className="flex gap-2">
                <p className="line-clamp-3">{startDateTime}</p>
                <small>-</small>
                <p className="line-clamp-3">{endDateTime}</p>
              </div>
            </div>
            <div className="ms-6 flex items-center gap-4 text-base lg:text-lg">
              <MapPin size={24} className="flex-shrink-0" />
              <p className="line-clamp-3">{data.location}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardContent className="flex gap-2 p-8">
            <h1 className="text-xl font-black">Estimated Attendees:</h1>
            <p className="text-lg lg:text-justify lg:text-xl">
              {data.estimatedAttendees} Person
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardContent className="flex gap-2 p-8">
            <h1 className="text-xl font-black">Who can join:</h1>
            <p className="text-lg lg:text-justify lg:text-xl">
              {eventAudience?.label ?? 'Unset'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card className="shadow-none">
          <CardContent className="flex items-center gap-4 p-8">
            <Avatar className="h-16 w-16">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="grid">
              <h1 className="text-xl font-black">Organized By:</h1>
              <p className="text-lg lg:text-justify lg:text-xl">
                {eventOrganizer}{' '}
                {data?.organizer?.email === auth.user && '(You)'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-none md:min-h-[18rem] lg:min-h-[20rem]">
          <CardContent className="flex flex-col gap-2 p-8">
            <div>
              <h1 className="text-xl font-black">Description:</h1>
              <div className="ms-8 text-lg lg:text lg:text-xl">
                <MarkdownFormat details={data.details} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-none h-full">
          <CardContent className="flex flex-col gap-2 p-8">
            <div>
              <h1 className="text-xl font-black">Purpose:</h1>
              <div className="ms-8 text-lg lg:text lg:text-xl">
                <MarkdownFormat details={data.purpose} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EventOverview