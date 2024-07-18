import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Clock8, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Event } from '@/components/Calendar'
import { Card, CardContent } from '@/components/ui/card'
import ResultMessage from '@/components/ui/resultMessage'

const EventList = ({
  events,
  selectedFilter,
}: {
  events: Event[]
  selectedFilter: string
}) => {
  return (
    <div className="overflow flex flex-col gap-4">
      {events.length > 0 ? (
        events.map((el) => {
          const startDateTime = new Date(el.startDateTime)
          const endDateTime = new Date(el.endDateTime)

          return (
            <motion.div
              key={el.id}
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex-1 bg-white transition-all ease-linear"
            >
              <Link to={`/events/detail/${el.id}`}>
                <Card
                  className={cn('relative flex h-36', {
                    'bg-primary/10': selectedFilter === 'DONE',
                    'bg-red-700/10': selectedFilter === 'CANCELLED',
                  })}
                >
                  <img
                    src="https://sb.ecobnb.net/app/uploads/sites/3/2021/09/event-plan.jpg"
                    alt="Example Image"
                    className="hidden lg:flex aspect-square w-3/12 relative"
                  />
                  <CardContent className="relative flex flex-1 items-center gap-4 p-8">
                    <div className="flex flex-col items-center justify-center rounded-sm border px-4 py-2">
                      <p className="-mb-1 text-base">
                        {format(startDateTime, 'MMM')}
                      </p>
                      <p className="mb-0 text-[24px] font-black">
                        {format(startDateTime, 'dd')}
                      </p>
                    </div>
                    <div className="w-full">
                      <p className="line-clamp-1 text-[17px] font-bold dark:text-gray-300">
                        {el.title}
                      </p>
                      <p className="mt-1 line-clamp-1 text-[14px]">
                        {el.purpose}
                      </p>
                      <div className="flex flex-col flex-wrap gap-x-4 lg:flex-row">
                        <div className="mt-1 flex items-center gap-2 text-lg lg:mt-2">
                          <Clock8 size={18} />
                          <small>{format(startDateTime, 'p')}</small>
                          <small>-</small>
                          <small>{format(endDateTime, 'p')}</small>
                        </div>
                        <div className="flex items-center gap-2 text-lg lg:mt-2">
                          <MapPin size={18} className="flex-shrink-0" />
                          <small className="line-clamp-1">{el.location}</small>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )
        })
      ) : (
        <ResultMessage label="No events to show." />
      )}
    </div>
  )
}

export default EventList
