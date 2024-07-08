import { Calendar, Clock8, MapPin } from 'lucide-react'
import { format, formatDistance, subDays } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { useGetEventById } from '@/hooks/api/useGetEventById'

const EventOverview = ({ id }: { id: string }) => {
  const { data } = useGetEventById(id)

  const convertDate = new Date(data.startDateTime)
  const startDateTime = format(convertDate, 'PPp')
  const endDateTime = format(new Date(data.endDateTime), 'PPp')

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Card className="shadow-none rounded-lg relative p-4">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSZHgjV8ckMtH2AEwV7Q63QFOFZoVDKDy24MVx_9NVPA&s"
            alt="Example Image"
            className="w-full rounded-lg"
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
              <Calendar size={24} className="flex-shrink-0" />
              <div className="flex gap-2">
                <p className="line-clamp-3">{startDateTime}</p>
                <small>-</small>
                <p className="line-clamp-3">{endDateTime}</p>
              </div>
            </div>
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
              <MapPin size={24} className="flex-shrink-0" />
              <p className="line-clamp-3">{data.location}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-none">
        <CardContent className="flex flex-col gap-2 p-8">
          <div>
            <h1 className="text-xl font-black">Description:</h1>
            <p className="ms-8 text-lg lg:text-justify lg:text-xl">
              {data.purpose}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EventOverview
